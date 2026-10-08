// All the text on the site lives here. Edit this file to update the page.

export const profile = {
  name: "Nithish Raaju V",
  role: "Full-stack & ML developer",
  tagline:
    "I build web apps, mobile apps and machine-learning tools that solve everyday problems, from payroll on construction sites to catching fraudulent UPI payments.",
  about: [
    "I'm a developer who likes taking a project all the way from idea to something people can actually open and use. Most of my work sits in three areas: web apps with Next.js and React, cross-platform mobile apps with Flutter, and applied machine learning in Python.",
    "I care about software that keeps working in real conditions, like an attendance app that still records entries when the site has no signal, or a fraud model that explains its score to the person reviewing it.",
  ],
  github: "https://github.com/nithish-7777",
  // Fill these in to show them in the contact section.
  email: "",
  linkedin: "",
  resumeUrl: "",
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  repo: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "JR Erectors",
    description:
      "Construction attendance and payroll PWA with role-based dashboards for admins and team leaders. Attendance can be marked offline and syncs in real time once the device is back online.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Firebase"],
    repo: "https://github.com/nithish-7777/jr-erectors-pwa",
  },
  {
    title: "MediStore",
    description:
      "Pharmacy management web app covering inventory tracking, customer records, sales processing and alerts for medicines close to expiry.",
    tech: ["JavaScript", "React", "CSS"],
    repo: "https://github.com/nithish-7777/Medistore",
    live: "https://medistore-six.vercel.app",
  },
  {
    title: "FraudShield Sentinel",
    description:
      "Real-time UPI fraud detection. A FastAPI backend scores live transactions with an Isolation Forest model plus rule-based checks, and a Streamlit dashboard shows colour-coded alerts for risk teams.",
    tech: ["Python", "FastAPI", "Streamlit", "scikit-learn"],
    repo: "https://github.com/nithish-7777/FraudShield-Sentinel",
  },
  {
    title: "School Van Tracker",
    description:
      "Live student transport monitoring that lets parents and school admins follow van locations, routes and estimated arrival times on a map.",
    tech: ["Python", "GPS tracking", "Maps"],
    repo: "https://github.com/nithish-7777/school-van-tracker",
  },
  {
    title: "Adaptive Employment Readiness Platform",
    description:
      "Analyses industry skill demand from job-market data, identifies a learner's skill gaps and generates personalised career recommendations and learning paths.",
    tech: ["Java"],
    repo: "https://github.com/nithish-7777/Adaptive-Employment-Readiness-Platform",
  },
  {
    title: "Split Wise",
    description:
      "Appathon project for splitting group expenses. Enter a total and head count, get each person's share, and settle up through a generated UPI QR code.",
    tech: ["JavaScript", "UPI QR"],
    repo: "https://github.com/nithish-7777/Complexity-Simplified-Appathon-Split-Wise",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "Dart"] },
  { group: "Web", items: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "PWA"] },
  { group: "Mobile", items: ["Flutter"] },
  { group: "Backend & data", items: ["FastAPI", "Firebase", "Firestore", "Streamlit"] },
  { group: "Machine learning", items: ["scikit-learn", "Anomaly detection"] },
  { group: "Tools", items: ["Git", "GitHub", "Vercel", "Netlify"] },
];
