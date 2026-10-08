"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { tracks } from "@/data/site";

/**
 * Two degree tracks drawn as rails that fill as you scroll, then join into one.
 */
export function Tracks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.7"] });
  const rail = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const merge = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const verdict = useTransform(scrollYProgress, [0.9, 1], [0.25, 1]);

  return (
    <div ref={ref}>
      <div className="grid md:grid-cols-2">
        {tracks.map((track, index) => (
          <div key={track.id} className="relative pb-14 pl-8 md:pb-20 md:pr-10">
            <span className="absolute inset-y-0 left-0 w-px bg-line" />
            <motion.span
              style={{ scaleY: rail }}
              className={`absolute inset-y-0 left-0 w-px origin-top ${index === 0 ? "bg-hot" : "bg-lime"}`}
            />
            <span
              className={`absolute -left-[5px] top-1 h-[11px] w-[11px] rounded-full border-2 border-bg ${
                index === 0 ? "bg-hot" : "bg-lime"
              }`}
            />
            <p className="font-mono text-xs tracking-widest text-muted">
              {track.code} · {track.place}
            </p>
            <h3 className="mt-4 font-head text-3xl leading-tight font-semibold sm:text-4xl">{track.degree}</h3>
            <p className="mt-2 text-muted">{track.school}</p>
            <p
              className={`mt-5 inline-block rounded-full border px-3 py-1 font-mono text-xs ${
                index === 0 ? "border-hot/50 text-hot" : "border-lime/50 text-lime"
              }`}
            >
              {track.highlight}
            </p>
            <ul className="mt-6 space-y-2 text-muted">
              {track.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-[0.7em] h-px w-4 shrink-0 bg-line" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-xs tracking-widest text-muted uppercase">
              Gives me <span className="text-text">{track.gives}</span>
            </p>
          </div>
        ))}
      </div>

      <svg
        aria-hidden
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="hidden h-32 w-full overflow-visible md:block"
      >
        <path d="M0,0 C0,26 50,12 50,40" fill="none" stroke="var(--line)" vectorEffect="non-scaling-stroke" />
        <path d="M50,0 L50,40" fill="none" stroke="var(--line)" vectorEffect="non-scaling-stroke" />
        <motion.path
          d="M0,0 C0,26 50,12 50,40"
          fill="none"
          stroke="var(--hot)"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: merge }}
        />
        <motion.path
          d="M50,0 L50,40"
          fill="none"
          stroke="var(--lime)"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: merge }}
        />
      </svg>

      <motion.div style={{ opacity: verdict }} className="border-l border-text pl-8 md:ml-[50%]">
        <p className="font-mono text-xs tracking-widest text-muted">MERGE</p>
        <p className="mt-3 max-w-md font-head text-2xl leading-snug font-medium sm:text-3xl">
          One engineer who can build the system and question the data inside it.
        </p>
      </motion.div>
    </div>
  );
}
