// ─── Compliance Chat Agent ───
// Multi-turn conversation agent that collects product params and runs compliance evaluation

import type { ChatMessage, ChatState, CollectedProductParams } from "./types";
import { COMPLIANCE_TOOLS, executeToolCall } from "./tools";

const SYSTEM_PROMPT = `你是 ComplianceGuard（合规卫士），一个卫浴/厨卫产品出口合规 AI 助手。

你的任务是帮助用户评估产品出口到不同国家所需的认证和合规要求。

## 工作流程

1. **收集信息**：通过对话逐步收集以下产品参数：
   - 产品类型（水龙头、花洒、马桶、浴缸、阀门等）
   - 主要材质（金属、塑料、陶瓷、玻璃、复合材料等）
   - 与水接触情况（接触饮用水、接触非饮用水、不接触水）
   - 目标市场（可多选：美国、欧盟、加州、英国、澳大利亚）
   - 预期用途（家用、商用、工业用）
   - 是否含电气组件
   - 已持有的认证（可选）

2. **调用工具**：收集到足够信息后，调用 evaluate_compliance 工具进行评估。

3. **解读结果**：用通俗易懂的语言向用户解释评估结果，包括：
   - 强制认证要求（必须办理）
   - 建议办理的认证
   - 费用和时间估算
   - 申请步骤概述

## 对话风格
- 专业但友好，使用中文
- 一次只问 1-2 个问题，不要一次性问完所有参数
- 如果用户提供的信息不完整，引导补充
- 如果用户提供的信息模糊，给出选项让用户选择
- 评估完成后，询问用户是否需要进一步了解某个认证的详情

## 重要规则
- 在调用 evaluate_compliance 前，必须确保已收集到：产品类型、材质、水接触情况、目标市场
- 如果用户问某个市场的信息，可以先调用 get_market_info 提供概览
- 如果用户问某个认证的机构信息，可以调用 get_cert_agency_info`;

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function extractParamsFromMessages(messages: ChatMessage[]): Partial<CollectedProductParams> {
  const params: Partial<CollectedProductParams> = {};
  // This is a simple extraction — the LLM will handle actual param extraction
  // via function calling. This is used for state tracking.
  return params;
}

export function createInitialState(): ChatState {
  return {
    messages: [
      {
        id: generateId(),
        role: "assistant",
        content: "你好！我是 ComplianceGuard 合规卫士 🛡️\n\n我可以帮你快速评估卫浴/厨卫产品出口到不同国家需要的认证和合规要求。\n\n请告诉我，你的产品是什么类型？比如水龙头、花洒、马桶、浴缸等。",
        timestamp: Date.now(),
      },
    ],
    collectedParams: {},
    currentStep: "greeting",
  };
}

export async function processUserMessage(
  state: ChatState,
  userInput: string
): Promise<ChatState> {
  const userMessage: ChatMessage = {
    id: generateId(),
    role: "user",
    content: userInput,
    timestamp: Date.now(),
  };

  const updatedMessages = [...state.messages, userMessage];
  const newState: ChatState = {
    ...state,
    messages: updatedMessages,
    currentStep: "collecting",
  };

  // Call MiniMax M2.7 for agent reasoning
  try {
    const minimaxKey = process.env.MINIMAX_API_KEY;
    if (!minimaxKey) {
      throw new Error("MINIMAX_API_KEY not configured");
    }

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...updatedMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const llmRes = await fetch("https://api.minimaxi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${minimaxKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 1500,
        tools: COMPLIANCE_TOOLS.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        })),
        tool_choice: "auto",
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text();
      throw new Error(`MiniMax API error: ${llmRes.status} - ${errText}`);
    }

    const llmJson = await llmRes.json();
    const choice = llmJson.choices?.[0];
    const msg = choice?.message;

    if (!msg) {
      throw new Error("Empty response from MiniMax");
    }

    // Handle tool calls
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      const toolCall = msg.tool_calls[0];
      const fnName = toolCall.function.name;
      let fnArgs: Record<string, unknown>;

      try {
        fnArgs = JSON.parse(toolCall.function.arguments);
      } catch {
        fnArgs = {};
      }

      // Execute tool
      const { result, error } = await executeToolCall(fnName, fnArgs);

      // Send tool result back to LLM for response generation
      const toolResultContent = error
        ? `工具执行出错: ${error}`
        : JSON.stringify(result, null, 2);

      const followUpMessages = [
        ...apiMessages,
        {
          role: "assistant",
          content: null,
          tool_calls: msg.tool_calls,
        },
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResultContent,
        },
      ];

      const followUpRes = await fetch("https://api.minimaxi.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${minimaxKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "MiniMax-M2.7",
          messages: followUpMessages,
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!followUpRes.ok) {
        throw new Error(`MiniMax follow-up error: ${followUpRes.status}`);
      }

      const followUpJson = await followUpRes.json();
      const followUpContent = followUpJson.choices?.[0]?.message?.content ?? "评估完成，请查看上方结果。";

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: followUpContent,
        timestamp: Date.now(),
      };

      return {
        ...newState,
        messages: [...updatedMessages, assistantMessage],
        currentStep: fnName === "evaluate_compliance" ? "result" : "collecting",
      };
    }

    // Plain text response (no tool call)
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: msg.content ?? "抱歉，我没有理解你的意思，请重新描述一下你的产品。",
      timestamp: Date.now(),
    };

    return {
      ...newState,
      messages: [...updatedMessages, assistantMessage],
    };
  } catch (err: any) {
    const errorMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: `抱歉，处理你的问题时出错了：${err.message}。请稍后重试。`,
      timestamp: Date.now(),
    };

    return {
      ...newState,
      messages: [...updatedMessages, errorMessage],
      currentStep: "error",
    };
  }
}
