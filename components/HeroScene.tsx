"use client";

import { useEffect, useRef } from "react";

/**
 * Floating low-poly shapes behind the hero. They drift, follow the pointer with
 * parallax, grow when hovered, and rise as you scroll. Three.js is loaded only
 * in the browser, the loop pauses when the hero is off screen or the tab is
 * hidden, and reduced-motion users get a single still frame.
 */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      // WebGL may be unavailable (old devices, disabled GPU): just skip the scene.
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return;
      }
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 20);
      scene.fog = new THREE.Fog(0x000000, 14, 34);

      const css = () => getComputedStyle(document.documentElement);
      const colors = () => {
        const s = css();
        return {
          accent: new THREE.Color(s.getPropertyValue("--accent").trim() || "#0e7672"),
          accent2: new THREE.Color(s.getPropertyValue("--accent-2").trim() || "#22409a"),
          ink: new THREE.Color(s.getPropertyValue("--ink").trim() || "#13212c"),
          paper: new THREE.Color(s.getPropertyValue("--paper").trim() || "#f1f3ef"),
        };
      };

      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.position.set(6, 10, 12);
      scene.add(sun);
      const glow = new THREE.PointLight(0xffffff, 40, 30);
      glow.position.set(0, 0, 8);
      scene.add(glow);

      const geos = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TorusGeometry(0.8, 0.26, 12, 32),
        new THREE.TetrahedronGeometry(1.1, 0),
        new THREE.TorusKnotGeometry(0.7, 0.2, 80, 10),
        new THREE.DodecahedronGeometry(0.9, 0),
      ];
      const wireGeo = new THREE.IcosahedronGeometry(2.4, 1);

      type Body = {
        mesh: InstanceType<typeof THREE.Mesh>;
        base: InstanceType<typeof THREE.Vector3>;
        spin: InstanceType<typeof THREE.Vector3>;
        phase: number;
        scale: number;
        hover: number;
        tone: "accent" | "accent2" | "ink";
      };
      const group = new THREE.Group();
      scene.add(group);
      const bodies: Body[] = [];
      const mats: InstanceType<typeof THREE.Material>[] = [];

      // Deterministic pseudo-random so the layout is the same on every load
      let seed = 7;
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

      const tones: Body["tone"][] = ["accent", "accent2", "ink", "accent", "accent2"];
      const c0 = colors();
      for (let i = 0; i < 24; i++) {
        const tone = tones[i % tones.length];
        const mat = new THREE.MeshStandardMaterial({ color: c0[tone], roughness: 0.38, metalness: 0.2, flatShading: true });
        mats.push(mat);
        const mesh = new THREE.Mesh(geos[i % geos.length], mat);
        let x = (rand() - 0.5) * 34;
        const y = (rand() - 0.5) * 16;
        let z = -rand() * 12 + 2;
        if (x < 2) z -= 7; // keep the text side calmer and deeper
        if (Math.abs(x) < 3 && Math.abs(y) < 3) x += 6;
        const scale = 0.45 + rand() * 0.85;
        mesh.scale.setScalar(scale);
        mesh.position.set(x, y, z);
        group.add(mesh);
        bodies.push({
          mesh,
          base: new THREE.Vector3(x, y, z),
          spin: new THREE.Vector3((rand() - 0.5) * 0.6, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.3),
          phase: rand() * Math.PI * 2,
          scale,
          hover: 0,
          tone,
        });
      }

      const wireMats: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
      const wires = [
        [9, 3.5, -4],
        [-12, -4, -10],
        [13, -5, -8],
      ].map(([x, y, z], i) => {
        const m = new THREE.MeshBasicMaterial({ color: i === 1 ? c0.accent2 : c0.accent, wireframe: true, transparent: true, opacity: 0.35 });
        wireMats.push(m);
        const w = new THREE.Mesh(wireGeo, m);
        w.position.set(x, y, z);
        group.add(w);
        return w;
      });

      const applyTheme = () => {
        const c = colors();
        bodies.forEach((b) => ((b.mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>).color = c[b.tone]));
        wireMats.forEach((m, i) => m.color.copy(i === 1 ? c.accent2 : c.accent));
        glow.color.copy(c.accent);
        (scene.fog as InstanceType<typeof THREE.Fog>).color.copy(c.paper);
        renderOnce();
      };

      const size = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Pull back on narrow screens so shapes don't crowd the text
        camera.position.z = w < 760 ? 30 : 20;
        camera.updateProjectionMatrix();
      };

      const pointer = new THREE.Vector2(0, 0);
      const ndc = new THREE.Vector2(9, 9);
      const ray = new THREE.Raycaster();
      const onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      };

      const clock = new THREE.Clock();
      let running = false;
      let frame = 0;

      const step = () => {
        const dt = Math.min(clock.getDelta(), 0.05); // getDelta also advances elapsedTime
        const t = clock.elapsedTime;

        camera.position.x += (pointer.x * 2.2 - camera.position.x) * 0.04;
        camera.position.y += (pointer.y * 1.4 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        glow.position.set(pointer.x * 14, pointer.y * 8, 8);
        group.position.y = window.scrollY * 0.012;
        group.rotation.y = window.scrollY * 0.0006;

        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(bodies.map((b) => b.mesh))[0]?.object;

        for (const b of bodies) {
          b.hover += ((hit === b.mesh ? 1 : 0) - b.hover) * 0.12;
          const boost = 1 + b.hover * 2.5;
          b.mesh.rotation.x += b.spin.x * dt * boost;
          b.mesh.rotation.y += b.spin.y * dt * boost;
          b.mesh.rotation.z += b.spin.z * dt;
          b.mesh.position.y = b.base.y + Math.sin(t * 0.6 + b.phase) * 0.6;
          b.mesh.position.x = b.base.x + Math.cos(t * 0.4 + b.phase) * 0.3;
          b.mesh.scale.setScalar(b.scale * (1 + b.hover * 0.45));
        }
        wires.forEach((w, i) => {
          w.rotation.x = t * 0.08 * (i + 1);
          w.rotation.y = t * 0.12;
        });
        renderer.render(scene, camera);
      };

      const loop = () => {
        if (!running) return;
        step();
        frame = requestAnimationFrame(loop);
      };
      const start = () => {
        if (running || still || document.hidden) return;
        running = true;
        clock.getDelta();
        frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };
      function renderOnce() {
        renderer.render(scene, camera);
      }

      size();
      applyTheme();
      if (still) renderOnce();

      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
      io.observe(el);
      const ro = new ResizeObserver(() => {
        size();
        renderOnce();
      });
      ro.observe(el);
      const onVis = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("pointermove", onPointer, { passive: true });
      const mo = new MutationObserver(applyTheme);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const mq = matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyTheme);

      requestAnimationFrame(() => el.classList.add("is-ready"));

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        mo.disconnect();
        mq.removeEventListener("change", applyTheme);
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onPointer);
        geos.forEach((g) => g.dispose());
        wireGeo.dispose();
        mats.forEach((m) => m.dispose());
        wireMats.forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className="hero-scene" aria-hidden="true" />;
}
