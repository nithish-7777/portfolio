"use client";

import { useEffect, useState } from "react";
import { Scramble, SplitReveal } from "./Wow";

type Note = { id: string; name: string; message: string; at: string };

const MAX_NAME = 40;
const MAX_MESSAGE = 240;
const TILTS = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-2", "rotate-2"];

const day = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

/**
 * A wall of short notes left by visitors. A new note is held until the owner
 * approves it. The whole section stays hidden until storage is set up.
 */
export function Guestbook() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" | "error"; text?: string }>({ kind: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/guestbook", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { open: boolean; notes: Note[] }) => {
        setOpen(data.open);
        setNotes(data.notes ?? []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, message, website }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus({ kind: "error", text: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      setMessage("");
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", text: "Couldn't reach the server. Check your connection and try again." });
    }
  };

  const field =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-sans text-base tracking-normal text-text normal-case outline-none transition-colors placeholder:text-muted/60 focus:border-lime";

  return (
    <section id="guestbook" className="mx-auto w-full max-w-[92rem] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <p className="section-label font-mono text-xs tracking-widest text-muted uppercase">
        <Scramble text="Guestbook" />
      </p>
      <h2 className="mt-5 max-w-4xl font-head text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
        <SplitReveal text="You were here. Leave a note." />
      </h2>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <form onSubmit={submit} className="glass-card h-fit space-y-5 rounded-3xl p-6 sm:p-8">
          <label className="block font-mono text-xs tracking-widest text-muted uppercase">
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={MAX_NAME}
              required
              autoComplete="name"
              className={field}
            />
          </label>
          <label className="block font-mono text-xs tracking-widest text-muted uppercase">
            <span className="flex justify-between">
              Your note <span>{MAX_MESSAGE - message.length}</span>
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={MAX_MESSAGE}
              required
              rows={4}
              placeholder="Say hi, leave feedback, or tell me what you're building."
              className={`${field} resize-none`}
            />
          </label>
          {/* Hidden from people; automated spam fills it in and gets ignored. */}
          <input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="rounded-full bg-lime px-7 py-3.5 font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {status.kind === "sending" ? "Sending…" : "Leave note"}
          </button>
          <p className="text-sm leading-relaxed text-muted" role="status">
            {status.kind === "sent" && <span className="text-lime">Thanks! Your note will appear once Nithish approves it.</span>}
            {status.kind === "error" && <span className="text-hot">{status.text}</span>}
            {(status.kind === "idle" || status.kind === "sending") && "Notes are read by Nithish before they appear here."}
          </p>
        </form>

        {notes.length === 0 ? (
          <p className="glass-card grid min-h-56 place-items-center rounded-3xl p-8 text-center text-lg text-muted">
            No notes yet. Be the first to sign.
          </p>
        ) : (
          <ul className="grid content-start gap-4 sm:grid-cols-2">
            {notes.map((note, index) => (
              <li
                key={note.id}
                className={`glass-card rounded-2xl p-5 transition-transform hover:rotate-0 ${TILTS[index % TILTS.length]}`}
              >
                <p className="leading-relaxed break-words">{note.message}</p>
                <p className="mt-4 flex justify-between gap-3 font-mono text-[11px] tracking-wider text-muted uppercase">
                  <span className="truncate text-lime">{note.name}</span>
                  <span className="shrink-0">{day.format(new Date(note.at))}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

type Queue = { pending: Note[]; approved: Note[] };

/** The owner's page for approving, rejecting and deleting notes. */
export function GuestbookAdmin() {
  const [key, setKey] = useState("");
  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    const response = await fetch("/api/guestbook/admin", { headers: { "x-admin-key": key } });
    if (!response.ok) {
      setQueue(null);
      setError(response.status === 401 ? "That key isn't right, or the guestbook isn't set up yet." : "Couldn't load the notes.");
      return;
    }
    setQueue((await response.json()) as Queue);
  };

  const act = async (id: string, action: "approve" | "reject" | "delete") => {
    await fetch("/api/guestbook/admin", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action }),
    });
    await load();
  };

  const row = (note: Note, actions: { label: string; action: "approve" | "reject" | "delete"; primary?: boolean }[]) => (
    <li key={note.id} className="glass-card rounded-2xl p-5">
      <p className="leading-relaxed break-words">{note.message}</p>
      <p className="mt-2 font-mono text-[11px] tracking-wider text-muted uppercase">
        {note.name} · {day.format(new Date(note.at))}
      </p>
      <div className="mt-4 flex gap-2">
        {actions.map((item) => (
          <button
            key={item.action}
            type="button"
            onClick={() => act(note.id, item.action)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              item.primary ? "bg-lime text-bg" : "border border-line text-muted hover:border-hot hover:text-hot"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </li>
  );

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          load();
        }}
        className="flex flex-wrap gap-3"
      >
        <input
          type="password"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder="Admin key"
          aria-label="Admin key"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-line bg-black/30 px-5 py-3 outline-none focus:border-lime"
        />
        <button type="submit" className="rounded-full bg-text px-6 py-3 font-medium text-bg">
          Open
        </button>
      </form>
      {error && <p className="mt-4 text-hot">{error}</p>}

      {queue && (
        <div className="mt-10 space-y-10">
          <div>
            <h2 className="font-head text-2xl font-semibold">Waiting for approval ({queue.pending.length})</h2>
            <ul className="mt-4 space-y-3">
              {queue.pending.length === 0 && <li className="text-muted">Nothing waiting.</li>}
              {queue.pending.map((note) =>
                row(note, [
                  { label: "Approve", action: "approve", primary: true },
                  { label: "Reject", action: "reject" },
                ]),
              )}
            </ul>
          </div>
          <div>
            <h2 className="font-head text-2xl font-semibold">Showing on the site ({queue.approved.length})</h2>
            <ul className="mt-4 space-y-3">
              {queue.approved.length === 0 && <li className="text-muted">Nothing approved yet.</li>}
              {queue.approved.map((note) => row(note, [{ label: "Delete", action: "delete" }]))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
