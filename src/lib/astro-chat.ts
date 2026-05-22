"use client";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

const STORAGE_KEY = "astro-xams-chat-v1";
const MAX_STORED_MESSAGES = 100;

export function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        typeof m.id === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  const trimmed = messages.slice(-MAX_STORED_MESSAGES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function createChatMessage(
  role: ChatRole,
  content: string
): ChatMessage {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: Date.now(),
  };
}

/** Last N turns sent to the API to stay within token limits. */
export function messagesForApi(
  messages: ChatMessage[],
  maxTurns = 24
): { role: ChatRole; content: string }[] {
  return messages.slice(-maxTurns).map(({ role, content }) => ({ role, content }));
}
