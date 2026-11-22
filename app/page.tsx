import Image from "next/image";
import { profile, experience, skills, leadership, languages } from "@/lib/content";
import Nav from "@/components/Nav";
import RotatingText from "@/components/RotatingText";
import Work, { External } from "@/components/Work";
import GithubFeed from "@/components/GithubFeed";
import CopyEmail from "@/components/CopyEmail";
import ChatBot from "@/components/ChatBot";
import AskButton from "@/components/AskButton";
import Reveal from "@/components/Reveal";
import HeroScene from "@/components/HeroScene";
import SkillSphere from "@/components/SkillSphere";
import Effects from "@/components/Effects";

const sphereSkills = skills.flatMap((s) => s.items).filter((s, i, a) => a.indexOf(s) === i && s.length < 22);

/** The name drops in letter by letter with a slight 3D turn. */
function SplitName({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="split">
        {text.split("").map((ch, i) => (
          <span key={i} className="split-ch" style={{ animationDelay: `${0.15 + i * 0.045}s` }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </>
  );
}

const building = [
  "full-stack web apps",
  "Arabic and English websites",
  "AI-powered features",
  "e-commerce stores",
  "secure, deployed products",
];

const marquee = ["Next.js", "React", "TypeScript", "Node.js", "FastAPI", "Prisma", "PostgreSQL", "MongoDB", "Tailwind CSS", "Sanity", "AWS", "Azure", "Vercel", "Docker", "TensorFlow.js", "MediaPipe", "RAG"];

export default function Home() {
  return (
    <>
      <a className="skip" href="#work">Skip to work</a>
      <Nav />

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <HeroScene />
          <div className="wrap hero-inner">
          <div className="hero-grid">
            <div className="hero-text">
              <h1 className="name"><SplitName text={profile.name} /></h1>
              <p className="tagline">
                Full-stack engineer building <RotatingText phrases={building} />
              </p>
              <p className="intro">{profile.intro}</p>
              <p className="avail">
                <span className="pulse" aria-hidden="true" />
                {profile.availability}
              </p>
              <div className="actions">
                <a className="btn" href={`mailto:${profile.email}`} data-magnetic>Email me</a>
                <AskButton className="btn btn-ghost btn-bot">
                  <span className="bot-face bot-face-sm" aria-hidden="true" />
                  Ask my bot
                </AskButton>
              </div>
            </div>

            <div className="avatar-wrap" data-tilt>
              <div className="avatar-ring">
                <Image src="/kareem.jpg" alt="Kareem Taha" width={640} height={640} priority sizes="(max-width: 760px) 200px, 340px" />
              </div>
              <span className="avatar-badge">
                <span className="pulse" aria-hidden="true" />
                Open to work
              </span>
            </div>
          </div>

          <dl className="facts">
            {profile.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        {/* Work */}
        <section id="work" className="section wrap" aria-labelledby="work-h">
          <div className="section-head" data-reveal>
            <h2 id="work-h">Selected work</h2>
            <p>Live products for a national sports federation, my own brand and my graduation project. Filter by what you care about.</p>
          </div>
          <Work />
        </section>

        {/* Experience */}
        <section id="experience" className="section wrap" aria-labelledby="exp-h">
          <div className="section-head" data-reveal>
            <h2 id="exp-h">Experience</h2>
            <p>Shipping software for clients, and security work in a Security Operations Center.</p>
          </div>
          <ol className="timeline">
            {experience.map((r) => (
              <li key={r.title + r.org} className={r.current ? "is-current" : undefined} data-reveal>
                <p className="dates">{r.dates}</p>
                <div>
                  <h3>{r.title}</h3>
                  <p className="org">{r.org}, {r.place}</p>
                  <ul className="points">
                    {r.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* About */}
        <section id="about" className="section wrap" aria-labelledby="about-h">
          <div className="section-head" data-reveal>
            <h2 id="about-h">Skills</h2>
            <p>What I reach for, grouped by where it sits in the stack.</p>
          </div>
          <div className="skills-grid">
            <SkillSphere items={sphereSkills} />
            <dl className="skills" data-reveal>
              {skills.map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="about-grid" data-reveal>
            <div>
              <h3 className="sub-h">Beyond code</h3>
              <ul className="lead">
                {leadership.map((l) => (
                  <li key={l.title}>
                    <strong>{l.title}</strong>
                    <span>{l.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="sub-h">Education</h3>
              <p className="edu">
                <strong>BSc Computer Science, dual degree</strong>
                <span>The British University in Egypt and London South Bank University</span>
                <span>2022 to 2026, graduated</span>
              </p>
              <h3 className="sub-h">Languages</h3>
              <p className="edu"><span>{languages}</span></p>
            </div>
          </div>
        </section>

        {/* GitHub, live */}
        <section id="github" className="section wrap" aria-labelledby="gh-h">
          <div className="section-head" data-reveal>
            <h2 id="gh-h">Latest on GitHub</h2>
            <p>Pulled live from GitHub each time the page loads.</p>
          </div>
          <GithubFeed />
        </section>

        {/* Contact */}
        <section id="contact" className="contact wrap" aria-labelledby="contact-h">
          <h2 id="contact-h" data-reveal>Get in touch</h2>
          <p>Hiring, or have a project in mind? Email is the fastest way to reach me, or ask my bot first.</p>
          <a className="contact-mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="actions">
            <CopyEmail email={profile.email} />
            <AskButton className="btn btn-ghost btn-bot" question="How can I contact Kareem?">
              <span className="bot-face bot-face-sm" aria-hidden="true" />
              Ask my bot
            </AskButton>
          </div>
          <ul className="contact-links">
            <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub<External /></a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn<External /></a></li>
            <li><a href={profile.cv} download>Download CV</a></li>
          </ul>
        </section>
      </main>

      <footer className="footer wrap">
        <p>© 2026 Kareem Taha, Cairo</p>
        <p>Built with Next.js, TypeScript and Claude</p>
      </footer>

      <ChatBot />
      <Reveal />
      <Effects />
    </>
  );
}
