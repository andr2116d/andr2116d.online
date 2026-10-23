/**
 * The brand mark: a trefoil knot, the same mathematical knot as the hero art,
 * drawn as one ribbon with real over/under crossings.
 *
 * Pure geometry, no DOM: used by BrandMark.astro and by the icon/OG generators,
 * so every place shows the identical mark.
 */

export interface TrefoilMark {
  viewBox: string;
  /** The whole closed ribbon. */
  path: string;
  /** Short pieces that pass over a crossing, redrawn on top of a gap. */
  overs: string[];
  /** Same pieces, slightly shorter, used to cut the gap under each over-piece. */
  gaps: string[];
  strokeWidth: number;
  gapWidth: number;
}

type Point = [number, number];

const TAU = Math.PI * 2;
/** Crossing detection needs density; drawing uses smooth Béziers through fewer points. */
const SAMPLES = 720;
const DRAW_POINTS = 48;

/** Classic trefoil projection, centered on its 3-fold symmetry axis (the origin). */
function rawCurve(t: number): Point {
  return [Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t)];
}

// Rotate so the outermost lobe points straight up (SVG y grows downwards).
const LOBE = (() => {
  let best = 0,
    bestT = 0;
  for (let i = 0; i < 3600; i++) {
    const t = (i / 3600) * Math.PI * 2;
    const [x, y] = rawCurve(t);
    const r = Math.hypot(x, y);
    if (r > best) {
      best = r;
      bestT = t;
    }
  }
  const [x, y] = rawCurve(bestT);
  return { radius: best, angle: -Math.PI / 2 - Math.atan2(y, x) };
})();

function curve(t: number): Point {
  const [x, y] = rawCurve(t);
  const c = Math.cos(LOBE.angle),
    s = Math.sin(LOBE.angle);
  return [x * c - y * s, x * s + y * c];
}

function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const cross = (o: Point, p: Point, q: Point) =>
    (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

export function trefoilMark(size = 40, padding = 4.5): TrefoilMark {
  const ts = Array.from({ length: SAMPLES }, (_, i) => (i / SAMPLES) * TAU);
  const raw = ts.map(curve);

  // Center on the symmetry axis and fit the outermost lobe inside the padding.
  const scale = (size / 2 - padding) / LOBE.radius;
  const project = ([x, y]: Point): Point => [
    x * scale + size / 2,
    y * scale + size / 2,
  ];
  const pts = raw.map(project);

  const fmt = (n: number) => Number(n.toFixed(2));
  // Catmull-Rom through the points, written as cubic Béziers: smooth and compact.
  const toPath = (points: Point[], closed = false) => {
    const n = points.length;
    const at = (i: number) =>
      closed ? points[(i + n) % n]! : points[Math.max(0, Math.min(n - 1, i))]!;
    let d = `M${fmt(points[0]![0])} ${fmt(points[0]![1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = at(i - 1),
        p1 = at(i),
        p2 = at(i + 1),
        p3 = at(i + 2);
      const c1x = p1[0] + (p2[0] - p0[0]) / 6,
        c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6,
        c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += `C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2[0])} ${fmt(p2[1])}`;
    }
    return closed ? d + "Z" : d;
  };

  // Find crossings: pairs of non-adjacent segments that intersect.
  const events: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    for (let j = i + 2; j < SAMPLES; j++) {
      if (i === 0 && j === SAMPLES - 1) continue;
      const a = pts[i]!,
        b = pts[(i + 1) % SAMPLES]!;
      const c = pts[j]!,
        d = pts[(j + 1) % SAMPLES]!;
      if (segmentsIntersect(a, b, c, d)) events.push(ts[i]!, ts[j]!);
    }
  }
  // Walking along an alternating knot, crossings go over, under, over…
  events.sort((p, q) => p - q);
  const overTimes = events.filter((_, index) => index % 2 === 0);

  const piece = (center: number, half: number) => {
    const steps = 10;
    return toPath(
      Array.from({ length: steps + 1 }, (_, k) =>
        project(curve(center - half + (k / steps) * half * 2)),
      ),
    );
  };

  const strokeWidth = size * 0.085;
  return {
    viewBox: `0 0 ${size} ${size}`,
    path: toPath(
      Array.from({ length: DRAW_POINTS }, (_, i) =>
        project(curve((i / DRAW_POINTS) * TAU)),
      ),
      true,
    ),
    overs: overTimes.map((t) => piece(t, 0.5)),
    gaps: overTimes.map((t) => piece(t, 0.32)),
    strokeWidth: fmt(strokeWidth),
    gapWidth: fmt(strokeWidth * 2.4),
  };
}

/**
 * Inner SVG markup. Crossing gaps are cut with a mask (true transparency), so the
 * mark works on any background: translucent header, both themes, images.
 */
export function trefoilMarkup(
  mark: TrefoilMark,
  { id, from, to }: { id: string; from?: string; to?: string },
): string {
  const size = mark.viewBox.split(" ")[2];
  const round = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  // Crossing pieces use flat ends so each cut stays clean.
  const flat = `fill="none" stroke-linecap="butt" stroke-linejoin="round"`;
  return [
    `<defs>`,
    // Without explicit colors the stops get classes, so CSS can theme them.
    `<linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">`,
    from
      ? `<stop offset="0" stop-color="${from}"/>`
      : `<stop offset="0" class="trefoil-from"/>`,
    to
      ? `<stop offset="1" stop-color="${to}"/>`
      : `<stop offset="1" class="trefoil-to"/>`,
    `</linearGradient>`,
    `<mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="#fff"/>`,
    ...mark.gaps.map(
      (d) =>
        `<path d="${d}" ${flat} stroke="#000" stroke-width="${mark.gapWidth}"/>`,
    ),
    `</mask>`,
    `</defs>`,
    `<path d="${mark.path}" ${round} stroke="url(#${id}-g)" stroke-width="${mark.strokeWidth}" mask="url(#${id}-m)"/>`,
    ...mark.overs.map(
      (d) =>
        `<path d="${d}" ${flat} stroke="url(#${id}-g)" stroke-width="${mark.strokeWidth}"/>`,
    ),
  ].join("");
}

/** Standalone SVG (favicon, generated images). Colors are fixed there. */
export function trefoilSvg({
  background,
  radius = 0,
  from = "#8edcc3",
  to = "#c6b6f7",
  size = 64,
}: {
  background?: string;
  radius?: number;
  from?: string;
  to?: string;
  size?: number;
} = {}): string {
  const mark = trefoilMark(size, background ? size * 0.16 : size * 0.06);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox}">`,
    background
      ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>`
      : "",
    trefoilMarkup(mark, { id: "trefoil", from, to }),
    `</svg>`,
  ].join("");
}
