/**
 * A trefoil-like tube of particles drawn with Canvas 2D: two colors (chemistry and
 * systems/AI) intertwined along one curve. Mathematical illustration, not a simulation.
 *
 * Performance: particles are precomputed once per resize; each frame projects them into
 * typed arrays and paints ~12 batched paths (color × depth buckets) instead of one fill
 * per particle. The loop is capped at 30 fps and stops offscreen, in hidden tabs and when
 * the user pauses it or prefers reduced motion.
 */

const DEPTH_BUCKETS = 6;
const FRAME_MS = 1000 / 30;

interface Field {
  count: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  nx: Float32Array;
  ny: Float32Array;
  nz: Float32Array;
  tone: Uint8Array;
}

function center(t: number): [number, number, number] {
  const radius = 2 + 0.66 * Math.cos(3 * t);
  return [
    radius * Math.cos(2 * t),
    radius * Math.sin(2 * t),
    0.85 * Math.sin(3 * t),
  ];
}

function normalize(v: [number, number, number]): [number, number, number] {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function buildField(compact: boolean): Field {
  const rings = compact ? 180 : 260;
  const sides = compact ? 20 : 24;
  const count = rings * sides;
  const field: Field = {
    count,
    x: new Float32Array(count),
    y: new Float32Array(count),
    z: new Float32Array(count),
    nx: new Float32Array(count),
    ny: new Float32Array(count),
    nz: new Float32Array(count),
    tone: new Uint8Array(count),
  };
  let i = 0;
  for (let ring = 0; ring < rings; ring++) {
    const t = (ring / rings) * Math.PI * 2;
    const c = center(t);
    const ahead = center(t + 0.001);
    const tangent = normalize([
      ahead[0] - c[0],
      ahead[1] - c[1],
      ahead[2] - c[2],
    ]);
    const normal = normalize([tangent[1], -tangent[0], 0]);
    const binormal: [number, number, number] = [
      tangent[1] * normal[2] - tangent[2] * normal[1],
      tangent[2] * normal[0] - tangent[0] * normal[2],
      tangent[0] * normal[1] - tangent[1] * normal[0],
    ];
    // Two strands: the tone flips every half turn of the tube around the curve.
    for (let side = 0; side < sides; side++) {
      const v = (side / sides) * Math.PI * 2;
      const ox = normal[0] * Math.cos(v) + binormal[0] * Math.sin(v);
      const oy = normal[1] * Math.cos(v) + binormal[1] * Math.sin(v);
      const oz = normal[2] * Math.cos(v) + binormal[2] * Math.sin(v);
      field.x[i] = c[0] + 0.42 * ox;
      field.y[i] = c[1] + 0.42 * oy;
      field.z[i] = c[2] + 0.42 * oz;
      field.nx[i] = ox;
      field.ny[i] = oy;
      field.nz[i] = oz;
      field.tone[i] = Math.sin(v + t * 3) > 0 ? 1 : 0;
      i++;
    }
  }
  return field;
}

/**
 * Custom properties holding light-dark() are not resolved by getPropertyValue, so the
 * canvas CSS maps them onto `color` and `border-color`, whose computed values are rgb().
 */
function readColors(element: Element): [string, string] {
  const styles = getComputedStyle(element);
  return [styles.color || "#8edcc3", styles.borderTopColor || "#c6b6f7"];
}

export interface ParticleFieldOptions {
  canvas: HTMLCanvasElement;
  toggle: HTMLButtonElement | null;
  labels: { pause: string; play: string };
}

export function mountParticleField({
  canvas,
  toggle,
  labels,
}: ParticleFieldOptions) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;
  const ctx = context;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reduced.matches;
  let visible = true;
  let request = 0;
  let lastFrame = 0;
  let phase = 0.4;
  let width = 0;
  let height = 0;
  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let colors = readColors(canvas);
  let field = buildField(true);
  let px = new Float32Array(field.count);
  let py = new Float32Array(field.count);
  let size = new Float32Array(field.count);
  let bucket = new Uint8Array(field.count);

  function rebuild() {
    field = buildField(width < 480);
    px = new Float32Array(field.count);
    py = new Float32Array(field.count);
    size = new Float32Array(field.count);
    bucket = new Uint8Array(field.count);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const ax = 0.82 + tiltY * 0.17;
    const ay = phase + tiltX * 0.22;
    const az = -0.35;
    const sx = Math.sin(ax),
      cx = Math.cos(ax);
    const sy = Math.sin(ay),
      cy = Math.cos(ay);
    const sz = Math.sin(az),
      cz = Math.cos(az);
    const scale = Math.min(width, height) * 0.145;
    const dot = width < 480 ? 0.85 : 1;

    for (let i = 0; i < field.count; i++) {
      // Rotate position (X, then Y, then Z axis) and normal with the same matrix.
      const y1 = field.y[i]! * cx - field.z[i]! * sx;
      const z1 = field.y[i]! * sx + field.z[i]! * cx;
      const x2 = field.x[i]! * cy + z1 * sy;
      const z2 = -field.x[i]! * sy + z1 * cy;
      const x3 = x2 * cz - y1 * sz;
      const y3 = x2 * sz + y1 * cz;

      const ny1 = field.ny[i]! * cx - field.nz[i]! * sx;
      const nz1 = field.ny[i]! * sx + field.nz[i]! * cx;
      const nx2 = field.nx[i]! * cy + nz1 * sy;
      const nz2 = -field.nx[i]! * sy + nz1 * cy;
      const nx3 = nx2 * cz - ny1 * sz;
      const ny3 = nx2 * sz + ny1 * cz;

      const perspective = 9 / (9 - z2);
      px[i] = width * 0.5 + x3 * scale * perspective;
      py[i] = height * 0.5 + y3 * scale * perspective;
      size[i] = perspective * dot * 0.95;
      const light = Math.max(0, nx3 * -0.4 + ny3 * -0.55 + nz2 * 0.7);
      const depth = Math.min(1, Math.max(0, (z2 + 3.4) / 6.8 + light * 0.35));
      bucket[i] = Math.min(
        DEPTH_BUCKETS - 1,
        Math.floor(depth * DEPTH_BUCKETS),
      );
    }

    // Far buckets first, so nearer, brighter particles paint on top.
    for (let level = 0; level < DEPTH_BUCKETS; level++) {
      ctx.globalAlpha = 0.14 + (level / (DEPTH_BUCKETS - 1)) * 0.8;
      for (let tone = 0; tone < 2; tone++) {
        ctx.fillStyle = colors[tone]!;
        ctx.beginPath();
        for (let i = 0; i < field.count; i++) {
          if (bucket[i] !== level || field.tone[i] !== tone) continue;
          ctx.moveTo(px[i]! + size[i]!, py[i]!);
          ctx.arc(px[i]!, py[i]!, size[i]!, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(now: number) {
    request = 0;
    if (!visible || document.hidden || paused) return;
    if (now - lastFrame >= FRAME_MS) {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 60) : 33;
      phase += elapsed * 0.00008;
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
    if (!paused && visible && !document.hidden) {
      request = requestAnimationFrame(frame);
    }
  }

  function syncToggle() {
    if (!toggle) return;
    toggle.dataset.state = paused ? "paused" : "playing";
    const text = toggle.querySelector("[data-label]");
    if (text) text.textContent = paused ? labels.play : labels.pause;
  }

  new ResizeObserver(([entry]) => {
    if (!entry) return;
    const nextWidth = entry.contentRect.width;
    const nextHeight = entry.contentRect.height;
    const crossedBreakpoint = nextWidth < 480 !== width < 480;
    width = nextWidth;
    height = nextHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (crossedBreakpoint || field.count === 0) rebuild();
    draw();
  }).observe(canvas);

  new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true;
      syncLoop();
    },
    { threshold: 0.05 },
  ).observe(canvas);

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || paused) return;
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  });
  canvas.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });

  toggle?.addEventListener("click", () => {
    paused = !paused;
    syncToggle();
    syncLoop();
  });

  reduced.addEventListener("change", (event) => {
    paused = event.matches;
    syncToggle();
    syncLoop();
  });

  document.addEventListener("visibilitychange", syncLoop);
  document.addEventListener("themechange", () => {
    colors = readColors(canvas);
    draw();
  });

  canvas.dataset.ready = "";
  syncToggle();
  syncLoop();
}
