"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { featured, more, smallBuilds, tagList, type Project, type Tag } from "@/lib/content";

export function External() {
  return (
    <svg className="ext" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  return (
    <p className="links">
      {p.live && (
        <a href={p.live.href} target="_blank" rel="noreferrer">
          Visit {p.live.label}
          <External />
        </a>
      )}
      {p.code && (
        <a href={p.code} target="_blank" rel="noreferrer">
          Code on GitHub
          <External />
        </a>
      )}
    </p>
  );
}

/** Screenshot that tilts toward the pointer. */
function Shot({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.015)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  if (!p.image) {
    return (
      <div className="shot shot-brand" ref={ref} onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
        <span className="brand-word">Tandlos</span>
        <span className="brand-note">Founder, designer and developer</span>
      </div>
    );
  }
  return (
    <div className="shot" ref={ref} onPointerMove={onMove} onPointerLeave={reset}>
      <div className="shot-bar">
        <span className="shot-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="shot-url">{p.live?.label}</span>
      </div>
      <Image src={p.image.src} alt={p.image.alt} width={1440} height={900} sizes="(max-width: 960px) 100vw, 640px" />
      <span className="shot-glare" aria-hidden="true" />
    </div>
  );
}

function Meta({ p }: { p: Project }) {
  return (
    <p className="project-meta">
      <span>{p.context}</span>
      <span className="year">{p.year}</span>
    </p>
  );
}

function Tags({ p }: { p: Project }) {
  return (
    <ul className="tags" aria-label="Categories">
      {p.tags.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<Tag | "All">("All");
  const match = (p: Project) => filter === "All" || p.tags.includes(filter);
  const big = featured.filter(match);
  const small = more.filter(match);
  const count = (t: Tag | "All") => [...featured, ...more].filter((p) => t === "All" || p.tags.includes(t)).length;

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {(["All", ...tagList] as const).map((t) => (
          <button
            key={t}
            type="button"
            className="chip"
            aria-pressed={filter === t}
            onClick={() => setFilter(t)}
          >
            {t}
            <span className="chip-count">{count(t)}</span>
          </button>
        ))}
      </div>

      <div className="projects" key={filter}>
        {big.map((p) => (
          <article key={p.slug} className="project">
            <div className="project-text">
              <Meta p={p} />
              <h3>{p.title}</h3>
              <p className="summary">{p.summary}</p>
              <ul className="points">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <p className="stack">{p.stack.join(", ")}</p>
              <Tags p={p} />
              <ProjectLinks p={p} />
            </div>
            <Shot p={p} />
          </article>
        ))}

        {small.length > 0 && (
          <div className="more">
            {small.map((p) => (
              <article key={p.slug} className="more-item" data-spotlight>
                <Meta p={p} />
                <h3>{p.title}</h3>
                <p className="summary">{p.summary}</p>
                <ul className="points">
                  {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
                <p className="stack">{p.stack.join(", ")}</p>
                <Tags p={p} />
                <ProjectLinks p={p} />
              </article>
            ))}
          </div>
        )}
      </div>

      {filter === "All" && (
        <>
          <h3 className="sub-h">Smaller builds</h3>
          <ul className="small">
            {smallBuilds.map((b) => (
              <li key={b.title}>
                <a href={b.href} target="_blank" rel="noreferrer" data-spotlight>
                  <span className="small-title">{b.title}<External /></span>
                  <span className="small-note">{b.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
