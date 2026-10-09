"use client";

import { createContext, useContext, useEffect, useRef, useSyncExternalStore } from "react";
import Lenis from "lenis";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Weighted, gliding scroll on computers. Phones keep their own native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.11 });
    return () => lenis.destroy();
  }, []);
  return null;
}

/** A heading whose words rise out from behind a mask, one after another. */
export function SplitReveal({ text }: { text: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{text}</>;
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, index) => (
        <span key={index} aria-hidden className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "115%", rotate: 6 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.85, delay: index * 0.055, ease: [0.2, 0.75, 0.2, 1] }}
          >
            {word}
          </motion.span>
          {" "}
        </span>
      ))}
    </span>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_<>";

/** Text that decodes itself from random characters when it scrolls into view. */
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const element = ref.current;
    if (!inView || !element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const started = performance.now();
    const duration = 700;
    let raf = 0;
    const tick = (now: number) => {
      const done = Math.min(1, (now - started) / duration);
      const settled = Math.floor(done * text.length);
      element.textContent = Array.from(text, (char, index) =>
        index < settled || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      ).join("");
      if (done < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text]);

  return (
    <span ref={ref} aria-label={text}>
      {text}
    </span>
  );
}

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/** A band of giant outlined words that drifts sideways, and speeds up and leans with your scrolling. */
export function Marquee({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [-7, 7]);
  const x = useTransform(base, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const extra = boost.get();
    if (extra < 0) direction.current = 1;
    else if (extra > 0) direction.current = -1;
    const step = direction.current * 1.6 * (delta / 1000);
    base.set(base.get() + step + step * Math.abs(extra));
  });

  const line = words.map((word) => (
    <span key={word} className="flex items-center gap-[0.35em] pr-[0.35em]">
      {word}
      <span className="text-[0.4em] text-lime">✦</span>
    </span>
  ));

  return (
    <div aria-hidden className="overflow-hidden border-y border-line py-5 sm:py-7">
      <motion.div style={{ x, skewX: reduce ? 0 : skew }} className="marquee-text flex w-max font-head uppercase">
        <div className="flex">{line}</div>
        <div className="flex">{line}</div>
      </motion.div>
    </div>
  );
}

/** A button that leans toward the cursor as it approaches, then springs back. */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useSpring(0, { stiffness: 220, damping: 14, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 14, mass: 0.4 });

  const onMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="inline-block">
      {children}
    </motion.span>
  );
}

const StackProgress = createContext<MotionValue<number> | null>(null);

/** Wraps the project cards and tracks how far the visitor has scrolled through them. */
export function CardStack({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <StackProgress.Provider value={scrollYProgress}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StackProgress.Provider>
  );
}

/**
 * One card in the stack. As later cards slide over it, it shrinks back and
 * dims, so the pile reads as depth. Also carries the cursor spotlight.
 */
export function DepthCard({
  index,
  total,
  className = "",
  style,
  children,
}: {
  index: number;
  total: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const fallback = useMotionValue(0);
  const progress = useContext(StackProgress) ?? fallback;
  const stacked = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const depth = total - 1 - index;
  const scale = useTransform(progress, [index / total, 1], [1, stacked ? 1 - depth * 0.035 : 1]);
  const dim = useTransform(progress, [index / total, 1], [1, stacked ? 1 - depth * 0.09 : 1]);
  const filter = useTransform(dim, (value) => `brightness(${value})`);

  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      style={{ ...style, scale, filter, transformOrigin: "50% 0%" }}
      onPointerMove={onMove}
      className={`spotlight ${className}`}
    >
      {children}
    </motion.article>
  );
}
