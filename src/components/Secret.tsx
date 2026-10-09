"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "nithish";
const COLORS = ["#cdf545", "#ff4d1f", "#ece8df", "#466eff"];

type Piece = { x: number; y: number; vx: number; vy: number; size: number; spin: number; angle: number; color: string };

/**
 * A hidden extra. Type "nithish" anywhere on the page, or tap the logo five
 * times quickly, and the screen fills with confetti.
 */
export function Secret() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [found, setFound] = useState(false);

  useEffect(() => {
    console.log(
      "%cHi, fellow developer. %cThere's a secret on this page: type my first name.",
      "color:#cdf545;font-weight:bold;font-size:14px",
      "color:#9a958b",
    );

    let typed = "";
    let taps = 0;
    let lastTap = 0;
    let raf = 0;
    let hide = 0;

    const burst = () => {
      const element = canvas.current;
      const ctx = element?.getContext("2d");
      if (!element || !ctx) return;
      setFound(true);
      clearTimeout(hide);
      hide = window.setTimeout(() => setFound(false), 4200);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const width = (element.width = window.innerWidth);
      const height = (element.height = window.innerHeight);
      const pieces: Piece[] = Array.from({ length: 160 }, () => ({
        x: width / 2 + (Math.random() - 0.5) * 120,
        y: height * 0.55,
        vx: (Math.random() - 0.5) * 22,
        vy: -Math.random() * 20 - 6,
        size: 5 + Math.random() * 7,
        spin: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));

      cancelAnimationFrame(raf);
      const frame = () => {
        ctx.clearRect(0, 0, width, height);
        let alive = false;
        for (const piece of pieces) {
          piece.vy += 0.45;
          piece.vx *= 0.99;
          piece.x += piece.vx;
          piece.y += piece.vy;
          piece.angle += piece.spin;
          if (piece.y < height + 20) alive = true;
          ctx.save();
          ctx.translate(piece.x, piece.y);
          ctx.rotate(piece.angle);
          ctx.fillStyle = piece.color;
          ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
          ctx.restore();
        }
        if (alive) raf = requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, width, height);
      };
      raf = requestAnimationFrame(frame);
    };

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.("input, textarea, [contenteditable]") || event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-WORD.length);
      if (typed === WORD) {
        typed = "";
        burst();
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!(event.target as Element | null)?.closest?.("[data-logo]")) return;
      const now = Date.now();
      taps = now - lastTap < 600 ? taps + 1 : 1;
      lastTap = now;
      if (taps >= 5) {
        taps = 0;
        burst();
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hide);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[70] h-full w-full" />
      <div
        role="status"
        className={`glass pointer-events-none fixed top-20 left-1/2 z-[71] -translate-x-1/2 rounded-full px-5 py-3 text-center text-sm whitespace-nowrap transition-all duration-500 ${
          found ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        {found && "You found it. Thanks for being curious."}
      </div>
    </>
  );
}
