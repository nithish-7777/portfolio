import Link from "next/link";
import { BugGame } from "@/components/BugGame";

export const metadata = { title: "Page not found | Nithish Raaju V" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center px-5 py-16">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-hot">404</span> / Page not found
      </p>
      <h1 className="mt-5 font-head text-5xl leading-none font-bold tracking-tight sm:text-7xl">This page has a bug.</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        It doesn&apos;t exist. While you&apos;re here, catch a few. Move the net with your mouse, your finger or the arrow
        keys.
      </p>
      <div className="mt-8">
        <BugGame />
      </div>
      <Link
        href="/"
        className="mt-8 self-start rounded-full bg-text px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
      >
        ← Back to the portfolio
      </Link>
    </main>
  );
}
