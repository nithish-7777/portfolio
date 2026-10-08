// All the text on the site lives here. Edit this file to update the page.

export const profile = {
  name: "Nithish Raaju V",
  nameLines: ["NITHISH", "RAAJU V"],
  location: "Chennai, Tamil Nadu, India",
  coordinates: "13.08°N 80.27°E",
  roles: ["Full-stack", "AI / ML", "Security"],
  tagline:
    "Computer science student on two degree tracks at once, building full-stack, AI and security software for problems people actually have.",
  statement:
    "I like software that has a job to do. Catching a fraudulent UPI payment before it clears. Marking attendance on a site with no signal. Warning a pharmacist before stock expires.",
  about: [
    "I'm a computer science and engineering student from Chennai, pursuing a B.E. at Saveetha Institute of Medical and Technical Sciences alongside the online BS in Data Science and Applications from IIT Madras.",
    "The two tracks pull in useful directions. Engineering gives me systems, networks and security. Data science gives me statistics and machine learning. Most of what I build sits where they meet.",
    "I work iteratively: build it, break it, fix it, push it. I'd rather ship something small that works than describe something big that doesn't.",
  ],
  stats: [
    { value: "9.20", label: "CGPA, B.E. CSE" },
    { value: "02", label: "Degrees in parallel" },
    { value: "23", label: "Public repositories" },
  ],
  github: "https://github.com/nithish-7777",
  // Fill these in to show them in the contact section and command palette.
  email: "",
  linkedin: "",
  resumeUrl: "",
};

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
    title: "FraudShield Sentinel",
    kind: "Fintech · Machine learning",
    problem: "UPI fraud is caught after the money is gone.",
    description:
      "Real-time UPI fraud detection. A FastAPI backend scores each live transaction with an Isolation Forest model plus rule-based checks, and a Streamlit dashboard gives bank risk teams colour-coded alerts they can act on.",
    tech: ["Python", "FastAPI", "Streamlit", "scikit-learn"],
    repo: "https://github.com/nithish-7777/FraudShield-Sentinel",
    visual: "fraud",
  },
  {
    title: "JR Erectors",
    kind: "Construction · PWA",
    problem: "Construction sites rarely have a reliable signal.",
    description:
      "Attendance and payroll app for a construction firm, with role-based dashboards for admins and team leaders. Attendance is marked offline and syncs through Firestore the moment the device reconnects.",
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
  { layer: "Intelligence", role: "What it learns", items: ["Python", "scikit-learn", "Anomaly detection"] },
  { layer: "Foundations", role: "What holds it up", items: ["Docker", "Git", "GitHub", "C++", "Java"] },
];

export const interests = [
  "Fraud detection",
  "Cybersecurity",
  "Algorithms",
  "Research-oriented development",
  "macOS productivity",
  "Music",
  "Creative web experiments",
];
