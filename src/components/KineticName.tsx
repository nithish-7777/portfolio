"use client";

import { useEffect, useRef } from "react";

/**
 * The name set in a variable font. Each letter thins and widens as the cursor
 * gets close; with no cursor nearby a slow wave travels through the letters.
 */
export function KineticName({ lines, label }: { lines: string[]; label: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    const current = letters.map(() => 0);
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let visible = true;

    const tick = (now: number) => {
      letters.forEach((letter, index) => {
        let target = 0.28 + 0.28 * Math.sin(now / 1100 - index * 0.5);
        if (pointer.active) {
          const rect = letter.getBoundingClientRect();
          const dist = Math.hypot(
            pointer.x - (rect.left + rect.width / 2),
            pointer.y - (rect.top + rect.height / 2),
          );
          target = Math.max(0, 1 - dist / 280);
        }
        current[index] += (target - current[index]) * 0.12;
        const amount = current[index];
        letter.style.fontVariationSettings = `"wght" ${800 - amount * 560}, "wdth" ${75 + amount * 25}`;
      });
      if (visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = event.pointerType === "mouse";
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) raf = requestAnimationFrame(tick);
    });

    raf = requestAnimationFrame(tick);
    observer.observe(root);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <h1 ref={ref} aria-label={label} className="kinetic-name font-head uppercase">
      {lines.map((line) => (
        <span key={line} aria-hidden className="block whitespace-nowrap">
          {Array.from(line).map((char, index) => (
            <span key={index} data-letter className="inline-block">
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
