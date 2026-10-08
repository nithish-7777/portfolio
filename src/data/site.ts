// All the text on the site lives here. Edit this file to update the page.

export type Lens = "everyone" | "recruiter" | "client";

export const lenses: { id: Lens; label: string }[] = [
  { id: "everyone", label: "Anyone" },
  { id: "recruiter", label: "Recruiter" },
  { id: "client", label: "Client" },
];

// The order the sections appear in for each kind of reader.
export const sectionOrder: Record<Lens, string[]> = {
  everyone: ["about", "services", "work", "tracks", "milestones", "certs", "stack", "lab", "contact"],
  recruiter: ["about", "tracks", "milestones", "certs", "work", "stack", "lab", "services", "contact"],
  client: ["services", "work", "about", "stack", "milestones", "certs", "tracks", "lab", "contact"],
};

export const profile = {
  name: "Nithish Raaju V",
  nameLines: ["NITHISH", "RAAJU V"],
  location: "Chennai, Tamil Nadu, India",
  coordinates: "13.08°N 80.27°E",
  roles: ["Full-stack developer", "Freelance web developer", "CSE student"],
  availability: "Available for freelance web projects",
  tagline: {
    everyone:
      "Computer science student on two degree tracks at once, and a freelance developer who builds websites and web apps that people actually use.",
    recruiter:
      "CSE student with a 9.20 CGPA, studying data science at IIT Madras in parallel, with full-stack and machine-learning projects already shipped.",
    client:
      "I design and build fast, clean websites and web apps for businesses, from the first sketch to the live link.",
  } satisfies Record<Lens, string>,
  statement:
    "I'm Nithish. I study computer science on two degree tracks, build websites and web apps for clients, and care most about software that has a real job to do.",
  about: [
    "I'm a computer science and engineering student from Chennai, pursuing a B.E. at Saveetha Institute of Medical and Technical Sciences alongside the online BS in Data Science and Applications from IIT Madras.",
    "Outside class I freelance as a web developer. I take a project from the first conversation to a deployed, working product, and I stay around to fix and improve it.",
    "I work iteratively: build it, break it, fix it, push it. I'd rather ship something small that works than describe something big that doesn't.",
  ],
  stats: [
    { value: "9.20", label: "CGPA, B.E. CSE" },
    { value: "02", label: "Degrees in parallel" },
    { value: "23", label: "Public repositories" },
  ],
  contactHeading: {
    everyone: ["Let's build", "something"],
    recruiter: ["Hiring?", "Let's talk"],
    client: ["Have a", "project"],
  } satisfies Record<Lens, string[]>,
  github: "https://github.com/nithish-7777",
  email: "nithishraaju72@gmail.com",
  // Fill these in to show them in the contact section and command palette.
  linkedin: "",
  resumeUrl: "",
};

export const services = [
  {
    title: "Websites & landing pages",
    note: "Fast, responsive sites for businesses, portfolios and launches, built to look right on every screen.",
  },
  {
    title: "Web apps & dashboards",
    note: "Logins, roles, data and admin panels. Custom tools shaped around how your team already works.",
  },
  {
    title: "Installable, offline-ready apps",
    note: "Progressive web apps that install on a phone, keep working without signal and sync when it returns.",
  },
  {
    title: "Redesigns, fixes & deployment",
    note: "Modernise an existing site, fix what's broken and get it live on a fast, reliable host.",
  },
];

export const process = [
  { step: "Brief", note: "You tell me what you need and who it's for." },
  { step: "Design", note: "I show you how it will look before building it." },
  { step: "Build", note: "You get a live preview link and watch it take shape." },
  { step: "Launch", note: "It goes live on your domain, and I stay for fixes." },
];

export const tracks = [
  {
    id: "saveetha",
    code: "TRACK A",
    school: "Saveetha Institute of Medical and Technical Sciences",
    place: "Chennai · On campus",
    degree: "B.E. Computer Science and Engineering",
    highlight: "CGPA 9.20",
    gives: "Systems thinking",
    points: [
      "Operating systems, networks and computer architecture",
      "Cryptography and network security",
      "Object-oriented analysis and design",
    ],
  },
  {
    id: "iitm",
    code: "TRACK B",
    school: "Indian Institute of Technology Madras",
    place: "Online · Dual-degree path",
    degree: "BS Data Science and Applications",
    highlight: "In progress",
    gives: "Statistical thinking",
    points: [
      "Mathematics and statistics for data science",
      "Programming and application development",
      "Machine learning foundations",
    ],
  },
];

export const coursework = [
  "Data Structures",
  "Operating Systems",
  "Computer Networks",
  "Computer Architecture",
  "Cloud Computing",
  "Artificial Intelligence",
  "Cryptography & Network Security",
  "Object-Oriented Analysis & Design",
  "Discrete Mathematics",
  "Embedded Systems",
];

// Add awards, hackathon results, ranks and anything else worth showing off.
export const milestones: { title: string; note: string }[] = [
  { title: "9.20 CGPA", note: "Across the B.E. Computer Science and Engineering programme at Saveetha." },
  { title: "Two degrees at once", note: "Studying the IIT Madras BS in Data Science alongside a full-time B.E." },
  { title: "Live in production", note: "MediStore, a pharmacy management app, is deployed and publicly usable." },
  { title: "Built for the field", note: "Shipped JR Erectors, an attendance and payroll PWA that works offline on site." },
  { title: "Appathon build", note: "Built Split Wise, a bill-splitting app with UPI QR settlement, for an appathon." },
  { title: "23 public repositories", note: "Coursework, experiments and finished projects, all in the open on GitHub." },
];

// Add each certificate here. The section appears on the site once this list has entries.
export const certifications: { title: string; issuer: string; year: string; url?: string }[] = [];

export type VisualKind = "fraud" | "attendance" | "pharmacy" | "route" | "skills" | "split";

export type Project = {
  title: string;
  kind: string;
  problem: string;
  description: string;
  tech: string[];
  repo: string;
  live?: string;
  visual: VisualKind;
};

export const projects: Project[] = [
  {
    title: "JR Erectors",
    kind: "Construction · PWA",
    problem: "Construction sites rarely have a reliable signal.",
    description:
      "Attendance and payroll app for construction sites, with role-based dashboards for admins and team leaders. Attendance is marked offline and syncs through Firestore the moment the device reconnects.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    repo: "https://github.com/nithish-7777/jr-erectors-pwa",
    visual: "attendance",
  },
  {
    title: "MediStore",
    kind: "Healthcare · Web app",
    problem: "Expired stock is money and safety lost.",
    description:
      "Pharmacy management covering inventory, customers and sales, with alerts that surface medicines approaching expiry before they become a write-off.",
    tech: ["React", "JavaScript", "CSS"],
    repo: "https://github.com/nithish-7777/Medistore",
    live: "https://medistore-six.vercel.app",
    visual: "pharmacy",
  },
  {
    title: "FraudShield Sentinel",
    kind: "Fintech · Machine learning",
    problem: "UPI fraud is caught after the money is gone.",
    description:
      "Real-time UPI fraud detection. A FastAPI backend scores each live transaction with an Isolation Forest model plus rule-based checks, and a Streamlit dashboard gives bank risk teams colour-coded alerts.",
    tech: ["Python", "FastAPI", "Streamlit", "scikit-learn"],
    repo: "https://github.com/nithish-7777/FraudShield-Sentinel",
    visual: "fraud",
  },
  {
    title: "School Van Tracker",
    kind: "Safety · Live tracking",
    problem: "Parents wait at the stop without knowing where the van is.",
    description:
      "Live transport monitoring that lets parents and school admins follow each van's location, route and estimated arrival on a map.",
    tech: ["Python", "GPS", "Maps"],
    repo: "https://github.com/nithish-7777/school-van-tracker",
    visual: "route",
  },
  {
    title: "Adaptive Employment Readiness",
    kind: "Careers · Data",
    problem: "Students learn skills the market stopped asking for.",
    description:
      "Reads industry skill demand from job-market data, finds the gaps in a learner's profile and generates a personalised learning path to close them.",
    tech: ["Java", "Job-market data"],
    repo: "https://github.com/nithish-7777/Adaptive-Employment-Readiness-Platform",
    visual: "skills",
  },
  {
    title: "Split Wise",
    kind: "Appathon · Payments",
    problem: "Settling a group bill takes longer than the meal.",
    description:
      "Enter a total and a head count, get each person's share, and settle instantly by scanning a generated UPI QR code.",
    tech: ["JavaScript", "UPI QR"],
    repo: "https://github.com/nithish-7777/Complexity-Simplified-Appathon-Split-Wise",
    visual: "split",
  },
];

export const lab: { title: string; note: string; tag: string }[] = [
  {
    title: "Document Q&A for students",
    note: "Ask questions of your own course material and get answers grounded in the document.",
    tag: "Hackathon",
  },
  {
    title: "Mic and camera watchdog",
    note: "Browser extension concept that warns you when a page reaches for your microphone or camera without asking.",
    tag: "Concept",
  },
  {
    title: "ONLYOFFICE document editing",
    note: "In-app document editing wired up with ONLYOFFICE running in Docker.",
    tag: "Integration",
  },
  {
    title: "SIM-swap governance",
    note: "A model for how telecoms and banks could coordinate to stop SIM-swap account takeovers.",
    tag: "Concept",
  },
  {
    title: "Disaster resource allocation",
    note: "Deciding where limited relief supplies should go first when demand outruns supply.",
    tag: "Idea",
  },
];

export const stack: { layer: string; role: string; items: string[] }[] = [
  { layer: "Interface", role: "What people touch", items: ["React", "Next.js", "Tailwind CSS", "Flutter"] },
  { layer: "Services", role: "Where the logic lives", items: ["Node.js", "FastAPI", "Celery", "Streamlit"] },
  { layer: "Data", role: "What it remembers", items: ["PostgreSQL", "Prisma", "Redis", "Firestore"] },
  { layer: "Intelligence", role: "What it learns", items: ["Python", "scikit-learn", "Machine learning"] },
  { layer: "Foundations", role: "What holds it up", items: ["Docker", "Git", "GitHub", "C++", "Java"] },
];

export const interests = [
  "Cybersecurity",
  "AI and machine learning",
  "Algorithms",
  "Research-oriented development",
  "macOS productivity",
  "Music",
  "Creative web experiments",
];

export const enquiryTypes = ["A website", "A web app", "A redesign", "A role or internship", "Something else"];
