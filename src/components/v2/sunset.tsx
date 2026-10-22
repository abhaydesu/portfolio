"use client";

import { useEffect, useRef } from "react";
import { PugGate } from "./pug-gate";

/*
 * The page's sign-off, set like a small poster: a sunset over the sea in
 * square cells (after a photo of mine), a word of thanks in its corner and
 * the old man's pug sat above it, the way to him (see pug-gate.tsx).
 * The sun goes down as you reach the end of the page, half into the sea by
 * the bottom, and its reflection breathes slowly on the water. A hand
 * through it nudges the cells along like water and they ease back.
 *
 * The scene is drawn fresh from a few shapes (a disc, its glow, a horizon,
 * lines of water) into a fixed grid, so the cells step as the sun
 * sinks rather than slide, and every cell keeps its own spring for the drag.
 */

const COLS = 64;
const ROWS = 36;
const HORIZON = 20; // the row the sea starts on
// the lines of water below the horizon, opening out as they come nearer
const LINES = [1, 2, 4, 6, 9, 12, 15];
const SUN_X = 31.5;
const SUN_R = 4.2;
// the sun's row before you've scrolled to it, and at the bottom of the
// page, half into the sea
const RISE = 9;
const SET = 20.4;

// lavender at the edge of the light, through pink and orange, to the sun
const DAY = [
  [198, 192, 234],
  [238, 170, 204],
  [244, 156, 112],
  [250, 202, 118],
];
const NIGHT = [
  [146, 138, 204],
  [212, 128, 168],
  [236, 140, 96],
  [255, 222, 160],
];
const SUN = { day: [250, 206, 128], night: [255, 216, 150] };

// 4×4 ordered dither, so the glow thins out into scattered cells
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const ramp = (stops: number[][], v: number) => {
  const t = Math.max(0, Math.min(1, v)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(t));
  const f = t - i;
  const [a, b] = [stops[i], stops[i + 1]];
  return `rgb(${a.map((x, k) => Math.round(x + (b[k] - x) * f)).join(",")})`;
};

/**
 * Every lit cell for a sun at row `sy`, with the water at time `t` (in
 * seconds): a colour per grid slot, or null where the paper shows.
 */
function scene(sy: number, t: number, dark: boolean) {
  const stops = dark ? NIGHT : DAY;
  const cells: (string | null)[] = new Array(COLS * ROWS).fill(null);
  // how much of the sun is still up, which is how bright its path is
  const up = Math.max(0, Math.min(1, (HORIZON - (sy - SUN_R)) / (2 * SUN_R)));
  // lower, the light spreads along the horizon
  const low = (sy - RISE) / (SET - RISE);

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const dx = i + 0.5 - SUN_X;
      const grain = BAYER[(j % 4) * 4 + (i % 4)] / 16 - 0.5;
      let v = 0;
      if (j < HORIZON) {
        const dy = j + 0.5 - sy;
        if (Math.hypot(dx, dy) < SUN_R) {
          cells[j * COLS + i] = dark ? `rgb(${SUN.night})` : `rgb(${SUN.day})`;
          continue;
        }
        const glow = 0.74 * Math.exp(-((dx / 12) ** 2) - (dy / 7) ** 2);
        const haze =
          (0.5 + 0.3 * low) *
          Math.exp(-(HORIZON - 1 - j) / 2.6) *
          Math.exp(-((dx / 22) ** 2));
        v = Math.max(glow, haze);
        if (v + grain * 0.4 < 0.3) continue;
      } else if (j === HORIZON) {
        // the horizon, a faint line that fades out to the sides
        v = 0.12 + 0.5 * up * Math.exp(-((dx / 10) ** 2));
        if (Math.exp(-((dx / 26) ** 2)) + grain * 0.5 < 0.32) continue;
      } else {
        // the water is a few lines of light, further apart as they come
        // nearer, with plain paper between them
        const k = LINES.indexOf(j - HORIZON);
        if (k < 0) continue;
        const f = k / (LINES.length - 1);
        // the sun's reflection: a bar under it on each line, narrowing as
        // it comes down, that slowly breathes a cell wider and narrower and
        // sways a cell either way
        const hw =
          SUN_R * (1.15 - 0.45 * f) + 0.9 * Math.sin(t * 0.5 + k * 1.7);
        const cx = SUN_X + 0.8 * Math.sin(t * 0.3 + k * 2.3);
        const off = Math.abs(i + 0.5 - cx);
        if (off < hw) {
          // warm under the sun, cooler further down and out; in a few
          // steady shades, so the colours don't creep as it breathes
          const warm = (0.4 + 0.6 * up) * (1 - 0.5 * f) - 0.15 * (off / hw);
          v = Math.round(warm * 8) / 8;
        } else {
          // now and then a short, faint ripple either side, rocking a cell
          // back and forth; whole ones only, kept clear of the bar
          const rock = Math.round(0.6 * Math.sin(t * 0.25 + k * 1.3));
          const x = i + rock;
          const s = Math.floor(x / 6);
          if (x - s * 6 >= 2 + Math.floor(hash(k, s) * 2)) continue;
          const mid = s * 6 - rock + 1.5 - SUN_X;
          if (Math.abs(mid) > 24 || Math.abs(mid - (cx - SUN_X)) < hw + 3)
            continue;
          if (hash(s, k * 13) > 0.45 * Math.exp(-((mid / 18) ** 2))) continue;
          v = 0;
        }
      }
      cells[j * COLS + i] = ramp(stops, v);
    }
  }

  return cells;
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

    // each grid slot's drag: offset and velocity, in css px
    const n = COLS * ROWS;
    const ox = new Float32Array(n);
    const oy = new Float32Array(n);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);
    let moving = false;

    let cell = 8;
    let dpr = 1;
    const size = () => {
      const w = el.clientWidth;
      dpr = Math.min(2, devicePixelRatio || 1);
      cell = w / COLS;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(cell * ROWS * dpr);
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
    };

    let key = "";
    let cells: (string | null)[] = [];
    const draw = (now: number) => {
      const sy = RISE + (SET - RISE) * p;
      const row = Math.round(sy * 4) / 4; // the sun steps by quarter cells
      // the water is looked at a few times a second; a row only moves when
      // its drift reaches the next whole cell
      const step = reduce ? 0 : Math.floor(now / 250);
      const dark = root.classList.contains("dark");
      const k = `${row}|${step}|${dark}`;
      if (k === key && !moving) return;
      if (k !== key) cells = scene(row, step / 4, dark);
      key = k;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const s = Math.max(1, Math.round(cell * 0.82 * dpr));
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const c = cells[j * COLS + i];
          if (!c) continue;
          const at = j * COLS + i;
          ctx.fillStyle = c;
          ctx.fillRect(
            Math.round((i * cell + ox[at]) * dpr),
            Math.round((j * cell + oy[at]) * dpr),
            s,
            s,
          );
        }
      }
    };

    // eases back without overshooting
    const settle = () => {
      let any = false;
      for (let k = 0; k < n; k++) {
        if (!ox[k] && !oy[k] && !vx[k] && !vy[k]) continue;
        vx[k] = (vx[k] - ox[k] * 0.025) * 0.8;
        vy[k] = (vy[k] - oy[k] * 0.025) * 0.8;
        ox[k] += vx[k];
        oy[k] += vy[k];
        if (
          Math.abs(ox[k]) +
            Math.abs(oy[k]) +
            Math.abs(vx[k]) +
            Math.abs(vy[k]) <
          0.05
        )
          ox[k] = oy[k] = vx[k] = vy[k] = 0;
        else any = true;
      }
      moving = any;
    };

    let frame = 0;
    let seen = false;
    const loop = (now: number) => {
      frame = 0;
      p += (target - p) * (reduce ? 1 : 0.08);
      if (Math.abs(target - p) < 0.001) p = target;
      settle();
      draw(now);
      if (seen) frame = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (seen && !frame) frame = requestAnimationFrame(loop);
    };

    // the hand: cells near it are carried a little the way it's moving
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (last) {
        const dx = Math.max(-20, Math.min(20, x - last.x));
        const dy = Math.max(-20, Math.min(20, y - last.y));
        const reach = cell * 5;
        const i0 = Math.max(0, Math.floor((x - reach) / cell));
        const i1 = Math.min(COLS - 1, Math.ceil((x + reach) / cell));
        const j0 = Math.max(0, Math.floor((y - reach) / cell));
        const j1 = Math.min(ROWS - 1, Math.ceil((y + reach) / cell));
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const d = Math.hypot(
              i * cell + cell / 2 - x,
              j * cell + cell / 2 - y,
            );
            if (d > reach) continue;
            const w = (1 - d / reach) ** 2;
            const k = j * COLS + i;
            // each cell takes the push a touch its own way, so they part
            // softly rather than slide as one
            const a = (hash(i, j) - 0.5) * 0.5;
            const [c, s] = [Math.cos(a), Math.sin(a)];
            const f = w * 0.18 * (0.8 + hash(j, i) * 0.4);
            vx[k] += (dx * c - dy * s) * f;
            vy[k] += (dx * s + dy * c) * f;
          }
        }
        moving = true;
      }
      last = { x, y };
      wake();
    };
    const onLeave = () => (last = null);

    const onScroll = () => {
      progress();
      wake();
    };

    size();
    progress();
    p = target;
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
    // a theme switch redraws in the other palette
    const mo = new MutationObserver(() => {
      key = "";
      draw(performance.now());
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    addEventListener("scroll", onScroll, { passive: true });
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      removeEventListener("scroll", onScroll);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // a poster with its thanks in the corner, clear of the light; on a
    // phone, where it's too small to hold it, above it instead. either way
    // the thanks is lifted into the gap above, so it's nearer the end of the
    // text and further from the sun. it's the last part of the page in (see
    // v2-enter in globals.css)
    <footer className="v2-enter relative flex flex-col gap-14 [--enter:5] sm:mt-[92px] sm:block sm:aspect-[64/36]">
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
        style={{ aspectRatio: `${COLS} / ${ROWS}` }}
      >
        <canvas
          ref={canvas}
          aria-hidden
          data-cursor="pixel"
          className="absolute inset-0 size-full touch-pan-y"
        />
      </div>
    </footer>
  );
};
