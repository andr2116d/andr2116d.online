/* A mathematical particle sculpture, drawn locally with the Canvas 2D API.
   One animation loop; capped at 30 fps, paused offscreen and on hidden tabs. */
(() => {
  "use strict";
  const canvas = document.querySelector("#intersection");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  const button = document.querySelector("#motion-toggle");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reduced.matches;
  let visible = true;
  let request = 0;
  let lastFrame = 0;
  let phase = 0.4;
  let width = 0,
    height = 0;
  let pointerX = 0,
    pointerY = 0,
    tiltX = 0,
    tiltY = 0;
  let light = document.documentElement.dataset.theme === "light";
  let particles = [];
  const center = (t) => {
    const radius = 2 + 0.66 * Math.cos(3 * t);
    return [
      radius * Math.cos(2 * t),
      radius * Math.sin(2 * t),
      0.85 * Math.sin(3 * t),
    ];
  };
  const normalize = (vector) => {
    const length = Math.hypot(...vector);
    return vector.map((value) => value / length);
  };
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  function buildParticles() {
    particles = [];
    const rings = width < 450 ? 200 : 270;
    const sides = width < 450 ? 22 : 26;
    for (let i = 0; i < rings; i++) {
      const t = (i / rings) * Math.PI * 2;
      const c = center(t),
        next = center(t + 0.001);
      const tangent = normalize(next.map((value, index) => value - c[index]));
      const normal = normalize(cross(tangent, [0, 0, 1]));
      const binormal = cross(tangent, normal);
      for (let j = 0; j < sides; j++) {
        const v = (j / sides) * Math.PI * 2;
        const offset = normal.map(
          (value, index) => value * Math.cos(v) + binormal[index] * Math.sin(v),
        );
        const radius = 0.4;
        particles.push({
          x: c[0] + radius * offset[0],
          y: c[1] + radius * offset[1],
          z: c[2] + radius * offset[2],
          nx: offset[0],
          ny: offset[1],
          nz: offset[2],
          edge: j % 5 === 0,
        });
      }
    }
  }
  function rotate(x, y, z, sx, cx, sy, cy, sz, cz) {
    const y1 = y * cx - z * sx,
      z1 = y * sx + z * cx;
    const x1 = x * cy + z1 * sy,
      z2 = -x * sy + z1 * cy;
    return [x1 * cz - y1 * sz, x1 * sz + y1 * cz, z2];
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const ax = 0.82 + tiltY * 0.17,
      ay = phase + tiltX * 0.22,
      az = -0.35;
    const sx = Math.sin(ax),
      cx = Math.cos(ax),
      sy = Math.sin(ay),
      cy = Math.cos(ay),
      sz = Math.sin(az),
      cz = Math.cos(az);
    const scale = Math.min(width * 0.154, height * 0.165);
    const points = particles.map((p) => {
      const [x, y, z] = rotate(p.x, p.y, p.z, sx, cx, sy, cy, sz, cz);
      const normal = rotate(p.nx, p.ny, p.nz, sx, cx, sy, cy, sz, cz);
      const perspective = 9 / (9 - z);
      return {
        x: width * 0.5 + x * scale * perspective,
        y: height * 0.49 + y * scale * perspective,
        z,
        light: normal[0] * -0.4 + normal[1] * -0.55 + normal[2] * 0.7,
        size: perspective * (p.edge ? 0.95 : 0.7),
      };
    });
    points.sort((a, b) => a.z - b.z);
    for (const p of points) {
      const depth = (p.z + 3.4) / 6.8;
      const shine = Math.max(0, p.light);
      const alpha = Math.min(
        1,
        (light ? 0.22 : 0.13) + depth * 0.49 + shine * 0.31,
      );
      if (light)
        ctx.fillStyle = `rgba(${83 + Math.round(shine * 20)},${48 + Math.round(shine * 20)},${127 + Math.round(shine * 22)},${alpha})`;
      else
        ctx.fillStyle = `rgba(${171 + Math.round(shine * 71)},${145 + Math.round(shine * 85)},${210 + Math.round(shine * 39)},${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (width < 450 ? 0.9 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function frame(now) {
    request = 0;
    if (!visible || document.hidden || paused) return;
    if (now - lastFrame >= 1000 / 30) {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 60) : 33;
      phase += elapsed * 0.000075;
      tiltX += (pointerX - tiltX) * 0.06;
      tiltY += (pointerY - tiltY) * 0.06;
      draw();
      lastFrame = now;
    }
    request = requestAnimationFrame(frame);
  }
  function syncLoop() {
    cancelAnimationFrame(request);
    request = 0;
    lastFrame = 0;
    if (!paused && visible && !document.hidden)
      request = requestAnimationFrame(frame);
  }
  function updateButton() {
    const lang = document.documentElement.lang;
    const label =
      window.PORTFOLIO.translations[lang][
        paused ? "motion.play" : "motion.pause"
      ];
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute("aria-label", label);
    button.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true">${paused ? '<path d="m5 3 8 5-8 5Z"/>' : '<path d="M5 3v10M11 3v10"/>'}</svg><span>${label}</span>`;
  }
  const observer = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 1.8);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildParticles();
    draw();
  });
  observer.observe(canvas);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      syncLoop();
    },
    { threshold: 0.05 },
  ).observe(canvas);
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || paused || reduced.matches) return;
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  });
  canvas.addEventListener("pointerleave", () => {
    pointerX = pointerY = 0;
  });
  button.addEventListener("click", () => {
    paused = !paused;
    updateButton();
    syncLoop();
  });
  document.addEventListener("visibilitychange", syncLoop);
  document.addEventListener("portfolio:theme", () => {
    light = document.documentElement.dataset.theme === "light";
    draw();
  });
  document.addEventListener("portfolio:language", updateButton);
  reduced.addEventListener("change", (event) => {
    paused = event.matches;
    updateButton();
    syncLoop();
  });
  updateButton();
})();
