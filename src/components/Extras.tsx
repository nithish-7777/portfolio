"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/site";

/** A small glass lens that trails the cursor and swells over anything clickable. */
export function CursorLens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lens = ref.current;
    if (!lens || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      lens.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      lens.dataset.on = "true";
      const interactive = (event.target as Element | null)?.closest?.("a, button, input, textarea, [role=radio]");
      lens.dataset.active = interactive ? "true" : "false";
    };
    const onLeave = () => {
      lens.dataset.on = "false";
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="cursor-lens" />;
}

/** Tilts its content in 3D toward the pointer and sweeps a holographic sheen across it. */
export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
    element.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    element.style.setProperty("--hx", `${px * 100}%`);
  };
  const onLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--ry", "0deg");
    event.currentTarget.style.setProperty("--rx", "0deg");
  };
  return (
    <div className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

const clock = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** The current time where Nithish is, so visitors know whether he's likely awake. */
export function ChennaiClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(clock.format(new Date()));
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 15000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className="flex items-center gap-2">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
      Chennai {time && <span className="text-text tabular-nums">{time} IST</span>}
    </span>
  );
}

type Repo = { name: string; html_url: string; language: string | null; pushed_at: string };

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function ago(date: string) {
  const days = Math.round((new Date(date).getTime() - Date.now()) / 86_400_000);
  if (Math.abs(days) < 1) return "today";
  if (Math.abs(days) < 31) return relative.format(days, "day");
  if (Math.abs(days) < 365) return relative.format(Math.round(days / 30), "month");
  return relative.format(Math.round(days / 365), "year");
}

/** Most recently pushed repositories, read live from GitHub in the visitor's browser. */
export function GitHubPulse() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const user = profile.github.split("/").pop();
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=4`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Repo[]) => setRepos(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (repos.length === 0) return null;

  return (
    <div className="mt-16">
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted uppercase">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
        Live from GitHub · what I pushed last
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {repos.map((repo) => (
          <li key={repo.name}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="glass-card block h-full rounded-2xl p-5 transition-colors hover:border-lime/60"
            >
              <p className="font-mono text-[11px] tracking-wider text-muted uppercase">{ago(repo.pushed_at)}</p>
              <p className="mt-3 font-head text-lg leading-tight font-semibold break-words">{repo.name}</p>
              <p className="mt-2 text-sm text-muted">{repo.language ?? "Mixed"}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Tap a question, get the answer. A quicker way to get to know someone than scrolling. */
export function AskMe({ questions }: { questions: { ask: string; answer: string }[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      <ul className="flex flex-wrap gap-2 lg:flex-col">
        {questions.map((question, index) => (
          <li key={question.ask}>
            <button
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`w-full rounded-full px-5 py-3 text-left text-sm transition-colors sm:text-base lg:rounded-2xl lg:px-6 lg:py-4 ${
                active === index ? "bg-lime text-bg" : "glass-card text-muted hover:text-text"
              }`}
            >
              {question.ask}
            </button>
          </li>
        ))}
      </ul>
      <div className="glass-card flex min-h-72 flex-col justify-between rounded-3xl p-7 sm:p-10" aria-live="polite">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          {String(active + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active}
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.3 }}
            className="mt-8 font-head text-2xl leading-snug font-medium text-pretty sm:text-3xl"
          >
            {questions[active].answer}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
