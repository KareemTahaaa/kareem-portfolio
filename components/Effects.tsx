"use client";

import { useEffect } from "react";

/**
 * Page-wide pointer and scroll effects:
 * - magnetic pull on [data-magnetic] elements
 * - spotlight glow following the pointer on [data-spotlight] cards
 * - 3D tilt on [data-tilt] elements
 * - timeline progress line driven by scroll
 * Mouse-only effects are skipped on touch screens; motion is skipped for reduced-motion users.
 */
export default function Effects() {
  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // Timeline progress (works everywhere; it reflects scroll, not decoration)
    const timeline = document.querySelector<HTMLElement>(".timeline");
    if (timeline) {
      const onScroll = () => {
        const r = timeline.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
        timeline.style.setProperty("--p", p.toFixed(3));
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    if (!fine) return () => cleanups.forEach((c) => c());

    // Spotlight follows the pointer inside cards (subtle, fine with reduced motion)
    const onSpot = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--sx", `${e.clientX - r.left}px`);
      card.style.setProperty("--sy", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onSpot, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onSpot));

    if (still) return () => cleanups.forEach((c) => c());

    // Magnetic buttons and 3D tilt
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    const onHover = (e: PointerEvent) => {
      const t = e.target as Element;
      const m = t.closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet !== m) magnet.style.transform = "";
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.25}px, ${dy * 0.3}px)`;
      }
      const tl = t.closest<HTMLElement>("[data-tilt]");
      if (tilt && tilt !== tl) tilt.style.transform = "";
      tilt = tl;
      if (tl) {
        const r = tl.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tl.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      }
    };
    window.addEventListener("pointermove", onHover, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onHover));

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
