"use client";

import { openBot } from "./ChatBot";

export default function AskButton({ question, className, children }: { question?: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => openBot(question)} data-magnetic>
      {children}
    </button>
  );
}
