// ─── Chat Agent Types ───

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ChatToolResult {
  name: string;
  result: unknown;
  error?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  collectedParams: Partial<CollectedProductParams>;
  currentStep: "greeting" | "collecting" | "evaluating" | "result" | "error";
}

export interface CollectedProductParams {
  productType: string;
  material: string;
  waterContact: string;
  targetMarkets: string[];
  intendedUse: string;
  hasElectrical: boolean;
  certificationsHeld: string[];
}

export interface AgentAction {
  type: "message" | "tool_call" | "complete";
  content?: string;
  toolCalls?: ChatToolCall[];
  result?: unknown;
}
