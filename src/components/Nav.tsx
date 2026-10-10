"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { certifications, lenses, profile, type Lens } from "@/data/site";
import { useLens } from "./Lens";
import { ScrollProgress } from "./Motion";

type Command = { label: string; hint: string; href?: string; external?: boolean; lens?: Lens; event?: string };

const sections: Command[] = [
  { label: "About", hint: "Section", href: "#about" },
  { label: "Ask me", hint: "Section", href: "#ask" },
  { label: "Journey", hint: "Section", href: "#journey" },
  { label: "Education", hint: "Section", href: "#tracks" },
  { label: "Experience", hint: "Section", href: "#experience" },
  { label: "Achievements", hint: "Section", href: "#achievements" },
  ...(certifications.length ? [{ label: "Certifications", hint: "Section", href: "#certs" }] : []),
  { label: "Work", hint: "Section", href: "#work" },
  { label: "Stack", hint: "Section", href: "#stack" },
  { label: "Lab", hint: "Section", href: "#lab" },
  { label: "Services", hint: "Section", href: "#services" },
  { label: "Guestbook", hint: "Section", href: "#guestbook" },
  { label: "Contact", hint: "Section", href: "#contact" },
];

const commands: Command[] = [
  { label: "Ask Nithish a question", hint: "Chat", event: "ask-nithish" },
  ...sections,
  ...lenses.map((lens) => ({ label: `Read as ${lens.label.toLowerCase()}`, hint: "View", lens: lens.id })),
  { label: "Play the bug game", hint: "Fun", href: "/play" },
  { label: "Send an email", hint: "Link", href: `mailto:${profile.email}` },
  { label: "Message on WhatsApp", hint: "Link", href: profile.whatsapp, external: true },
  { label: "Open Instagram", hint: "Link", href: profile.instagram, external: true },
  { label: "Open GitHub", hint: "Link", href: profile.github, external: true },
  ...(profile.linkedin ? [{ label: "Open LinkedIn", hint: "Link", href: profile.linkedin, external: true }] : []),
  ...(profile.resumeUrl ? [{ label: "Open resume", hint: "Link", href: profile.resumeUrl, external: true }] : []),
];

const primary = ["About", "Education", "Achievements", "Work", "Services", "Contact"];

export function Nav() {
  const { setLens } = useLens();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((command) => command.label.toLowerCase().includes(q)) : commands;
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  const run = (command: Command) => {
    close();
    if (command.event) window.dispatchEvent(new Event(command.event));
    else if (command.lens) setLens(command.lens);
    else if (command.external) window.open(command.href, "_blank", "noreferrer");
    else if (command.href) window.location.href = command.href;
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    }
    if (event.key === "Enter" && results[active]) run(results[active]);
  };

  return (
    <>
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            data-logo
            className="glass rounded-full px-4 py-2 font-mono text-xs tracking-wide"
          >
            NRV<span className="text-hot">_</span>
          </a>
          <nav className="glass hidden items-center gap-1 rounded-full p-1 font-mono text-xs lg:flex">
            {sections
              .filter((section) => primary.includes(section.label))
              .map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-white/10 hover:text-text"
                >
                  {section.label}
                </a>
              ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs text-muted transition-colors hover:text-text"
          >
            <span className="hidden sm:inline">Jump to</span>
            <span className="sm:hidden">Menu</span>
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-text sm:inline">⌘K</kbd>
          </button>
        </div>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="glass-deep w-full max-w-lg overflow-hidden rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              ref={input}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder="Where to?"
              aria-label="Search sections and links"
              className="w-full border-b border-line bg-transparent px-5 py-4 text-base outline-none placeholder:text-muted"
            />
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.map((command, index) => (
                <li key={command.label}>
                  <button
                    type="button"
                    onClick={() => run(command)}
                    onMouseEnter={() => setActive(index)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                      index === active ? "bg-white/10 text-text" : "text-muted"
                    }`}
                  >
                    {command.label}
                    <span className="font-mono text-[10px] tracking-widest uppercase">{command.hint}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches.</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
