"use client";

import { createContext, Fragment, useContext, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lenses, sectionOrder, type Lens } from "@/data/site";

const LensContext = createContext<{ lens: Lens; setLens: (lens: Lens) => void }>({
  lens: "everyone",
  setLens: () => {},
});

export const useLens = () => useContext(LensContext);

/**
 * The site rearranges itself for whoever is reading. A recruiter gets
 * education and achievements first; a client gets services and work first.
 */
export function LensProvider({ children }: { children: React.ReactNode }) {
  const [lens, setLens] = useState<Lens>("everyone");
  return <LensContext.Provider value={{ lens, setLens }}>{children}</LensContext.Provider>;
}

/** Text that changes with the reader. */
export function LensText({ text }: { text: Record<Lens, string> }) {
  const { lens } = useLens();
  const reduce = useReducedMotion();
  return (
    <motion.span
      key={lens}
      className="inline-block"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text[lens]}
    </motion.span>
  );
}

/** Stacked lines that change with the reader, used for the contact headline. */
export function LensLines({ lines }: { lines: Record<Lens, string[]> }) {
  const { lens } = useLens();
  return (
    <>
      {lines[lens].map((line, index) => (
        <span key={line} className="block">
          {line}
          {index === lines[lens].length - 1 && <span className="text-hot">.</span>}
        </span>
      ))}
    </>
  );
}

/** Renders the page sections in the order that suits the current reader. */
export function LensSections({ sections }: { sections: Record<string, React.ReactNode> }) {
  const { lens } = useLens();
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={lens}
        id="sections"
        className="sections scroll-mt-20"
        initial={reduce ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -16 }}
        transition={{ duration: 0.35 }}
      >
        {sectionOrder[lens]
          .filter((id) => sections[id])
          .map((id) => (
            <Fragment key={id}>{sections[id]}</Fragment>
          ))}
      </motion.div>
    </AnimatePresence>
  );
}

/** Floating switch for choosing who is reading. */
export function LensDock() {
  const { lens, setLens } = useLens();

  const choose = (next: Lens) => {
    if (next === lens) return;
    setLens(next);
    const sections = document.getElementById("sections");
    if (sections && sections.getBoundingClientRect().top < 0) sections.scrollIntoView();
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div
        role="radiogroup"
        aria-label="Who is reading"
        className="glass flex items-center gap-1 rounded-full p-1 font-mono text-xs"
      >
        <span className="hidden pr-1 pl-3 text-muted sm:inline">Reading as</span>
        {lenses.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={lens === option.id}
            onClick={() => choose(option.id)}
            className="relative rounded-full px-3.5 py-2 transition-colors"
          >
            {lens === option.id && (
              <motion.span layoutId="lens-pill" className="absolute inset-0 rounded-full bg-lime" />
            )}
            <span className={`relative ${lens === option.id ? "text-bg" : "text-muted"}`}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
