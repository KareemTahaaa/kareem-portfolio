"use client";

import { useEffect, useRef } from "react";

/**
 * A 3D sphere of skill names. It spins on its own; drag (or swipe) to throw it.
 * Built with CSS 3D transforms, no WebGL needed.
 */
export default function SkillSphere({ items }: { items: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    // Even spread over a sphere (Fibonacci lattice)
    const n = items.length;
    const pts = items.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
    });

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = { x: 0.0022, y: 0.0035 };
    let vel = still ? { x: 0, y: 0 } : { ...base };
    let dragging = false;
    let last = { x: 0, y: 0 };
    let running = false;
    let frame = 0;

    const rotate = (ax: number, ay: number) => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      for (const p of pts) {
        const y1 = p.y * cx - p.z * sx;
        const z1 = p.y * sx + p.z * cx;
        const x2 = p.x * cy + z1 * sy;
        const z2 = -p.x * sy + z1 * cy;
        p.x = x2; p.y = y1; p.z = z2;
      }
    };

    const draw = () => {
      const R = el.clientWidth * 0.4;
      pts.forEach((p, i) => {
        const t = tags.current[i];
        if (!t) return;
        const depth = (p.z + 1) / 2; // 0 = back, 1 = front
        t.style.transform = `translate(-50%, -50%) translate3d(${p.x * R}px, ${p.y * R}px, ${p.z * R}px) scale(${0.65 + depth * 0.55})`;
        t.style.opacity = String(0.25 + depth * 0.75);
        t.style.zIndex = String(Math.round(depth * 100));
        t.dataset.front = depth > 0.82 ? "1" : "0";
      });
    };

    const tick = () => {
      if (!running) return;
      if (!dragging) {
        // Ease thrown spins back toward the gentle idle spin
        const target = still ? { x: 0, y: 0 } : base;
        vel.x += (target.x - vel.x) * 0.02;
        vel.y += (target.y - vel.y) * 0.02;
      }
      rotate(vel.x, vel.y);
      draw();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      el.classList.add("is-dragging");
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      start();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      vel = { x: -dy * 0.006, y: dx * 0.006 };
    };
    const up = () => {
      dragging = false;
      el.classList.remove("is-dragging");
    };

    draw();
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(el);
    const ro = new ResizeObserver(draw);
    ro.observe(el);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [items]);

  return (
    <div className="sphere-wrap">
      <div className="sphere" ref={box} role="img" aria-label={`Skills: ${items.join(", ")}`}>
        {items.map((s, i) => (
          <span key={s} ref={(n) => { tags.current[i] = n; }} className="sphere-tag" aria-hidden="true">
            {s}
          </span>
        ))}
      </div>
      <p className="sphere-hint">Drag to spin</p>
    </div>
  );
}
