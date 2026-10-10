"use client";

import { useRef, useState } from "react";
import {
  achievements,
  certifications,
  coursework,
  experience,
  interests,
  profile,
  projects,
  services,
  stack,
  tracks,
} from "@/data/site";

type Line = { kind: "input" | "output" | "error"; text: string };

const LINK = /(https?:\/\/[^\s]+[^\s.,)]|[\w.+-]+@[\w-]+\.[\w.]+\w|\/[\w-]+(?:\.pdf)?(?=\s|$))/g;

const pad = (text: string, width: number) => text.padEnd(width, " ");

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const files: Record<string, () => string[]> = {
  "about.txt": () => profile.about,
  "contact.txt": () => [
    `email      ${profile.email}`,
    `whatsapp   ${profile.whatsapp}`,
    `linkedin   ${profile.linkedin}`,
    `github     ${profile.github}`,
    `instagram  ${profile.instagram}`,
  ],
  "resume.pdf": () => [`Binary file. Open it here: ${profile.resumeUrl}`],
};

const commands: Record<string, { about: string; run: (args: string[]) => string[] }> = {
  help: {
    about: "List every command",
    run: () => [
      "Things you can type:",
      "",
      ...Object.entries(commands)
        .filter(([, command]) => command.about)
        .map(([name, command]) => `  ${pad(name, 14)}${command.about}`),
      "",
      "Tip: Tab completes a command, and ↑ ↓ walk through what you typed.",
    ],
  },
  whoami: {
    about: "Who is this?",
    run: () => [
      profile.name,
      `${profile.roles.join(" · ")}`,
      `${profile.location}`,
      "",
      profile.statement,
    ],
  },
  education: {
    about: "Degrees in progress",
    run: () =>
      tracks.flatMap((track) => [
        `${track.degree}`,
        `  ${track.school}`,
        `  ${track.place.split(" · ")[1]} · ${track.highlight}`,
        "",
      ]),
  },
  experience: {
    about: "Where he has worked",
    run: () =>
      experience.flatMap((job) => [`${job.role}, ${job.company}`, `  ${job.period}`, ...job.points.map((point) => `  - ${point}`), ""]),
  },
  projects: {
    about: "What he has built",
    run: () => [
      ...projects.map((project) => `  ${pad(slug(project.title), 32)}${project.kind}`),
      "",
      "Type: project <name>   for example: project medistore",
    ],
  },
  project: {
    about: "Details of one project",
    run: (args) => {
      const query = args.join("-").toLowerCase();
      const found = query && projects.find((project) => slug(project.title).includes(query));
      if (!found) return [`No project matches "${args.join(" ")}". Type projects to see the list.`];
      return [
        found.title,
        `  ${found.problem}`,
        `  ${found.description}`,
        `  stack   ${found.tech.join(", ")}`,
        `  code    ${found.repo}`,
        ...(found.live ? [`  live    ${found.live}`] : []),
      ];
    },
  },
  skills: {
    about: "The stack, layer by layer",
    run: () => stack.map((layer) => `  ${pad(layer.layer.toLowerCase(), 14)}${layer.items.join(", ")}`),
  },
  achievements: {
    about: "Hackathon results and awards",
    run: () => achievements.map((award) => `  ${pad(award.title, 18)}${award.event} (${award.date})`),
  },
  certs: {
    about: "Certifications",
    run: () => certifications.map((cert) => `  ${cert.title}, ${cert.event} · ${cert.issuer} (${cert.date})`),
  },
  courses: {
    about: "Subjects studied",
    run: () => [coursework.join(", ")],
  },
  hire: {
    about: "Freelance services",
    run: () => [
      "He builds for clients:",
      ...services.map((service) => `  - ${service.title}`),
      "",
      `Start with a message: ${profile.email} or ${profile.whatsapp}`,
    ],
  },
  contact: { about: "How to reach him", run: () => files["contact.txt"]() },
  resume: { about: "Open the resume", run: () => [`Here you go: ${profile.resumeUrl}`] },
  ask: {
    about: "Ask anything, e.g. ask does he know react",
    run: () => [],
  },
  ls: { about: "List files", run: () => [Object.keys(files).join("    ")] },
  cat: {
    about: "Read a file, e.g. cat about.txt",
    run: (args) => files[args[0]]?.() ?? [`cat: ${args[0] ?? ""}: no such file. Try ls.`],
  },
  date: {
    about: "The time in Chennai",
    run: () => [
      new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" }).format(new Date()) + " IST",
    ],
  },
  game: { about: "Take a break", run: () => ["Catch some bugs: /play"] },
  clear: { about: "Wipe the screen", run: () => [] },
  // Unlisted commands, for the curious.
  sudo: { about: "", run: () => ["Nice try. You're not in the sudoers file. This incident will be reported to Nithish."] },
  hello: { about: "", run: () => ["Hello! Type help to see what I can do."] },
  hi: { about: "", run: () => ["Hi! Type help to see what I can do."] },
  pwd: { about: "", run: () => ["/home/nithish/portfolio"] },
  exit: { about: "", run: () => ["There's no escape. But the contact section is just below."] },
  interests: { about: "", run: () => [interests.join(", ")] },
  coffee: { about: "", run: () => ["☕ Brewing… done. That's the fourth one today."] },
  vim: { about: "", run: () => ["You're in. Good luck getting out."] },
};

const starters = ["help", "whoami", "projects", "skills", "hire"];

const intro: Line[] = [
  { kind: "output", text: `Welcome to ${profile.name.split(" ")[0].toLowerCase()}@portfolio.` },
  { kind: "output", text: "Type help and press Enter, or tap a command below." },
];

/** A working command line. Visitors type commands to explore the portfolio. */
export function Terminal() {
  const [lines, setLines] = useState<Line[]>(intro);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  const scrollDown = () => requestAnimationFrame(() => screen.current?.scrollTo({ top: screen.current.scrollHeight }));

  const print = (next: Line[]) => {
    setLines((current) => [...current, ...next]);
    scrollDown();
  };

  const askAssistant = async (question: string) => {
    setBusy(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: question }] }),
      });
      print([{ kind: "output", text: (await response.text()) || "No answer came back. Try again." }]);
    } catch {
      print([{ kind: "error", text: "Couldn't reach the server. Check your connection." }]);
    } finally {
      setBusy(false);
    }
  };

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    history.current.push(text);
    cursor.current = history.current.length;
    setDraft("");

    const [name, ...args] = text.split(/\s+/);
    const command = commands[name.toLowerCase()];
    const echo: Line = { kind: "input", text };

    if (name.toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    if (name.toLowerCase() === "ask" || (!command && args.length > 0)) {
      const question = name.toLowerCase() === "ask" ? args.join(" ") : text;
      if (!question) {
        print([echo, { kind: "error", text: "Ask what? For example: ask does he know react" }]);
        return;
      }
      print([echo]);
      askAssistant(question);
      return;
    }
    if (!command) {
      print([echo, { kind: "error", text: `command not found: ${name}. Type help to see what works.` }]);
      return;
    }
    print([echo, ...command.run(args).map((line) => ({ kind: "output" as const, text: line }))]);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = cursor.current + (event.key === "ArrowUp" ? -1 : 1);
      cursor.current = Math.max(0, Math.min(history.current.length, next));
      setDraft(history.current[cursor.current] ?? "");
    }
    if (event.key === "Tab" && draft) {
      const match = Object.keys(commands).find((name) => commands[name].about && name.startsWith(draft.toLowerCase()));
      if (match) {
        event.preventDefault();
        setDraft(match);
      }
    }
  };

  return (
    <div
      className="glass-deep overflow-hidden rounded-3xl font-mono text-[13px] leading-relaxed sm:text-sm"
      onClick={() => input.current?.focus({ preventScroll: true })}
      data-cursor="Type"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-hot" />
        <span className="h-3 w-3 rounded-full bg-[#f5c542]" />
        <span className="h-3 w-3 rounded-full bg-lime" />
        <span className="ml-3 text-xs text-muted">nithish@portfolio: ~</span>
      </div>

      <div ref={screen} className="h-80 overflow-y-auto px-4 py-4 sm:h-96 sm:px-6" aria-live="polite">
        {lines.map((line, index) => (
          <p
            key={index}
            className={`break-words whitespace-pre-wrap ${
              line.kind === "input" ? "mt-3 text-text" : line.kind === "error" ? "text-hot" : "text-muted"
            }`}
          >
            {line.kind === "input" && <span className="text-lime">➜ </span>}
            {line.text.split(LINK).map((part, i) =>
              i % 2 === 1 ? (
                <a
                  key={i}
                  href={part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part}
                  target={part.startsWith("/play") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="text-text underline underline-offset-2 hover:text-lime"
                >
                  {part}
                </a>
              ) : (
                part
              ),
            )}
            {line.text === "" && " "}
          </p>
        ))}
        {busy && <p className="pulse-hot text-muted">thinking…</p>}

        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            run(draft);
          }}
        >
          <span className="text-lime">➜</span>
          <input
            ref={input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            maxLength={300}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            aria-label="Terminal command"
            placeholder="type a command"
            className="min-w-0 flex-1 bg-transparent text-text caret-lime outline-none placeholder:text-muted/50 focus-visible:outline-none"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
        {starters.map((starter) => (
          <button
            key={starter}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              run(starter);
            }}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-muted transition-colors hover:border-lime hover:text-text"
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
}
