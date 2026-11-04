"use client";

import { useEffect, useRef } from "react";
import { PugGate } from "./pug-gate";
import { groundMask } from "./ground";

/*
 * The page's sign-off, set like a small poster: a mountain over a lake,
 * painted in pixels, a word of thanks in its corner and the old man's pug
 * sat above it, the way to him (see pug-gate.tsx).
 *
 * One broad mountain with snow down its gullies, soft clouds behind it, a
 * band of forest along the far bank (pines, and round trees that turn with
 * the year), and the lake giving it all back upside down. A branch hangs in
 * over the top-left corner and a pine stands up the right edge, close by.
 *
 * - It's day with the sun in the light theme, night with the moon in the
 *   dark. Switching theme moves the sky: the sun sinks behind the mountain
 *   through a dusk as the moon comes up from behind the pine, and back.
 * - A click turns the year on a season: blossom, then summer green (and
 *   fireflies on a summer night), then autumn, then snow; each with what
 *   falls in it, easing from one to the next.
 * - It arrives in cloud, which parts as you scroll down to it.
 *
 * Clouds drift by a pixel every few seconds, the lake's lines sway, and
 * whatever's falling falls slowly. Everything's drawn fresh from a few
 * shapes into a small grid, a few colours to a ramp with an ordered dither
 * between, so it reads as pixel art; the grid is blown up by a whole number
 * of device pixels, so no pixel is ever resampled. Its edge fades into the
 * paper at a soft, wavering line, as the about panels' grounds do
 * (ground.ts).
 */

// roughly how many css px wide an art pixel is; rounded per screen to a
// whole number of device pixels
const ART = 2.5;
const ASPECT = 9 / 16;
// the fade at its edge, in css px (see ground.ts), and how far past its box
// the picture reaches, where there's room, to make space for it
const EDGE = { waver: 7, soft: 8, radius: 36 };
const BLEED = 22;

type RGB = readonly [number, number, number];

// 8×8 ordered dither, thresholds in (0, 1)
const B8 = (() => {
  let m = [
    [0, 2],
    [3, 1],
  ];
  while (m.length < 8) {
    const n = m.length;
    m = Array.from({ length: n * 2 }, (_, i) =>
      Array.from(
        { length: n * 2 },
        (_, j) =>
          4 * m[i % n][j % n] +
          [
            [0, 2],
            [3, 1],
          ][Math.floor(i / n)][Math.floor(j / n)],
      ),
    );
  }
  return Float32Array.from(m.flat(), (v) => (v + 0.5) / 64);
})();
const dith = (x: number, y: number) => B8[(y & 7) * 8 + (x & 7)];

// a steady random number in [0, 1) for a pair of whole numbers
const hash = (i: number, j: number) => {
  let h = Math.imul(i | 0, 374761393) + Math.imul(j | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/**
 * quantise `t` in [0, 1] to one of `n` steps, dithered between them; `s`
 * is how wide the dithered seam between two steps is, so lower keeps
 * broad flat bands the way pixel art does
 */
const step = (t: number, n: number, x: number, y: number, s = 0.6) =>
  Math.min(
    n - 1,
    Math.max(0, Math.floor(clamp(t) * (n - 1) + 0.5 + (dith(x, y) - 0.5) * s)),
  );

const rng = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

/** one light (or season) eased toward another, `t` of the way */
function mix<T>(a: T, b: T, t: number): T {
  if (typeof a === "number") return (a + ((b as number) - a) * t) as T;
  if (Array.isArray(a))
    return a.map((v, i) => mix(v, (b as unknown[])[i], t)) as T;
  const o = {} as Record<string, unknown>;
  for (const k in a) o[k] = mix(a[k], b[k], t);
  return o as T;
}

/** a ramp of `n` colours from a few stops */
function ramp(stops: number[][], n: number) {
  const out = new Uint8Array(n * 3);
  for (let k = 0; k < n; k++) {
    const t = (k / (n - 1)) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(t));
    for (let c = 0; c < 3; c++)
      out[k * 3 + c] = Math.round(
        stops[i][c] + (stops[i + 1][c] - stops[i][c]) * (t - i),
      );
  }
  return out;
}

const lerpc = (a: ArrayLike<number>, b: ArrayLike<number>, t: number) =>
  [0, 1, 2].map((c) => a[c] + (b[c] - a[c]) * t) as unknown as RGB;

/** smooth noise that tiles across the picture's width */
function noiseField(W: number, H: number, cell: number, seed: number) {
  const cx = Math.max(1, Math.round(W / cell));
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = 0;
      let amp = 0.6;
      let f = 1;
      for (let o = 0; o < 3; o++) {
        const u = (x / W) * cx * f;
        const w = (y / cell) * f;
        const i = Math.floor(u);
        const j = Math.floor(w);
        const fu = u - i;
        const fw = w - j;
        const su = fu * fu * (3 - 2 * fu);
        const sw = fw * fw * (3 - 2 * fw);
        const c = cx * f;
        const l = (a: number, b: number) =>
          hash((((a % c) + c) % c) + seed * 131 + o * 977, b + seed * 71);
        const top = l(i, j) + (l(i + 1, j) - l(i, j)) * su;
        const bot = l(i, j + 1) + (l(i + 1, j + 1) - l(i, j + 1)) * su;
        v += amp * (top + (bot - top) * sw);
        amp *= 0.5;
        f *= 2;
      }
      out[y * W + x] = v / 1.05;
    }
  }
  return out;
}

/* ----------------------------------------------------------------- light */

// the light at one time of day, all numbers so one can ease into the next
type Light = {
  // the sky, top to horizon (then the glare by the sun), and its clouds,
  // shadow to lit
  sky: number[][];
  cloud: number[][];
  // what the light falling on things looks like: its colour on the faces
  // turned to it, what everything's multiplied by (dim and blue at night),
  // and the air things fade into with distance
  light: number[];
  ambient: number[];
  haze: number[];
  // the sun (or moon): colour, size, where; its glare; and the stars
  disc: number[];
  discR: number;
  sunX: number;
  sunY: number;
  glow: number;
  stars: number;
  // how dark it is, for the things that only show at night
  night: number;
};

const NIGHT: Light = {
  sky: [
    [8, 12, 30],
    [16, 24, 54],
    [28, 38, 76],
    [44, 56, 98],
    [70, 80, 120],
  ],
  cloud: [
    [20, 26, 50],
    [34, 42, 72],
    [58, 68, 102],
  ],
  light: [176, 192, 228],
  ambient: [0.3, 0.36, 0.56],
  haze: [36, 46, 82],
  disc: [238, 236, 218],
  discR: 0.04,
  sunX: 0.78,
  sunY: 0.15,
  glow: 0.12,
  stars: 1,
  night: 1,
};
const DAWN: Light = {
  sky: [
    [112, 122, 176],
    [170, 156, 196],
    [228, 182, 196],
    [248, 204, 184],
    [255, 230, 204],
  ],
  cloud: [
    [176, 156, 190],
    [226, 186, 200],
    [252, 220, 210],
  ],
  light: [255, 212, 190],
  ambient: [0.78, 0.72, 0.8],
  haze: [214, 186, 200],
  disc: [255, 236, 206],
  discR: 0.05,
  sunX: 0.55,
  sunY: 0.44,
  glow: 0.3,
  stars: 0,
  night: 0.15,
};
const DAY: Light = {
  sky: [
    [80, 140, 212],
    [118, 168, 226],
    [160, 198, 236],
    [204, 224, 242],
    [236, 244, 246],
  ],
  cloud: [
    [178, 196, 218],
    [220, 230, 240],
    [250, 252, 254],
  ],
  light: [255, 250, 236],
  ambient: [1, 1, 1],
  haze: [176, 202, 226],
  disc: [255, 252, 232],
  discR: 0.045,
  sunX: 0.76,
  sunY: 0.12,
  glow: 0.22,
  stars: 0,
  night: 0,
};
const DUSK: Light = {
  sky: [
    [34, 36, 84],
    [74, 62, 122],
    [144, 92, 138],
    [214, 128, 124],
    [246, 168, 128],
  ],
  cloud: [
    [70, 56, 104],
    [140, 86, 120],
    [218, 128, 122],
  ],
  light: [240, 150, 136],
  ambient: [0.52, 0.44, 0.6],
  haze: [118, 90, 132],
  disc: [255, 180, 130],
  discR: 0.055,
  sunX: 0.55,
  sunY: 0.5,
  glow: 0.2,
  stars: 0.4,
  night: 0.65,
};

// something in the sky: where it is (in fractions of the picture), its size
// and colour, and whether it's the moon
type Body = { x: number; y: number; r: number; c: number[]; moon: boolean };

/* --------------------------------------------------------------- seasons */

// what changes through the year: the leaves, the snow, what falls
type Season = {
  // the broadleaf trees, three kinds, each lit then shaded; the pines
  leaves: number[][][];
  pine: number[][];
  // the shore, and the branch's leaves (colour, then how many)
  ground: number[];
  bloom: number[];
  bloomK: number;
  // how far down the mountain the snow comes (of its height), and how
  // much lies on the trees, the shore and the branch
  snowline: number;
  snow: number;
  // the lake: how pale (ice) it is
  ice: number;
  // what's falling, its colour, how many, how fast, and how it drifts;
  // and the fireflies on a warm night
  fall: number[];
  fallK: number;
  fallV: number;
  sway: number;
  flies: number;
};

// spring, summer, autumn, winter
const SEASONS: Season[] = [
  {
    leaves: [
      [
        [244, 184, 204],
        [212, 140, 172],
      ],
      [
        [250, 214, 222],
        [222, 168, 186],
      ],
      [
        [168, 204, 120],
        [118, 160, 92],
      ],
    ],
    pine: [
      [58, 100, 78],
      [30, 60, 54],
    ],
    ground: [96, 80, 58],
    bloom: [250, 190, 210],
    bloomK: 0.8,
    snowline: 0.3,
    snow: 0,
    ice: 0,
    fall: [252, 200, 216],
    fallK: 0.45,
    fallV: 0.3,
    sway: 1.6,
    flies: 0,
  },
  {
    leaves: [
      [
        [112, 168, 82],
        [70, 122, 62],
      ],
      [
        [140, 184, 92],
        [92, 138, 66],
      ],
      [
        [86, 146, 86],
        [54, 104, 64],
      ],
    ],
    pine: [
      [50, 96, 70],
      [26, 56, 48],
    ],
    ground: [84, 70, 46],
    bloom: [104, 160, 78],
    bloomK: 1,
    snowline: 0.1,
    snow: 0,
    ice: 0,
    fall: [255, 236, 140],
    fallK: 0,
    fallV: 0.2,
    sway: 1,
    flies: 1,
  },
  {
    leaves: [
      [
        [232, 124, 70],
        [184, 82, 56],
      ],
      [
        [244, 176, 84],
        [204, 124, 60],
      ],
      [
        [200, 72, 64],
        [148, 50, 52],
      ],
    ],
    pine: [
      [44, 82, 74],
      [24, 48, 50],
    ],
    ground: [92, 56, 44],
    bloom: [226, 120, 64],
    bloomK: 0.45,
    snowline: 0.18,
    snow: 0,
    ice: 0,
    fall: [232, 128, 66],
    fallK: 0.3,
    fallV: 0.35,
    sway: 2.2,
    flies: 0,
  },
  {
    leaves: [
      [
        [150, 128, 126],
        [108, 90, 94],
      ],
      [
        [160, 138, 130],
        [116, 98, 98],
      ],
      [
        [140, 120, 122],
        [100, 84, 90],
      ],
    ],
    pine: [
      [40, 74, 72],
      [22, 44, 48],
    ],
    ground: [232, 238, 246],
    bloom: [120, 100, 100],
    bloomK: 0,
    snowline: 0.78,
    snow: 1,
    ice: 0.6,
    fall: [250, 252, 255],
    fallK: 1,
    fallV: 0.55,
    sway: 0.8,
    flies: 0,
  },
];

/** the season it is now (in the north; the year's turn is what matters) */
const seasonNow = () => {
  const m = new Date().getMonth();
  return m >= 2 && m <= 4
    ? 0
    : m >= 5 && m <= 7
      ? 1
      : m >= 8 && m <= 10
        ? 2
        : 3;
};

/* ----------------------------------------------------------------- scene */

// where things are, in fractions of the picture down
const PEAK = 0.22; // the mountain's summit
const CX = 0.46; // and across
const FOOT = 0.62; // where its flanks meet the land
const SHORE = 0.745; // the forest's foot, the start of the bank
const WATER = 0.765; // the lake

// what each pixel of the trees is, in the forest's map
const T = {
  PineLit: 1,
  PineShade: 2,
  LeafLit: 3,
  LeafShade: 4,
  Trunk: 5,
  Floor: 6,
  LeafMid: 7,
};

type Scene = {
  // the mountain's outline and the low ranges either side, per column
  peak: Float32Array;
  ranges: Float32Array;
  // the forest: what each pixel is, which kind of tree and which row
  // (back to front), and the top of its floor per column
  wood: Uint8Array;
  kind: Uint8Array;
  floor: Float32Array;
  // the branch over the top-left corner (1 wood, 2 a leaf) and the pine
  // up the right edge (1 needles, 2 its lit edge)
  bough: Uint8Array;
  pine: Uint8Array;
  // soft noise for the clouds, the snow's edge, and the cloud it arrives in
  sky: Float32Array;
  grain: Float32Array;
  veil: Float32Array;
};

/** draw a line of `w` px thick into `map` as `v` */
function line(
  map: Uint8Array,
  W: number,
  H: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  w: number,
  v: number,
) {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const r = (w - 1) / 2;
    for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
      for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
        if (Math.hypot(dx, dy) > r + 0.35) continue;
        const xx = Math.round(x + dx);
        const yy = Math.round(y + dy);
        if (xx >= 0 && xx < W && yy >= 0 && yy < H) map[yy * W + xx] = v;
      }
  }
}

function scene(W: number, H: number): Scene {
  const rand = rng(41);
  const peakY = H * PEAK;
  const footY = H * FOOT;
  const cx = W * CX;

  // the mountain: steep near the top and spreading as it comes down, its
  // left flank longer than its right, a shoulder on each, rough along its
  // line
  const peak = new Float32Array(W);
  const ranges = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    const u = Math.abs(x - cx) / (W * (x < cx ? 0.5 : 0.4));
    let y = peakY + (footY - peakY) * Math.min(1, u) ** 0.7;
    const sh = (x / W - 0.68) / 0.06;
    y -= H * 0.04 * Math.exp(-sh * sh);
    const sl = (x / W - 0.24) / 0.08;
    y -= H * 0.025 * Math.exp(-sl * sl);
    y += hash(x, 3) * 0.7 + Math.sin(x * 0.5) * 0.4;
    if (Math.abs(x - cx) < 1.6) y = peakY + 0.6;
    peak[x] = y;
    // the low hills far off either side
    const v = x / W;
    ranges[x] =
      H *
      (0.55 +
        0.025 * Math.sin(v * 14 + 1) +
        0.015 * Math.sin(v * 31) -
        0.04 * Math.exp(-(((v - 0.1) / 0.1) ** 2)) -
        0.03 * Math.exp(-(((v - 0.9) / 0.09) ** 2)));
  }

  // the forest, three rows from the back: pines and round broadleaf trees
  const wood = new Uint8Array(W * H);
  const kind = new Uint8Array(W * H);
  const floor = new Float32Array(W);
  for (let x = 0; x < W; x++)
    floor[x] = H * 0.64 + Math.sin(x * 0.21) * 0.8 + hash(x, 9) * 1.2;
  const shoreY = H * SHORE;
  for (let x = 0; x < W; x++)
    for (let y = Math.round(floor[x]); y < shoreY; y++) {
      wood[y * W + x] = T.Floor;
      kind[y * W + x] = 0;
    }
  const rows = [
    { base: 0.665, tall: 0.08, gap: 4 },
    { base: 0.7, tall: 0.105, gap: 5 },
    { base: 0.74, tall: 0.135, gap: 6 },
  ];
  rows.forEach((row, ri) => {
    let x = -2 + rand() * row.gap;
    while (x < W + 3) {
      const base = Math.round(H * row.base + (rand() - 0.5) * 2);
      const tall = Math.round(H * row.tall * (0.75 + rand() * 0.5));
      const pine = rand() < 0.55;
      const which = Math.floor(rand() * 3);
      const tag = (ri << 4) | (pine ? 8 : 0) | which;
      const set = (xx: number, yy: number, v: number) => {
        if (xx < 0 || xx >= W || yy < 0 || yy >= H) return;
        wood[yy * W + xx] = v;
        kind[yy * W + xx] = tag;
      };
      const tx = Math.round(x);
      // a bit of trunk shows under the front ones
      const trunk = ri === 2 ? 3 : ri === 1 ? 2 : 1;
      for (let d = 0; d < trunk; d++) set(tx, base - d, T.Trunk);
      if (pine) {
        // tiers, each a little wider than the one above, jagged at the edge
        const h = tall - trunk;
        const top = base - trunk - h;
        for (let d = 0; d < h; d++) {
          const half = Math.round((d / h) * (2 + ri) + ((d % 3) - 1) * 0.6);
          for (let dx = -half; dx <= half; dx++)
            set(tx + dx, top + d, dx > 0 ? T.PineShade : T.PineLit);
        }
      } else {
        // a round crown, lumpy, on a short trunk
        const r = Math.max(2, Math.round(tall * 0.32));
        const cy = base - trunk - r;
        for (let dy = -r - 1; dy <= r; dy++)
          for (let dx = -r - 1; dx <= r + 1; dx++) {
            const lump = 0.6 * Math.sin(Math.atan2(dy, dx) * 3 + tx);
            if (Math.hypot(dx, dy * 1.1) > r + lump) continue;
            // lit across its top, shaded underneath; which side of the top
            // catches the light is up to where the sun is (see paint)
            const v =
              dy < -r * 0.25
                ? T.LeafLit
                : dy > r * 0.3
                  ? T.LeafShade
                  : T.LeafMid;
            set(tx + dx, cy + dy, v);
            const yy = cy + dy;
            const xx = tx + dx;
            if (dx < 0 && xx >= 0 && xx < W && yy >= 0 && yy < H)
              kind[yy * W + xx] |= 4;
          }
      }
      x += row.gap * (0.6 + rand() * 0.7);
    }
  });

  // the branch over the top-left corner: a bough sagging in from the edge,
  // boughs off it, twigs off those, and leaves along them
  const bough = new Uint8Array(W * H);
  const twig = (
    x: number,
    y: number,
    a: number,
    len: number,
    w: number,
    depth: number,
  ) => {
    const x1 = x + Math.cos(a) * len;
    const y1 = y + Math.sin(a) * len;
    line(bough, W, H, x, y, x1, y1, w, 1);
    if (depth === 0) {
      // a cluster of leaves at its end, and a few along it
      for (let i = 0; i < 5; i++) {
        const t = 0.25 + i * 0.2;
        const lx = Math.round(x + (x1 - x) * t + (rand() - 0.5) * 3);
        const ly = Math.round(y + (y1 - y) * t + (rand() - 0.5) * 3);
        for (const [dx, dy] of [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
          [-1, 0],
        ])
          if (rand() < 0.8) {
            const xx = lx + dx;
            const yy = ly + dy;
            if (xx >= 0 && xx < W && yy >= 0 && yy < H && !bough[yy * W + xx])
              bough[yy * W + xx] = 2;
          }
      }
      return;
    }
    const n = depth === 3 ? 6 : depth === 2 ? 4 : 3;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 0.5);
      const side = i % 2 ? 1 : -1;
      twig(
        x + (x1 - x) * t,
        y + (y1 - y) * t,
        a + side * (0.45 + rand() * 0.55) - 0.15,
        len * (0.32 + rand() * 0.15),
        Math.max(1, w - 1),
        depth - 1,
      );
    }
  };
  twig(-3, H * 0.24, -0.2, W * 0.42, 4, 3);

  // the pine up the right edge, close by and dark against everything
  const pine = new Uint8Array(W * H);
  const px = Math.round(W * 0.915);
  const ptop = Math.round(H * 0.2);
  for (let y = ptop; y < H; y++) {
    const d = y - ptop;
    // tiers that flare and pull in again, ragged at their tips
    const tier = d % 7;
    const half = Math.round(
      1 + d * 0.1 + (tier / 7) * (3 + d * 0.04) + (hash(y, 5) - 0.5) * 1.5,
    );
    for (let dx = -half; dx <= half; dx++) {
      const xx = px + dx;
      if (xx < 0 || xx >= W) continue;
      pine[y * W + xx] = dx === half ? 2 : 1;
    }
  }

  return {
    peak,
    ranges,
    wood,
    kind,
    floor,
    bough,
    pine,
    sky: noiseField(W, H, H * 0.22, 5),
    grain: noiseField(W, H, H * 0.05, 7),
    veil: noiseField(W, H, H * 0.26, 9),
  };
}

type Frame = {
  l: Light;
  s: Season;
  p: number; // how far down to it you've scrolled, 0 to 1
  open: number; // how far the cloud it arrives in has parted, 0 to 1
  // the sun and moon on their way across while the theme turns (otherwise
  // the light's own disc)
  bodies?: Body[];
  tick: number; // ambient steps, a few a second
  drift: number; // slow steps, one every few seconds
  scene: Scene;
};

const mul = (c: ArrayLike<number>, a: ArrayLike<number>): RGB => [
  c[0] * a[0],
  c[1] * a[1],
  c[2] * a[2],
];

function paint(out: Uint8ClampedArray, W: number, H: number, f: Frame) {
  const { l, s, p, tick, drift } = f;
  const sc = f.scene;
  const sunX = W * l.sunX;
  const sunY = H * (l.sunY + 0.05 * p);
  const bodies = (
    f.bodies ?? [
      { x: l.sunX, y: l.sunY, r: l.discR, c: l.disc, moon: l.night > 0.8 },
    ]
  ).map((b) => ({ ...b, x: b.x * W, y: (b.y + 0.05 * p) * H, r: b.r * H }));
  const cx = W * CX;
  const peakY = H * PEAK;
  const footY = H * FOOT;
  const shoreY = Math.round(H * SHORE);
  const waterY = Math.round(H * WATER);

  const NS = 14;
  const sky = ramp(l.sky, NS);
  const cl = ramp(l.cloud, 3);
  // a colour under this light, `far` of the way into the haze
  const lit = (c: ArrayLike<number>, far = 0) =>
    lerpc(mul(c, l.ambient), l.haze, far);
  // the light always comes from the right, where both the sun and the moon
  // are, so faces don't flip from lit to shaded as the sky turns
  const sunSide = 1;

  // the mountain's rock and snow, lit, between and shaded
  // (by night the lit faces sink toward the middle tone, smoothly, as the
  // light goes)
  const rockMid = lit([112, 100, 118], 0.34);
  const rock = [
    lerpc(
      lerpc(lit([132, 116, 128], 0.32), l.light, 0.3 * (1 - l.night)),
      rockMid,
      l.night * 0.8,
    ),
    rockMid,
    lit([80, 76, 98], 0.36),
  ];
  const snowMid = lit([214, 218, 232], 0.2);
  const snow = [
    lerpc(
      lerpc(lit([250, 248, 246], 0.15), l.light, 0.35 * (1 - l.night)),
      snowMid,
      l.night * 0.5,
    ),
    snowMid,
    lit([168, 176, 204], 0.24),
  ];
  const range = [lit([150, 140, 156], 0.55), lit([128, 120, 140], 0.48)];
  // the forest, darker and hazier at the back
  const tree = (rowi: number, c: ArrayLike<number>) =>
    lit(lerpc(c, [0, 0, 0], 0.08 * (2 - rowi)), 0.22 - rowi * 0.09);
  const floorC = lit([28, 42, 44], 0.22);
  const trunkC = lit([150, 90, 54], 0.05);
  const ground = lit(s.ground, 0.04);
  const groundDark = lerpc(ground, [0, 0, 0], 0.25);
  const snowLit = lit([244, 246, 250], 0.05);

  const skyT = (x: number, y: number) => {
    const v = clamp(y / (H * 0.62));
    const g = Math.exp(
      -(((x - sunX) / (W * 0.24)) ** 2) - ((y - sunY) / (H * 0.22)) ** 2,
    );
    return clamp(0.85 * v ** 1.2 + l.glow * g * 1.3);
  };

  const put = (k: number, c: ArrayLike<number>, o = 0) => {
    out[k * 4] = c[o];
    out[k * 4 + 1] = c[o + 1];
    out[k * 4 + 2] = c[o + 2];
    out[k * 4 + 3] = 255;
  };

  // everything above the water
  for (let y = 0; y < waterY; y++) {
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      const w = sc.wood[k];
      const g = sc.grain[k];

      if (y >= shoreY) {
        // the bank: earth, or snow, with a few stones
        const deep = (y - shoreY) / (waterY - shoreY);
        let c = dith(x, y) < deep * 0.6 ? groundDark : ground;
        if (hash(x * 3, y * 5) < 0.025) c = lerpc(c, [255, 255, 255], 0.15);
        if (s.snow > 0 && dith(x + 2, y) < s.snow * (1 - deep * 0.6))
          c = snowLit;
        put(k, c);
        continue;
      }

      if (w) {
        const tag = sc.kind[k];
        const rowi = tag >> 4;
        if (w === T.Floor) put(k, floorC);
        else if (w === T.Trunk)
          put(k, tree(rowi, lerpc(trunkC, [0, 0, 0], 0.1 * (2 - rowi))));
        else if (w === T.PineLit || w === T.PineShade) {
          // lit on the sun's side; snow along the top of each tier
          const litSide = (w === T.PineLit) === sunSide < 0;
          let c = tree(rowi, s.pine[litSide ? 0 : 1]);
          const above = y > 0 ? sc.wood[k - W] : 0;
          if (
            s.snow > 0 &&
            above !== T.PineLit &&
            above !== T.PineShade &&
            dith(x, y) < s.snow * 0.9
          )
            c = snowLit;
          put(k, c);
        } else {
          const leaf = s.leaves[tag & 3] ?? s.leaves[0];
          // lit across the top on the sun's side, shaded underneath
          const left = (tag & 4) !== 0;
          const sunward = left === sunSide < 0;
          let c =
            w === T.LeafShade || (w === T.LeafMid && !sunward)
              ? tree(rowi, leaf[1])
              : w === T.LeafLit && sunward
                ? tree(rowi, leaf[0])
                : tree(rowi, lerpc(leaf[0], leaf[1], 0.5));
          if (
            s.snow > 0 &&
            y > 0 &&
            sc.wood[k - W] !== w &&
            dith(x, y) < s.snow * 0.6
          )
            c = snowLit;
          put(k, c);
        }
        continue;
      }

      if (y >= sc.peak[x]) {
        // the mountain: faces turned to the sun lit, the others shaded,
        // gullies running down from the summit, and snow from the top
        const dx = x + 0.5 - cx;
        const h = y - peakY;
        const ray = dx / (h + 5);
        // a few gullies down each face, irregular, not a fan of stripes
        const gully = Math.sin(ray * 13 + g * 7 + Math.sin(ray * 5) * 2);
        const toward = dx * sunSide > -h * 0.1 + (g - 0.5) * 3;
        const tone = toward ? (gully > 0.6 ? 1 : 0) : gully > 0.75 ? 1 : 2;
        const line =
          peakY +
          s.snowline * (footY - peakY) +
          (g - 0.5) * 8 +
          gully * 3.5 * s.snowline;
        put(k, y < line ? snow[tone] : rock[tone]);
        continue;
      }

      if (y >= sc.ranges[x]) {
        put(k, range[y > sc.ranges[x] + 3 ? 1 : 0]);
        continue;
      }

      // the sky: the sun or moon, clouds, stars
      const ds = Math.hypot(x + 0.5 - sunX, y + 0.5 - sunY);
      // the sun or moon over this pixel, if either
      let body: (typeof bodies)[number] | null = null;
      let bd = Infinity;
      for (const b of bodies) {
        const d = Math.hypot(x + 0.5 - b.x, y + 0.5 - b.y);
        if (d < b.r && d < bd) {
          body = b;
          bd = d;
        }
      }
      const t = skyT(x, y);
      const band = Math.exp(-(((y / H - 0.3) / 0.2) ** 2));
      const n = sc.sky[y * W + ((x + drift) % W)] * band;
      if (n > 0.38 && !(body && n < 0.48)) {
        const lv = n > 0.56 ? 2 : n > 0.46 ? 1 : 0;
        // brighter near the sun
        const near = Math.exp(-((ds / (W * 0.25)) ** 2));
        put(
          k,
          lerpc(
            cl.subarray(lv * 3, lv * 3 + 3),
            l.light,
            near * 0.35 * (1 - l.night),
          ),
        );
        continue;
      }
      if (body) {
        // the moon has a few greyer seas on it; the sun a softer rim
        const c =
          body.moon && hash(x * 7, y * 3) < 0.18
            ? lerpc(body.c, [150, 156, 176], 0.35)
            : bd > body.r * 0.7
              ? lerpc(body.c, sky.subarray(36, 39), 0.3)
              : body.c;
        put(k, c);
        continue;
      }
      const st = step(t, NS, x, y, 0.5) * 3;
      if (
        l.stars > 0 &&
        y < H * 0.5 &&
        hash(x, y) < 0.005 &&
        hash(y, x) < l.stars
      ) {
        put(
          k,
          lerpc(
            sky.subarray(st, st + 3),
            [255, 246, 228],
            0.4 + 0.6 * hash(x * 3, y * 7),
          ),
        );
        continue;
      }
      put(k, sky, st);
    }
  }

  // the lake: everything above, upside down and darker, broken into
  // lines by the ripples, paler where it's iced over
  for (let y = waterY; y < H; y++) {
    const back = y - waterY;
    const my = Math.max(0, waterY - 1 - back);
    const wob = Math.round(
      Math.sin(y * 1.3 + tick * 0.05) * Math.min(1.5, 0.4 + back * 0.12),
    );
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      const sx = Math.max(0, Math.min(W - 1, x + wob));
      const m = (my * W + sx) * 4;
      let c: RGB = [out[m] * 0.78, out[m + 1] * 0.8, out[m + 2] * 0.86];
      c = lerpc(c, l.sky[3], 0.12);
      if (hash(Math.floor((x + drift * 2) / 7), y) > 0.9)
        c = lerpc(c, l.sky[4], 0.35);
      if (s.ice > 0) c = lerpc(c, lit([226, 234, 244], 0.1), s.ice * 0.55);
      put(k, c);
    }
  }

  // the pine up the right edge, then the branch, close by and dark
  const near = lit([18, 26, 30], 0);
  const nearRim = lerpc(near, l.light, 0.22 * (1 - l.night));
  for (let k = 0; k < W * H; k++) {
    const v = sc.pine[k];
    if (!v) continue;
    const y = Math.floor(k / W);
    const x = k - y * W;
    let c = v === 2 && sunSide > 0 ? nearRim : near;
    if (s.snow > 0 && y > 0 && !sc.pine[k - W] && dith(x, y) < s.snow)
      c = snowLit;
    put(k, c);
  }
  const boughC = lit([34, 20, 22], 0);
  const bloom = lit(s.bloom, 0);
  for (let k = 0; k < W * H; k++) {
    const v = sc.bough[k];
    if (!v) continue;
    const y = Math.floor(k / W);
    const x = k - y * W;
    if (v === 2) {
      // its leaves (or blossom), as many as the season has
      if (hash(x, y + 3) < s.bloomK)
        put(k, lerpc(bloom, [0, 0, 0], hash(y, x) < 0.35 ? 0.2 : 0));
      continue;
    }
    if (s.snow > 0 && y > 0 && sc.bough[k - W] !== 1 && dith(x, y) < s.snow)
      put(k, snowLit);
    else put(k, boughC);
  }

  // what's falling: petals, leaves, snow; or, on a summer night, fireflies
  const nf = Math.round(s.fallK * 30);
  for (let i = 0; i < nf; i++) {
    const r0 = hash(i, 1);
    const sp = s.fallV * (0.7 + 0.6 * hash(i, 2));
    const y = Math.floor(((r0 * (H + 10) + tick * sp) % (H + 10)) - 5);
    const x = Math.floor(
      (((hash(i, 3) * W -
        tick * sp * 0.4 +
        s.sway * Math.sin(tick * 0.06 + i)) %
        W) +
        W) %
        W,
    );
    if (y < 0 || y >= H) continue;
    const c = lit(s.fall, 0);
    put(y * W + x, c);
    // leaves are bigger than snow
    if (s.sway > 1.4 && x + 1 < W) put(y * W + x + 1, lerpc(c, [0, 0, 0], 0.2));
  }
  const nfly = Math.round(s.flies * l.night * 10);
  for (let i = 0; i < nfly; i++) {
    if (Math.sin(tick * 0.03 + i * 2.1) < -0.2) continue;
    const x = Math.round(hash(i, 11) * W + 4 * Math.sin(tick * 0.012 + i));
    const y = Math.round(
      H * (0.66 + hash(i, 12) * 0.12) + 2 * Math.sin(tick * 0.017 + i * 3),
    );
    if (x >= 0 && x < W && y >= 0 && y < H) put(y * W + x, [255, 236, 150]);
  }

  // the cloud the view arrives in, parting from the middle out
  // (`open` comes in eased: none until the picture's well into view, all
  // of it once it's fully in; the threshold sweeps the cloud's whole
  // range, and its edge is a broad dither so it thins rather than cuts)
  const open = f.open;
  if (open < 1) {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const k = y * W + x;
        const qx = Math.abs((x + 0.5) / W - 0.5) * 2;
        const qy = Math.abs((y + 0.5) / H - 0.5) * 2;
        const n = sc.veil[y * W + ((x + drift) % W)];
        const reach = 0.5 * n + 0.5 * Math.hypot(qx * 0.9, qy * 0.7);
        const edge = reach - (open * 1.15 - 0.05);
        if (edge <= (dith(x + 3, y + 1) - 0.5) * 0.18) continue;
        const below = sc.veil[Math.min(H - 1, y + 4) * W + ((x + drift) % W)];
        let lift = 0.25 + 0.55 * n + (n - below) * 3;
        if (edge < 0.06) lift += 0.3;
        const tone = step(lift, 4, x, y, 0.4);
        put(
          k,
          tone === 0
            ? cl.subarray(0, 3)
            : lerpc(cl.subarray(3, 6), cl.subarray(6, 9), (tone - 1) / 2),
        );
      }
  }
}

export const SunsetFooter = ({
  open,
  onToggle,
}: {
  // the old man's panel, opened by following his pug from the thanks
  open: boolean;
  onToggle: (anchor: DOMRect) => void;
}) => {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // the art grid, and the small canvas it's painted into before it's
    // blown up by a whole number of device pixels
    let W = 0;
    let H = 0;
    let px = 1;
    const art = document.createElement("canvas");
    const actx = art.getContext("2d")!;
    let img: ImageData | null = null;
    const size = () => {
      const dpr = Math.min(3, devicePixelRatio || 1);
      px = Math.max(1, Math.round(ART * dpr));
      // the picture reaches past its box into whatever gutter there is (as
      // a panel's ground reaches past its card), so the fade at its edge
      // happens around the poster rather than eating into it
      const room = (root.clientWidth - el.getBoundingClientRect().width) / 2;
      const bleed = Math.max(0, Math.min(BLEED, room - 4));
      W = Math.max(32, Math.floor(((el.clientWidth + bleed * 2) * dpr) / px));
      H = Math.round(W * ASPECT);
      art.width = W;
      art.height = H;
      img = actx.createImageData(W, H);
      cv.width = W * px;
      cv.height = H * px;
      cv.style.width = `${(W * px) / dpr}px`;
      cv.style.height = `${(H * px) / dpr}px`;
      // the about panels' edge: a rounded patch that wavers in and out,
      // blurred into the paper. it sits in far enough that the blur is done
      // before the canvas ends, so it never stops at a hard line
      const m = groundMask((W * px) / dpr, (H * px) / dpr, "sunset", true, {
        inset: EDGE.waver + EDGE.soft * 2.6,
        ...EDGE,
      });
      if (m) {
        cv.style.mask = `${m} 0 0 / 100% 100% no-repeat`;
        cv.style.webkitMask = cv.style.mask;
      }
      land = scene(W, H);
      key = "";
    };

    // how far the sun has set: none until the footer starts coming up,
    // all of it at the very bottom of the page
    let target = 1;
    let p = 1;
    const progress = () => {
      const left = root.scrollHeight - innerHeight - scrollY;
      const range = Math.min(
        root.scrollHeight - innerHeight,
        el.offsetHeight * 1.2,
      );
      target = range > 0 ? 1 - Math.max(0, Math.min(1, left / range)) : 1;
      // the cloud parts by how much of the picture is on screen: not at
      // all till it's well into view, all of it once it's fully in (or the
      // page can't scroll any further)
      const r = el.getBoundingClientRect();
      const seenOf = clamp((innerHeight - r.top) / r.height);
      const t = clamp((seenOf - 0.4) / 0.6);
      revealTo = target >= 0.999 ? 1 : t * t * (3 - 2 * t);
    };
    let revealTo = 1;
    let reveal = 1;

    let land: Scene | null = null;
    let key = "";
    // the season it's showing: the one it is to begin with, then the next
    // with each click, eased into from wherever the year was
    let season = seasonNow();
    let from: Season = SEASONS[season];
    let since = -Infinity;
    const EASE = 1600;
    const year = (now: number) => {
      const t = reduce ? 1 : clamp((now - since) / EASE);
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      return {
        s: t >= 1 ? SEASONS[season] : mix(from, SEASONS[season], e),
        easing: t < 1,
      };
    };
    // the light follows the theme: day with the sun in the light one,
    // night with the moon in the dark. switching moves the sky: into the
    // dark, the sun sinks behind the mountain through a dusk and the moon
    // comes up from behind the pine; back out, the moon goes down behind
    // the pine and the sun climbs out from behind the mountain through a
    // dawn
    let dark = root.classList.contains("dark");
    let lightFrom: Light | null = null;
    let turnedAt = -Infinity;
    let lastLight: Light | null = null;
    const TURN = 2800;
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    // a stretch of the turn, `a` to `b`, as 0 to 1
    const part = (t: number, a: number, b: number) =>
      ease(clamp((t - a) / (b - a)));
    const light = (now: number) => {
      const goal = dark ? NIGHT : DAY;
      const t = reduce ? 1 : clamp((now - turnedAt) / TURN);
      if (!lightFrom || t >= 1) {
        lastLight = goal;
        return { l: goal, bodies: undefined, turning: false };
      }
      // the sky passes through a dusk on the way down, a dawn on the way
      // up: one smooth curve under a single ease, so the colours never surge
      // and stall. it's a weighted blend of the three (start, dusk or dawn,
      // end) whose weights always add up to one, so it never strays outside
      // their colours; the middle one weighted up so the sky gets well into
      // its dusk (or dawn) on the way
      const mid = dark ? DUSK : DAWN;
      const u = ease(t);
      const a = (1 - u) ** 2;
      const m = 4 * u * (1 - u);
      const c = u * u;
      const ends = mix(lightFrom, goal, c / (a + c || 1));
      const l = mix(ends, mid, m / (a + m + c));
      lastLight = l;
      const sunUp = { x: DAY.sunX, y: DAY.sunY };
      const sunDown = { x: CX + (DAY.sunX - CX) * 0.15, y: PEAK + 0.24 };
      const moonUp = { x: NIGHT.sunX, y: NIGHT.sunY };
      const moonDown = { x: 0.915, y: 0.9 };
      // into the dark the sun goes first and the moon follows it up; out
      // of it, the moon goes first
      const sn = dark ? part(t, 0, 0.6) : 1 - part(t, 0.35, 1);
      const mn = dark ? part(t, 0.35, 1) : 1 - part(t, 0, 0.6);
      const at = (a: { x: number; y: number }, b: typeof a, k: number) => ({
        x: a.x + (b.x - a.x) * k,
        // a little arc: it falls (or rises) faster than it travels across
        y: a.y + (b.y - a.y) * Math.sin((k * Math.PI) / 2),
      });
      const bodies: Body[] = [
        { ...at(sunUp, sunDown, sn), r: DAY.discR, c: DAY.disc, moon: false },
        {
          ...at(moonDown, moonUp, mn),
          r: NIGHT.discR,
          c: NIGHT.disc,
          moon: true,
        },
      ];
      return { l, bodies, turning: true };
    };
    const draw = (now: number) => {
      if (!img || !land) return;
      // ambient things move in whole steps: what's falling and the lake a
      // few times a second, the clouds a pixel every few seconds
      const tick = reduce ? 0 : Math.floor(now / 160);
      const drift = reduce ? 0 : Math.floor(now / 3500);
      const { s, easing } = year(now);
      const { l, bodies, turning } = light(now);
      const at = Math.round(p * 200) / 200;
      const op = Math.round(reveal * 300) / 300;
      const k = `${at}|${op}|${tick}|${drift}|${season}|${dark}`;
      if (k === key && !easing && !turning) return;
      key = k;
      paint(img.data, W, H, {
        l,
        bodies,
        s,
        p: at,
        open: op,
        tick,
        drift,
        scene: land,
      });
      actx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(art, 0, 0, cv.width, cv.height);
    };

    let frame = 0;
    let seen = false;
    const loop = (now: number) => {
      frame = 0;
      p += (target - p) * (reduce ? 1 : 0.08);
      if (Math.abs(target - p) < 0.001) p = target;
      // (the cloud eases apart more slowly than the scroll)
      reveal += (revealTo - reveal) * (reduce ? 1 : 0.045);
      if (Math.abs(revealTo - reveal) < 0.002) reveal = revealTo;
      draw(now);
      if (seen) frame = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (seen && !frame) frame = requestAnimationFrame(loop);
    };

    // a click turns the year on a season (the cursor's a pixel hand over
    // it, to say it can be pressed)
    const onClick = () => {
      const now = performance.now();
      from = year(now).s;
      since = now;
      season = (season + 1) % SEASONS.length;
      key = "";
      wake();
    };

    const onScroll = () => {
      progress();
      wake();
    };

    size();
    progress();
    p = target;
    reveal = revealTo;
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      wake();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      size();
      progress();
      wake();
    });
    ro.observe(el);
    // a theme switch turns the light toward its evening, or back
    const mo = new MutationObserver(() => {
      const now = root.classList.contains("dark");
      if (now === dark) return;
      lightFrom = lastLight;
      turnedAt = performance.now();
      dark = now;
      wake();
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    addEventListener("scroll", onScroll, { passive: true });
    cv.addEventListener("click", onClick);
    return () => {
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      removeEventListener("scroll", onScroll);
      cv.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // a poster with its thanks in the corner, clear of the light; on a
    // phone, where it's too small to hold it, above it instead. either way
    // the thanks is lifted into the gap above, so it's nearer the end of the
    // text and further from the sun. it's the last part of the page in (see
    // v2-enter in globals.css)
    <footer className="v2-enter relative flex flex-col gap-14 [--enter:5] sm:mt-[92px] sm:block sm:aspect-[16/9]">
      <p
        data-intro="text"
        className="pointer-events-none -mt-6 flex flex-col items-start gap-1 text-[15px] text-neutral-800 sm:absolute sm:-top-[116px] md:-top-[124px] sm:left-0 sm:z-[1] sm:mt-0"
      >
        <PugGate open={open} onToggle={onToggle} />
        thanks for stopping by.
      </p>
      <div
        ref={box}
        data-intro="media"
        className="relative sm:absolute sm:inset-0"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* centred on its box, reaching past it on every side (see size) */}
        <canvas
          ref={canvas}
          aria-hidden
          data-cursor="pixel"
          data-poke=""
          data-sound="action"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 touch-pan-y"
        />
      </div>
    </footer>
  );
};
