"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={copy} data-magnetic>
        {copied ? "Email copied" : "Copy email"}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</span>
    </>
  );
}
