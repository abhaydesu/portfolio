"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HaikyuMark } from "./hobby-marks";
import { boom, thwack } from "./feedback";

/*
 * Haikyu!! in the about text, and Hinata's boom jump off it. Clicking the
 * logo sends him running in along its line of text; he stomps into a broad
 * jump, rises far too high (as he does in the anime), and spikes the ball
 * straight into the logo, which is knocked askew and stays that way until
 * he's gone, then wobbles back into place. Every click plays it again.
 *
 * He's 9E0's pixel animation (@9E0_D0), its frames recovered from the GIF
 * at their own 200px size onto one palette (public/haikyu/hinata-spike.png),
 * and drawn at whole device pixels per pixel of it, so he stays crisp. The
 * ball after the hit, and its bounce, are drawn here, in the same colours.
 * Nothing moves under reduced motion.
 */

const SHEET = "/haikyu/hinata-spike.png";
// the frames: 200px square, side by side
const SIZE = 200;
const DUR = [
  80, 120, 80, 120, 80, 120, 80, 120, 80, 120, 80, 120, 80, 120, 80, 120,
];
// the first two have him cut off at the edge, as he comes in off camera; he
// starts at the third, sliding in instead
const FIRST = 2;
// the stomp (the ground rings out), and the hit
const STOMP = 8;
const HIT = 13;
// where the ball is at the hit, and the ground line, in the frame's pixels
const BALL = [182, 19];
const GROUND = 198;

// the ball as it leaves his hand: white, with green and red panels
const BALL_PX = [
  "..wwwww..",
  ".wgggwwr.",
  "wgggwwrrw",
  "wggwwrrrw",
  "wwwwrrrww",
  "wrrrrwwgw",
  "wrrrwwggw",
  ".wrwwggw.",
  "..wwwww..",
];
const BALL_INK: Record<string, string> = {
  w: "#fcfcfe",
  g: "#16a069",
  r: "#d9515f",
};

// how long each part takes, after the hit frame ends
const FLIGHT = 150;
const BOUNCE = 850;
// the logo's knocked pose, and when it rights itself
const KNOCKED = "translate(3px, 2px) rotate(14deg) scale(0.94, 1.04)";
const SETTLE_AFTER = 260;

let sheet: HTMLImageElement | null = null;
const loadSheet = () => {
  if (!sheet) {
    sheet = new Image();
    sheet.src = SHEET;
  }
  return sheet;
};

type Run = {
  // the part of the page the canvas covers
  left: number;
  top: number;
  width: number;
  height: number;
};

export const HaikyuWord = () => {
  const logo = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [run, setRun] = useState<(Run & { key: number }) | null>(null);
  const stop = useRef<() => void>(() => {});
  // one spike at a time: from the click until the logo's righted itself,
  // further clicks do nothing
  const [busy, setBusy] = useState(false);
  const playing = useRef(false);
  const done = () => {
    playing.current = false;
    setBusy(false);
  };

  // fetch him ahead of the first click: once the logo's getting near the
  // screen, rather than on every visit whether it's seen or not
  useEffect(() => {
    const el = logo.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        loadSheet();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const play = () => {
    if (playing.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = logo.current;
    if (!el) return;
    // (clearing up after the last spike first: its clean-up marks the logo
    // free, which would undo this one's marking it busy)
    stop.current();
    el.getAnimations().forEach((a) => a.cancel());
    playing.current = true;
    setBusy(true);

    const dpr = devicePixelRatio || 1;
    // about a css px per pixel of his, as a whole number of device pixels,
    // so he stays crisp
    const k = Math.max(1, Math.round(dpr));
    const s = k / dpr;
    const box = SIZE * s;

    const r = el.getBoundingClientRect();
    const ground = r.bottom + scrollY - 2;
    // the hit just up and left of the logo, unless that would put his
    // stomp off the side of the screen
    const boxLeft = Math.max(-40 * s, r.left + scrollX - BALL[0] * s - 8);
    const boxTop = ground - GROUND * s;
    // the canvas reaches past him for the ball's bounce
    const pad = 120;
    setRun({
      key: Date.now(),
      left: boxLeft - pad,
      top: boxTop - pad,
      width: box + pad * 2,
      height: box + pad * 2,
    });

    const img = loadSheet();
    let raf = 0;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    stop.current = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      setRun(null);
      done();
    };

    const start = () => {
      if (cancelled) return;
      const cv = canvas.current;
      if (!cv) return requestAnimationFrame(start);
      const ctx = cv.getContext("2d")!;
      const W = Math.round((box + pad * 2) * dpr);
      cv.width = W;
      cv.height = W;
      ctx.imageSmoothingEnabled = false;

      // the frames' times, from where he starts
      const at: number[] = [];
      let t = 0;
      for (let i = FIRST; i < DUR.length; i++) {
        at[i] = t;
        t += DUR[i];
      }
      const end = t;
      const hitEnd = at[HIT] + DUR[HIT];
      // the ball's path: from his hand to the middle of the logo
      const ox = pad * dpr;
      const oy = pad * dpr;
      const from = [ox + BALL[0] * k, oy + BALL[1] * k];
      const lr = el.getBoundingClientRect();
      const to = [
        (lr.left + lr.width / 2 + scrollX - boxLeft + pad) * dpr,
        (lr.top + lr.height / 2 + scrollY - boxTop + pad) * dpr,
      ];

      const drawBall = (x: number, y: number, turn: number) => {
        const n = BALL_PX.length;
        const u = k;
        for (let row = 0; row < n; row++)
          for (let col = 0; col < n; col++) {
            // spin it in quarter turns, so it stays on the pixel grid
            const [a, b] = [
              [col, row],
              [n - 1 - row, col],
              [n - 1 - col, n - 1 - row],
              [row, n - 1 - col],
            ][turn % 4];
            const c = BALL_PX[b][a];
            if (c === ".") continue;
            ctx.fillStyle = BALL_INK[c];
            ctx.fillRect(
              Math.round(x + (col - n / 2) * u),
              Math.round(y + (row - n / 2) * u),
              u,
              u,
            );
          }
      };

      let boomed = false;
      let hit = false;
      let knocked = false;
      const t0 = performance.now();
      const frame = (now: number) => {
        if (cancelled) return;
        const e = now - t0;
        ctx.clearRect(0, 0, W, W);

        // him
        if (e < end) {
          let i = FIRST;
          while (i + 1 < DUR.length && at[i + 1] <= e) i++;
          // in from the left, quickly; gone as he drops away after the hit
          const slide = e < 200 ? (1 - e / 200) * 40 * k : 0;
          ctx.globalAlpha =
            e < 120
              ? e / 120
              : e > hitEnd
                ? Math.max(0, 1 - (e - hitEnd) / (end - hitEnd))
                : 1;
          ctx.drawImage(
            img,
            i * SIZE,
            0,
            SIZE,
            SIZE,
            ox - slide,
            oy,
            SIZE * k,
            SIZE * k,
          );
          ctx.globalAlpha = 1;
          if (i >= STOMP && !boomed) {
            boomed = true;
            boom();
          }
          if (i >= HIT && !hit) {
            hit = true;
            thwack();
          }
        }

        // the ball, once it's left his hand: straight into the logo, then
        // off it, up and away, fading
        const f = e - hitEnd;
        if (f >= 0 && f < FLIGHT) {
          // with a short trail behind it, so a ball this fast can be seen
          const along = (g: number) => {
            const p = Math.max(0, g / FLIGHT) ** 1.4;
            return [
              from[0] + (to[0] - from[0]) * p,
              from[1] + (to[1] - from[1]) * p,
            ];
          };
          [0.15, 0.3, 0.5, 1].forEach((alpha, n) => {
            ctx.globalAlpha = alpha;
            const [x, y] = along(f - (3 - n) * 18);
            drawBall(x, y, Math.floor(f / 40));
          });
          ctx.globalAlpha = 1;
        } else if (f >= FLIGHT && f < FLIGHT + BOUNCE) {
          const b = f - FLIGHT;
          if (!knocked) {
            knocked = true;
            el.animate([{ transform: "none" }, { transform: KNOCKED }], {
              duration: 120,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "forwards",
            });
          }
          // a burst where it struck
          if (b < 110) {
            ctx.fillStyle = "#f6b73c";
            const reach = (8 + b / 6) * dpr;
            for (const [dx, dy] of [
              [1, -1],
              [1, 1],
              [-1, -1],
              [-1, 1],
              [0, -1.4],
              [1.4, 0],
            ]) {
              const u = Math.max(1, Math.round(k));
              ctx.fillRect(
                Math.round(to[0] + dx * reach),
                Math.round(to[1] + dy * reach),
                u * 2,
                u * 2,
              );
            }
          }
          const vx = 0.26 * dpr;
          const vy = -0.5 * dpr;
          const g = 0.0016 * dpr;
          ctx.globalAlpha = b > BOUNCE - 300 ? (BOUNCE - b) / 300 : 1;
          drawBall(
            to[0] + vx * b,
            to[1] + vy * b + (g * b * b) / 2,
            Math.floor(b / 60),
          );
          ctx.globalAlpha = 1;
        }

        if (e < Math.max(end, hitEnd + FLIGHT + BOUNCE)) {
          raf = requestAnimationFrame(frame);
        } else {
          setRun(null);
          // and the logo rights itself, with a wobble
          timers.push(
            setTimeout(() => {
              el.getAnimations().forEach((a) => a.cancel());
              el.animate(
                [
                  { transform: KNOCKED },
                  { transform: "rotate(-6deg) scale(1.03)" },
                  { transform: "rotate(3deg)" },
                  { transform: "rotate(-1deg)" },
                  { transform: "none" },
                ],
                { duration: 700, easing: "ease-out" },
              ).onfinish = done;
            }, SETTLE_AFTER),
          );
        }
      };
      raf = requestAnimationFrame(frame);
    };

    if (img.complete && img.naturalWidth) requestAnimationFrame(start);
    else {
      img.onload = () => requestAnimationFrame(start);
      // (if he can't be fetched, there's nothing to wait for)
      img.onerror = () => stop.current();
    }
  };

  useEffect(() => () => stop.current(), []);

  return (
    <>
      <button
        ref={logo}
        type="button"
        onClick={play}
        onPointerEnter={loadSheet}
        onFocus={loadSheet}
        aria-label="Haikyu!! (plays Hinata's spike)"
        aria-disabled={busy}
        // (no click sound while he's mid-spike, and an arrow, not a hand:
        // see cursors.tsx)
        data-sound={busy ? undefined : "action"}
        data-near="logo"
        // the logo's short for a thumb; an unseen ::before reaches above
        // and below it
        className="group/w relative inline-flex before:absolute before:inset-x-0 before:-inset-y-[5px]"
      >
        <HaikyuMark />
      </button>
      {run &&
        createPortal(
          // a strip across the page that clips him, so his canvas never
          // pushes the page wider than the screen
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-20 overflow-hidden"
            style={{ top: run.top, height: run.height }}
          >
            <canvas
              key={run.key}
              ref={canvas}
              className="absolute top-0 [image-rendering:pixelated]"
              style={{ left: run.left, width: run.width, height: run.height }}
            />
          </div>,
          document.body,
        )}
    </>
  );
};
