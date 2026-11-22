// All portfolio copy lives here. Edit this file to update the site.

export const profile = {
  name: "Kareem Taha",
  role: "Full-stack software engineer",
  location: "Cairo, Egypt",
  email: "kareemm.taha04@gmail.com",
  github: "https://github.com/KareemTahaaa",
  linkedin: "https://www.linkedin.com/in/kareem-taha-a30869416",
  cv: "/Kareem-Taha-CV.pdf",
  intro:
    "I build web apps end to end, from the database to the deploy, in English and Arabic. Most of my work ships to real clients and real customers.",
  availability: "Open to full-time software engineering roles and freelance projects.",
  facts: [
    { label: "Based in", value: "Cairo, Egypt" },
    { label: "Studied", value: "BSc Computer Science, BUE and London South Bank University, 2026" },
    { label: "Freelancing since", value: "January 2024" },
  ],
};

export type Tag = "AI" | "Web" | "E-commerce" | "Back end";
export const tagList: Tag[] = ["AI", "Web", "E-commerce", "Back end"];

export type Project = {
  slug: string;
  title: string;
  context: string;
  year: string;
  summary: string;
  points: string[];
  stack: string[];
  live?: { href: string; label: string };
  code?: string;
  image?: { src: string; alt: string };
  dir?: "rtl";
  tags: Tag[];
};

export const featured: Project[] = [
  {
    slug: "esf",
    tags: ["Web"],
    title: "Egyptian Skating Federation",
    context: "Client project, official federation website",
    year: "2026",
    summary:
      "The federation's official Arabic site for news, events, competitions and regulations. Staff publish everything themselves through a CMS.",
    points: [
      "Built a fully responsive right-to-left Arabic interface",
      "Dynamic pages for every competition and event",
      "Content managed in Sanity, so updates need no developer",
      "Tuned SEO and Core Web Vitals for search and speed",
    ],
    stack: ["Next.js 15", "TypeScript", "Sanity CMS", "Tailwind CSS"],
    live: { href: "https://egyptskate.org", label: "egyptskate.org" },
    code: "https://github.com/KareemTahaaa/ESF",
    image: { src: "/work/esf.png", alt: "Egyptian Skating Federation homepage in Arabic, showing the Africa Skate Games Cairo banner" },
    dir: "rtl",
  },
  {
    slug: "dollaby",
    tags: ["AI", "Web", "Back end"],
    title: "Dollaby",
    context: "Graduation project, AI personal stylist",
    year: "2026",
    summary:
      "Upload your clothes and get outfits matched to the weather and your calendar, then see them on you with virtual try-on.",
    points: [
      "FastAPI backend with JWT auth and MongoDB Atlas",
      "Outfit generation and a fashion chat assistant using OpenAI and Groq",
      "Virtual try-on with VITON models run through Replicate",
      "Real-time notifications while long AI jobs finish in the background",
    ],
    stack: ["Next.js 16", "React 19", "FastAPI", "MongoDB", "Docker"],
    live: { href: "https://dollaby.vercel.app", label: "dollaby.vercel.app" },
    code: "https://github.com/KareemTahaaa/DOLLABY",
    image: { src: "/work/dollaby.png", alt: "Dollaby landing page: Your smart AI-powered digital wardrobe" },
  },
  {
    slug: "tandlos",
    tags: ["E-commerce", "AI", "Web"],
    title: "Tandlos store",
    context: "My own clothing brand, founded and run by me",
    year: "Ongoing",
    summary:
      "I started Tandlos as a clothing brand, then built its online store. It has handled real orders from real customers.",
    points: [
      "Checkout, order management and an admin dashboard",
      "In-browser virtual try-on with TensorFlow.js and MediaPipe",
      "Product design, branding and e-commerce operations, start to finish",
    ],
    stack: ["Next.js", "React", "TypeScript", "TensorFlow.js", "MediaPipe"],
    code: "https://github.com/KareemTahaaa/tandlosfull",
  },
];

export const more: Project[] = [
  {
    slug: "medretriv",
    tags: ["AI", "Back end"],
    title: "MedRetriv",
    context: "Hackathon, clinical decision support",
    year: "2026",
    summary:
      "A question-answering assistant for breast cancer screening guidelines that cites the exact page behind every claim.",
    points: [
      "Retrieval over 5 clinical documents, 387 pages split into 515 chunks",
      "Citations checked against the source after every answer",
      "Off-topic questions stopped before they reach the language model",
      "Corrects medical typos before searching",
    ],
    stack: ["Python", "RAG", "Embeddings", "JavaScript"],
    code: "https://github.com/KareemTahaaa/medretriv",
  },
  {
    slug: "habits",
    tags: ["Back end", "Web"],
    title: "Habit Tracker",
    context: "User service for a habit-tracking app",
    year: "2026",
    summary:
      "Sign-up, login, profiles and password reset by email, built as a standalone service with its own API.",
    points: [
      "Express REST API with JWT-protected routes",
      "Password reset emails through SendGrid",
      "React front end with protected pages and shared auth state",
    ],
    stack: ["Node.js", "Express", "MongoDB Atlas", "React", "Vite"],
    live: { href: "https://habit-tracker-nu-indol.vercel.app", label: "the live demo" },
    code: "https://github.com/KareemTahaaa/habit-tracker",
  },
];

export const smallBuilds = [
  { title: "React component library", note: "Reusable components with documentation", href: "https://github.com/KareemTahaaa/react-component-library" },
  { title: "Contact form", note: "Real-time validation, mobile first", href: "https://github.com/KareemTahaaa/contact-form" },
  { title: "Collapsible sidebar", note: "Animated navigation with a mobile layout", href: "https://github.com/KareemTahaaa/collapsible-sidebar" },
];

export type Role = {
  title: string;
  org: string;
  place: string;
  dates: string;
  current?: boolean;
  points: string[];
};

export const experience: Role[] = [
  {
    title: "Freelance full-stack developer",
    org: "Self-employed",
    place: "Cairo, Egypt",
    dates: "Jan 2024 to now",
    current: true,
    points: [
      "Build and ship full-stack web apps for clients with React, Next.js and TypeScript",
      "Backend APIs in Node.js with Prisma and SQL databases",
      "Deploy to AWS, Azure and Vercel with CI/CD for reliable releases",
      "Integrate Sanity CMS so clients can manage their own content",
    ],
  },
  {
    title: "Cybersecurity intern",
    org: "Optima Professional Services (OPS)",
    place: "Cairo, Egypt",
    dates: "Jun 2026 to Jul 2026",
    points: [
      "Monitored and triaged security alerts in the Security Operations Center",
      "Worked hands-on with Palo Alto and F5 for network security and traffic inspection",
      "Took part in red team exercises to find and exploit network weaknesses",
    ],
  },
];

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "SQL", "Python", "C++"] },
  { group: "Front end", items: ["React", "Next.js (App Router)", "Tailwind CSS", "Radix UI"] },
  { group: "Back end and data", items: ["Node.js", "REST APIs", "FastAPI", "Prisma", "PostgreSQL", "MongoDB"] },
  { group: "Cloud and delivery", items: ["AWS", "Microsoft Azure", "Vercel", "CI/CD", "Docker", "Git"] },
  { group: "AI and computer vision", items: ["TensorFlow.js", "MediaPipe", "RAG", "OpenAI and Groq APIs"] },
  { group: "Security", items: ["SOC monitoring", "Palo Alto", "F5", "Penetration testing basics"] },
  { group: "Content", items: ["Sanity", "GROQ"] },
];

export const leadership = [
  { title: "Founder and owner, Tandlos", note: "Clothing brand with real customers and online sales" },
  { title: "Coach, Shams Club", note: "Trained and mentored more than 200 trainees" },
  { title: "Head of Faculty (ICS), BUE Student Union", note: "2025, after heading the Clubs Committee in 2023" },
  { title: "Head, BUE Magazine Club", note: "2024" },
  { title: "Head of Activities, Infinity Club", note: "2023" },
  { title: "Full-stack trainee, WE Initiative", note: "198-hour intensive program" },
  { title: "Event team leader", note: "Usher at 6 large events, promoted to team leader for 3" },
];

export const languages = "Arabic (native) and English (professional)";
