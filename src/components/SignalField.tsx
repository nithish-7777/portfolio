"use client";

import { useEffect, useRef } from "react";

type Flag = { x: number; y: number; born: number; score: number };

const GAP = 30;
const FLAG_LIFE = 3800;
const TEXT = "236,232,223";
const FLAGGED = "255,77,31";
const CLEARED = "205,245,69";

/**
 * Hero background: a field of data points that drifts like a signal. Every so
 * often one point is flagged as an anomaly, scored, then cleared.
 */
export function SignalField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = `10px ${getComputedStyle(canvas).fontFamily}`;
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let lastSpawn = 0;
    let flags: Flag[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (now: number) => {
      const cols = Math.floor(width / GAP);
      const rows = Math.floor(height / GAP);
      flags.push({
        x: GAP / 2 + Math.floor(Math.random() * cols) * GAP,
        y: GAP / 2 + Math.floor(Math.random() * rows) * GAP,
        born: now,
        score: 0.81 + Math.random() * 0.18,
      });
      lastSpawn = now;
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, width, height);

      const sweep = ((t / 9) % 1) * (width + 240) - 120;

      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          const wave = Math.sin(x * 0.006 + t * 0.6) * Math.cos(y * 0.008 - t * 0.4);
          let px = x;
          let py = y + wave * 6;
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const lift = dist < 170 ? 1 - dist / 170 : 0;
          px += (dx / dist) * lift * 14;
          py += (dy / dist) * lift * 14;
          const scan = Math.max(0, 1 - Math.abs(x - sweep) / 90);
          const alpha = 0.09 + 0.14 * ((wave + 1) / 2) + lift * 0.5 + scan * 0.3;
          ctx.fillStyle = `rgba(${TEXT},${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, 1 + lift * 1.2 + scan * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (now - lastSpawn > 1200 && flags.length < 5) spawn(now);
      flags = flags.filter((flag) => now - flag.born < FLAG_LIFE);

      ctx.font = font;
      for (const flag of flags) {
        const age = (now - flag.born) / FLAG_LIFE;
        const cleared = age > 0.62;
        const color = cleared ? CLEARED : FLAGGED;
        const fade = Math.min(1, age * 8) * Math.min(1, (1 - age) * 5);
        const ring = cleared ? (age - 0.62) / 0.38 : age / 0.62;

        ctx.strokeStyle = `rgba(${color},${(1 - ring) * 0.7 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(flag.x, flag.y, 5 + ring * 24, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(${color},${fade})`;
        ctx.beginPath();
        ctx.arc(flag.x, flag.y, 3, 0, Math.PI * 2);
        ctx.fill();

        const label = cleared ? "cleared" : `risk ${flag.score.toFixed(2)}`;
        ctx.fillStyle = `rgba(${color},${fade * 0.9})`;
        ctx.fillText(label, flag.x + 11, flag.y + 3);
      }

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reduce) raf = requestAnimationFrame(draw);
    });

    const onResize = () => {
      resize();
      if (reduce) draw(performance.now());
    };

    const sizer = new ResizeObserver(onResize);

    resize();
    raf = requestAnimationFrame(draw);
    observer.observe(canvas);
    sizer.observe(canvas);
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="signal-field absolute inset-0 h-full w-full font-mono" />;
}
