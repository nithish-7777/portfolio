"use client";

import { useEffect, useRef, useState } from "react";
import { profile, tracks } from "@/data/site";

const GRAVITY = 34;
const DAMPING = 1.5;
const MAX_ANGLE = 1.15;

const initials = profile.name
  .split(" ")
  .slice(0, 2)
  .map((part) => part[0])
  .join("");

function Face({ back, short, tile, band }: { back?: boolean; short: string; tile: string; band: string }) {
  const track = tracks[back ? 1 : 0];
  return (
    <div className={`id-face ${back ? "id-face-back" : ""}`}>
      <div className="px-5 pt-9">
        <p className="font-head text-xl leading-none font-extrabold tracking-[0.14em] text-[#1c2b63] uppercase">{short}</p>
        <p className="mt-1.5 text-[9px] leading-tight font-medium tracking-wide text-[#1c2b63]/70 uppercase">
          {track.school}
        </p>
      </div>
      {/* A monogram stands in for the photo. */}
      <div className="mx-auto mt-5 grid h-32 w-28 place-items-center rounded-xl bg-[#0a0a09]">
        <span className="font-head text-5xl font-bold text-lime">{tile}</span>
      </div>
      <div className={`absolute inset-x-0 bottom-0 px-4 pt-3 pb-4 text-center text-[#0a0a09] ${band}`}>
        <p className="text-sm font-semibold tracking-wide uppercase">V. Nithish Raaju</p>
        <p className="mt-0.5 text-[11px] leading-snug font-medium">{track.degree}</p>
        <p className="mt-0.5 font-mono text-[10px]">
          {track.place.split(" · ")[1]} · {track.highlight}
        </p>
      </div>
    </div>
  );
}

/**
 * A student ID hanging from a lanyard. It swings like a pendulum when dragged
 * or flicked, and flips between the two colleges when tapped.
 */
export function IdCard() {
  const swing = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const element = swing.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let angle = reduce ? 0 : 0.5;
    let velocity = 0;
    let dragging = false;
    let moved = 0;
    let lastAngle = 0;
    let lastTime = 0;
    let previous = performance.now();
    let raf = 0;
    let visible = false;

    const pivot = () => {
      const rect = element.parentElement!.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top };
    };
    const angleTo = (event: PointerEvent) => {
      const origin = pivot();
      const raw = Math.atan2(event.clientX - origin.x, Math.max(40, event.clientY - origin.y));
      return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, raw));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.032, (now - previous) / 1000);
      previous = now;
      if (!dragging) {
        velocity += (-GRAVITY * Math.sin(angle) - DAMPING * velocity) * dt;
        angle += velocity * dt;
      }
      // The card lags the strap slightly, as a loose card would.
      element.style.setProperty("--swing", `${angle}rad`);
      element.style.setProperty("--lag", `${Math.max(-0.35, Math.min(0.35, -velocity * 0.05))}rad`);
      const resting = !dragging && Math.abs(angle) < 0.002 && Math.abs(velocity) < 0.002;
      if (visible && !resting) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const wake = () => {
      if (raf || reduce) return;
      previous = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onDown = (event: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastAngle = angle;
      lastTime = performance.now();
      element.setPointerCapture(event.pointerId);
      wake();
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const next = angleTo(event);
      const now = performance.now();
      moved += Math.abs(next - angle);
      velocity = (next - lastAngle) / Math.max(0.008, (now - lastTime) / 1000);
      lastAngle = next;
      lastTime = now;
      angle = next;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      velocity = Math.max(-9, Math.min(9, velocity));
      if (moved < 0.03) setFlipped((value) => !value);
      wake();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        // Give it a nudge each time it comes into view so people see it's alive.
        if (Math.abs(angle) < 0.05) velocity += 2.4;
        wake();
      }
    });

    observer.observe(element);
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[34rem] w-full justify-center overflow-x-clip">
        <div
          ref={swing}
          className="id-swing"
          role="button"
          tabIndex={0}
          aria-label="Student ID card. Drag to swing it, press Enter to flip it."
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setFlipped((value) => !value);
            }
          }}
        >
          <div className="id-strap" />
          <div className="id-clip" />
          <div className="id-card">
            <div className="id-flip" style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}>
              <Face short="SIMATS Engineering" tile={initials} band="bg-[#8fd9e8]" />
              <Face back short="IIT Madras" tile="BS" band="bg-lime" />
            </div>
          </div>
        </div>
      </div>
      <p className="font-mono text-xs tracking-widest text-muted uppercase">Drag to swing · tap to flip</p>
    </div>
  );
}
