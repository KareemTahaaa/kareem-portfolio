// Kareem bot: the knowledge it answers from, plus an offline answerer used
// when no AI key is configured (or the AI call fails).
import { profile, featured, more, experience, skills, leadership, languages, smallBuilds } from "./content";

const allProjects = [...featured, ...more];

/** Plain-text fact sheet. The AI answers only from this. */
export function factSheet(): string {
  const projects = allProjects
    .map(
      (p) =>
        `- ${p.title} (${p.context}, ${p.year}): ${p.summary} Details: ${p.points.join("; ")}. Stack: ${p.stack.join(", ")}.` +
        (p.live ? ` Live: ${p.live.href}.` : "") +
        (p.code ? ` Code: ${p.code}.` : ""),
    )
    .join("\n");
  const roles = experience
    .map((r) => `- ${r.title}, ${r.org}, ${r.place} (${r.dates}): ${r.points.join("; ")}.`)
    .join("\n");
  const skillLines = skills.map((s) => `- ${s.group}: ${s.items.join(", ")}`).join("\n");
  const lead = leadership.map((l) => `- ${l.title}: ${l.note}`).join("\n");
  const small = smallBuilds.map((b) => `- ${b.title}: ${b.note} (${b.href})`).join("\n");

  return `NAME: ${profile.name}
ROLE: ${profile.role}
LOCATION: ${profile.location}
SUMMARY: ${profile.intro}
AVAILABILITY: ${profile.availability}
EDUCATION: BSc Computer Science, dual degree program, The British University in Egypt (BUE) and London South Bank University, 2022 to 2026, graduated.
LANGUAGES: ${languages}
CONTACT: email ${profile.email}; GitHub ${profile.github}; LinkedIn ${profile.linkedin}; CV download on the site.

PROJECTS:
${projects}

SMALLER BUILDS:
${small}

EXPERIENCE:
${roles}

SKILLS:
${skillLines}

LEADERSHIP AND ACTIVITIES:
${lead}`;
}

export function systemPrompt(): string {
  return `You are "Kareem bot", the assistant on Kareem Taha's portfolio website. Visitors are mostly recruiters, hiring managers and potential freelance clients.

Answer questions about Kareem using only the fact sheet below. Talk about Kareem in the third person ("Kareem built...").
- Keep answers short: two to four sentences, or a short list when listing things. Plain text, no markdown headings.
- If the fact sheet does not cover something (salary, age, personal life, opinions, anything not listed), say you don't have that information and suggest emailing Kareem at ${profile.email}. Never guess or invent facts, dates, numbers or employers.
- When it helps, point to a relevant link from the fact sheet.
- Reply in the visitor's language. If they write in Arabic, answer in Arabic.
- If asked about something unrelated to Kareem, politely steer back to what you can help with.
- Present Kareem positively but honestly; don't exaggerate.

FACT SHEET
${factSheet()}`;
}

// ---------- Offline answerer ----------

// weight > 1 lets a specific topic beat a generic one ("the ESF project" -> ESF, not "projects")
type Intent = { keys: string[]; answer: () => string; weight?: number };

const list = (xs: string[]) => xs.join(", ");

const intents: Intent[] = [
  {
    keys: ["hello", "hi", "hey", "salam", "مرحبا", "السلام", "اهلا", "أهلا"],
    answer: () =>
      `Hi! I'm Kareem's bot. Ask me about his projects, skills, experience, education or how to contact him.`,
  },
  {
    keys: ["contact", "email", "reach", "hire", "hiring", "interview", "linkedin", "تواصل", "ايميل", "بريد"],
    answer: () =>
      `The fastest way to reach Kareem is email: ${profile.email}. You can also find him on LinkedIn (${profile.linkedin}) and GitHub (${profile.github}), or download his CV from this page.`,
  },
  {
    keys: ["available", "availability", "open to", "looking", "job", "role", "full-time", "fulltime", "freelance", "متاح"],
    answer: () =>
      `Yes. Kareem is ${profile.availability.charAt(0).toLowerCase()}${profile.availability.slice(1)} He's a recent Computer Science graduate who has been freelancing since January 2024. Email ${profile.email} to start a conversation.`,
  },
  {
    keys: ["skill", "stack", "tech", "technolog", "language", "framework", "react", "next", "typescript", "node", "مهارات"],
    answer: () =>
      `Kareem works mainly with ${list(skills[1].items)} on the front end and ${list(skills[2].items)} on the back end. He deploys to ${list(skills[3].items.slice(0, 3))}, and has hands-on AI experience with ${list(skills[4].items)}.`,
  },
  {
    keys: ["project", "portfolio", "built", "build", "work on", "مشاريع", "مشروع"],
    answer: () =>
      `Kareem's main projects are ${list(allProjects.map((p) => p.title))}. The Egyptian Skating Federation site (egyptskate.org) and Dollaby (his AI stylist graduation project) are good places to start. Ask me about any of them.`,
  },
  {
    keys: ["esf", "federation", "skat", "egyptskate", "sanity", "rtl", "arabic site", "الاتحاد"],
    answer: () => describe("esf"),
    weight: 3,
  },
  {
    keys: ["dollaby", "fashion", "stylist", "wardrobe", "outfit", "try-on", "try on", "graduation"],
    answer: () => describe("dollaby"),
    weight: 3,
  },
  {
    keys: ["tandlos", "brand", "clothing", "store", "shop", "e-commerce", "ecommerce"],
    answer: () => describe("tandlos"),
    weight: 3,
  },
  {
    keys: ["medretriv", "medical", "clinical", "cancer", "rag", "hackathon", "health"],
    answer: () => describe("medretriv"),
    weight: 3,
  },
  {
    keys: ["habit", "tracker", "express", "sendgrid"],
    answer: () => describe("habits"),
    weight: 3,
  },
  {
    keys: ["experience", "worked", "employ", "career", "history", "intern", "خبرة"],
    answer: () =>
      `Kareem has been a freelance full-stack developer since January 2024, building and deploying apps for clients. In mid 2026 he was a cybersecurity intern at Optima Professional Services, working in the SOC with Palo Alto and F5 and joining red team exercises.`,
  },
  {
    keys: ["security", "cyber", "soc", "palo alto", "f5", "red team", "pentest", "penetration"],
    answer: () =>
      `Kareem interned in cybersecurity at Optima Professional Services (June to July 2026). He monitored and triaged alerts in the SOC, worked with Palo Alto and F5 for network security, and took part in red team exercises.`,
  },
  {
    keys: ["ai", "machine learning", "ml", "tensorflow", "mediapipe", "llm", "openai", "ذكاء"],
    answer: () =>
      `Kareem has built AI features into real products: virtual try-on with TensorFlow.js and MediaPipe in his Tandlos store, outfit generation and try-on in Dollaby, and MedRetriv, a clinical question-answering system that cites its sources.`,
  },
  {
    keys: ["educat", "study", "studied", "degree", "university", "bue", "college", "graduat", "جامعة", "دراسة"],
    answer: () =>
      `Kareem has a BSc in Computer Science from a dual degree program between The British University in Egypt and London South Bank University (2022 to 2026). He also completed the 198-hour full-stack program at WE Initiative.`,
  },
  {
    keys: ["where", "location", "based", "live", "cairo", "egypt", "relocat", "remote"],
    answer: () => `Kareem is based in ${profile.location}. For questions about remote work or relocating, email him at ${profile.email}.`,
  },
  {
    keys: ["speak", "arabic", "english", "languages", "لغة", "عربي"],
    answer: () => `Kareem speaks ${languages}. He also builds bilingual sites, including fully right-to-left Arabic interfaces.`,
  },
  {
    keys: ["leader", "leadership", "student union", "coach", "club", "team", "volunteer", "extracurricular"],
    answer: () =>
      `Outside of code, Kareem founded the Tandlos clothing brand, coached more than 200 trainees at Shams Club, and was Head of Faculty (ICS) in the BUE Student Union in 2025. He has also led teams at large events.`,
  },
  {
    keys: ["github", "code", "repo", "source"],
    answer: () => `Kareem's code is on GitHub at ${profile.github}. The most complete repos are ESF, DOLLABY, tandlosfull and medretriv.`,
  },
  {
    keys: ["cv", "resume", "résumé", "سيرة"],
    answer: () => `You can download Kareem's CV with the "Download CV" button at the top of the page.`,
  },
];

function describe(slug: string): string {
  const p = allProjects.find((x) => x.slug === slug)!;
  const links = [p.live && `Live: ${p.live.href}`, p.code && `Code: ${p.code}`].filter(Boolean).join(". ");
  return `${p.title} (${p.context}): ${p.summary} Built with ${list(p.stack)}. ${links}.`;
}

/** Best-effort keyword answer for when the AI isn't available. */
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Latin keys match at the start of a word ("skill" matches "skills");
 *  keys of 3 letters or fewer must be the whole word ("hi" never matches "his"). */
function hasKey(q: string, key: string): boolean {
  const k = key.trim();
  if (!/^[a-z0-9 .\-]+$/.test(k)) return q.includes(k); // Arabic and other scripts
  const end = k.length <= 3 ? "(?![a-z0-9])" : "";
  return new RegExp(`(?<![a-z0-9])${escape(k)}${end}`).test(q);
}

export function localAnswer(question: string): string {
  const q = question.toLowerCase();
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = (intent.weight ?? 1) * intent.keys.reduce((n, k) => (hasKey(q, k) ? n + k.trim().length : n), 0);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  if (best) return best.answer();
  return `I don't have an answer for that one. Try asking about Kareem's projects, skills, experience or education, or email him directly at ${profile.email}.`;
}
