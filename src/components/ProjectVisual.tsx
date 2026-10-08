import type { VisualKind } from "@/data/site";

// Small animated sketches of what each project does. The figures are illustrative.

function Fraud() {
  const rows = [
    { id: "TXN 4821", amount: "₹240", score: "0.04" },
    { id: "TXN 4822", amount: "₹1,150", score: "0.11" },
    { id: "TXN 4823", amount: "₹86,000", score: "0.94", flagged: true },
    { id: "TXN 4824", amount: "₹520", score: "0.07" },
    { id: "TXN 4825", amount: "₹3,300", score: "0.19" },
  ];
  return (
    <ul className="w-full space-y-2 font-mono text-xs">
      {rows.map((row) => (
        <li
          key={row.id}
          className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${
            row.flagged ? "pulse-hot border-hot text-hot" : "border-line text-muted"
          }`}
        >
          <span>{row.id}</span>
          <span>{row.amount}</span>
          <span className="flex items-center gap-2">
            {row.score}
            <span className={`h-1.5 w-1.5 rounded-full ${row.flagged ? "bg-hot" : "bg-lime"}`} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Attendance() {
  const cells = Array.from({ length: 35 }, (_, index) => (index * 7 + 3) % 11 > 1);
  return (
    <div className="w-full font-mono text-xs">
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((present, index) => (
          <span
            key={index}
            className={`aspect-square rounded-[4px] ${present ? "bg-lime/80" : "border border-line"}`}
          />
        ))}
      </div>
      <div className="relative mt-4 h-8">
        <span className="swap-a absolute inset-0 flex items-center gap-2 text-hot">
          <span className="h-1.5 w-1.5 rounded-full bg-hot" /> Offline · 3 entries queued
        </span>
        <span className="swap-b absolute inset-0 flex items-center gap-2 text-lime">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Back online · synced
        </span>
      </div>
    </div>
  );
}

function Pharmacy() {
  const stock = [
    { name: "Amoxicillin 500", days: 212, width: "88%" },
    { name: "Cetirizine 10", days: 143, width: "62%" },
    { name: "Pantoprazole 40", days: 61, width: "30%" },
    { name: "Azithromycin 250", days: 6, width: "7%", urgent: true },
  ];
  return (
    <ul className="w-full space-y-4 font-mono text-xs">
      {stock.map((item) => (
        <li key={item.name}>
          <div className={`flex justify-between ${item.urgent ? "text-hot" : "text-muted"}`}>
            <span>{item.name}</span>
            <span>{item.urgent ? `expires in ${item.days}d` : `${item.days}d`}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-line">
            <div
              className={`h-full rounded-full ${item.urgent ? "pulse-hot bg-hot" : "bg-text/60"}`}
              style={{ width: item.width }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Route() {
  const path = "M20,150 C70,150 70,60 130,60 S190,130 240,110 S300,40 340,40";
  return (
    <svg viewBox="0 0 360 190" className="w-full font-mono">
      <path d={path} fill="none" stroke="var(--line)" strokeWidth="2" />
      <path d={path} fill="none" stroke="var(--text)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
      {[
        [20, 150],
        [130, 60],
        [240, 110],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="4" fill="var(--bg)" stroke="var(--muted)" />
      ))}
      <circle cx="340" cy="40" r="6" fill="none" stroke="var(--lime)" />
      <text x="282" y="22" fontSize="10" fill="var(--lime)">
        SCHOOL
      </text>
      <circle r="6" fill="var(--hot)">
        <animateMotion dur="7s" repeatCount="indefinite" path={path} />
      </circle>
      <text x="20" y="182" fontSize="10" fill="var(--muted)">
        Van 03 · next stop in 4 min
      </text>
    </svg>
  );
}

function Skills() {
  const rows = [
    { skill: "SQL", demand: "90%", have: "78%" },
    { skill: "Cloud", demand: "82%", have: "40%" },
    { skill: "React", demand: "74%", have: "70%" },
    { skill: "ML Ops", demand: "66%", have: "18%" },
  ];
  return (
    <div className="w-full font-mono text-xs">
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.skill} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 text-muted">
            <span>{row.skill}</span>
            <span className="relative h-2 rounded-full bg-line">
              <span className="absolute inset-y-0 left-0 rounded-full bg-hot/50" style={{ width: row.demand }} />
              <span className="absolute inset-y-0 left-0 rounded-full bg-lime" style={{ width: row.have }} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 flex gap-5 text-muted">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" /> You
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-hot/60" /> Gap to market demand
        </span>
      </p>
    </div>
  );
}

function Split() {
  const cells = Array.from({ length: 81 }, (_, index) => (index * 13 + (index % 7) * 5) % 3 !== 0);
  return (
    <div className="flex w-full items-center justify-between gap-6 font-mono text-xs">
      <div>
        <p className="text-muted">Total</p>
        <p className="mt-1 font-head text-3xl font-semibold text-text">₹2,400</p>
        <p className="mt-4 text-muted">÷ 4 people</p>
        <p className="mt-1 text-lg text-lime">₹600 each</p>
      </div>
      <div className="grid w-32 grid-cols-9 gap-[3px] rounded-lg border border-line p-2.5">
        {cells.map((filled, index) => (
          <span key={index} className={`aspect-square ${filled ? "bg-text" : "bg-transparent"}`} />
        ))}
      </div>
    </div>
  );
}

const visuals: Record<VisualKind, () => React.ReactNode> = {
  fraud: Fraud,
  attendance: Attendance,
  pharmacy: Pharmacy,
  route: Route,
  skills: Skills,
  split: Split,
};

export function ProjectVisual({ kind }: { kind: VisualKind }) {
  const Visual = visuals[kind];
  return (
    <div aria-hidden className="flex min-h-64 items-center rounded-xl border border-line bg-bg p-6 sm:p-8">
      <Visual />
    </div>
  );
}
