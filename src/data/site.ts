// All the text on the site lives here. Edit this file to update the page.

export type Lens = "everyone" | "recruiter" | "client";

export const lenses: { id: Lens; label: string }[] = [
  { id: "everyone", label: "Anyone" },
  { id: "recruiter", label: "Recruiter" },
  { id: "client", label: "Client" },
];

// The order the sections appear in for each kind of reader.
export const sectionOrder: Record<Lens, string[]> = {
  everyone: ["about", "journey", "tracks", "experience", "achievements", "certs", "work", "stack", "lab", "services", "contact"],
  recruiter: ["about", "journey", "achievements", "tracks", "experience", "certs", "work", "stack", "lab", "services", "contact"],
  client: ["about", "services", "work", "journey", "achievements", "certs", "stack", "experience", "tracks", "lab", "contact"],
};

export const profile = {
  name: "Nithish Raaju V",
  nameLines: ["NITHISH", "RAAJU V"],
  location: "Chennai, Tamil Nadu, India",
  coordinates: "13.08°N 80.27°E",
  roles: ["CSE student", "Full-stack developer", "Freelance web developer"],
  availability: "Available for freelance web projects",
  tagline: {
    everyone:
      "Computer science student from Chennai on two degree tracks at once, a three-time hackathon podium finisher, and a developer who likes software with a real job to do.",
    recruiter:
      "CSE student with a 9.20 CGPA and three hackathon podiums, studying data science at IIT Madras in parallel, with full-stack projects already shipped.",
    client:
      "I design and build fast, clean websites and web apps for businesses, from the first sketch to the live link.",
  } satisfies Record<Lens, string>,
  statement:
    "I'm Nithish. I study computer science on two degree tracks, compete in hackathons, and build software that has a real job to do.",
  about: [
    "I'm a computer science and engineering student from Chennai, pursuing a B.E. at Saveetha Institute of Medical and Technical Sciences alongside the online BS in Data Science and Applications from IIT Madras.",
    "Outside class I freelance as a web developer. I take a project from the first conversation to a deployed, working product, and I stay around to fix and improve it.",
    "I work iteratively: build it, break it, fix it, push it. I'd rather ship something small that works than describe something big that doesn't.",
  ],
  stats: [
    { value: "9.20", label: "CGPA, B.E. CSE" },
    { value: "97", label: "Percentile, first year" },
    { value: "03", label: "Hackathon podiums" },
  ],
  contactHeading: {
    everyone: ["Let's build", "something"],
    recruiter: ["Hiring?", "Let's talk"],
    client: ["Have a", "project"],
  } satisfies Record<Lens, string[]>,
  github: "https://github.com/nithish-7777",
  email: "nithishraaju72@gmail.com",
  linkedin: "https://www.linkedin.com/in/nithish-raaju-v-b4a563388",
  whatsapp: "https://wa.me/919345581362",
  instagram: "https://www.instagram.com/nith.isshhhh",
  resumeUrl: "/Nithish-Raaju-V-Resume.pdf",
};

export type JourneyStop = { year: string; kind: string; title: string; note: string; win?: boolean };

export const journey: JourneyStop[] = [
  { year: "2022", kind: "School", title: "Class 10, CBSE", note: "Kids Club CBSE School, Tiruppur." },
  { year: "2024", kind: "School", title: "Class 12, CBSE", note: "Kids Club CBSE School. Then the move to Chennai." },
  { year: "2024", kind: "College", title: "Started B.E. in CSE", note: "Saveetha Institute of Medical and Technical Sciences, Chennai." },
  { year: "2025", kind: "Second degree", title: "Joined IIT Madras BS", note: "Data Science and Applications, online, alongside the B.E." },
  { year: "2025", kind: "Certification", title: "AI For All", note: "Completed the AI Aware stage from Intel, CBSE and Digital India." },
  { year: "2025", kind: "Merit", title: "97th percentile", note: "Certificate of Merit among 3,123 students in first-year exams.", win: true },
  { year: "2025", kind: "Hackathon", title: "Won the Internal Hackathon", note: "Winner, Hackathon Club, SIMATS Engineering.", win: true },
  { year: "2026", kind: "Work", title: "Python Developer", note: "Three months with Zaalima Development, working remotely." },
  { year: "2026", kind: "Hackathon", title: "2nd place, Thiran Appathon", note: "Sri Eshwar College of Engineering, Coimbatore.", win: true },
  { year: "2026", kind: "Hackathon", title: "1st place, Sathak-A-Thon 2.0", note: "Mohamed Sathak A.J. College of Engineering, Chennai.", win: true },
  { year: "2028", kind: "Next", title: "Graduation", note: "B.E. Computer Science and Engineering, expected." },
];

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
    place: "Chennai · 2024 to 2028",
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
    place: "Online · 2025 to present",
    degree: "BS Data Science and Applications",
    highlight: "Foundation level",
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

export type Award = { title: string; event: string; issuer: string; date: string; image: string };

export const achievements: Award[] = [
  {
    title: "1st place",
    event: "Sathak-A-Thon 2.0",
    issuer: "Mohamed Sathak A.J. College of Engineering, Chennai",
    date: "April 2026",
    image: "/certificates/sathak-a-thon.jpg",
  },
  {
    title: "Winner",
    event: "Internal Hackathon 2025",
    issuer: "Hackathon Club, SIMATS Engineering",
    date: "December 2025",
    image: "/certificates/internal-hackathon.jpg",
  },
  {
    title: "2nd place",
    event: "Appathon, Thiran 2026",
    issuer: "Sri Eshwar College of Engineering, Coimbatore",
    date: "February 2026",
    image: "/certificates/thiran-appathon.jpg",
  },
  {
    title: "97th percentile",
    event: "Certificate of Merit, CSE first year",
    issuer: "Saveetha Institute of Medical and Technical Sciences · of 3,123 students",
    date: "2024 to 2025",
    image: "/certificates/merit.jpg",
  },
];

export const certifications: Award[] = [
  {
    title: "AI For All",
    event: "AI Aware stage completed",
    issuer: "Intel · CBSE · Digital India",
    date: "August 2025",
    image: "/certificates/ai-for-all.jpg",
  },
];

export const experience = [
  {
    role: "Python Developer",
    company: "Zaalima Development",
    period: "January to March 2026 · Remote",
    points: [
      "Helped build backend systems with Python and REST APIs.",
      "Supported development and testing of application features.",
      "Worked with data using Pandas and NumPy.",
      "Debugged and improved application performance.",
    ],
  },
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
      "Online pharmacy and inventory system with medicine browsing, cart and checkout, a role-based admin dashboard, and alerts for stock that is running low or close to expiry.",
    tech: ["Next.js", "Node.js", "JWT auth"],
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
    title: "Line-following robot",
    note: "A differential-drive robot that tracks a path and adjusts its own speed as the line curves.",
    tag: "Robotics",
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
  { layer: "Services", role: "Where the logic lives", items: ["Node.js", "FastAPI", "Flask", "REST APIs", "Celery", "Streamlit"] },
  { layer: "Data", role: "What it remembers", items: ["PostgreSQL", "Prisma", "Redis", "Firestore"] },
  { layer: "Intelligence", role: "What it learns", items: ["Python", "Pandas", "NumPy", "scikit-learn"] },
  { layer: "Foundations", role: "What holds it up", items: ["Docker", "Git", "GitHub", "C", "C++", "Java"] },
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
