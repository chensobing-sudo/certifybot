"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  ChevronDown,
  Sparkles,
  Shield,
} from "lucide-react";

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMsg = {
      id: `user_${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: content.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "请求失败");
      }

      const data = await res.json();
      setSessionId(data.sessionId);

      const assistantMsg: ChatMsg = {
        id: data.message.id,
        role: "assistant",
        content: data.message.content,
        timestamp: data.message.timestamp,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMsg = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: `出错了：${err.message}。请稍后重试。`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [sessionId, loading]);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    // Initial greeting is handled server-side on first message
    sendMessage("你好");
  }, [sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = useCallback(async () => {
    if (sessionId) {
      try {
        await fetch(`/api/chat?sessionId=${sessionId}`, { method: "DELETE" });
      } catch {}
    }
    setMessages([]);
    setSessionId(null);
    setHasStarted(false);
    setInput("");
  }, [sessionId]);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-95 ${
          isOpen
            ? "bg-gray-700 rotate-90"
            : "bg-gradient-to-br from-blue-600 to-blue-700 hover:shadow-xl hover:scale-105"
        }`}
        aria-label={isOpen ? "关闭对话" : "打开合规助手"}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        ) : (
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[60vh] sm:max-h-[70vh] flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">ComplianceGuard</p>
              <p className="text-[10px] text-[var(--muted)]">合规卫士 · AI 助手</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg px-2 py-1 text-[10px] text-[var(--muted)] hover:text-[var(--text-secondary)] hover:bg-gray-100 transition-colors"
          >
            新对话
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[40vh] sm:max-h-[50vh]">
          {!hasStarted ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-3">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-[var(--text)] mb-1">
                合规评估助手
              </p>
              <p className="text-xs text-[var(--muted)] mb-4 max-w-[200px]">
                聊着天就能查清产品出口需要哪些认证
              </p>
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 active:scale-[0.97] transition-all"
              >
                <Sparkles className="h-4 w-4" />
                开始咨询
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--muted)]" />
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-blue-100"
                      : "bg-gradient-to-br from-blue-600 to-blue-700"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5 text-blue-600" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-md"
                      : "bg-gray-100 text-[var(--text)] rounded-tl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-gray-100 px-3.5 py-2.5">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border)] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasStarted ? "输入产品信息..." : "点击上方按钮开始..."}
              disabled={!hasStarted || loading}
              className="flex-1 rounded-xl border border-[var(--border)] bg-gray-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading || !hasStarted}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 active:scale-[0.95] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-[var(--muted)] text-center mt-1.5">
            由 MiniMax M2.7 驱动 · 信息仅供参考
          </p>
        </div>
      </div>
    </>
  );
}
