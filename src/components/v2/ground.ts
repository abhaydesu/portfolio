/*
 * The edge of a hobby's ground, as a mask: a rounded patch whose sides
 * waver gently in and out (no two the same, but the same every time for a
 * given hobby), blurred so it fades into the paper rather than stopping.
 * Drawn at the ground's own size so the waver and the fade keep their
 * width whatever shape the ground is.
 */

// in px, docked / opened up
const SOFT = { docked: 6, window: 9 }; // blur of the edge
const INSET = { docked: 16, window: 24 }; // patch edge from the ground's
const WAVER = { docked: 6, window: 10 }; // how far the edge wanders
const RADIUS = { docked: 26, window: 40 };

function seed(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    return h / 2 ** 32;
  };
}

export function groundMask(
  w: number,
  h: number,
  id: string,
  expanded: boolean,
  // the same edge at other sizes, for things that aren't a panel's ground
  // (the footer's sunset)
  tune: Partial<Record<"soft" | "inset" | "waver" | "radius", number>> = {},
): string | null {
  if (w <= 0 || h <= 0) return null;
  const k = expanded ? "window" : "docked";
  const inset = tune.inset ?? INSET[k];
  const soft = tune.soft ?? SOFT[k];
  const waver = tune.waver ?? WAVER[k];
  const radius = tune.radius ?? RADIUS[k];
  const r = Math.min(radius, (w - inset * 2) / 2, (h - inset * 2) / 2);
  const x0 = inset,
    y0 = inset,
    x1 = w - inset,
    y1 = h - inset;
  const sides = [x1 - x0 - 2 * r, y1 - y0 - 2 * r];
  const arc = (Math.PI / 2) * r;
  const perimeter = 2 * sides[0] + 2 * sides[1] + 4 * arc;

  // a point on the rounded rectangle, and its outward normal, at distance s
  // along it (clockwise from the top-left corner's end)
  const at = (s: number): [number, number, number, number] => {
    const legs: [number, (t: number) => [number, number, number, number]][] = [
      [sides[0], (t) => [x0 + r + t, y0, 0, -1]],
      [arc, (t) => corner(x1 - r, y0 + r, -Math.PI / 2 + t / r)],
      [sides[1], (t) => [x1, y0 + r + t, 1, 0]],
      [arc, (t) => corner(x1 - r, y1 - r, t / r)],
      [sides[0], (t) => [x1 - r - t, y1, 0, 1]],
      [arc, (t) => corner(x0 + r, y1 - r, Math.PI / 2 + t / r)],
      [sides[1], (t) => [x0, y1 - r - t, -1, 0]],
      [arc, (t) => corner(x0 + r, y0 + r, Math.PI + t / r)],
    ];
    for (const [len, f] of legs) {
      if (s <= len) return f(s);
      s -= len;
    }
    return legs[0][1](0);
  };
  const corner = (cx: number, cy: number, a: number) =>
    [cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)] as [
      number,
      number,
      number,
      number,
    ];

  // a few long, slow waves around the edge, each a whole number of times
  // round so the outline closes without a seam
  const rand = seed(id + k);
  const waves = [
    { n: Math.max(2, Math.round(perimeter / 300)), amp: 0.6 },
    { n: Math.max(3, Math.round(perimeter / 130)), amp: 0.3 },
    { n: Math.max(5, Math.round(perimeter / 70)), amp: 0.1 },
  ].map((wv) => ({ ...wv, phase: rand() * Math.PI * 2 }));
  const wander = (s: number) =>
    waver *
    waves.reduce(
      (sum, wv) =>
        sum +
        wv.amp * Math.sin((s / perimeter) * Math.PI * 2 * wv.n + wv.phase),
      0,
    );

  const steps = Math.ceil(perimeter / 8);
  let d = "";
  for (let i = 0; i < steps; i++) {
    const s = (i / steps) * perimeter;
    const [x, y, nx, ny] = at(s);
    const o = wander(s);
    d += `${i ? "L" : "M"}${(x + nx * o).toFixed(1)} ${(y + ny * o).toFixed(1)}`;
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='${soft}'/></filter><path d='${d}Z' fill='#000' filter='url(#f)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
