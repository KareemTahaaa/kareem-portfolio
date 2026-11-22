"use client";

import { useEffect, useState } from "react";

/** Types each phrase, pauses, deletes it, moves to the next. Static for reduced motion. */
export default function RotatingText({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState(phrases[0]);
  const [deleting, setDeleting] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (still) return;
    const full = phrases[i];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === full) t = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && text === "") {
      setDeleting(false);
      setI((i + 1) % phrases.length);
    } else {
      t = setTimeout(
        () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
        deleting ? 28 : 55,
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, i, phrases, still]);

  return (
    <>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span className="typed" aria-hidden="true">
        {text}
        <span className="caret" />
      </span>
    </>
  );
}
