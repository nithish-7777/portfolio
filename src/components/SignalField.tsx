"use client";

import { useEffect, useRef } from "react";

type Ping = { x: number; y: number; born: number; warm: boolean };

const PING_LIFE = 3200;
const TEXT = "236,232,223";
const WARM = "255,77,31";
const LIME = "205,245,69";

/**
 * Hero background: a field of points that drifts like a slow wave, bends away
 * from the cursor and lights up with the occasional pulse.
 */
export function SignalField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones get a sparser field at a lower resolution and half the frame rate.
    const light = window.matchMedia("(pointer: coarse)").matches;
    const GAP = light ? 40 : 30;
    let lastFrame = 0;
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let lastSpawn = 0;
    let pings: Ping[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = light ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (now: number) => {
      const cols = Math.floor(width / GAP);
      const rows = Math.floor(height / GAP);
      pings.push({
        x: GAP / 2 + Math.floor(Math.random() * cols) * GAP,
        y: GAP / 2 + Math.floor(Math.random() * rows) * GAP,
        born: now,
        warm: Math.random() < 0.5,
      });
      lastSpawn = now;
    };

    const draw = (now: number) => {
      if (light && !reduce && now - lastFrame < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
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

      if (now - lastSpawn > 1100 && pings.length < 5) spawn(now);
      pings = pings.filter((ping) => now - ping.born < PING_LIFE);

      for (const ping of pings) {
        const age = (now - ping.born) / PING_LIFE;
        const color = ping.warm ? WARM : LIME;
        const fade = Math.min(1, age * 8) * Math.min(1, (1 - age) * 4);

        ctx.strokeStyle = `rgba(${color},${(1 - age) * 0.6 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, 4 + age * 34, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(${color},${fade})`;
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
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

  return <canvas ref={ref} aria-hidden className="signal-field absolute inset-0 h-full w-full" />;
}
