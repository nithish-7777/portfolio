"use client";

import { useEffect, useRef, useState } from "react";

type Bug = { x: number; y: number; speed: number };

const HEIGHT = 360;
const PADDLE = 84;
const LIVES = 3;

/** Catch the falling bugs with the net. Move with a mouse, a finger or the arrow keys. */
export function BugGame() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [over, setOver] = useState(false);
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx || !started) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = element.clientWidth;
    let paddle = width / 2;
    let bugs: Bug[] = [];
    let caught = 0;
    let missed = 0;
    let lastSpawn = 0;
    let raf = 0;
    let key = 0;

    const resize = () => {
      width = element.clientWidth;
      element.width = width * dpr;
      element.height = HEIGHT * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      paddle = Math.max(PADDLE / 2, Math.min(width - PADDLE / 2, paddle + key * 7));
      const gap = Math.max(380, 950 - caught * 25);
      if (now - lastSpawn > gap) {
        bugs.push({ x: 20 + Math.random() * (width - 40), y: -20, speed: 1.6 + Math.random() * 1.2 + caught * 0.06 });
        lastSpawn = now;
      }

      ctx.clearRect(0, 0, width, HEIGHT);
      ctx.font = "22px system-ui, sans-serif";
      ctx.textAlign = "center";

      bugs = bugs.filter((bug) => {
        bug.y += bug.speed;
        const atNet = bug.y > HEIGHT - 34 && bug.y < HEIGHT - 8;
        if (atNet && Math.abs(bug.x - paddle) < PADDLE / 2 + 6) {
          caught += 1;
          setScore(caught);
          return false;
        }
        if (bug.y > HEIGHT + 20) {
          missed += 1;
          setLives(LIVES - missed);
          return false;
        }
        ctx.fillText("🐛", bug.x, bug.y);
        return true;
      });

      ctx.fillStyle = "#cdf545";
      ctx.beginPath();
      ctx.roundRect(paddle - PADDLE / 2, HEIGHT - 22, PADDLE, 10, 5);
      ctx.fill();

      if (missed >= LIVES) {
        setOver(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const onPointer = (event: PointerEvent) => {
      paddle = event.clientX - element.getBoundingClientRect().left;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") key = -1;
      if (event.key === "ArrowRight") key = 1;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") key = 0;
    };

    resize();
    raf = requestAnimationFrame(frame);
    element.addEventListener("pointermove", onPointer);
    element.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      cancelAnimationFrame(raf);
      element.removeEventListener("pointermove", onPointer);
      element.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [round, started]);

  const restart = () => {
    setScore(0);
    setLives(LIVES);
    setOver(false);
    setRound((value) => value + 1);
  };

  return (
    <div className="glass-card relative overflow-hidden rounded-3xl">
      <div className="flex justify-between border-b border-white/10 px-5 py-3 font-mono text-xs tracking-widest uppercase">
        <span>
          Bugs caught <span className="text-lime">{score}</span>
        </span>
        <span>
          Lives <span className="text-hot">{"●".repeat(Math.max(0, lives)) || "0"}</span>
        </span>
      </div>
      <canvas
        ref={canvas}
        style={{ height: HEIGHT }}
        className="block w-full touch-none"
        aria-label="Game: move the green net left and right to catch falling bugs"
      />
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg/80 px-6 text-center">
          <p className="font-head text-3xl font-semibold">Catch the bugs</p>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted">
            <li>Bugs fall from the top. Slide the green net under them.</li>
            <li>
              <span className="text-text">Phone:</span> drag your finger across the box.
            </li>
            <li>
              <span className="text-text">Computer:</span> move the mouse, or use the ← → keys.
            </li>
            <li>Miss three and the game ends.</li>
          </ul>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="rounded-full bg-lime px-7 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            Start
          </button>
        </div>
      )}
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/80 text-center">
          <p className="font-head text-3xl font-semibold">{score} bugs caught</p>
          <button
            type="button"
            onClick={restart}
            className="rounded-full bg-lime px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
