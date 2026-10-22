"use client";

import { Fragment, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

/*
 * The picture at the top, with day and night stuck to its top-left corner,
 * in a little round bubble that's joined to the mat round the picture the
 * way two drops of something thick are, a neck of it between them; and
 * drawn as one line round both.
 *
 * Bring the pointer near the bubble and it leans towards it, on a spring,
 * the neck stretching as it goes; let it go and it settles back.
 *
 * Scroll down and the bubble catches on the top of the screen while the
 * picture goes on up past it. It holds on to the mat's edge as it slides
 * by, then to its corner, stretching the neck between them, until it can't
 * any more and snaps free, springing out to hang a little to the left, clear
 * of the text (and of the work wall, when it's opened out past the column).
 * Scroll back up and, as the picture comes near, it's pulled
 * in again with a snap, and carried back up to its corner.
 *
 * On a phone it hangs above the picture's own corner, so it never cuts
 * across the picture to get there: it goes round the corner and down the
 * picture's left side as the picture passes, and steps out to hang once
 * it's clear; and back the same way. There's no margin there to hang in
 * clear of the text, though, so while you read on down it's tucked away
 * up past the top of the screen, and it drops back down to hang as soon as
 * you scroll back up.
 *
 * The join is a goo filter (blur everything, then cut the blur back to a
 * hard edge), drawn twice: once a hair larger in the line's colour, then
 * in the page's colour inside it, so what's left is the outline. Once the
 * bubble's well clear of the mat it's drawn on its own, fixed to the
 * screen, exactly where it was; the two look the same there, so the swap
 * can't be seen.
 *
 * It's glass, after Apple's liquid glass: a light rim round its top, a
 * softer one round its foot, and a glint across it that shifts with its
 * lean and its motion. Hanging over the page, what scrolls by under it is
 * seen through it as through a drop (where the browser can bend what's
 * behind a thing; elsewhere it's only softened): a touch magnified in the
 * middle, pulled round at the rim, and split a little into its colours
 * there, red bent least and blue most. And it moves like a drop: drawn out
 * along its way as it goes, and wobbling round again as it stops.
 */

// the lens, as a displacement map: each pixel says how far (red across,
// green down) to look away from it for what to show: a little in toward
// the middle (so the middle's magnified), then, nearing the rim, further
// and further out (so what's beyond the edge is pulled round into it)
const lensMap = (n: number) => {
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const g = c.getContext("2d")!;
  const im = g.createImageData(n, n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const u = ((x + 0.5) / n) * 2 - 1;
      const v = ((y + 0.5) / n) * 2 - 1;
      const d = Math.hypot(u, v);
      const k = d < 1 ? -0.26 * d + 1.26 * d ** 5 : 0;
      const i = (y * n + x) * 4;
      im.data[i] = 128 + (d ? u / d : 0) * k * 127;
      im.data[i + 1] = 128 + (d ? v / d : 0) * k * 127;
      im.data[i + 2] = 128;
      im.data[i + 3] = 255;
    }
  g.putImageData(im, 0, 0);
  return c.toDataURL();
};

const SIZE = 56;
// the mat round the picture
const MAT = 4;
// the bubble: its middle (from the picture's top left), its size, how far
// it'll lean
const B = { x: -11, y: -11, r: 14, lean: 9 };
// where it hangs: its middle this far down from the top of the screen, and
// this much left of where it sits on the picture. on a phone it hangs right
// above where it sat, as far down from the top as it is in from the side
const HANG = 30;
const SHIFT = 26;
const EDGE = 14;
// however it's pulled, its middle never comes nearer the top of the screen
// than this (and further off while it's drawn out), so it always keeps a
// margin there; only sat on the picture, or on a phone (where it tucks
// away above the screen), does it go up past it
const FLOOR = B.r + 14;
// where it sits on the picture: on its top left corner; on a phone, along
// its top edge just in from the corner, so it keeps to the page's margin
// rather than reaching out to the side of the screen (and high enough that
// it sits on the mat, its rim clear of the picture)
const seatOf = () =>
  innerWidth < 640 ? { x: B.r + 2, y: -(MAT + B.r - 1) } : { x: B.x, y: B.y };
// the magnet: how far it'll stretch from the mat's corner before it lets go,
// and how near it has to come again to be caught
const STICK = 46;
const CATCH = 30;
// the svg reaches this far round the picture: room for the bubble while
// it's near enough the mat to join it
const PAD = 60;
const VIEW = SIZE + PAD * 2;
// how near the pointer has to come for the bubble to feel it
const REACH = 80;

const ICON =
  "relative grid size-full place-items-center rounded-full text-neutral-500 transition-colors duration-200 hover:text-neutral-900 focus-visible:text-neutral-900 focus-visible:outline-none";

export const AvatarDock = () => {
  const goo = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGCircleElement>(null);
  const fill = useRef<SVGCircleElement>(null);
  const btn = useRef<HTMLSpanElement>(null);
  const hanger = useRef<HTMLDivElement>(null);
  const hangIcon = useRef<HTMLSpanElement>(null);
  const glass = useRef<HTMLSpanElement>(null);
  const rim = useRef<HTMLSpanElement>(null);
  const lens = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    lens.current?.setAttribute("href", lensMap(B.r * 4));

    // where the bubble is (on the screen) and how it's moving; and its lean
    // towards the pointer, a spring of its own
    const s = { px: 0, py: 0, vx: 0, vy: 0 };
    const l = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, grow: 0, tg: 0 };
    // how drawn out it is (and which way): a loose spring after its speed,
    // so it wobbles round again as it stops
    const j = { a: 0, v: 0, ang: 0 };
    // on the picture's corner, held to the mat as it goes, or hanging free
    let mode: "on" | "held" | "free" = "on";
    // riding with the picture exactly (no spring) while it's on its corner
    let locked = true;
    // on a phone, put away above the screen while you scroll down to read,
    // and let down again once you've scrolled back up a little way
    let tucked = false;
    let lastY = scrollY;
    let upBy = 0;
    let far = false;
    let raf = 0;
    let running = false;
    let last = 0;

    // springs measured in time, not frames, and stepped in small fixed
    // slices, so they move the same at any frame rate and never stutter
    // when a frame comes late. a spring's feel is its frequency (how quick)
    // and damping (how much it overshoots: under 1 a touch, like a magnet
    // catching)
    const SLICE = 1 / 240;
    const spring = (
      x: number,
      v: number,
      to: number,
      hz: number,
      damp: number,
    ) => {
      const w = 2 * Math.PI * hz;
      v += (w * w * (to - x) - 2 * damp * w * v) * SLICE;
      return [x + v * SLICE, v];
    };

    // on a phone, where it hangs is above the picture's own corner, so it
    // can't just let go and drop there while the picture's going by: it
    // goes round the corner and holds on down the picture's left side as
    // the picture passes, and only steps out to hang once it's clear (and
    // the other way round as the picture comes back). tucked, it hangs
    // above the screen instead
    const phone = (box: DOMRect): [number, number] => {
      const seat = seatOf();
      const ax = box.left + seat.x;
      const ay = box.top + seat.y;
      // it hangs above where it sits, as far down as it is in from the side
      const hy = Math.max(EDGE, ax - B.r) + B.r;
      if (ay >= hy) {
        mode = "on";
        return [ax, ay];
      }
      if (box.bottom + MAT > hy - B.r - 10) {
        mode = "held";
        return [
          box.left - MAT - B.r * 0.55,
          Math.min(Math.max(hy, box.top - MAT), box.bottom + MAT),
        ];
      }
      mode = "free";
      return [ax, tucked ? -B.r * 2 : hy];
    };

    const target = (box: DOMRect): [number, number] => {
      if (innerWidth < 640) return phone(box);
      let hx = box.left + B.x - SHIFT;
      const hy = HANG;
      // the work wall, opened out, reaches past the column; if a project's
      // level with where it'd hang, it hangs clear of that instead
      let left = Infinity;
      for (const li of document.querySelectorAll("#work-more li")) {
        if (!li.querySelector("img")) continue;
        const r = li.getBoundingClientRect();
        if (r.bottom > hy - B.r - 8 && r.top < hy + B.r + 8)
          left = Math.min(left, r.left);
      }
      hx = Math.min(hx, Math.max(EDGE + B.r, left - 16 - B.r));
      const ax = box.left + B.x;
      const ay = box.top + B.y;
      if (ay >= hy) {
        mode = "on";
        return [ax, ay];
      }
      // the nearest it can be to where it'd hang while still on the mat:
      // against its left edge, level with the hang, or its bottom corner
      const sx = box.left - MAT - B.r * 0.55;
      const sy = Math.min(Math.max(hy, box.top - MAT), box.bottom + MAT);
      const d = Math.hypot(hx - sx, hy - sy);
      // caught a little nearer than it lets go, so it doesn't flicker
      // between the two at the edge
      if (d < (mode === "free" ? CATCH : STICK)) {
        mode = "held";
        // stretched out towards the hang, further the further it's pulled
        const k = (d / STICK) * 0.5;
        return [sx + (hx - sx) * k, sy + (hy - sy) * k];
      }
      mode = "free";
      return [hx, hy];
    };

    const place = (box: DOMRect) => {
      const x = s.px + l.x;
      // (allowing for how far it's drawn out, which reaches higher). sat on
      // the picture it goes wherever the picture goes, off the top too; and
      // on a phone, where it hangs well clear of the top anyway, it's left
      // to glide up out of sight and back down again
      const y =
        mode === "on" || innerWidth < 640
          ? s.py + l.y
          : Math.max(s.py + l.y, FLOOR + B.r * Math.max(0, j.a));
      const r = B.r * (1 + l.grow * 0.12);
      // how far it is from the mat: near, it's drawn with it (and joins it);
      // well clear, on its own
      const dx = Math.max(box.left - MAT - x, 0, x - box.right - MAT);
      const dy = Math.max(box.top - MAT - y, 0, y - box.bottom - MAT);
      const nowFar = Math.hypot(dx, dy) > B.r + 22;
      // drawn out along its way, narrower across it
      const deg = (j.ang * 180) / Math.PI;
      const sx = 1 + j.a;
      const sy = 1 - j.a * 0.55;
      const cx = x - box.left + PAD;
      const cy = y - box.top + PAD;
      for (const [c, rr] of [
        [line.current, r + 1.25],
        [fill.current, r],
      ] as const) {
        c?.setAttribute("cx", `${cx}`);
        c?.setAttribute("cy", `${cy}`);
        c?.setAttribute("r", `${nowFar ? 0 : rr}`);
        c?.setAttribute(
          "transform",
          `rotate(${deg} ${cx} ${cy}) translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy}) rotate(${-deg} ${cx} ${cy})`,
        );
      }
      if (glass.current)
        glass.current.style.transform = `rotate(${deg}deg) scale(${sx}, ${sy}) rotate(${-deg}deg)`;
      // the glint: toward the pointer it's leaning to, and trailing its
      // motion a little
      const gx = Math.max(12, Math.min(58, 30 + l.x * 2.2 - s.vx / 60));
      const gy = Math.max(4, Math.min(42, 12 + l.y * 2.2 - s.vy / 60));
      for (const g of [glass.current, rim.current]) {
        g?.style.setProperty("--gx", `${gx}%`);
        g?.style.setProperty("--gy", `${gy}%`);
      }
      if (btn.current)
        btn.current.style.translate = `${x - box.left - B.x}px ${y - box.top - B.y}px`;
      const h = hanger.current;
      if (h)
        h.style.transform = `translate3d(${x - B.r - 2}px, ${y - B.r - 2}px, 0) scale(${1 + l.grow * 0.12})`;
      // if it's ever over the picture (a fast scroll on a phone can catch
      // it), its icon keeps out of the way
      const over =
        x + r > box.left &&
        x - r < box.right &&
        y + r > box.top &&
        y - r < box.bottom;
      if (hangIcon.current) hangIcon.current.style.opacity = over ? "0" : "";
      if (nowFar !== far) {
        far = nowFar;
        if (btn.current) {
          btn.current.style.visibility = far ? "hidden" : "";
          btn.current.inert = far;
        }
        if (h) {
          h.style.visibility = far ? "visible" : "hidden";
          h.inert = !far;
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 20);
      last = now;
      const box = el.getBoundingClientRect();
      const [tx, ty] = target(box);
      if (mode !== "on") locked = false;
      const n = Math.ceil(dt / SLICE);
      if (reduce || (mode === "on" && locked)) {
        s.px = tx;
        s.py = ty;
        s.vx = s.vy = 0;
      } else {
        // (on a phone, its comings and goings are quicker, and settle
        // without overshooting back into the picture)
        const [hz, damp] = innerWidth < 640 ? [5.5, 0.9] : [3.2, 0.7];
        for (let i = 0; i < n; i++) {
          [s.px, s.vx] = spring(s.px, s.vx, tx, hz, damp);
          [s.py, s.vy] = spring(s.py, s.vy, ty, hz, damp);
        }
        if (
          mode === "on" &&
          Math.hypot(tx - s.px, ty - s.py) < 0.3 &&
          Math.hypot(s.vx, s.vy) < 12
        )
          locked = true;
      }
      for (let i = 0; i < n; i++) {
        [l.x, l.vx] = spring(l.x, l.vx, l.tx, 4, 0.75);
        [l.y, l.vy] = spring(l.y, l.vy, l.ty, 4, 0.75);
      }
      l.grow += (l.tg - l.grow) * (1 - Math.exp(-dt / 0.07));
      const speed = Math.hypot(s.vx, s.vy);
      if (speed > 30) j.ang = Math.atan2(s.vy, s.vx);
      if (reduce) j.a = j.v = 0;
      else
        for (let i = 0; i < n; i++)
          [j.a, j.v] = spring(j.a, j.v, Math.min(0.3, speed / 1100), 6, 0.3);
      j.a = Math.max(-0.22, Math.min(0.34, j.a));
      place(box);
      return (
        (locked ||
          (Math.hypot(tx - s.px, ty - s.py) < 0.05 &&
            Math.hypot(s.vx, s.vy) < 1)) &&
        Math.abs(l.vx) + Math.abs(l.vy) < 0.5 &&
        Math.abs(l.tx - l.x) + Math.abs(l.ty - l.y) < 0.02 &&
        Math.abs(l.tg - l.grow) < 0.005 &&
        Math.abs(j.a) + Math.abs(j.v) < 0.002
      );
    };
    const frame = (now: number) => {
      if (tick(now)) running = false;
      else raf = requestAnimationFrame(frame);
    };
    const go = () => {
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    // on a scroll: riding the picture, it's put straight where it belongs,
    // so it never lags it; anything else is left to the springs, once a
    // frame
    const onScroll = () => {
      // which way you're going: any way down tucks it away, a little way
      // back up lets it down (not the first pixel up, so a reader's thumb
      // settling doesn't bring it out)
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (innerWidth >= 640) tucked = false;
      else if (dy > 0) {
        tucked = true;
        upBy = 0;
      } else if (dy < 0) {
        upBy -= dy;
        if (upBy > 24) tucked = false;
      }
      const box = el.getBoundingClientRect();
      const [tx, ty] = target(box);
      if (mode === "on" && locked) {
        s.px = tx;
        s.py = ty;
      }
      // (and wherever it is, it's put back there straight away: while it's
      // drawn with the mat, the page carries it along with the scroll, and
      // left till the next frame it'd be dragged that far, up toward the top
      // of the screen or down)
      place(box);
      go();
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - s.px;
      const dy = e.clientY - s.py;
      const d = Math.hypot(dx, dy);
      if (d < REACH) {
        // nearer, the harder it leans, up to its limit
        const pull = (1 - d / REACH) * B.lean;
        l.tx = d ? (dx / d) * Math.min(pull, d * 0.5) : 0;
        l.ty = d ? (dy / d) * Math.min(pull, d * 0.5) : 0;
        l.tg = d < B.r ? 1 : 0;
      } else l.tx = l.ty = l.tg = 0;
      go();
    };
    const onLeave = () => {
      l.tx = l.ty = l.tg = 0;
      go();
    };

    const box = el.getBoundingClientRect();
    s.px = box.left + seatOf().x;
    s.py = box.top + seatOf().y;
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    // the wall opening or paging moves things without a scroll
    const wall = document.getElementById("work-more");
    const ro = new ResizeObserver(onScroll);
    if (wall) ro.observe(wall);
    const mo = new MutationObserver(onScroll);
    if (wall) mo.observe(wall, { childList: true, subtree: true });
    addEventListener("resize", onScroll);
    // the lean wants a mouse, and motion
    const lean = matchMedia("(pointer: fine)").matches && !reduce;
    if (lean) {
      addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      ro.disconnect();
      mo.disconnect();
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const shapes = (grow: number, ref: typeof line) => (
    <>
      <rect
        x={PAD - MAT - grow}
        y={PAD - MAT - grow}
        width={SIZE + (MAT + grow) * 2}
        height={SIZE + (MAT + grow) * 2}
        rx={10 + grow}
      />
      <circle ref={ref} cx={PAD + B.x} cy={PAD + B.y} r={B.r + grow} />
    </>
  );

  return (
    <div ref={root} className="relative size-14 shrink-0">
      {/* the mat and the bubble, as one gooey shape with a line round it */}
      <svg
        aria-hidden
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -PAD, top: -PAD, width: VIEW, height: VIEW }}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
      >
        {/* the filter only finds the shape (the blur's edge, cut hard); the
          colour is then poured in flat, so none of the blur's in-between
          colour is left to fringe its edge (at night it showed as brown) */}
        <defs>
          {[
            ["line", "var(--color-neutral-300)"],
            ["fill", "var(--paper)"],
          ].map(([name, colour]) => (
            <filter
              key={name}
              id={`${goo}-${name}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b" />
              <feColorMatrix
                in="b"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 22 -9"
                result="shape"
              />
              <feFlood style={{ floodColor: colour }} />
              <feComposite in2="shape" operator="in" />
            </filter>
          ))}
        </defs>
        <g filter={`url(#${goo}-line)`}>{shapes(1.25, line)}</g>
        <g filter={`url(#${goo}-fill)`}>{shapes(0, fill)}</g>
      </svg>

      <div
        data-intro="media"
        className="relative size-full overflow-hidden rounded-md border border-neutral-200"
      >
        <Image
          src="/about/avatar-2.jpeg"
          alt="Abhay Singh"
          fill
          sizes="56px"
          quality={90}
          className="object-cover"
        />
      </div>

      {/* the switch, in the middle of its bubble (while it's by the mat),
        under the glass's light */}
      <span
        ref={btn}
        data-intro="control"
        className="absolute"
        style={{
          left: B.x - B.r,
          top: B.y - B.r,
          width: B.r * 2,
          height: B.r * 2,
        }}
      >
        <span
          ref={rim}
          aria-hidden
          className="lg-rim pointer-events-none absolute inset-0"
        />
        <ThemeToggle className={ICON} />
      </span>

      {/* the bubble on its own, fixed to the screen, once it's well clear */}
      <div
        ref={hanger}
        inert
        className="invisible fixed top-0 left-0 z-30 will-change-transform"
        style={{ width: (B.r + 2) * 2, height: (B.r + 2) * 2 }}
      >
        {/* the lens it bends what's behind it through */}
        <svg aria-hidden className="absolute size-0">
          <filter
            id={`${goo}-glass`}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={lens}
              x="0"
              y="0"
              width={B.r * 2}
              height={B.r * 2}
              preserveAspectRatio="none"
              result="lens"
            />
            {/* each colour bent a little differently, then put back
              together: the fringe at a lens's edge */}
            {(
              [
                ["r", 12, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
                ["g", 14, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
                ["b", 16, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
              ] as const
            ).map(([c, scale, only]) => (
              <Fragment key={c}>
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="lens"
                  scale={scale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result={`${c}-bent`}
                />
                <feColorMatrix in={`${c}-bent`} values={only} result={c} />
              </Fragment>
            ))}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </svg>
        <span
          ref={glass}
          aria-hidden
          className="lg pointer-events-none absolute inset-[2px]"
          style={{
            // (where a browser can't bend what's behind, it's only
            // softened and brightened, which it drops this for)
            WebkitBackdropFilter: "blur(1px) saturate(1.8)",
            backdropFilter: `url(#${goo}-glass) blur(0.4px) saturate(1.8)`,
          }}
        />
        <span
          ref={hangIcon}
          className="absolute inset-[2px] transition-opacity duration-150"
        >
          <ThemeToggle className={ICON} />
        </span>
      </div>
    </div>
  );
};
