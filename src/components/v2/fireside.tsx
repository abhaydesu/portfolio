"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { FIRESIDE, firesideTopics, type Beat } from "./data";
import { sceneOf, type Mood, type Scene } from "./fireside-mood";
import {
  PUG_ASLEEP,
  PUG_POUNCE,
  PUG_SIT,
  PUG_TROT,
  type Sprite,
} from "./pug-sprites";
import { crt } from "./fonts";

/*
 * The old man, at the foot of the page: following his pug from beside the
 * thanks (see pug-gate.tsx) opens this like the hobby panels open. Inside is a little pixel game: an old
 * man on a floating island (fishing by day, by his fire at night, in his
 * tent when it rains; see fireside-mood.ts), and a conversation you steer. Click, space or enter moves him along (or finishes the line he's on);
 * when he's done talking you pick what to say next, by click, arrow keys
 * or number. The fire can be poked, or fed a log, and most of the island
 * pokes back.
 */

/* ---------- the scene ---------- */

type Choice = { label: string; pick: () => void };

export const Fireside = ({
  mood,
  onLeave,
}: {
  mood: Mood;
  onLeave: () => void;
}) => {
  const reduce = !!useReducedMotion();
  const lines = FIRESIDE[sceneOf(mood)];
  const topics = useMemo(() => firesideTopics(lines), [lines]);
  const [beats, setBeats] = useState<Beat[]>(() =>
    mood.storm ? [FIRESIDE.storm, ...lines.opening.slice(1)] : lines.opening,
  );
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState(0);
  const [asked, setAsked] = useState<string[]>([]);
  const [gone, setGone] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [stoked, setStoked] = useState(0);
  // he waits for the panel to settle before he starts
  const [ready, setReady] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const beat = beats[at];
  const done = typed >= beat.say.length;
  const waiting = done && at === beats.length - 1;

  useEffect(() => {
    const id = setTimeout(() => setReady(true), reduce ? 0 : 500);
    box.current?.focus({ preventScroll: true });
    return () => clearTimeout(id);
  }, [reduce]);

  // one letter at a time, catching his breath on punctuation
  useEffect(() => {
    if (!ready || done) return;
    if (reduce) return setTyped(beat.say.length);
    const ch = beat.say[typed - 1];
    const wait = ch === "." || ch === "?" ? 240 : ch === "," ? 110 : 24;
    const id = setTimeout(() => setTyped((t) => t + 1), typed ? wait : 0);
    return () => clearTimeout(id);
  }, [ready, done, typed, beat, reduce]);

  const play = (next: Beat[]) => {
    setBeats(next);
    setAt(0);
    setTyped(0);
    setCursor(0);
  };

  const left = topics.filter((t) => !asked.includes(t.id));
  const choices: Choice[] = gone
    ? [
        {
          label: "sit back down",
          pick: () => {
            setGone(false);
            play([{ by: "him", say: lines.back }]);
          },
        },
        { label: "leave", pick: onLeave },
      ]
    : [
        ...left.map((t) => ({
          label: t.ask,
          pick: () => {
            const now = [...asked, t.id];
            setAsked(now);
            if (t.stoke) setStoked((n) => n + 1);
            const after =
              now.length === topics.length
                ? lines.spent
                : lines.again[(now.length - 1) % lines.again.length];
            play([...t.beats, { by: "him", say: after }]);
          },
        })),
        {
          label: FIRESIDE.farewell,
          pick: () => {
            setGone(true);
            play(lines.farewell);
          },
        },
      ];

  const advance = useCallback(() => {
    if (!done) return setTyped(beat.say.length);
    if (at < beats.length - 1) {
      setAt((a) => a + 1);
      setTyped(0);
    }
  }, [done, beat, at, beats.length]);

  const onKey = (e: React.KeyboardEvent) => {
    if (waiting) {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) return choices[n - 1].pick();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        return setCursor((c) => (c + step + choices.length) % choices.length);
      }
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (waiting) choices[cursor]?.pick();
      else advance();
    }
  };

  return (
    <div
      className={cn(
        // no frame: the panel's ground is the same night, so the scene's
        // edges just dissolve into it
        crt.className,
      )}
    >
      <Island
        mood={mood}
        still={reduce}
        talking={ready && !done && beat.by === "him"}
        stoked={stoked}
      />

      {/* the dialogue box, the kind an old game talks to you in */}
      <div className="mt-1">
        <div
          ref={box}
          tabIndex={0}
          role="group"
          aria-label="talking with the old man"
          onKeyDown={onKey}
          onClick={() => !waiting && advance()}
          className={cn(
            "flex min-h-[10rem] flex-col bg-[#0f1430] px-3.5 pt-2.5 pb-3 shadow-[inset_0_0_0_3px_#d9cfb6,inset_0_0_0_6px_#0f1430,inset_0_0_0_8px_#2a3060] outline-none focus-visible:shadow-[inset_0_0_0_3px_#f3c98c,inset_0_0_0_6px_#0f1430,inset_0_0_0_8px_#2a3060]",
            !waiting && "cursor-pointer",
          )}
        >
          {/* the whole line for screen readers; the typed copy is for eyes */}
          <span className="sr-only" aria-live="polite">
            {beat.by === "him" ? `the old man: ${beat.say}` : beat.say}
          </span>
          <span
            aria-hidden
            className="h-4 px-1 text-base leading-none text-[#e39a52]"
          >
            {beat.by === "him" && "the old man"}
          </span>
          <span
            aria-hidden
            className={cn(
              "mt-1 block px-1 text-[1.2rem] leading-[1.05]",
              beat.by === "him" ? "text-[#f3ecdc]" : "text-[#9ea8d4]",
            )}
          >
            {beat.say.slice(0, typed)}
            {/* the rest holds its place, so the lines don't reflow */}
            <span className="invisible">{beat.say.slice(typed)}</span>
          </span>

          {waiting ? (
            <ul className="mt-auto flex flex-col">
              {choices.map((c, i) => (
                <li key={c.label}>
                  <button
                    type="button"
                    tabIndex={-1}
                    data-sound={c.pick === onLeave ? "close" : "open"}
                    onClick={(e) => {
                      e.stopPropagation();
                      c.pick();
                    }}
                    onPointerEnter={() => setCursor(i)}
                    className={cn(
                      "flex w-full cursor-pointer gap-1.5 px-1 text-left text-[1.1rem] leading-[1.15] transition-colors",
                      i === cursor ? "text-[#f3c98c]" : "text-[#efe6d2]/55",
                    )}
                  >
                    <span className={cn(i !== cursor && "invisible")}>▸</span>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span
              aria-hidden
              className={cn(
                "mt-auto self-end text-lg leading-none text-[#efe6d2]/45 transition-opacity duration-300",
                done ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="fs-caret inline-block">▾</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- the island ---------- */

/*
 * A little floating island, drawn a pixel at a time on a 152×116 canvas and
 * blown up to the panel's width, like a scene out of an old game. What's on
 * it hangs on the hour and the weather in Bangalore (fireside-mood.ts):
 *
 * at night the old man pokes at his fire from his log while his pug sleeps
 * by it. The fire is simulated (heat rising and cooling row by row), its
 * light falls off across the island in dithered steps and flickers with it,
 * the stars blink, and the moon glints on the pond.
 *
 * by day he fishes the pond off an upturned crate, and his pug chases a
 * butterfly about. The fire's down to a few coals and a thread of smoke.
 *
 * in the rain he sits in the mouth of his tent under a lantern, with a
 * coffee, his pug asleep on the doorstep, and the rain rings the pond. With thunder
 * in it, now and then the whole sky lights up.
 *
 * Most of it pokes back: the fire flares (or hisses, wet), the old man and
 * his pug answer, the pond ripples, the bushes let out fireflies (or
 * butterflies, or a shower), and the sky throws a shooting star (or a bird,
 * or lightning). Every pixel remembers what it belongs to, so the pointer
 * finds exactly what it's over, and whatever it's over gets the light
 * outline an old game hovers with.
 */

const PW = 152;
const PH = 116;
// the world moves on a game's clock, not the display's
const TICK = 90;

type RGB = [number, number, number];
const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

// seeded randomness for placing things, so the island is the same every visit
const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// and a fixed hash for texture, so the island is the same every visit
const hash = (x: number, y: number, s = 0) => {
  let h =
    (Math.imul(x, 374761393) +
      Math.imul(y, 668265263) +
      Math.imul(s, 1442695041)) |
    0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

// 4×4 ordered dither, for gradients made of flat colours
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (n) => (n + 0.5) / 16,
);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

/* the island: N×N tiles, each 8 wide and 4 tall, its back corner at (OX, OY) */
const N = 17;
const OX = 76;
const OY = 22;
const iso = (u: number, v: number): [number, number] => [
  Math.round(OX + (u - v) * 4),
  Math.round(OY + (u + v) * 2),
];

const FIRE = { u: 8, v: 10 };
const [FX, FY] = iso(FIRE.u, FIRE.v);
// his log by the fire: where he sits at night, and in the rain (with his
// tent pitched round it)
const [MX, MY] = iso(10.25, 8.25);
// by day, his crate on the pond's near bank: the top left of him, as drawn
const ANGLER = { x: 86, y: 41 };
// where his pug sleeps at night; in the rain, on the tent's doorstep
const [CX, CY] = iso(6.2, 11.4);
const RAIN_PUG = { x: MX - 3, y: MY + 1 };
// the tent: the middle of its front, at the ground; and its lantern, hung
// off the doorway's edge, beside him
const TENT = { x: MX + 6, y: MY + 1 };
const LAMP = { x: TENT.x + 8, y: TENT.y - 15 };
const MOON = { x: 112, y: 6 };
const POND = { u: 13.6, v: 3, ru: 2.7, rv: 2 };
const [PX, PY] = iso(POND.u, POND.v);
// where his float sits on the pond
const FLOAT = { x: PX - 4, y: PY + 1 };
const BUSHES = [
  [13.2, 7],
  [4.6, 5],
  [11.6, 15.4],
  [15.6, 10.4],
].map(([u, v]) => iso(u, v));
// the patch of grass the pug has the run of, by day (in tiles), clear of
// the fire pit, the trees and the rocks
const YARD = { u0: 3.8, u1: 7, v0: 10.8, v1: 13.4 };

// what each pixel belongs to, for the pointer
const T_SKY = 1;
const T_MAN = 2;
const T_PUG = 3;
const T_POND = 4;
// (one each, from here up)
const T_BUSH = 5;
type Kind = "fire" | "man" | "pug" | "pond" | "bush" | "sky";
type Hit = { kind: Kind; tag: number };

/* ---------- how it's lit ---------- */

// the light over everything, per channel (1 is the colour as painted); what
// the fire or the lantern adds at its brightest; and the pond's blues
type Look = { amb: RGB; warm: RGB; water: RGB[] };
type Sky = "night" | "day" | "rain-day" | "rain-night";
const LOOKS: Record<Sky, Look> = {
  night: {
    amb: [0.32, 0.36, 0.6],
    warm: [1.25, 0.78, 0.4],
    water: ["#14203e", "#1a2a4c", "#22365c", "#2e4670"].map(hex),
  },
  day: {
    amb: [1.16, 1.12, 1],
    warm: [0.5, 0.26, 0.06],
    water: ["#2e6aa0", "#3a7cb4", "#4b90c6", "#6eaedb"].map(hex),
  },
  "rain-day": {
    amb: [0.72, 0.76, 0.84],
    warm: [0.5, 0.34, 0.12],
    water: ["#32495e", "#3a5368", "#455f74", "#546d82"].map(hex),
  },
  "rain-night": {
    amb: [0.22, 0.25, 0.4],
    warm: [1.25, 0.84, 0.4],
    water: ["#0e1526", "#121b30", "#18233a", "#202d46"].map(hex),
  },
};
// what a flash of lightning makes of it, for a moment
const FLASH: RGB = [1.35, 1.4, 1.6];

/* ---------- sprites: one character per pixel, "." is clear ---------- */

// the same, facing the other way
const flip = (s: Sprite): Sprite => ({
  rows: s.rows.map((r) => [...r].reverse().join("")),
  pal: s.pal,
});

const PINE: Sprite = {
  rows: [
    ".....b.....",
    "....abc....",
    "....abc....",
    "...aabbc...",
    "..aaabbcc..",
    "....abc....",
    "...aabbc...",
    "..aaabbcc..",
    ".aaaabbccc.",
    "...aabbc...",
    "..aaabbbc..",
    ".aaaabbbcc.",
    "aaaaabbbccc",
    ".aaaabbbcc.",
    ".....tt....",
    ".....tt....",
  ],
  pal: { a: "#1d3a2a", b: "#2b5638", c: "#3f7446", t: "#5a3c28" },
};

const SPRUCE: Sprite = {
  rows: [
    "...b...",
    "..abc..",
    "..abc..",
    ".aabcc.",
    "..abc..",
    ".aabcc.",
    "aaabbcc",
    "..abc..",
    ".aabbc.",
    "aaabbcc",
    "...t...",
  ],
  pal: PINE.pal,
};

const BUSH: Sprite = {
  rows: [".abbc..", "aabbbcc", "aabbbbc", ".aaabb."],
  pal: { a: "#22432e", b: "#33603c", c: "#4c8048" },
};

const ROCK: Sprite = {
  rows: [".GG.", "gGGg", "ggga"],
  pal: { g: "#6c6a74", G: "#8c8a96", a: "#4a4852" },
};

const LOG: Sprite = {
  rows: [
    ".OOOOOOOOOOOO.",
    "rroooooooooooo",
    "rRrooooooooooo",
    ".rr.ooooooooo.",
  ],
  pal: { o: "#6b4a30", O: "#8f6842", r: "#c49a6a", R: "#7a5236" },
};

// his crate by the pond, upturned, and his bucket for whatever bites
const CRATE: Sprite = {
  rows: ["OOOOOOO", "oRoooRo", "oRoooRo", "rrrrrrr"],
  pal: { O: "#b08a58", o: "#8f6a40", R: "#6a4a2c", r: "#5a3e24" },
};
const BUCKET: Sprite = {
  rows: [".hhhh.", "hBBBBh", "gGGGGg", "gGGGGg", ".gggg."],
  pal: { h: "#9a9aa6", B: "#2a3a52", g: "#7a7a88", G: "#a4a4b0" },
};

// the old man, sat on the log, facing left toward the fire. his head is its
// own sprite so it can nod
const MAN_PAL = {
  h: "#6a4a34",
  H: "#3e2c22",
  S: "#9a6448",
  e: "#1a1410",
  s: "#e4a87e",
  n: "#f4c094",
  w: "#efe9de",
  W: "#bab3a8",
  k: "#b4462e",
  c: "#6e5c48",
  C: "#4a3e34",
  a: "#86725a",
  p: "#40405a",
  q: "#2e2e42",
  b: "#2a1e16",
};
const HEAD: Sprite = {
  rows: [
    "......hhh.......",
    ".....hhhhH......",
    ".....HHHHHH.....",
    "..hhhhhhhhhhH...",
    "....SSSSSww.....",
    "...nsesssww.....",
  ],
  pal: MAN_PAL,
};
const BODY: Sprite = {
  rows: [
    ".....wwwwskk....",
    ".....wwwwkkcC...",
    ".....wWwwccccC..",
    "......wWacccccC.",
    "......aaacccccC.",
    ".ssaaaa.cccccCC.",
    "..pppp.ccccccCC.",
    ".ppppppppcccCC..",
    ".pp.qqqqqqpcC...",
    ".pp.qq..........",
    ".pp.qq..........",
    "bbbbqq..........",
    "....bbbb........",
  ],
  pal: MAN_PAL,
};
// with his hand off the stick: in the rain it's round a mug, drawn with it
const BODY_MUG: Sprite = {
  rows: BODY.rows.map((r, i) => (i === 5 ? r.replace("ss", "..") : r)),
  pal: MAN_PAL,
};

const Z = ["zzz", ".z.", "zzz"];

const MOON_ROWS = [
  "....MMM....",
  "..MMMM.....",
  ".MMMm......",
  ".MMm.......",
  "MMMm.......",
  "MMMm.......",
  "MMMm.......",
  ".MMm.......",
  ".MMMm......",
  "..MMMM.....",
  "....MMM....",
];

// clouds, each a few puffs run together: [dx, dy, underside?] per pixel
const cloud = (seed: number, w: number) => {
  const r = rand(seed);
  const puffs = Array.from({ length: 4 }, (_, i) => ({
    x: (i / 3) * w + (r() - 0.5) * 3,
    // (taller in the middle)
    y: -Math.sin((Math.PI * i) / 3) * 2.5 + (r() - 0.5),
    rx: 3.5 + r() * 3,
    ry: 2.6 + r() * 2,
  }));
  const px: [number, number, boolean][] = [];
  for (let y = -8; y <= 3; y++)
    for (let x = -6; x <= w + 6; x++)
      if (
        puffs.some(
          (p) => ((x - p.x) / p.rx) ** 2 + ((y - p.y) / p.ry) ** 2 < 1,
        ) &&
        y <= 2
      )
        px.push([x, y, y >= 1]);
  return px;
};

/* ---------- the canvas ---------- */

// colour per pixel; how the light touches it: not at all for things that
// give off their own light, like the fire and the water; in dithered steps
// across the ground; and evenly over a figure, the way an old game lights
// its sprites, so he doesn't go to noise; and what it belongs to
const makeLayer = () => ({
  col: new Uint8ClampedArray(PW * PH * 3),
  lit: new Uint8Array(PW * PH),
  tag: new Uint8Array(PW * PH),
  // how far forward it stands (its foot's y; the ground is behind
  // everything), so what moves can pass behind what it should
  dep: new Int16Array(PW * PH),
});
type Layer = ReturnType<typeof makeLayer>;

// what's being drawn right now, which every pixel put is marked as
let TAG = 0;
// and how far forward it stands
let DEPTH = -1;

const put = (
  L: Layer,
  x: number,
  y: number,
  c: RGB,
  glows: boolean | "evenly" = false,
) => {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= PW || y >= PH) return;
  const i = y * PW + x;
  L.col[i * 3] = c[0];
  L.col[i * 3 + 1] = c[1];
  L.col[i * 3 + 2] = c[2];
  L.lit[i] = glows === true ? 0 : glows ? 2 : 1;
  L.tag[i] = TAG;
  L.dep[i] = DEPTH;
};

const shade = (L: Layer, x: number, y: number, k: number) => {
  if (x < 0 || y < 0 || x >= PW || y >= PH) return;
  const i = (y * PW + x) * 3;
  L.col[i] *= k;
  L.col[i + 1] *= k;
  L.col[i + 2] *= k;
};

// a dark line round a sprite, so a figure reads at this size; "open" names
// sides to leave unlined, where it joins something else
const outline = (L: Layer, s: Sprite, x: number, y: number, open = "") => {
  const ink = hex("#120e14");
  const solid = (dx: number, dy: number) => !!s.pal[s.rows[dy]?.[dx] ?? "."];
  for (let dy = -1; dy <= s.rows.length; dy++)
    for (let dx = -1; dx <= s.rows[0].length; dx++) {
      if (solid(dx, dy)) continue;
      if (dy === -1 && open.includes("t")) continue;
      if (dy === s.rows.length && open.includes("b")) continue;
      if (
        solid(dx - 1, dy) ||
        solid(dx + 1, dy) ||
        solid(dx, dy - 1) ||
        solid(dx, dy + 1)
      )
        put(L, x + dx, y + dy, ink, "evenly");
    }
};

const sprite = (L: Layer, s: Sprite, x: number, y: number, evenly = false) => {
  s.rows.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const c = s.pal[row[dx]];
      if (c) put(L, x + dx, y + dy, hex(c), evenly && "evenly");
    }
  });
};

// a figure: outlined, and lit evenly
const figure = (L: Layer, s: Sprite, x: number, y: number, open = "") => {
  outline(L, s, x, y, open);
  sprite(L, s, x, y, true);
};

// a soft shadow, w wide, centred under (x, y)
const shadow = (L: Layer, x: number, y: number, w: number) => {
  for (let dx = -1; dx <= w; dx++)
    for (let dy = -1; dy <= 1; dy++) {
      const e = ((dx - w / 2) / (w / 2 + 1)) ** 2 + dy * dy * 0.6;
      if (e < 1) shade(L, Math.round(x - w / 2 + dx), y + dy, 0.6);
    }
};

// a sprite stood with its foot at (x, y), on its shadow
const stand = (L: Layer, s: Sprite, x: number, y: number) => {
  const w = s.rows[0].length;
  shadow(L, x, y, w);
  sprite(L, s, Math.round(x - w / 2), y - s.rows.length + 1);
};

// a straight run of pixels from one point to another
const segment = (
  L: Layer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  c: RGB,
  glows: boolean | "evenly" = false,
) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++)
    put(L, x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c, glows);
};

/* ---------- the still parts, drawn once ---------- */

// marks a pixel of open sky, which is left see-through
const SKY_CLEAR = 3;
const r = rand(11);
const STARS = Array.from({ length: 40 }, () => ({
  x: Math.floor(r() * PW),
  y: Math.floor(Math.pow(r(), 1.4) * 64),
  big: r() < 0.12,
  rate: 4 + Math.floor(r() * 9),
}));

const GRASS = ["#3f6a36", "#46753a", "#507f40", "#365c30"].map(hex);
const DIRT = ["#7a5636", "#6a4a2e", "#5c3f27"].map(hex);
const STONE = ["#6c6874", "#5a5664", "#7c7886"].map(hex);

const inPond = (u: number, v: number, grow = 0) =>
  ((u - POND.u) / (POND.ru + grow)) ** 2 +
    ((v - POND.v) / (POND.rv + grow)) ** 2 <
  1;

// the island's sides: grass lip, then earth, then rock, tapering to a point
const depthAt = (x: number) => {
  const t = 1 - Math.abs(x - OX) / (N * 4);
  return Math.round(
    5 + Math.pow(Math.max(t, 0), 1.3) * 12 + hash(x >> 1, 7) * 3,
  );
};

// the tent, pitched round his log: a ridge tent with short walls, its front
// facing you, the doorway tied back, and its right side running off behind
const pitchTent = (L: Layer, canvas: Uint8Array) => {
  const { x: tx, y: ty } = TENT;
  const A = 15; // half its width
  const WALL = 11;
  const PEAK = 24;
  const D: [number, number] = [7, -5]; // how far back it runs
  const CANVAS = hex("#c58844");
  const SEAM = hex("#9a6534");
  const RIDGE = hex("#e4ae6c");
  // the front's outline: up the left wall, to the peak, down the right
  const half = (y: number) => {
    const h = ty - y;
    if (h <= WALL) return A - (h / WALL) * 2;
    return (A - 2) * (1 - (h - WALL) / (PEAK - WALL));
  };
  // and the doorway's, inside it
  const door = (y: number) => {
    const h = ty - y;
    if (h <= 14) return 10;
    return 10 * (1 - (h - 14) / 7);
  };
  // the side running back: wall, then roof, each a slanted band (stepped
  // finely enough back that no grass shows through between the steps)
  const steps = Math.abs(D[1]) * 3;
  for (let k = 0; k <= steps; k++) {
    const ox = Math.round((D[0] * k) / steps);
    const oy = Math.round((D[1] * k) / steps);
    for (let y = ty - PEAK; y <= ty; y++) {
      const w = half(y);
      if (w <= 0) continue;
      const x = Math.round(tx + w) + ox;
      const yy = y + oy;
      const roof = ty - y > WALL;
      for (const xx of [x, x + 1]) {
        put(L, xx, yy, roof ? hex("#a8703a") : hex("#8e5c2e"));
        if (xx >= 0 && xx < PW && yy >= 0) canvas[yy * PW + xx] = 1;
      }
    }
  }
  // the ridge, back from the peak
  segment(L, tx, ty - PEAK, tx + D[0], ty - PEAK + D[1], RIDGE);
  // the front, with a seam down from the peak to each corner, and the
  // doorway dark
  for (let y = ty - PEAK; y <= ty; y++) {
    const w = half(y);
    for (let x = Math.ceil(tx - w); x <= Math.floor(tx + w); x++) {
      const inDoor = Math.abs(x - tx) <= door(y) && ty - y <= 21;
      if (inDoor) {
        // darker toward the back
        put(L, x, y, hex(ty - y < 3 ? "#3a2a1e" : "#2a1e16"));
        continue;
      }
      put(L, x, y, CANVAS);
      canvas[y * PW + x] = 1;
    }
  }
  // the flaps, rolled and tied back either side of the doorway
  for (let y = ty - 14; y <= ty; y++) {
    put(L, tx - 11, y, SEAM);
    put(L, tx + 11, y, SEAM);
    if (y % 3 === 0) {
      put(L, tx - 12, y, RIDGE);
      put(L, tx + 12, y, RIDGE);
    }
  }
  segment(L, tx - 10, ty - 14, tx, ty - 21, SEAM);
  segment(L, tx + 10, ty - 14, tx, ty - 21, SEAM);
  // guy ropes out to their pegs
  segment(L, tx - A, ty - WALL, tx - A - 5, ty + 1, hex("#d8c8a8"));
  segment(L, tx + A + 1, ty - WALL, tx + A + 6, ty, hex("#d8c8a8"));
  put(L, tx - A - 5, ty + 1, hex("#5a3c28"));
  put(L, tx + A + 6, ty, hex("#5a3c28"));
};

// a pixel of a tree, drawn apart so it can sway: where it is, its colour,
// which tree, how far forward that stands, and how far up the tree it is
type Bough = {
  x: number;
  y: number;
  c: RGB;
  tree: number;
  dep: number;
  up: number;
};

const buildStill = (sky: Sky, look: Look, windy = false) => {
  const L = makeLayer();
  const water = new Uint8Array(PW * PH);
  // the tent's canvas, which ripples in the wind
  const canvas = new Uint8Array(PW * PH);
  const boughs: Bough[] = [];
  const night = sky === "night";

  // the sky is left clear: the panel's ground is the sky behind it, so the
  // scene has no edge. at night the moon's halo is drawn, dithered out, and
  // the stars; by day the sun; in the rain neither
  L.lit.fill(SKY_CLEAR);
  L.tag.fill(T_SKY);
  TAG = T_SKY;
  if (night) {
    for (let y = 0; y < PH; y++)
      for (let x = 0; x < PW; x++) {
        const md = Math.hypot(x - MOON.x - 5, y - MOON.y - 5);
        if (md < 16 && bayer(x, y) < (1 - md / 16) * 0.8)
          put(L, x, y, hex(md < 9 ? "#2c3266" : "#20264f"), true);
      }
    for (const s of STARS) put(L, s.x, s.y, hex("#8a90b8"), true);

    // the dark of the moon, and the lit crescent over it
    for (let y = 0; y < 11; y++)
      for (let x = 0; x < 11; x++)
        if (Math.hypot(x - 5, y - 5) < 5.4)
          put(L, MOON.x + x, MOON.y + y, hex("#232850"), true);
    MOON_ROWS.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === "M")
          put(L, MOON.x + x, MOON.y + y, hex("#f4ecd2"), true);
        if (row[x] === "m")
          put(L, MOON.x + x, MOON.y + y, hex("#b8b4a8"), true);
      }
    });
  }
  if (sky === "day")
    for (let y = 0; y < 11; y++)
      for (let x = 0; x < 11; x++) {
        const d = Math.hypot(x - 5, y - 5);
        if (d < 5.4)
          put(
            L,
            MOON.x + x,
            MOON.y + y,
            hex(d < 3.6 ? "#fff8dc" : d < 4.6 ? "#ffeaa8" : "#ffd97a"),
            true,
          );
      }
  TAG = 0;

  // the sides, first, so the top can lap over their edge
  for (let x = OX - N * 4; x < OX + N * 4; x++) {
    const left = x < OX;
    const edge = left ? OY + 4 * N + (x - OX) / 2 : OY + 4 * N - (x - OX) / 2;
    const depth = depthAt(x);
    for (let k = -1; k <= depth; k++) {
      const y = Math.floor(edge) + k;
      let c: RGB;
      if (k <= 0) c = hex("#5f9046");
      else if (k === 1) c = hash(x, y) < 0.5 ? GRASS[3] : DIRT[0];
      else if (k < 6) c = DIRT[Math.floor(hash(x, y, 2) * 3)];
      else c = STONE[Math.floor(hash(x >> 1, y, 3) * 3)];
      if (k === depth) c = STONE[1];
      put(L, x, y, c);
      if (!left) shade(L, x, y, 0.72);
    }
    // the odd root hanging off the bottom
    if (hash(x, 99) < 0.08)
      for (let k = 1; k <= 1 + hash(x, 98) * 4; k++)
        put(L, x, Math.floor(edge) + depth + k, hex("#3a2a1e"));
  }

  // the top: grass in tiles, a scuffed patch round the fire, the pond
  for (let y = OY - 1; y < OY + 4 * N + 1; y++)
    for (let x = OX - N * 4; x < OX + N * 4; x++) {
      const a = (x + 0.5 - OX) / 4;
      const b = (y + 0.5 - OY) / 2;
      const u = (a + b) / 2;
      const v = (b - a) / 2;
      if (u < 0 || v < 0 || u >= N || v >= N) continue;
      if (inPond(u, v)) {
        // deeper toward the middle; lighter near the far bank, where it
        // catches the sky
        const d = ((u - POND.u) / POND.ru) ** 2 + ((v - POND.v) / POND.rv) ** 2;
        const far = (POND.u + POND.v - u - v) / 4;
        const i = Math.max(
          0,
          Math.min(3, Math.floor((1 - d) * 1.6 + far * 1.4 + bayer(x, y))),
        );
        TAG = T_POND;
        put(L, x, y, look.water[i], true);
        TAG = 0;
        water[y * PW + x] = 1;
        continue;
      }
      if (inPond(u, v, 0.45)) {
        TAG = T_POND;
        put(L, x, y, STONE[Math.floor(hash(x, y, 5) * 3)]);
        TAG = 0;
        continue;
      }
      const fire = Math.hypot(u - FIRE.u, v - FIRE.v);
      let c = GRASS[Math.floor(hash(x, y) * 3)];
      if ((Math.floor(u) + Math.floor(v)) % 2)
        c = c.map((n) => n * 0.93) as RGB;
      if (hash(x, y, 1) > 0.94) c = GRASS[3];
      if (fire < 1 + hash(x, y, 4) * 0.45)
        c = DIRT[1 + Math.floor(hash(x, y, 6) * 2)];
      if (hash(x, y, 8) > 0.996)
        c = hex(hash(x, y, 9) < 0.5 ? "#a8a488" : "#9a5a58");
      put(L, x, y, c);
    }

  // lily pads
  TAG = T_POND;
  for (const [u, v] of [
    [12.4, 2.6],
    [14.4, 4],
    [14.8, 1.8],
  ]) {
    const [x, y] = iso(u, v);
    put(L, x, y, hex("#3c6a3c"));
    put(L, x + 1, y, hex("#4c7c44"));
  }
  TAG = 0;

  // him, as he is: on his log by the fire (in his tent's mouth if it's
  // raining), or on his crate by the pond
  const man: [number, () => void][] =
    sky === "day"
      ? [
          [
            ANGLER.y + 12,
            () => {
              TAG = T_MAN;
              shadow(L, ANGLER.x + 6, ANGLER.y + 13, 12);
              sprite(L, CRATE, ANGLER.x + 1, ANGLER.y + 9);
              figure(L, flip(BODY), ANGLER.x, ANGLER.y, "t");
              stand(L, BUCKET, ANGLER.x + 17, ANGLER.y + 17);
              TAG = 0;
            },
          ],
        ]
      : [
          [
            MY,
            () => {
              if (sky !== "night") pitchTent(L, canvas);
              // his shadow, thrown away from the fire
              else
                for (let dx = 0; dx < 16; dx++)
                  for (let dy = -1; dy <= 1; dy++)
                    if ((dx / 16) ** 2 + dy * dy * 0.7 < 1)
                      shade(L, MX + 6 + dx, MY + dy, 0.55);
              TAG = T_MAN;
              sprite(L, LOG, MX + 3, MY - 5);
              figure(L, night ? BODY : BODY_MUG, MX - 1, MY - 12, "t");
              TAG = 0;
            },
          ],
        ];

  // everything stood on the island, back to front
  const things: [number, () => void][] = [
    ...(
      [
        [PINE, 0.6, 0.9],
        [SPRUCE, 2.6, 1.8],
        [SPRUCE, 1, 3.6],
        [PINE, 1.8, 6.6],
        [SPRUCE, 0.8, 9.4],
        [PINE, 1.5, 12.2],
        [PINE, 0.8, 15.2],
        [SPRUCE, 3.4, 15],
        [SPRUCE, 6.2, 1],
        [PINE, 9.6, 0.9],
        [PINE, 16.2, 0.7],
        [SPRUCE, 15.6, 14.6],
        [ROCK, 15, 11.4],
        [ROCK, 6, 14],
        [ROCK, 4.4, 2.6],
        [ROCK, 11, 12.2],
      ] as [Sprite, number, number][]
    ).map(([s, u, v], tree) => {
      const [x, y] = iso(u, v);
      // in the wind, the trees are left for the moving parts to draw,
      // swaying; only their shadows stay
      if (windy && s !== ROCK) {
        const w = s.rows[0].length;
        const x0 = Math.round(x - w / 2);
        const y0 = y - s.rows.length + 1;
        s.rows.forEach((row, dy) => {
          for (let dx = 0; dx < w; dx++) {
            const c = s.pal[row[dx]];
            if (c)
              boughs.push({
                x: x0 + dx,
                y: y0 + dy,
                c: hex(c),
                tree,
                dep: y,
                up: 1 - dy / (s.rows.length - 1),
              });
          }
        });
        return [y, () => shadow(L, x, y, w)] as [number, () => void];
      }
      return [y, () => stand(L, s, x, y)] as [number, () => void];
    }),
    ...BUSHES.map(
      ([x, y], i) =>
        [
          y,
          () => {
            TAG = T_BUSH + i;
            stand(L, BUSH, x, y);
            TAG = 0;
          },
        ] as [number, () => void],
    ),
    ...man,
  ];
  things
    .sort((p, q) => p[0] - q[0])
    .forEach(([y, draw]) => {
      DEPTH = y;
      draw();
    });
  DEPTH = -1;

  // at night, the stick, from his hand down into the coals
  if (night) {
    const hand = { x: MX, y: MY - 7 };
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      put(
        L,
        hand.x + (FX + 3 - hand.x) * t,
        hand.y + (FY - 2 - hand.y) * t,
        hex("#7a5434"),
      );
    }
  }

  boughs.sort((p, q) => p.dep - q.dep);
  return { still: L, water, canvas, boughs };
};

/* ---------- the moving parts ---------- */

// the fire: heat at the bottom, carried up a row a tick, drifting and
// cooling as it goes, faster at the edges, so it keeps a flame's shape
const FW = 11;
const FH = 16;
const FIRE_COLOURS: [number, RGB][] = (
  [
    [0.8, "#fff3c6"],
    [0.64, "#ffd45e"],
    [0.47, "#ff9a2e"],
    [0.31, "#e8561e"],
    [0.17, "#a2301a"],
  ] as const
).map(([t, c]) => [t, hex(c)]);

type Firefly = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  // where an old one keeps drifting back to; a new one just wanders off
  home?: [number, number];
};
type Puff = { x: number; y: number; life: number };
type Ripple = { x: number; y: number; r: number; max: number };

// by day, the line: waiting on a bite, the float twitching, the strike, a
// fish reeled in (or not) and dropped in the bucket, and the cast again
type Line = {
  phase: "wait" | "nibble" | "strike" | "reel" | "land" | "cast";
  t: number;
  // how long this wait lasts, and whether this one's caught
  until: number;
  caught: boolean;
};

const makeWorld = (mood: Mood) => {
  const scene: Scene = sceneOf(mood);
  const sky = (mood.wet ? `rain-${mood.time}` : mood.time) as Sky;
  const look = LOOKS[sky];
  const night = scene === "night";
  const day = scene === "day";
  const rain = scene === "rain";
  const { still, water, canvas, boughs } = buildStill(sky, look, mood.storm);
  // the tent's canvas showing (not behind him, or anything in front)
  const sheet: number[] = [];
  for (let i = 0; i < PW * PH; i++)
    if (canvas[i] && still.tag[i] === 0 && still.dep[i] === MY) sheet.push(i);
  const L = makeLayer();
  const heat = new Float32Array(FW * FH);
  const embers: Puff[] = [];
  const smoke: (Puff & { steam?: boolean })[] = [];
  const ripples: Ripple[] = [];
  const fish: { x: number; y: number; t: number }[] = [];
  const falling: { x: number; y: number; t: number }[] = [];
  const birds: { x: number; y: number; t: number }[] = [];
  const zs: Puff[] = [];
  const flies: Firefly[] = night
    ? [
        [PX - 10, PY + 6],
        [PX + 8, PY + 2],
        [BUSHES[1][0], BUSHES[1][1] - 6],
      ].map(([x, y]) => ({ x, y, vx: 0, vy: 0, life: Infinity, home: [x, y] }))
    : [];
  // by day: butterflies (the first is the one he's after), in tiles, with
  // how high it's flying in pixels
  const butterflies = day
    ? [{ u: 6.2, v: 11.6, h: 6, vu: 0, vv: 0, life: Infinity }]
    : [];
  // and the pug, after it
  const pug = { u: 4.6, v: 12.6, face: 1, hop: 0, step: 0 };
  // in the rain: the drops, and the splashes where they land
  const drops = rain
    ? Array.from({ length: mood.storm ? 90 : 64 }, () => ({
        x: Math.random() * (PW + 30),
        y: Math.random() * PH,
        to: 20 + Math.random() * (PH - 20),
      }))
    : [];
  const splashes: { x: number; y: number; t: number }[] = [];
  const steam: Puff[] = [];
  // (by day; in the rain the sky's all cloud as it is)
  const clouds = (
    day
      ? [
          [8, 12, 20],
          [64, 6, 14],
          [126, 22, 10],
        ]
      : []
  ).map(([x, y, w], i) => ({ x, y, px: cloud(i + 3, w), w }));
  const line: Line = { phase: "wait", t: 0, until: 60, caught: false };
  let tick = 0;
  let flicker = 1;
  // a fresh log or a poke: the fire stands up taller and wider, throws a
  // burst of sparks and more light, then settles back over a few seconds
  let boost = 0;
  // what the pointer's over, and until when he's looking up / the pug's awake
  let hovered = 0;
  let looking = 0;
  let awake = 0;
  // in the rain: when he next sips, and a flash of lightning's frames left
  let sip = 30;
  // in a storm, the wind: it comes in gusts, easing toward each new one
  let wind = mood.storm ? 0.8 : 0;
  let gustTo = wind;
  // how far the lantern has swung, in pixels either side
  const swing = () =>
    mood.storm ? Math.sin(tick * 0.55) * (0.5 + wind * 1.1) : 0;
  let flash = 0;
  let bolt: [number, number][] = [];

  // the fire burns at night; by day it's coals until poked; in the rain
  // it's out
  const fuel = night ? 1 : 0;
  const stepFire = () => {
    const burn = Math.max(fuel, day ? Math.min(1, boost * 1.6) : 0);
    for (let x = 0; x < FW; x++)
      heat[(FH - 1) * FW + x] =
        burn && x > 2 - Math.round(boost) && x < FW - 3 + Math.round(boost)
          ? (0.85 + Math.random() * 0.15) * (1 + boost * 0.3) * burn
          : 0;
    for (let y = 0; y < FH - 1; y++)
      for (let x = 0; x < FW; x++) {
        const from = Math.min(
          FW - 1,
          Math.max(0, x + Math.floor(Math.random() * 3) - 1),
        );
        const edge = Math.abs(x - (FW - 1) / 2) / ((FW - 1) / 2);
        heat[y * FW + x] = Math.max(
          0,
          heat[(y + 1) * FW + from] -
            Math.random() * 0.1 -
            edge * edge * 0.1 -
            0.008,
        );
      }
  };
  for (let i = 0; i < 30; i++) stepFire();

  // where the line runs from: his hand, and the rod's tip
  const HAND = { x: ANGLER.x + 14, y: ANGLER.y + 5 };
  const tip = () =>
    line.phase === "strike" || line.phase === "reel"
      ? { x: HAND.x + 7, y: HAND.y - 13 }
      : { x: HAND.x + 10, y: HAND.y - 10 };

  const stepLine = () => {
    line.t++;
    const next = (phase: Line["phase"]) => {
      line.phase = phase;
      line.t = 0;
    };
    if (line.phase === "wait" && line.t > line.until) {
      next("nibble");
      line.caught = Math.random() < 0.55;
    } else if (line.phase === "nibble") {
      if (line.t % 4 === 1)
        ripples.push({ x: FLOAT.x, y: FLOAT.y, r: 0, max: 2.5 });
      if (line.t > 14) next("strike");
    } else if (line.phase === "strike" && line.t > 4)
      next(line.caught ? "reel" : "cast");
    else if (line.phase === "reel" && line.t > 12) next("land");
    else if (line.phase === "land" && line.t > 8) next("cast");
    else if (line.phase === "cast" && line.t > 8) {
      ripples.push({ x: FLOAT.x, y: FLOAT.y, r: 0, max: 4 });
      next("wait");
      line.until = 60 + Math.floor(Math.random() * 110);
    }
  };

  const stepCat = () => {
    const b = butterflies[0];
    if (!b) return;
    // the butterfly: wandering, kept over the yard, bobbing as it flaps
    for (const f of butterflies) {
      f.vu = Math.max(
        -0.09,
        Math.min(0.09, f.vu + (Math.random() - 0.5) * 0.05),
      );
      f.vv = Math.max(
        -0.09,
        Math.min(0.09, f.vv + (Math.random() - 0.5) * 0.05),
      );
      if (f.life === Infinity) {
        if (f.u < YARD.u0) f.vu += 0.02;
        if (f.u > YARD.u1) f.vu -= 0.02;
        if (f.v < YARD.v0) f.vv += 0.02;
        if (f.v > YARD.v1) f.vv -= 0.02;
        f.h = Math.max(3, Math.min(11, f.h + (Math.random() - 0.5) * 1.6));
      } else {
        f.h += 0.4;
        f.life -= 1;
      }
      f.u += f.vu;
      f.v += f.vv;
    }
    for (let i = butterflies.length - 1; i > 0; i--)
      if (butterflies[i].life <= 0) butterflies.splice(i, 1);
    // the pug: sat looking at you for a moment if poked; otherwise after it
    if (tick < awake) return;
    // (a pounce never carries him out of the yard, into the fire pit)
    const keep = () => {
      pug.u = Math.max(YARD.u0, Math.min(YARD.u1, pug.u));
      pug.v = Math.max(YARD.v0, Math.min(YARD.v1, pug.v));
    };
    if (pug.hop) {
      pug.hop--;
      pug.u += (b.u - pug.u) * 0.18;
      pug.v += (b.v - pug.v) * 0.18;
      return keep();
    }
    const du = b.u - pug.u;
    const dv = b.v - pug.v;
    const d = Math.hypot(du, dv);
    const sx = (du - dv) * 4;
    if (Math.abs(sx) > 0.6) pug.face = sx > 0 ? 1 : -1;
    if (d < 0.9 && b.h < 8 && Math.random() < 0.2) {
      pug.hop = 6;
      // and off it goes, just out of reach
      b.vu += (Math.random() - 0.5) * 0.3;
      b.vv += (Math.random() - 0.5) * 0.3;
      b.h += 4;
    } else if (d > 0.5) {
      pug.u += (du / d) * 0.07;
      pug.v += (dv / d) * 0.07;
      pug.step++;
    }
    keep();
  };

  const strike = () => {
    flash = 5;
    let x = 20 + Math.random() * 110;
    let y = 0;
    bolt = [];
    while (y < 26 + Math.random() * 10) {
      bolt.push([Math.round(x), y]);
      y++;
      if (Math.random() < 0.4) x += Math.random() < 0.5 ? -1 : 1;
    }
  };

  const step = () => {
    tick++;
    boost = Math.max(0, boost - 0.025);
    flash = Math.max(0, flash - 1);
    stepFire();
    flicker = Math.min(
      1.1,
      Math.max(0.82, flicker + (Math.random() - 0.5) * 0.12),
    );
    if (Math.random() < (night ? 0.35 : 0) + boost * 0.5)
      embers.push({
        x: FX + Math.round((Math.random() - 0.5) * 6),
        y: FY - 10,
        life: 10 + Math.random() * 10,
      });
    // smoke off the fire; by day a thread of it off the coals
    if (!rain && tick % (night ? 5 : 7) === 0)
      smoke.push({
        x: FX + Math.round((Math.random() - 0.5) * 3),
        y: FY - (night ? 15 : 3),
        life: night ? 36 : 30,
      });
    if (!day && tick > awake && tick % 22 === 0)
      zs.push(
        night
          ? { x: CX + 2, y: CY - 8, life: 16 }
          : { x: RAIN_PUG.x - 3, y: RAIN_PUG.y - 8, life: 16 },
      );
    // now and then, without being asked
    if (night && Math.random() < 0.003)
      falling.push({
        x: 50 + Math.floor(Math.random() * (PW - 50)),
        y: 2 + Math.floor(Math.random() * 16),
        t: 0,
      });
    if (day && Math.random() < 0.004)
      birds.push({ x: -4, y: 8 + Math.random() * 20, t: 0 });
    if (mood.storm && !flash && Math.random() < 0.006) strike();
    if (mood.storm) {
      if (tick % 24 === 0) gustTo = 0.3 + Math.random() * 1.1;
      wind += (gustTo - wind) * 0.08;
    }

    if (day) {
      stepLine();
      stepCat();
    }
    if (rain) {
      for (const d of drops) {
        d.x -= 1 + wind * 2;
        d.y += 4;
        const x = Math.round(d.x);
        const y = Math.round(d.y);
        // landing: rings on the pond, a splash on the ground; over open
        // sky it just keeps falling
        if (y >= d.to && x >= 0 && x < PW && y < PH) {
          const i = y * PW + x;
          if (water[i]) {
            ripples.push({ x, y, r: 0, max: 2.5 });
            d.y = PH + 10;
          } else if (still.lit[i] !== SKY_CLEAR) {
            if (Math.random() < 0.5) splashes.push({ x, y, t: 0 });
            d.y = PH + 10;
          }
        }
        if (d.y > PH + 4) {
          d.x = Math.random() * (PW + 30 + wind * 40);
          d.y = -Math.random() * 20;
          d.to = 20 + Math.random() * (PH - 20);
        }
      }
      for (const s of splashes) s.t += 1;
      // he sips now and then, and his coffee steams between
      if (tick > sip + 10) sip = tick + 40 + Math.floor(Math.random() * 40);
      if (tick < sip && tick % 3 === 0)
        steam.push({
          x: MX - 1 + Math.round(Math.random()),
          y: MY - 11,
          life: 9,
        });
    }
    for (const c of clouds)
      if (tick % 9 === 0) c.x = c.x > PW + 10 ? -c.w - 10 : c.x + 1;

    for (const e of embers) {
      e.y -= 1;
      if (Math.random() < 0.3) e.x += Math.random() < 0.5 ? -1 : 1;
      e.life -= 1;
    }
    for (const s of smoke) {
      if (tick % 2 || s.steam) s.y -= 1;
      if (Math.random() < 0.18) s.x += 1;
      s.life -= 1;
    }
    for (const s of steam) {
      if (tick % 2) s.y -= 1;
      if (Math.random() < 0.25) s.x += Math.random() < 0.5 ? -1 : 1;
      s.life -= 1;
    }
    for (const z of zs) {
      if (tick % 2) z.y -= 1;
      z.life -= 1;
    }
    for (const p of ripples) p.r += 0.45;
    for (const f of fish) {
      f.t += 1;
      if (f.t === 10) ripples.push({ x: f.x + 7, y: f.y, r: 0, max: 6 });
    }
    for (const s of falling) s.t += 1;
    for (const b of birds) {
      b.x += 1.5;
      b.t += 1;
    }
    for (const f of flies) {
      f.vx = Math.max(-0.6, Math.min(0.6, f.vx + (Math.random() - 0.5) * 0.3));
      f.vy = Math.max(-0.4, Math.min(0.4, f.vy + (Math.random() - 0.5) * 0.24));
      if (f.home) {
        f.vx += (f.home[0] - f.x) * 0.01;
        f.vy += (f.home[1] - f.y) * 0.01;
      } else f.vy -= 0.015;
      f.x += f.vx;
      f.y += f.vy;
      f.life -= 1;
    }

    const prune = <T,>(list: T[], gone: (t: T) => boolean) => {
      for (let i = list.length - 1; i >= 0; i--)
        if (gone(list[i])) list.splice(i, 1);
    };
    for (const list of [embers, smoke, steam, zs, flies])
      prune(list, (p) => p.life <= 0);
    prune(ripples, (p) => p.r > p.max);
    prune(fish, (f) => f.t > 10);
    prune(falling, (s) => s.t > 12);
    prune(birds, (b) => b.x > PW + 4);
    prune(splashes, (s) => s.t > 1);
  };

  // where the light comes from: the fire at night (and by day while it's
  // poked up), the lantern in the rain
  const source = () => {
    if (rain)
      return {
        // (its light rocks with it, further than the lantern moves: the
        // pool of light swings wider across the ground than it does up here)
        x: LAMP.x + swing() * 3,
        y: LAMP.y + 3,
        reach: (sky === "rain-night" ? 44 : 30) * (0.96 + flicker * 0.04),
        flk: 0.94 + (flicker - 0.82) * 0.3,
      };
    const reach = night
      ? 60 * flicker * (1 + boost * 0.35)
      : 34 * Math.min(1, boost * 1.4);
    return reach > 0 ? { x: FX, y: FY - 5, reach, flk: flicker } : null;
  };

  // the pug by day: where he is on screen, as drawn
  const pugAt = () => {
    const [x, y] = iso(pug.u, pug.v);
    const lift = pug.hop
      ? Math.round(Math.sin((Math.PI * pug.hop) / 6) * 4)
      : 0;
    return { x, y, lift };
  };

  const render = (out: Uint8ClampedArray, talking: boolean) => {
    L.col.set(still.col);
    L.lit.set(still.lit);
    L.tag.set(still.tag);
    L.dep.set(still.dep);

    if (mood.storm) {
      TAG = 0;
      // the tent's canvas rippling in the gusts: bands of it caught light,
      // then shade, running across with the wind
      for (const i of sheet) {
        const x = i % PW;
        const y = (i - x) / PW;
        const w =
          Math.sin(x * 0.55 + y * 0.3 + tick * 0.9) * (0.4 + wind * 0.6);
        const d = bayer(x, y) * 0.3;
        if (w > 0.55 + d) shade(L, x, y, 1.14);
        else if (w < -0.55 - d) shade(L, x, y, 0.82);
      }
      // and a corner of the door flap come loose, lifting in the gusts
      DEPTH = MY;
      for (let j = 0; j < 4; j++) {
        const lift = wind * (0.8 + Math.sin(tick * 1.1 + j) * 0.4);
        put(
          L,
          TENT.x - 12 - j,
          TENT.y - 13 + Math.round(j * (1.3 - lift)),
          hex(j ? "#c58844" : "#9a6534"),
        );
      }
      // the trees, swaying with it, each at its own pace, more toward
      // the top (and never in front of what they're behind)
      for (const b of boughs) {
        const sway = wind * (1.1 + 0.5 * Math.sin(tick * 0.5 + b.tree * 1.7));
        const x = Math.round(b.x - sway * b.up ** 1.5 * 1.8);
        if (x < 0 || x >= PW) continue;
        const i = b.y * PW + x;
        if (L.dep[i] > b.dep) continue;
        DEPTH = b.dep;
        put(L, x, b.y, b.c);
      }
      DEPTH = -1;
    }
    const open = (x: number, y: number) =>
      x >= 0 &&
      y >= 0 &&
      x < PW &&
      y < PH &&
      still.tag[y * PW + x] === T_SKY &&
      still.lit[y * PW + x] === SKY_CLEAR;

    TAG = T_SKY;
    // stars blink, each at its own pace
    if (night)
      for (const s of STARS) {
        // (unless something's stood in front of it)
        if (L.lit[s.y * PW + s.x] % SKY_CLEAR) continue;
        const on = hash(s.x, Math.floor(tick / s.rate), 3) > 0.25;
        const c = hex(on ? (s.big ? "#fff8e4" : "#c8cce8") : "#4a5078");
        put(L, s.x, s.y, c, true);
        if (s.big && on && hash(s.x, Math.floor(tick / s.rate), 4) > 0.5)
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ])
            put(L, s.x + dx, s.y + dy, hex("#6a70a0"), true);
      }

    // clouds drifting over, only ever over open sky
    for (const c of clouds)
      for (const [dx, dy, under] of c.px) {
        const x = Math.round(c.x + dx);
        const y = c.y + dy;
        if (!open(x, y)) continue;
        put(L, x, y, hex(under ? "#dbe8f2" : "#ffffff"), true);
      }

    // shooting stars, birds and lightning, only ever over open sky too
    for (const s of falling) {
      const hx = s.x - 2 * s.t;
      const hy = s.y + s.t;
      for (let j = s.t > 8 ? 1 : 0; j < 6; j++) {
        const x = hx + 2 * j;
        const y = hy - j;
        if (!open(x, y)) continue;
        const c = ["#fff8e4", "#e8e4f4", "#b4b8dc", "#8a90c0", "#5a6094"][
          Math.min(4, j)
        ];
        put(L, x, y, hex(c), true);
      }
    }
    for (const b of birds) {
      const up = Math.floor(b.t / 3) % 2;
      for (const [dx, dy] of [
        [0, 0],
        [-1, up ? -1 : 0],
        [1, up ? -1 : 0],
        [-2, up ? -1 : 1],
        [2, up ? -1 : 1],
      ])
        if (open(Math.round(b.x) + dx, Math.round(b.y) + dy))
          put(L, b.x + dx, b.y + dy, hex("#34404e"), true);
    }
    if (flash > 2)
      for (const [x, y] of bolt)
        if (open(x, y)) put(L, x, y, hex("#f4f6ff"), true);

    // light glinting on the pond (the moon's at night, the sun's by day),
    // and rings where something went in
    TAG = T_POND;
    // (the moon's in a column under it; the sun's scattered all over)
    if (!rain)
      for (let y = PY - 8; y < PY + 8; y++)
        for (let x = PX - 20; x < PX + 20; x++) {
          if (!water[y * PW + x]) continue;
          if (night && Math.abs(x - PX + 2) > 2 + (y - PY + 6) * 0.5) continue;
          if (hash(x, y, Math.floor(tick / 3)) > (day ? 0.965 : 0.9))
            put(L, x, y, hex(day ? "#e8f6ff" : "#b8c6ea"), true);
        }
    const ring = day
      ? ["#cfe6f6", "#9cc8e6", "#7ab0d8"]
      : rain
        ? sky === "rain-day"
          ? ["#a8b8c6", "#7e92a4", "#627688"]
          : ["#56688a", "#3e5070", "#2e3e5c"]
        : ["#8aa2d0", "#5a76aa", "#3e5688"];
    for (const p of ripples) {
      const k = Math.max(10, Math.round(p.r * 7));
      for (let j = 0; j < k; j++) {
        const a = (j / k) * Math.PI * 2;
        const x = Math.round(p.x + Math.cos(a) * p.r * 1.2);
        const y = Math.round(p.y + Math.sin(a) * p.r * 0.6);
        if (x < 0 || y < 0 || x >= PW || y >= PH || !water[y * PW + x])
          continue;
        put(
          L,
          x,
          y,
          hex(p.r < 2.5 ? ring[0] : p.r < 4.5 ? ring[1] : ring[2]),
          true,
        );
      }
    }
    for (const f of fish) {
      const x = f.x + f.t * 0.7;
      const y = f.y - Math.sin((Math.PI * f.t) / 10) * 6;
      put(L, x, y, hex("#c4ccdc"), true);
      put(L, x - 1, y + (f.t < 5 ? 1 : -1), hex("#8a96ac"), true);
    }
    TAG = 0;

    // his head, nodding while he talks, or looking up when poked
    const up = tick < looking ? 1 : 0;
    const nod = !up && talking && Math.floor(tick / 3) % 2 ? 1 : 0;
    TAG = T_MAN;
    if (day)
      figure(L, flip(HEAD), ANGLER.x + nod, ANGLER.y - 6 + nod - up, "b");
    else figure(L, HEAD, MX - 1 - nod, MY - 18 + nod - up, "b");

    if (day) {
      // the rod, and the line off its tip: slack to the float while he
      // waits, taut while he strikes, a fish on it while he reels in
      const t = tip();
      segment(L, HAND.x, HAND.y, t.x, t.y, hex("#6a4a30"), "evenly");
      const silk = hex("#d8dce4");
      const lw = line.phase;
      if (lw === "wait" || lw === "nibble") {
        const dip = lw === "nibble" && line.t % 4 < 2 ? 1 : 0;
        const fy = FLOAT.y + dip;
        for (let i = 0; i <= 16; i++) {
          const s = i / 16;
          put(
            L,
            t.x + (FLOAT.x - t.x) * s,
            t.y + (fy - t.y) * s + Math.sin(Math.PI * s) * 3,
            silk,
            true,
          );
        }
        TAG = T_POND;
        put(L, FLOAT.x, fy - 1, hex("#e8463a"), true);
        if (!dip) put(L, FLOAT.x, fy - 2, hex("#f4f0e8"), true);
        TAG = T_MAN;
      } else if (lw === "strike") {
        const k = line.t / 4;
        const fx = FLOAT.x + (t.x - FLOAT.x) * k * 0.3;
        const fy = FLOAT.y + (t.y - FLOAT.y) * k * 0.3;
        segment(L, t.x, t.y, fx, fy, silk, true);
        put(L, fx, fy - 1, hex("#e8463a"), true);
      } else if (lw === "reel") {
        const k = line.t / 12;
        const fx = Math.round(FLOAT.x + (t.x + 1 - FLOAT.x) * (0.3 + k * 0.7));
        const fy = Math.round(FLOAT.y + (t.y + 6 - FLOAT.y) * (0.3 + k * 0.7));
        segment(L, t.x, t.y, fx, fy, silk, true);
        // the fish, wriggling
        const w = line.t % 2;
        put(L, fx, fy + 1, hex("#c8d2de"), "evenly");
        put(L, fx, fy + 2, hex("#a8b4c4"), "evenly");
        put(L, fx + (w ? 1 : -1), fy + 3, hex("#8a96ac"), "evenly");
      } else if (lw === "land") {
        // swung down into the bucket at his feet
        const k = line.t / 8;
        const bx = ANGLER.x + 17;
        const by = ANGLER.y + 12;
        const fx = t.x + (bx - t.x) * k;
        const fy = t.y + 6 + (by - t.y - 6) * k - Math.sin(Math.PI * k) * 6;
        segment(L, t.x, t.y, fx, fy - 1, silk, true);
        put(L, fx, fy, hex("#c8d2de"), "evenly");
        put(L, fx, fy + 1, hex("#a8b4c4"), "evenly");
      } else {
        // the cast: the float flying out
        const k = line.t / 8;
        const fx = t.x + (FLOAT.x - t.x) * k;
        const fy = t.y + (FLOAT.y - t.y) * k - Math.sin(Math.PI * k) * 8;
        segment(L, t.x, t.y, fx, fy, silk, true);
        put(L, fx, fy, hex("#e8463a"), true);
      }
      TAG = 0;
    }

    if (rain) {
      // his mug, held in front of him, or up at his mouth for a sip
      const sipping = tick >= sip;
      const m = sipping ? { x: MX + 1, y: MY - 14 } : { x: MX - 1, y: MY - 11 };
      TAG = T_MAN;
      // (blue enamel, its rim chipped white)
      const MUG = hex("#3f6aa6");
      const RIM = hex("#e6e0d2");
      put(L, m.x, m.y, RIM, "evenly");
      put(L, m.x + 1, m.y, RIM, "evenly");
      for (let dy = 1; dy <= 2; dy++) {
        put(L, m.x, m.y + dy, MUG, "evenly");
        put(L, m.x + 1, m.y + dy, MUG, "evenly");
      }
      // his hand round it, and his sleeve back to his shoulder
      put(L, m.x + 2, m.y + 1, hex(MAN_PAL.s), "evenly");
      put(L, m.x + 2, m.y + 2, hex(MAN_PAL.s), "evenly");
      segment(L, m.x + 3, m.y + 2, MX + 4, MY - 7, hex(MAN_PAL.a), "evenly");
      TAG = 0;
    }

    // the pug: asleep by the fire, or up for a moment, wagging his tail
    // (at night); out chasing a butterfly (by day); curled in his lap (in
    // the rain)
    const roused =
      tick < awake
        ? Math.floor(tick / 4) % 2
          ? PUG_SIT.lookWag
          : PUG_SIT.look
        : null;
    if (night) {
      const s = roused ?? PUG_ASLEEP;
      TAG = 0;
      shadow(L, CX, CY, 9);
      TAG = T_PUG;
      figure(L, s, CX - 5, CY - s.rows.length + 1);
    } else if (rain) {
      // curled on the doorstep against his boots
      const s = roused ?? PUG_ASLEEP;
      TAG = T_PUG;
      figure(L, s, RAIN_PUG.x - 5, RAIN_PUG.y - s.rows.length + 1);
    } else {
      const { x, y, lift } = pugAt();
      const pose =
        roused ??
        (pug.hop ? PUG_POUNCE : PUG_TROT[Math.floor(pug.step / 2) % 2]);
      const s = pug.face < 0 && !roused ? flip(pose) : pose;
      const w = s.rows[0].length;
      TAG = 0;
      shadow(L, x, y, w - 2);
      TAG = T_PUG;
      figure(L, s, Math.round(x - w / 2), y - lift - s.rows.length + 1);
    }
    TAG = 0;
    for (const z of zs)
      Z.forEach((row, dy) => {
        for (let dx = 0; dx < 3; dx++)
          if (row[dx] === "z" && bayer(z.x + dx, z.y + dy) < z.life / 16)
            put(L, z.x + dx, z.y + dy, hex("#7a84b0"), true);
      });

    // the fire's bed: stones behind, crossed logs and coals, the flames,
    // and the stones in front. in the rain the logs are dark and wet, and
    // the coals out
    const stones = [
      [-6, -1],
      [-4, -2],
      [-1, -3],
      [2, -3],
      [5, -2],
      [7, -1],
      [-6, 1],
      [-3, 2],
      [0, 2],
      [3, 2],
      [6, 1],
    ];
    for (const [dx, dy] of stones.filter(([, dy]) => dy < 0)) {
      put(L, FX + dx, FY + dy, hex("#787480"));
      put(L, FX + dx + 1, FY + dy, hex("#5a5662"));
    }
    for (let i = -4; i <= 4; i++) {
      put(L, FX + i, FY - Math.round(i / 3), hex(rain ? "#3a2a20" : "#5a3a24"));
      put(L, FX + i, FY + Math.round(i / 3), hex(rain ? "#2e221a" : "#4a2e1c"));
      if (!rain && hash(i, tick >> 2, 7) > (night ? 0.55 : 0.8))
        put(L, FX + i, FY, hex(night ? "#ff7a2a" : "#d8541e"), true);
    }
    // (the bottom row is the fuel; it isn't drawn)
    for (let y = 0; y < FH - 1; y++)
      for (let x = 0; x < FW; x++) {
        const h = heat[y * FW + x];
        const c = FIRE_COLOURS.find(([t]) => h > t);
        if (c) put(L, FX - (FW >> 1) + x, FY - FH + y + 2, c[1], true);
      }
    for (const [dx, dy] of stones.filter(([, dy]) => dy > 0)) {
      put(L, FX + dx, FY + dy, hex("#8a8692"));
      put(L, FX + dx + 1, FY + dy, hex("#64606c"));
    }

    // smoke, thinning as it rises (and steam, off wet logs or his coffee);
    // embers, cooling as they go; fireflies, blinking on and off
    const SMOKE = hex(day ? "#bcb8b4" : "#8c8a9c");
    const STEAM = hex(sky === "rain-night" ? "#9a96a4" : "#e4e2de");
    for (const s of smoke)
      for (const [dx, dy] of [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
        if (bayer(s.x + dx, s.y + dy) < (s.life / 36) * (s.steam ? 0.8 : 0.55))
          put(L, s.x + dx, s.y + dy, s.steam ? STEAM : SMOKE, !!s.steam);
    for (const s of steam)
      if (bayer(s.x, s.y) < s.life / 11) put(L, s.x, s.y, STEAM, true);
    for (const e of embers)
      put(
        L,
        e.x,
        e.y,
        hex(e.life > 10 ? "#ffd25a" : e.life > 5 ? "#ff8a2e" : "#a8381a"),
        true,
      );
    flies.forEach((f, i) => {
      const on = hash(i, Math.floor((tick + i * 5) / 4), 12);
      if (on < 0.3) return;
      put(L, f.x, f.y, hex(on > 0.75 ? "#f6ffb0" : "#cfe070"), true);
    });
    // butterflies, flapping
    butterflies.forEach((f, i) => {
      const [x, y] = iso(f.u, f.v);
      const by = Math.round(y - f.h);
      const wing = hex(i ? "#f4f0f8" : "#ffd75a");
      const shut = Math.floor((tick + i) / 2) % 2;
      put(L, x, by, hex("#3a2a1e"), true);
      if (shut) {
        put(L, x, by - 1, wing, true);
      } else {
        put(L, x - 1, by - 1, wing, true);
        put(L, x + 1, by - 1, wing, true);
        put(L, x - 1, by, wing, true);
        put(L, x + 1, by, wing, true);
      }
    });

    // in the rain: the lantern in the doorway, and the rain itself, in
    // slanting streaks, with a splash where each lands
    if (rain) {
      // (swinging from its hook in a storm: the handle a little, the
      // lantern more)
      const glass = flicker > 0.96 ? "#fff1b8" : "#ffd27a";
      const sw = swing();
      const hx = LAMP.x + Math.round(sw * 0.5);
      const lx = LAMP.x + Math.round(sw);
      put(L, LAMP.x, LAMP.y, hex("#2a1e16"), true);
      put(L, hx - 1, LAMP.y + 1, hex("#2a1e16"), true);
      put(L, hx, LAMP.y + 1, hex("#3a2a1e"), true);
      put(L, hx + 1, LAMP.y + 1, hex("#2a1e16"), true);
      for (let dy = 2; dy <= 3; dy++) {
        put(L, lx - 1, LAMP.y + dy, hex("#ffb84a"), true);
        put(L, lx, LAMP.y + dy, hex(glass), true);
        put(L, lx + 1, LAMP.y + dy, hex("#ffb84a"), true);
      }
      put(L, lx, LAMP.y + 4, hex("#2a1e16"), true);
      const head = hex(sky === "rain-day" ? "#e4ecf4" : "#7a8aa8");
      const tail = hex(sky === "rain-day" ? "#b4c0cc" : "#46546e");
      for (const d of drops)
        for (let k = 0; k < 3; k++)
          put(
            L,
            d.x + (k * (1 + wind * 2)) / 4,
            d.y - k,
            k ? tail : head,
            true,
          );
      for (const s of splashes) {
        put(L, s.x - 1, s.y - 1, head, true);
        put(L, s.x + 1, s.y - 1, head, true);
      }
    }

    // whatever the pointer's over gets a light line round it
    if (hovered) {
      const edge: number[] = [];
      for (let y = 1; y < PH - 1; y++)
        for (let x = 1; x < PW - 1; x++) {
          const i = y * PW + x;
          if (L.tag[i] === hovered) continue;
          if (
            L.tag[i - 1] === hovered ||
            L.tag[i + 1] === hovered ||
            L.tag[i - PW] === hovered ||
            L.tag[i + PW] === hovered
          )
            edge.push(x, y);
        }
      for (let k = 0; k < edge.length; k += 2)
        put(L, edge[k], edge[k + 1], hex(day ? "#fff4cc" : "#e8c48a"), true);
    }

    // light: the scene's light everywhere, and the fire's (or the
    // lantern's) warmth falling off in dithered steps around it
    const src = source();
    const amb = flash === 4 || flash === 2 ? FLASH : look.amb;
    const glow = (x: number, y: number, dither: number) => {
      if (!src) return 0;
      const d = Math.hypot(x - src.x, (y - src.y) * 1.6);
      const f = Math.max(0, 1 - d / src.reach);
      return Math.floor(f * f * 5 * src.flk + dither) / 5;
    };
    const lit = glow(
      day ? ANGLER.x + 8 : MX + 3,
      day ? ANGLER.y + 4 : MY - 9,
      0.5,
    );
    for (let y = 0; y < PH; y++)
      for (let x = 0; x < PW; x++) {
        const i = y * PW + x;
        const o = i * 4;
        const c = i * 3;
        if (L.lit[i] === SKY_CLEAR) {
          out[o + 3] = 0;
          continue;
        }
        if (!L.lit[i]) {
          out[o] = L.col[c];
          out[o + 1] = L.col[c + 1];
          out[o + 2] = L.col[c + 2];
          out[o + 3] = 255;
          continue;
        }
        const q = L.lit[i] === 2 ? lit : glow(x, y, bayer(x, y));
        out[o] = L.col[c] * (amb[0] + look.warm[0] * q);
        out[o + 1] = L.col[c + 1] * (amb[1] + look.warm[1] * q);
        out[o + 2] = L.col[c + 2] * (amb[2] + look.warm[2] * q);
        out[o + 3] = 255;
      }
  };

  const stoke = (power: number) => {
    boost = Math.min(1.2, boost + power);
    for (let i = 0; i < power * 14; i++)
      embers.push({
        x: FX + Math.round((Math.random() - 0.5) * 12),
        y: FY - 6 - Math.round(Math.random() * 8),
        life: 8 + Math.random() * 16,
      });
  };
  // the wet logs, poked: a hiss of steam and nothing else
  const hiss = () => {
    for (let i = 0; i < 6; i++)
      smoke.push({
        x: FX + Math.round((Math.random() - 0.5) * 8),
        y: FY - 2 - Math.round(Math.random() * 3),
        life: 14 + Math.random() * 10,
        steam: true,
      });
  };

  // the chore you can do for him: a log on the fire, a bite on his line,
  // his mug filled
  const chore = () => {
    if (night) return stoke(1);
    if (day) {
      line.phase = "nibble";
      line.t = 0;
      line.caught = true;
      return;
    }
    sip = tick;
    for (let i = 0; i < 8; i++)
      steam.push({
        x: MX - 2 + Math.round(Math.random() * 3),
        y: MY - 12 - Math.round(Math.random() * 3),
        life: 9 + Math.random() * 6,
      });
  };

  // what's at a point (in the canvas's own pixels), as last drawn
  const hit = (x: number, y: number): Hit | null => {
    if (Math.hypot(x - FX, (y - FY + 6) * 0.8) < 9)
      return { kind: "fire", tag: 0 };
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= PW || y >= PH) return null;
    const tag = L.tag[y * PW + x];
    const kind =
      ([null, "sky", "man", "pug", "pond"] as (Kind | null)[])[tag] ??
      (tag >= T_BUSH ? "bush" : null);
    return kind && { kind, tag };
  };

  // outline what's under the pointer; says whether that changed anything
  const hover = (h: Hit | null) => {
    const tag = h && h.kind !== "sky" ? h.tag : 0;
    const changed = tag !== hovered;
    hovered = tag;
    return changed;
  };

  const poke = ({ kind, tag }: Hit, x: number, y: number) => {
    if (kind === "fire") {
      if (rain) hiss();
      else stoke(0.45);
    }
    if (kind === "man") looking = tick + 24;
    if (kind === "pug") awake = tick + (day ? 30 : 50);
    if (kind === "pond") {
      ripples.push({ x: Math.round(x), y: Math.round(y), r: 0, max: 6 });
      // (one in three, something was down there)
      if (Math.random() < 0.35) {
        const at = Math.floor(Math.random() * 3) - 1;
        fish.push({ x: PX - 6 + at * 3, y: PY + at, t: 0 });
      }
    }
    if (kind === "bush") {
      const [bx, by] = BUSHES[tag - T_BUSH];
      if (night)
        for (let i = 0; i < 6; i++)
          flies.push({
            x: bx + (Math.random() - 0.5) * 6,
            y: by - 2 - Math.random() * 2,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -0.2 - Math.random() * 0.4,
            life: 70 + Math.random() * 80,
          });
      if (day) {
        const a = (bx - OX) / 4;
        const b = (by - OY) / 2;
        for (let i = 0; i < 3; i++)
          butterflies.push({
            u: (a + b) / 2,
            v: (b - a) / 2,
            h: 3,
            vu: (Math.random() - 0.5) * 0.2,
            vv: (Math.random() - 0.5) * 0.2,
            life: 60 + Math.random() * 40,
          });
      }
      // in the rain, it shakes off what it was holding
      if (rain)
        for (let i = 0; i < 10; i++)
          splashes.push({
            x: bx + Math.round((Math.random() - 0.5) * 9),
            y: by - Math.round(Math.random() * 5),
            t: -Math.floor(Math.random() * 2),
          });
    }
    if (kind === "sky") {
      if (night)
        falling.push({ x: Math.round(x) + 6, y: Math.round(y) - 3, t: 0 });
      if (day) birds.push({ x: Math.round(x) - 6, y: Math.round(y), t: 0 });
      if (rain) strike();
    }
  };

  // where a speech bubble sits: over the old man's hat, or the pug's ears
  const anchor = (who: "man" | "pug") => {
    if (who === "man")
      return day
        ? { x: ANGLER.x + 9, y: ANGLER.y - 10 }
        : { x: MX + 6, y: MY - 22 };
    if (night) return { x: CX + 2, y: CY - 9 };
    if (rain) return { x: RAIN_PUG.x, y: RAIN_PUG.y - 9 };
    const { x, y, lift } = pugAt();
    return { x, y: y - lift - 8 };
  };

  // a flash of lightning's brightest frames, which light the sky too
  const flashing = () => flash === 4 || flash === 2;

  return { step, render, chore, hit, hover, poke, anchor, flashing };
};
type World = ReturnType<typeof makeWorld>;

const LABEL: Record<Scene, string> = {
  night:
    "A little floating island at night, in pixels. An old man in a wide hat sits on a log by a campfire, poking it with a stick, his pug asleep on the other side of it, pines behind him and a pond catching the moon.",
  day: "A little floating island by day, in pixels. An old man in a wide hat sits on an upturned crate by the pond, fishing, a bucket beside him, while his pug chases a butterfly across the grass. The campfire is down to a thread of smoke.",
  rain: "A little floating island in the rain, in pixels. An old man in a wide hat sits in the mouth of his tent under a lantern, a mug of coffee in his hands and his pug asleep on the doorstep, while the rain rings the pond and the campfire sits out and wet.",
};

const Island = ({
  mood,
  still,
  talking,
  stoked,
}: {
  mood: Mood;
  still: boolean;
  talking: boolean;
  // goes up by one each time you do his chore
  stoked: number;
}) => {
  const scene = sceneOf(mood);
  const lines = FIRESIDE[scene];
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<{ w: World; paint: () => void } | null>(null);
  const talk = useRef(talking);
  useEffect(() => {
    talk.current = talking;
  }, [talking]);

  // what he or the pug says when poked, a line at a time, in turn
  const [bubble, setBubble] = useState<{
    who: "man" | "pug";
    say: string;
    n: number;
    at: { x: number; y: number };
  } | null>(null);
  const said = useRef({ man: 0, pug: 0 });
  useEffect(() => {
    if (!bubble) return;
    const id = setTimeout(() => setBubble(null), 2800);
    return () => clearTimeout(id);
  }, [bubble]);
  // the nudge to poke around, until you have
  const [poked, setPoked] = useState(false);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const w = makeWorld(mood);
    const frame = ctx.createImageData(PW, PH);
    // the sky behind the scene, lit up with it by a flash of lightning
    const ground = document.querySelector<HTMLElement>(
      '.hobby-ground[data-ground="fireside"]',
    );
    const draw = () => {
      w.render(frame.data, talk.current);
      ctx.putImageData(frame, 0, 0);
      ground?.toggleAttribute("data-flash", w.flashing());
    };
    const paint = () => {
      w.step();
      draw();
    };
    // when still, a poke only redraws what's there
    world.current = { w, paint: still ? draw : paint };
    paint();
    if (still) return;
    let id = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last >= TICK) {
        last = t;
        paint();
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      ground?.removeAttribute("data-flash");
    };
  }, [still, mood]);

  useEffect(() => {
    if (!stoked || !world.current) return;
    world.current.w.chore();
    if (still) world.current.paint();
  }, [stoked, still]);

  // the pointer, in the canvas's own pixels
  const at = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return [
      ((e.clientX - box.left) / box.width) * PW,
      ((e.clientY - box.top) / box.height) * PH,
    ] as const;
  };

  return (
    <div className="relative -mx-5">
      <canvas
        ref={canvas}
        width={PW}
        height={PH}
        data-cursor="pixel"
        className="block w-full touch-manipulation [image-rendering:pixelated]"
        onPointerMove={(e) => {
          const now = world.current;
          if (!now) return;
          const h = now.w.hit(...at(e));
          // (the cursor's a pixel hand over whatever can be poked; see
          // cursors.tsx)
          e.currentTarget.toggleAttribute("data-poke", !!h && h.kind !== "sky");
          if (now.w.hover(h) && still) now.paint();
        }}
        onPointerLeave={(e) => {
          e.currentTarget.removeAttribute("data-poke");
          if (world.current?.w.hover(null) && still) world.current.paint();
        }}
        onPointerDown={(e) => {
          const now = world.current;
          const [x, y] = at(e);
          const h = now?.w.hit(x, y);
          if (!now || !h) return;
          setPoked(true);
          // (a still scene doesn't start things moving)
          if (!still || h.kind === "fire") now.w.poke(h, x, y);
          now.paint();
          if (h.kind === "man" || h.kind === "pug") {
            const said_ = lines.poked[h.kind];
            const n = said.current[h.kind]++;
            setBubble({
              who: h.kind,
              say: said_[n % said_.length],
              n,
              at: now.w.anchor(h.kind),
            });
          }
        }}
        role="img"
        aria-label={LABEL[scene]}
      />

      {/* what he (or the pug) says back, the way an old game pops it up */}
      <AnimatePresence>
        {bubble && (
          <motion.span
            key={bubble.n + bubble.who}
            role="status"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              left: `${(bubble.at.x / PW) * 100}%`,
              top: `${(bubble.at.y / PH) * 100}%`,
            }}
            className="pointer-events-none absolute w-max max-w-[11rem] -translate-x-1/2 -translate-y-full bg-[#f3ecdc] px-1.5 pt-0.5 pb-1 text-center text-base leading-none text-[#1a1410] shadow-[0_0_0_2px_#120e14]"
          >
            {bubble.say}
            <span
              aria-hidden
              className="absolute top-full left-1/2 -ml-1 h-1.5 w-2 bg-[#f3ecdc] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            />
          </motion.span>
        )}
      </AnimatePresence>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-1 left-5 text-base leading-none transition-opacity duration-700",
          scene === "day" ? "text-[#2e4a66]/60" : "text-[#9ea8d4]/55",
          poked && "opacity-0",
        )}
      >
        (poke around)
      </span>
    </div>
  );
};
