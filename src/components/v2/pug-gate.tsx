"use client";

import { useEffect, useRef, useState } from "react";
import { warmPanel } from "./hobby-panel";
import { PUG_GATE, type Sprite } from "./pug-sprites";

/*
 * The old man's pug, sat on the page's thanks: the way to the old man. He
 * sits with his eyes shut, his tail going now and then; pointed at, he opens
 * his eyes and looks at you, and takes the light line round him that things
 * in the old man's scene take when they're pointed at, like an old game's.
 * Clicked, he gets up and trots off to the old man, and that scene opens;
 * his paw prints are left where he went. When it closes he trots back and
 * sits down again.
 *
 * He's drawn at whole device pixels per pixel of his own, so he stays
 * crisp at any zoom, and only moves while he's on screen. Under reduced
 * motion he's simply there, or gone.
 */

const W = 34;
const H = 15;
// where he sits, and the row his paws are on (a row's left below for the
// line round him)
const SIT_X = 1;
const FOOT = H - 2;
// css px per pixel of him, roughly (rounded to whole device pixels)
const SCALE = 2;
const TICK = 90;
// how far he trots a tick
const PACE = 1.6;

const INK = "#2a1a10";
// the hover line: the old man's scene's, and deeper on light paper so it
// shows there
const EDGE = { day: "#d39545", night: "#e8c48a" };
// his paw prints, faint on the paper
const PRINT = { day: "#cfc4b2", night: "#3e372e" };

type Mode = "sit" | "out" | "gone" | "in";

export const PugGate = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: (anchor: DOMRect) => void;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState(false);
  const looking = useRef(false);
  looking.current = hover;
  const away = useRef(open);
  away.current = open;
  const redraw = useRef(() => {});
  const go = useRef(() => {});

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    let k = 2;
    const size = () => {
      const dpr = devicePixelRatio || 1;
      k = Math.max(1, Math.round(SCALE * dpr));
      cv.width = W * k;
      cv.height = H * k;
      cv.style.width = `${(W * k) / dpr}px`;
      cv.style.height = `${(H * k) / dpr}px`;
    };

    let mode: Mode = away.current ? "gone" : "sit";
    let x = mode === "gone" ? W : SIT_X;
    let tick = 0;
    let step = 0;
    // until when his tail's going, and when it next goes
    let flick = 0;
    let nextFlick = 30;

    const step_ = () => {
      tick++;
      if (mode === "sit" && tick >= nextFlick) {
        flick = tick + 6;
        nextFlick = tick + 40 + Math.floor(Math.random() * 50);
      }
      if (mode === "out") {
        x += PACE;
        step++;
        if (x >= W) mode = "gone";
      }
      if (mode === "in") {
        x -= PACE;
        step++;
        if (x <= SIT_X) {
          x = SIT_X;
          mode = "sit";
          // (a wag as he settles)
          flick = tick + 6;
        }
      }
    };

    const pose = (): { s: Sprite; at: number; flip: boolean } | null => {
      if (mode === "gone") return null;
      if (mode === "out" || mode === "in")
        return {
          s: PUG_GATE.trot[Math.floor(step / 2) % 2],
          at: Math.round(x),
          flip: mode === "in",
        };
      const up = tick < flick;
      const s = looking.current
        ? up
          ? PUG_GATE.lookWag
          : PUG_GATE.look
        : up
          ? PUG_GATE.restWag
          : PUG_GATE.rest;
      return { s, at: SIT_X, flip: false };
    };

    const draw = () => {
      const dark = root.classList.contains("dark");
      const px = new Array<string | null>(W * H).fill(null);
      const put = (a: number, b: number, c: string) => {
        if (a >= 0 && b >= 0 && a < W && b < H) px[b * W + a] = c;
      };
      // his paw prints, from where he sat off to the right, while he's
      // away (and as he comes back, the ones he hasn't reached yet)
      if (mode !== "sit")
        for (let p = SIT_X + 7; p < W; p += 4) {
          if (mode === "in" && p > x) continue;
          const y = FOOT - ((p >> 2) & 1);
          put(p, y, PRINT[dark ? "night" : "day"]);
          put(p + 1, y, PRINT[dark ? "night" : "day"]);
        }

      const pug = pose();
      const body: number[] = [];
      if (pug) {
        const { s, at, flip } = pug;
        const w = s.rows[0].length;
        const top = FOOT - s.rows.length + 1;
        s.rows.forEach((row, dy) => {
          for (let dx = 0; dx < w; dx++) {
            const c = s.pal[row[flip ? w - 1 - dx : dx]];
            // (only what's on the canvas: what's past its edge has gone)
            if (!c || at + dx < 0 || at + dx >= W) continue;
            put(at + dx, top + dy, c);
            body.push(at + dx, top + dy);
          }
        });
      }
      // a dark line round him so he reads at this size, and when he's
      // pointed at, the light one round that
      const ring = (inside: (a: number, b: number) => boolean) => {
        const out: number[] = [];
        for (let b = 0; b < H; b++)
          for (let a = 0; a < W; a++) {
            if (inside(a, b)) continue;
            if (
              inside(a - 1, b) ||
              inside(a + 1, b) ||
              inside(a, b - 1) ||
              inside(a, b + 1)
            )
              out.push(a, b);
          }
        return out;
      };
      const solid = new Set<number>();
      for (let i = 0; i < body.length; i += 2)
        solid.add(body[i + 1] * W + body[i]);
      const isPug = (a: number, b: number) =>
        a >= 0 && b >= 0 && a < W && b < H && solid.has(b * W + a);
      const ink = ring(isPug);
      for (let i = 0; i < ink.length; i += 2) put(ink[i], ink[i + 1], INK);
      if (looking.current && mode === "sit") {
        const inked = new Set(solid);
        for (let i = 0; i < ink.length; i += 2)
          inked.add(ink[i + 1] * W + ink[i]);
        const line = ring(
          (a, b) => a >= 0 && b >= 0 && a < W && b < H && inked.has(b * W + a),
        );
        for (let i = 0; i < line.length; i += 2)
          put(line[i], line[i + 1], EDGE[dark ? "night" : "day"]);
      }

      ctx.clearRect(0, 0, cv.width, cv.height);
      px.forEach((c, i) => {
        if (!c) return;
        ctx.fillStyle = c;
        ctx.fillRect((i % W) * k, Math.floor(i / W) * k, k, k);
      });
    };
    redraw.current = draw;

    let seen = false;
    let timer = 0;
    const run = () => {
      const on = seen && !reduce && mode !== "gone";
      if (on && !timer)
        timer = window.setInterval(() => {
          step_();
          draw();
          if (mode === "gone") run();
        }, TICK);
      if (!on && timer) {
        clearInterval(timer);
        timer = 0;
      }
    };
    // off to him, or back
    go.current = () => {
      if (reduce) {
        mode = away.current ? "gone" : "sit";
        x = away.current ? W : SIT_X;
        return draw();
      }
      if (away.current && mode !== "gone") mode = "out";
      if (!away.current && mode !== "sit") {
        mode = "in";
        x = Math.min(x, W);
      }
      draw();
      run();
    };

    size();
    draw();
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      run();
    });
    io.observe(cv);
    // a theme switch changes the lines' colours
    const mo = new MutationObserver(draw);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    const onResize = () => {
      size();
      draw();
    };
    addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      mo.disconnect();
      removeEventListener("resize", onResize);
      clearInterval(timer);
    };
  }, []);

  // he looks up at once, not on his next tick
  useEffect(() => redraw.current(), [hover]);
  useEffect(() => go.current(), [open]);

  return (
    <button
      type="button"
      aria-label="follow the pug to the old man"
      aria-pressed={open}
      data-sound={open ? "close" : "open"}
      // the old man's scene opens from, and closes back into, where he sat
      onClick={() => onToggle(canvas.current!.getBoundingClientRect())}
      onPointerEnter={() => {
        setHover(true);
        void warmPanel("fireside");
      }}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      // sparks from a click come out in his colour
      style={{ "--accent": "#c99d6c" } as React.CSSProperties}
      data-cursor="pixel"
      className="pointer-events-auto outline-none"
    >
      <canvas
        ref={canvas}
        aria-hidden
        data-hobby-word="fireside"
        className="block [image-rendering:pixelated]"
      />
    </button>
  );
};
