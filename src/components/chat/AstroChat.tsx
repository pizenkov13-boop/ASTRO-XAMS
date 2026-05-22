"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  createChatMessage,
  loadChatHistory,
  messagesForApi,
  saveChatHistory,
  type ChatMessage,
} from "@/lib/astro-chat";
import { useLocale } from "@/lib/i18n/context";

function RobotIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="5" y="8" width="14" height="11" rx="2" />
      <path d="M9 8V6a3 3 0 016 0v2" />
      <circle cx="9.5" cy="13" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13" r="1.25" fill="currentColor" stroke="none" />
      <path d="M9.5 16.5h5" />
      <path d="M12 3v1" />
      <path d="M4 12H2" />
      <path d="M22 12h-2" />
    </svg>
  );
}

export function AstroChat() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(loadChatHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveChatHistory(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) {
      const id = window.requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const userMsg = createChatMessage("user", text);
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesForApi(nextMessages) }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");

      const assistantMsg = createChatMessage(
        "assistant",
        data.reply ?? t("chat.error")
      );
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError(t("chat.error"));
      setMessages((prev) => prev.slice(0, -1));
      setDraft(text);
    } finally {
      setLoading(false);
    }
  }, [draft, loading, messages, t]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-astro-orange to-astro-purple text-white shadow-[0_0_24px_rgba(255,107,44,0.45)] transition hover:scale-105 hover:shadow-[0_0_32px_rgba(168,85,247,0.5)] focus:outline-none focus:ring-2 focus:ring-astro-cyan/60 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{
          right: "max(1rem, var(--safe-right))",
          bottom: "max(1rem, var(--safe-bottom))",
        }}
        aria-label={t("chat.open")}
        title={t("chat.open")}
      >
        <RobotIcon className="h-7 w-7" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[64] bg-black/60 touch-manipulation"
              aria-label={t("chat.close")}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="astro-chat-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[65] flex h-full w-full max-w-md flex-col border-l border-astro-purple/40 bg-astro-bg shadow-[-8px_0_32px_rgba(0,0,0,0.5)]"
              style={{
                paddingTop: "max(0px, env(safe-area-inset-top))",
                paddingBottom: "max(0px, env(safe-area-inset-bottom))",
              }}
            >
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-astro-purple/30 px-4 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-astro-orange/30 to-astro-purple/30 text-astro-orange">
                    <RobotIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h2
                      id="astro-chat-title"
                      className="font-display text-lg font-semibold text-white"
                    >
                      {t("chat.title")}
                    </h2>
                    <p className="truncate text-xs text-gray-500">
                      {t("chat.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="touch-target flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-astro-surface text-gray-400 transition hover:border-astro-orange hover:text-white"
                  aria-label={t("chat.close")}
                >
                  <span className="text-xl leading-none" aria-hidden>
                    ×
                  </span>
                </button>
              </header>

              <div
                ref={listRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              >
                {messages.length === 0 && (
                  <p className="rounded-xl border border-astro-purple/25 bg-astro-purple/10 p-4 text-sm leading-relaxed text-gray-300">
                    {t("chat.welcome")}
                  </p>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-astro-orange/90 to-astro-purple/90 text-white"
                          : "border border-astro-surface bg-astro-surface/80 text-gray-200"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <p className="text-sm text-gray-500 animate-pulse">
                    {t("chat.thinking")}
                  </p>
                )}

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}
              </div>

              <footer className="shrink-0 border-t border-astro-purple/30 p-4">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    rows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={loading}
                    placeholder={t("chat.placeholder")}
                    className="input-mobile min-h-[52px] flex-1 resize-none py-3"
                    aria-label={t("chat.placeholder")}
                  />
                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={loading || !draft.trim()}
                    className="btn-primary shrink-0 self-end px-4 disabled:opacity-40"
                  >
                    {t("chat.send")}
                  </button>
                </div>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
