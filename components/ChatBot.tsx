"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "What has Kareem built?",
  "What's his tech stack?",
  "Is he open to work?",
  "Tell me about Dollaby",
  "كيف أتواصل معه؟",
];

const greeting: Msg = {
  role: "assistant",
  content: "Hi, I'm Kareem's bot. Ask me anything about his projects, skills, experience or how to reach him.",
};

export const OPEN_BOT_EVENT = "kareem-bot:open";

/** Opens the bot from anywhere on the page, optionally asking a question. */
export function openBot(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_BOT_EVENT, { detail: { question } }));
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || busy) return;
      setInput("");
      const history = [...messages, { role: "user" as const, content: q }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setBusy(true);

      const write = (text: string) =>
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: text };
          return copy;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          // The greeting is UI only; send real turns.
          body: JSON.stringify({ messages: history.filter((m) => m !== greeting) }),
        });
        if (!res.ok || !res.body) {
          write((await res.text()) || "Something went wrong. Try again, or email Kareem directly.");
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          write(text);
        }
        if (!text) write("I couldn't answer that. Try rephrasing, or email Kareem directly.");
      } catch {
        write("I can't reach the server right now. Check your connection and try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy, messages],
  );

  // Open requests from elsewhere on the page
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (q) setTimeout(() => ask(q), 50);
    };
    window.addEventListener(OPEN_BOT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_BOT_EVENT, onOpen);
  }, [ask]);

  // Focus the input on open; Escape closes and returns focus to the launcher
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  const onlyGreeting = messages.length === 1;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`bot-launcher${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="kareem-bot"
        data-magnetic
      >
        <span className="bot-face" aria-hidden="true" />
        <span className="bot-launcher-label">{open ? "Close" : "Ask Kareem bot"}</span>
      </button>

      <section
        id="kareem-bot"
        className={`bot${open ? " is-open" : ""}`}
        role="dialog"
        aria-label="Kareem bot"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="bot-head">
          <span className="bot-face" aria-hidden="true" />
          <div>
            <p className="bot-title">Kareem bot</p>
            <p className="bot-sub">Answers from Kareem&apos;s CV and projects</p>
          </div>
          <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <div className="bot-list" ref={listRef} aria-live="polite">
          {messages.map((m, i) => (
            <p key={i} className={`bubble bubble-${m.role}`} dir="auto">
              {m.content || <span className="dots" aria-label="Kareem bot is typing"><i /><i /><i /></span>}
            </p>
          ))}
          {onlyGreeting && (
            <div className="bot-suggest">
              {suggestions.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => ask(s)} dir="auto">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="bot-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Kareem…"
            aria-label="Your question"
            maxLength={600}
            dir="auto"
          />
          <button type="submit" className="bot-send" disabled={busy || !input.trim()} aria-label="Send question">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
          </button>
        </form>
      </section>
    </>
  );
}
