"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Turn = { role: "user" | "assistant"; content: string };

const starters = [
  "Tell me about Nithish",
  "What has he built?",
  "Has he used PostgreSQL?",
  "Does he take freelance work?",
  "How do I contact him?",
];

const MAX_CHARS = 400;

const LINK = /(https?:\/\/[^\s]+[^\s.,)]|[\w.+-]+@[\w-]+\.[\w.]+\w|\/[\w-]+\.pdf)/g;

/** Turns web addresses and email addresses in an answer into links. */
function Linked({ text }: { text: string }) {
  return (
    <>
      {text.split(LINK).map((part, index) =>
        index % 2 === 1 ? (
          <a
            key={index}
            href={part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-lime"
          >
            {part.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** A chat window where visitors ask about Nithish and get answers from his own details. */
export function AskNithish() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [basic, setBasic] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  // The command palette opens the chat by sending this event.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("ask-nithish", show);
    return () => window.removeEventListener("ask-nithish", show);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [turns]);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || busy) return;
    const history = [...turns, { role: "user" as const, content: text }];
    setTurns([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    const show = (content: string) => setTurns([...history, { role: "assistant", content }]);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      setBasic(response.headers.get("x-ask-mode") === "basic");
      if (!response.body) {
        show(await response.text());
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        show(answer);
      }
      if (!answer) show("I couldn't get an answer just now. Please try again.");
    } catch {
      show("I couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="ask-nithish"
        className="glass fixed right-4 bottom-20 z-30 flex items-center gap-2 rounded-full px-4 py-3 font-mono text-xs sm:bottom-4"
      >
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
        {open ? "Close" : "Ask Nithish"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="ask-nithish"
            role="dialog"
            aria-label="Ask Nithish"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="glass-deep fixed inset-x-3 bottom-36 z-40 flex max-h-[min(34rem,70svh)] origin-bottom-right flex-col overflow-hidden rounded-3xl sm:inset-x-auto sm:right-4 sm:bottom-20 sm:w-96"
          >
            <div className="border-b border-white/10 px-5 py-4">
              <p className="font-head text-lg font-semibold">Ask Nithish</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {basic
                  ? "Quick answers pulled straight from this page."
                  : "An AI assistant that answers from the details on this page. It can get things wrong, so for anything important, ask him directly."}
              </p>
            </div>

            <div ref={log} className="flex-1 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite">
              {turns.length === 0 && (
                <ul className="flex flex-wrap gap-2">
                  {starters.map((starter) => (
                    <li key={starter}>
                      <button
                        type="button"
                        onClick={() => ask(starter)}
                        className="rounded-full border border-white/15 px-3 py-2 text-left text-sm text-muted transition-colors hover:border-lime hover:text-text"
                      >
                        {starter}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {turns.map((turn, index) => (
                <p
                  key={index}
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    turn.role === "user" ? "ml-auto bg-lime text-bg" : "bg-white/8 text-text"
                  }`}
                >
                  {turn.content ? <Linked text={turn.content} /> : <span className="pulse-hot text-muted">Thinking…</span>}
                </p>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask(draft);
              }}
              className="flex gap-2 border-t border-white/10 p-3"
            >
              <input
                ref={input}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={MAX_CHARS}
                placeholder="Ask about his work, studies, skills…"
                aria-label="Your question"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm outline-none placeholder:text-muted/70 focus:border-lime"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                className="rounded-full bg-text px-4 py-2.5 text-sm font-medium text-bg transition-opacity disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
