"use client";

import { useState } from "react";
import { enquiryTypes, profile } from "@/data/site";

/**
 * Builds a ready-to-send email from a short brief and opens it in the
 * visitor's own mail app. Nothing is stored or sent from this page.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [need, setNeed] = useState(enquiryTypes[0]);
  const [details, setDetails] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = `${need}${name ? ` — from ${name}` : ""}`;
    const body = `Hi Nithish,\n\nI'm looking for: ${need.toLowerCase()}.\n\n${details}\n\n${name}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is unavailable; the address is still visible to copy by hand.
    }
  };

  const field =
    "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition-colors placeholder:text-muted/60 focus:border-lime";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
      <div className="glass-card flex flex-col justify-between gap-10 rounded-3xl p-6 sm:p-10">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">Write to me directly</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-4 block font-head text-2xl font-semibold break-all transition-colors hover:text-lime sm:text-3xl"
          >
            {profile.email}
          </a>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              className="rounded-full border border-line px-4 py-2 font-mono text-xs transition-colors hover:border-text"
            >
              {copied ? "Copied" : "Copy address"}
            </button>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-lime px-4 py-2 font-mono text-xs text-bg transition-opacity hover:opacity-85"
            >
              Chat on WhatsApp ↗
            </a>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          For freelance work, a line about what you need and when you need it is enough to start.
        </p>
      </div>

      <form onSubmit={submit} className="glass-card space-y-6 rounded-3xl p-6 sm:p-10">
        <fieldset>
          <legend className="font-mono text-xs tracking-widest text-muted uppercase">What do you need?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {enquiryTypes.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={need === type}
                onClick={() => setNeed(type)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  need === type ? "border-lime bg-lime text-bg" : "border-line text-muted hover:border-text hover:text-text"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block font-mono text-xs tracking-widest text-muted uppercase">
          Your name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            className={`${field} font-sans text-base tracking-normal text-text normal-case`}
          />
        </label>
        <label className="block font-mono text-xs tracking-widest text-muted uppercase">
          A few details
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            required
            rows={4}
            placeholder="What it's for, when you need it, anything you already have."
            className={`${field} resize-none font-sans text-base tracking-normal text-text normal-case`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-full bg-text px-7 py-3.5 font-medium text-bg transition-opacity hover:opacity-85"
          >
            Write the email ↗
          </button>
          <p className="text-xs text-muted">Opens your mail app with the message filled in.</p>
        </div>
      </form>
    </div>
  );
}
