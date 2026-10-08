"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/** A paragraph whose words light up one by one as it scrolls into view. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.3"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Word key={index} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

/** Counts up to a number the first time it scrolls into view. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const element = ref.current;
    if (!inView || !element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, digits = "", suffix = ""] = value.match(/^([\d.]+)(.*)$/) ?? [];
    const decimals = (digits.split(".")[1] ?? "").length;
    const controls = animate(0, parseFloat(digits), {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => {
        element.textContent = latest.toFixed(decimals).padStart(digits.length, "0") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{value}</span>;
}

/** A card with a soft light that follows the cursor across it. */
export function Spotlight({
  as: Tag = "div",
  className = "",
  style,
  children,
}: {
  as?: "div" | "article" | "li";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return (
    <Tag className={`spotlight ${className}`} style={style} onPointerMove={onMove}>
      {children}
    </Tag>
  );
}

/** Thin bar across the top showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-lime" />;
}
