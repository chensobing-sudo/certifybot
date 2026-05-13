// API: Compliance Chat Agent
// Multi-turn conversation with function calling for compliance evaluation

import { NextRequest, NextResponse } from "next/server";
import { createInitialState, processUserMessage } from "@/lib/chat/agent";
import type { ChatState } from "@/lib/chat/types";

// In-memory session store (for MVP; replace with DB in production)
const sessions = new Map<string, ChatState>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message } = body as {
      sessionId?: string;
      message: string;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "消息不能为空" },
        { status: 400 }
      );
    }

    // Get or create session
    const sid = sessionId ?? `session_${Date.now()}`;
    let state = sessions.get(sid);

    if (!state) {
      state = createInitialState();
      sessions.set(sid, state);
    }

    // Process message
    const newState = await processUserMessage(state, message.trim());
    sessions.set(sid, newState);

    // Return last assistant message and session ID
    const lastMessage = newState.messages[newState.messages.length - 1];

    return NextResponse.json({
      sessionId: sid,
      message: {
        id: lastMessage.id,
        role: lastMessage.role,
        content: lastMessage.content,
        timestamp: lastMessage.timestamp,
      },
      currentStep: newState.currentStep,
      history: newState.messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content.slice(0, 100),
      })),
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err.message ?? "对话处理失败" },
      { status: 500 }
    );
  }
}

// GET: retrieve session history
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId || !sessions.has(sessionId)) {
    return NextResponse.json(
      { error: "会话不存在或已过期" },
      { status: 404 }
    );
  }

  const state = sessions.get(sessionId)!;
  return NextResponse.json({
    sessionId,
    messages: state.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    })),
    currentStep: state.currentStep,
  });
}

// DELETE: clear session
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (sessionId) {
    sessions.delete(sessionId);
  }
  return NextResponse.json({ success: true });
}
