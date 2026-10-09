import Link from "next/link";
import { BugGame } from "@/components/BugGame";

export const metadata = { title: "Catch the bugs | Nithish Raaju V" };

export default function Play() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col justify-center px-5 py-16">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-hot">Bonus</span> / A small game
      </p>
      <h1 className="mt-5 font-head text-5xl leading-none font-bold tracking-tight sm:text-7xl">Catch the bugs.</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        Every developer spends their days doing this anyway. See how many you can get.
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
