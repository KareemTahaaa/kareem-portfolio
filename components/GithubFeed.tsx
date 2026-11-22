"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
  stargazers_count: number;
  fork: boolean;
};

const USER = "KareemTahaaa";

const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#e0b400",
  Python: "#3572a5",
  "Jupyter Notebook": "#da5b0b",
  CSS: "#663399",
  HTML: "#e34c26",
  Java: "#b07219",
};

// Fallback blurbs for repos without a GitHub description
const blurbs: Record<string, string> = {
  ESF: "Official Egyptian Skating Federation website",
  tandlosfull: "Full-stack store for the Tandlos clothing brand",
  DOLLABY: "AI personal stylist with virtual try-on",
  medretriv: "Clinical RAG assistant with verified citations",
  "habit-tracker": "User service for a habit-tracking app",
  "react-component-library": "Reusable React components with docs",
};

function ago(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default function GithubFeed() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Repo[]) => {
        if (cancelled) return;
        const own = data.filter((r) => !r.fork);
        setTotal(own.length);
        setRepos(own.slice(0, 6));
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <p className="gh-note">
        GitHub didn&apos;t respond just now. <a href={profile.github} target="_blank" rel="noreferrer">See all repositories on GitHub</a>.
      </p>
    );
  }

  return (
    <>
      <p className="gh-note" aria-live="polite">
        {total === null ? "Loading the latest activity from GitHub…" : `${total} public repositories, most recently updated first.`}
      </p>
      <ul className="gh-grid">
        {(repos ?? Array.from({ length: 6 }, () => null)).map((r, i) =>
          r ? (
            <li key={r.name}>
              <a className="gh-card" href={r.html_url} target="_blank" rel="noreferrer" data-spotlight>
                <span className="gh-name">{r.name}</span>
                <span className="gh-desc">{r.description || blurbs[r.name] || "Repository on GitHub"}</span>
                <span className="gh-meta">
                  {r.language && (
                    <span>
                      <i className="gh-dot" style={{ background: langColor[r.language] ?? "var(--muted)" }} />
                      {r.language}
                    </span>
                  )}
                  <span>Updated {ago(r.pushed_at)}</span>
                </span>
              </a>
            </li>
          ) : (
            <li key={i} className="gh-card gh-skeleton" aria-hidden="true" />
          ),
        )}
      </ul>
    </>
  );
}
