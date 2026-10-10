import Link from "next/link";
import { GuestbookAdmin } from "@/components/Guestbook";

export const metadata = { title: "Guestbook admin | Nithish Raaju V", robots: { index: false } };

export default function Admin() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-2xl px-5 py-16">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-hot">Private</span> / Guestbook
      </p>
      <h1 className="mt-5 font-head text-4xl leading-none font-bold tracking-tight sm:text-6xl">Approve notes.</h1>
      <p className="mt-5 leading-relaxed text-muted">
        Enter your admin key to see what visitors have written. Nothing appears on the site until you approve it.
      </p>
      <div className="mt-8">
        <GuestbookAdmin />
      </div>
      <Link href="/" className="mt-10 inline-block text-sm text-muted underline underline-offset-2 hover:text-text">
        ← Back to the portfolio
      </Link>
    </main>
  );
}
