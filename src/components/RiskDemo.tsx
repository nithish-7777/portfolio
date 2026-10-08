"use client";

import { useState } from "react";

const formatRupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const formatHour = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

// Amount slider is logarithmic: 0..100 maps to ₹100..₹2,00,000.
const toAmount = (position: number) => Math.round((100 * Math.pow(2000, position / 100)) / 10) * 10;

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
        checked ? "border-flag/60 text-text" : "border-line text-muted"
      }`}
    >
      {label}
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-flag" : "bg-line"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-text transition-all ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function RiskDemo() {
  const [position, setPosition] = useState(38);
  const [hour, setHour] = useState(14);
  const [burst, setBurst] = useState(1);
  const [newDevice, setNewDevice] = useState(false);
  const [newPayee, setNewPayee] = useState(false);

  const amount = toAmount(position);
  const night = hour >= 23 || hour < 5;

  const factors = [
    { on: amount > 20000, weight: 2.1 * Math.log10(amount / 2000), text: `Large amount (${formatRupees(amount)})` },
    { on: night, weight: 1.3, text: `Unusual hour (${formatHour(hour)})` },
    { on: newDevice, weight: 1.6, text: "First time on this device" },
    { on: newPayee, weight: 1.1, text: "Payee never paid before" },
    { on: burst >= 4, weight: 0.3 * burst, text: `${burst} payments in 10 minutes` },
  ];
  const base = Math.max(0, 2.1 * Math.log10(amount / 2000)) * 0.35 + burst * 0.08;
  const logit = -3.1 + base + factors.reduce((sum, factor) => sum + (factor.on ? factor.weight : 0), 0);
  const score = 1 / (1 + Math.exp(-logit));
  const reasons = factors.filter((factor) => factor.on);

  const verdict =
    score >= 0.7
      ? { label: "Flagged", color: "text-flag", bar: "bg-flag" }
      : score >= 0.35
        ? { label: "Needs review", color: "text-text", bar: "bg-text" }
        : { label: "Cleared", color: "text-clear", bar: "bg-clear" };

  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-7 bg-surface p-6 sm:p-10">
        <label className="block">
          <span className="flex justify-between font-mono text-xs tracking-widest text-muted uppercase">
            Amount <span className="text-text">{formatRupees(amount)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            className="range mt-3 w-full"
          />
        </label>
        <label className="block">
          <span className="flex justify-between font-mono text-xs tracking-widest text-muted uppercase">
            Time of day <span className="text-text">{formatHour(hour)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={23}
            value={hour}
            onChange={(event) => setHour(Number(event.target.value))}
            className="range mt-3 w-full"
          />
        </label>
        <label className="block">
          <span className="flex justify-between font-mono text-xs tracking-widest text-muted uppercase">
            Payments in last 10 min <span className="text-text">{burst}</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={burst}
            onChange={(event) => setBurst(Number(event.target.value))}
            className="range mt-3 w-full"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="New device" checked={newDevice} onChange={setNewDevice} />
          <Toggle label="New payee" checked={newPayee} onChange={setNewPayee} />
        </div>
      </div>

      <div className="flex flex-col bg-surface p-6 sm:p-10" aria-live="polite">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">Risk score</p>
        <p className={`mt-2 font-head text-7xl leading-none font-bold tabular-nums sm:text-8xl ${verdict.color}`}>
          {score.toFixed(2)}
        </p>
        <div className="mt-6 h-1.5 rounded-full bg-line">
          <div
            className={`h-full rounded-full transition-all duration-300 ${verdict.bar}`}
            style={{ width: `${Math.max(2, score * 100)}%` }}
          />
        </div>
        <p className={`mt-4 font-mono text-sm tracking-widest uppercase ${verdict.color}`}>{verdict.label}</p>
        <ul className="mt-6 flex-1 space-y-2 text-sm text-muted">
          {reasons.length === 0 && <li>Nothing unusual about this payment.</li>}
          {reasons.map((reason) => (
            <li key={reason.text} className="flex gap-3">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-flag" />
              {reason.text}
            </li>
          ))}
        </ul>
        <p className="mt-8 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          A simplified, rules-only demo that runs in your browser. The real FraudShield Sentinel scores transactions
          with an Isolation Forest model as well.
        </p>
      </div>
    </div>
  );
}
