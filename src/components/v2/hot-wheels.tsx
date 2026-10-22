"use client";

import { useEffect, useId, useState } from "react";
import { getImageProps } from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { HOT_WHEELS } from "./data";
import { hand } from "./fonts";
import { HW_FLAME, HW_LETTERS } from "./hobby-marks";

/*
 * The toy box, seen from above, like the sketchbook on the desk and the
 * prints on the table: an old cardboard carton with its flaps standing
 * open, a childhood's worth of toys in the bottom (lego, marbles, a ball, a
 * letter block, a loose car) and the carded cars lying on top, where the
 * newest finds go.
 *
 * It arrives taped shut, "toys" written across the seam. The long flaps
 * come unstuck and swing open, flopping a little past standing and back,
 * then the short ones, and the light gets in. Pointing at a card (or
 * focusing it) lifts it up out of the box towards you; its name is written
 * beneath. Clicking keeps it up (and is how it works on a touch screen).
 */

// the box, in px: its opening, and how far each pair of flaps reaches
const OPEN_W = 236;
const OPEN_H = 164;
const LONG = OPEN_H / 2; // the flaps along the long sides meet in the middle
const SHORT = 50;
// the cut top of the walls, and how much of their inside shows below it
const RIM = 3;
const DEPTH = 10;
const WALL = RIM + DEPTH;
// how far open the flaps stand, leaning out from upright
const STAND = 64;
// shut, folded in just short of flat, so each lies a hair above what's in
// the box (exactly flat, they'd tie with the cards for which is drawn on top)
const SHUT = 177;
const CARD_H = 92;
const EASE = [0.32, 0.72, 0, 1] as const;

// kraft board: its speckle, and the long fibres running through it
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .18 0 0 0 0 .06 1.1 0 0 0 -.5'/></filter><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.006 .22' numOctaves='3' seed='8' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .98 0 0 0 0 .9 0 0 0 0 .75 .45 0 0 0 -.2'/></filter><rect width='100%' height='100%' filter='url(%23f)'/><rect width='100%' height='100%' filter='url(%23s)'/></svg>")`;
const KRAFT = "#c99c66";
const board = (shade: string) => `${GRAIN}, ${shade}, ${KRAFT}`;

type Car = (typeof HOT_WHEELS)[number];

const widthOf = (c: Car) => Math.round(CARD_H * c.aspect);
// a 1x and a 2x file, each fetched at twice the card's size (it's lifted
// larger when pointed at, and the small print on the card goes soft at
// anything less) and at the higher quality
const imageOf = (c: Car) =>
  getImageProps({
    src: c.src,
    alt: "",
    width: widthOf(c) * 2,
    height: CARD_H * 2,
    quality: 90,
  }).props;

// fetch and decode the cards ahead of time, so they're there (not loading)
// as the box opens
const warmed: HTMLImageElement[] = [];
export function warmCars() {
  if (warmed.length) return;
  for (const c of HOT_WHEELS) {
    const { src, srcSet } = imageOf(c);
    const img = new window.Image();
    if (srcSet) img.srcset = srcSet;
    img.src = src;
    img.decode().catch(() => {});
    warmed.push(img);
  }
}

// warms the cards once the page is idle
export const WarmCars = () => {
  useEffect(() => {
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
    idle(warmCars);
  }, []);
  return null;
};

// where each card lies on the floor of the box (its top left, px) and how
// it's turned
const LIE = [
  { x: 16, y: 16, r: -11 },
  { x: 62, y: 32, r: 7 },
  { x: 108, y: 8, r: -5 },
  { x: 138, y: 32, r: 12 },
];

// the flaps, in the order they're opened: the long ones lie over the short
const FLAPS: [Side, number][] = [
  ["top", 0.28],
  ["bottom", 0.36],
  ["left", 0.62],
  ["right", 0.7],
];

// stuck on the insides of the long flaps years ago, wherever there was
// room (the short ones are seen too edge on to make anything out)
const STICKERS: Partial<Record<Side, React.ReactNode>> = {
  bottom: (
    <>
      <Sticker
        viewBox="-136 190 604 172"
        pad={16}
        className="top-[22%] left-[8%] w-[46%] -rotate-[6deg]"
      >
        <path d={HW_FLAME} fill="#e22d3e" />
        <path
          d={HW_LETTERS}
          fill="#ffe900"
          stroke="#b3121f"
          strokeWidth={3}
          paintOrder="stroke"
        />
      </Sticker>
      <Logo
        src="/autobots-logo.png"
        w={2048}
        h={2048}
        className="top-[14%] right-[12%] w-[15%] rotate-[10deg]"
      />
    </>
  ),
  top: (
    <>
      <Logo
        src="/marvel-logo.png"
        w={537}
        h={241}
        className="top-[28%] left-[12%] w-[22%] -rotate-[5deg]"
      />
      <Logo
        src="/koenigsegg-logo.png"
        w={860}
        h={1243}
        className="top-[14%] left-[45%] w-[10%] -rotate-[6deg]"
      />
      <Logo
        src="/hp-logo.png"
        w={739}
        h={415}
        className="top-[16%] right-[5%] w-[28%] rotate-[7deg]"
      />
    </>
  ),
};

export const ToyBox = () => {
  const [pointed, setPointed] = useState<number | null>(null);
  const [kept, setKept] = useState<number | null>(null);
  const up = pointed ?? kept;
  const car = up === null ? null : HOT_WHEELS[up];

  // dark inside until the flaps are out of the way
  const still = !!useReducedMotion();
  const [dark, fade] = useAnimate<HTMLSpanElement>();
  useEffect(() => {
    if (still) return;
    fade(
      dark.current,
      { opacity: [0.75, 0] },
      { delay: 0.34, duration: 1, ease: [0.4, 0, 0.3, 1] },
    );
    // on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* the box, with room around it for its open flaps */}
      <div
        className="relative mx-auto [perspective:1100px]"
        style={{ width: OPEN_W + SHORT * 1.15, height: OPEN_H + LONG * 1.15 }}
      >
        <div
          className="absolute [transform-style:preserve-3d]"
          style={{
            left: "50%",
            top: "50%",
            width: OPEN_W,
            height: OPEN_H,
            marginLeft: -OPEN_W / 2,
            marginTop: -OPEN_H / 2,
          }}
        >
          {/* its shadow on the floor */}
          <span
            aria-hidden
            className="absolute -inset-1 translate-y-2 rounded-[4px] bg-(--ink) opacity-30 blur-[7px]"
          />
          <Walls />

          {/* the floor, and what's been on it for years */}
          <div
            className="absolute overflow-hidden"
            style={{ inset: WALL, background: board("#a27a4c") }}
          >
            <Toys />
            {/* the walls' shadow, falling across the toys too: the light's
              from the top left */}
            <span
              aria-hidden
              className="absolute inset-0 shadow-[inset_0_10px_10px_-4px_rgb(50_28_8/0.5),inset_9px_0_10px_-6px_rgb(50_28_8/0.4),inset_-6px_0_8px_-6px_rgb(50_28_8/0.2),inset_0_-5px_7px_-6px_rgb(50_28_8/0.2)]"
            />
          </div>

          {/* the cards, lying on the top of the pile */}
          <div
            className="absolute isolate"
            style={{ inset: WALL }}
            onPointerLeave={() => setPointed(null)}
          >
            {HOT_WHEELS.map((c, i) => (
              <Card
                key={c.name}
                car={c}
                index={i}
                up={up === i}
                onPoint={() => setPointed(i)}
                onLeave={() => setPointed((p) => (p === i ? null : p))}
                onKeep={() => setKept((k) => (k === i ? null : i))}
              />
            ))}
          </div>

          {/* the dark of a shut box */}
          <span
            ref={dark}
            aria-hidden
            className="pointer-events-none absolute bg-[#24140a]"
            style={{ inset: RIM, opacity: still ? 0 : 0.75 }}
          />

          {FLAPS.map(([side, delay]) => (
            <Flap key={side} side={side} delay={delay}>
              {STICKERS[side]}
            </Flap>
          ))}
        </div>
      </div>

      {/* beneath: the card that's up */}
      <div className="relative h-4 text-xs">
        <AnimatePresence mode="wait" initial={false}>
          {car && (
            <motion.p
              key={car.name}
              className="absolute inset-0 truncate text-center"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <span className="text-neutral-800">{car.name}</span>
              <span className="text-neutral-500"> · {car.line}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ---------- the walls ---------- */

// looking down into the box: the cut top of the walls all round, and the
// inside of each running down to the floor. lit from the top left, so the
// far and left walls are in their own shade and the others catch the light
const WALLS = [
  {
    clip: `polygon(0 0, 100% 0, calc(100% - ${DEPTH}px) ${DEPTH}px, ${DEPTH}px ${DEPTH}px)`,
    shade: "linear-gradient(180deg, #8f6a40, #7a5732)",
  },
  {
    clip: `polygon(0 0, ${DEPTH}px ${DEPTH}px, ${DEPTH}px calc(100% - ${DEPTH}px), 0 100%)`,
    shade: "linear-gradient(90deg, #a07847, #8a6439)",
  },
  {
    clip: `polygon(100% 0, 100% 100%, calc(100% - ${DEPTH}px) calc(100% - ${DEPTH}px), calc(100% - ${DEPTH}px) ${DEPTH}px)`,
    shade: "linear-gradient(270deg, #c99a63, #b68753)",
  },
  {
    clip: `polygon(${DEPTH}px calc(100% - ${DEPTH}px), calc(100% - ${DEPTH}px) calc(100% - ${DEPTH}px), 100% 100%, 0 100%)`,
    shade: "linear-gradient(0deg, #c1925c, #ab7e4c)",
  },
];

const Walls = () => (
  <>
    <span
      aria-hidden
      className="absolute inset-0 rounded-[2px] shadow-[inset_0_0_0_1px_rgb(255_240_215/0.35)]"
      style={{ background: board("linear-gradient(#ddb683, #cfa36d)") }}
    />
    {WALLS.map(({ clip, shade }, i) => (
      <span
        key={i}
        aria-hidden
        className="absolute"
        style={{ inset: RIM, clipPath: clip, background: board(shade) }}
      />
    ))}
  </>
);

/* ---------- a flap ---------- */

type Side = "top" | "bottom" | "left" | "right";

// hinged on the rim. shut, it lies folded in over the opening, its outside
// up; it comes unstuck, swings up towards you and over, flops a little past
// where it stands and settles, leaning out from the box with its inside
// showing. it darkens as it turns edge on to the light
const Flap = ({
  side,
  delay,
  children,
}: {
  side: Side;
  delay: number;
  // what's stuck on its inside
  children?: React.ReactNode;
}) => {
  const still = !!useReducedMotion();
  const long = side === "top" || side === "bottom";
  const sign = side === "top" || side === "right" ? -1 : 1;
  const axis = long ? "rotateX" : "rotateY";
  const open = sign * STAND;
  const angle = useMotionValue(still ? open : sign * SHUT);
  // turned away from the light (it's from the top left), the top and left
  // ones stand a little in their own shade
  const away = side === "top" ? 0.12 : side === "left" ? 0.07 : 0;
  const shade = useTransform(
    angle,
    [-180, -90, -STAND, 0, STAND, 90, 180],
    [0, 0.4, 0.09 + away, 0, 0.09 + away, 0.4, 0],
  );

  useEffect(() => {
    if (still) return;
    let stop = false;
    let run: { stop: () => void } | undefined;
    // a tug to free it, then let go
    run = animate(angle, sign * (long ? 165 : 169), {
      delay,
      duration: 0.16,
      ease: [0.3, 0, 0.6, 1],
    });
    (run as unknown as Promise<void>).then(() => {
      if (stop) return;
      run = animate(angle, open, {
        type: "spring",
        stiffness: 150,
        damping: 12.5,
        mass: 0.9,
      });
    });
    return () => {
      stop = true;
      run?.stop();
    };
  }, [angle, delay, long, open, sign, still]);

  const place: React.CSSProperties = long
    ? {
        left: 0,
        width: OPEN_W,
        height: LONG,
        [side]: -LONG,
        transformOrigin: side === "top" ? "50% 100%" : "50% 0%",
      }
    : {
        top: 0,
        height: OPEN_H,
        width: SHORT,
        [side]: -SHORT,
        transformOrigin: side === "left" ? "100% 50%" : "0% 50%",
      };
  // the free edge, along which the corners are cut back a little
  const cut = {
    top: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
    bottom: "polygon(0 0, 100% 0, 97% 100%, 3% 100%)",
    left: "polygon(0 4%, 100% 0, 100% 100%, 0 96%)",
    right: "polygon(0 0, 100% 4%, 100% 96%, 0 100%)",
  }[side];
  // the outside is turned over the hinge, so its free edge is drawn where
  // the inside's hinge is
  const outCut = {
    top: "polygon(0 0, 100% 0, 97% 100%, 3% 100%)",
    bottom: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
    left: "polygon(0 0, 100% 4%, 100% 96%, 0 100%)",
    right: "polygon(0 4%, 100% 0, 100% 100%, 0 96%)",
  }[side];
  // towards the hinge, and towards the free edge
  const hinge = {
    top: "0deg",
    bottom: "180deg",
    left: "270deg",
    right: "90deg",
  }[side];
  // the corrugation, showing along the cut free edge
  const edge = {
    top: "top / 100% 2px",
    bottom: "bottom / 100% 2px",
    left: "left / 2px 100%",
    right: "right / 2px 100%",
  }[side];
  const flutes = `repeating-linear-gradient(${long ? "90deg" : "0deg"}, transparent 0 2px, rgb(90 60 25 / 0.35) 2px 3px) ${edge} no-repeat`;
  // the outside's free edge, turned over the hinge with it
  const outEdge = {
    top: "bottom / 100% 2px",
    bottom: "top / 100% 2px",
    left: "right / 2px 100%",
    right: "left / 2px 100%",
  }[side];
  const outFlutes = `repeating-linear-gradient(${long ? "90deg" : "0deg"}, transparent 0 2px, rgb(90 60 25 / 0.35) 2px 3px) ${outEdge} no-repeat`;
  const face =
    "absolute inset-0 block overflow-hidden [backface-visibility:hidden]";

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute block [transform-style:preserve-3d]"
      // the long ones lie over the short ones when shut
      style={{ ...place, [axis]: angle, z: long ? 2 : 0 }}
    >
      {/* the inside: paler, a crease along the hinge, and where long, the
        cut ends of the tape folded round its edge */}
      <span
        className={face}
        style={{
          clipPath: cut,
          background: `${flutes}, linear-gradient(${hinge}, rgb(70 40 10 / 0.28), transparent 7%), ${board(`linear-gradient(${hinge}, #c29360, #dcb683)`)}`,
        }}
      >
        {long && (
          <span
            className={cn(
              "absolute left-1/2 block h-[16%] w-[17%] -translate-x-1/2 bg-[#efe3c4]/75",
              side === "top" ? "top-0" : "bottom-0",
            )}
            style={{
              clipPath:
                side === "top"
                  ? "polygon(0 0, 100% 0, 100% 100%, 80% 80%, 60% 100%, 40% 76%, 20% 100%, 0 82%)"
                  : "polygon(0 18%, 20% 0, 40% 24%, 60% 0, 80% 20%, 100% 0, 100% 100%, 0 100%)",
            }}
          />
        )}
        {children}
        <motion.span
          className="absolute inset-0 block bg-[#2a1606]"
          style={{ opacity: shade }}
        />
      </span>

      {/* the outside, seen while it's shut: across the long ones' seam, a
        strip of tape and "toys" in marker */}
      <span
        className={face}
        style={{
          clipPath: outCut,
          transform: `${axis}(180deg)`,
          background: `${outFlutes}, ${board("linear-gradient(#c89a63, #c0915a)")}`,
        }}
      >
        {long && (
          <>
            <span
              className={cn(
                "absolute left-1/2 block h-[44%] w-[17%] -translate-x-1/2 bg-[linear-gradient(90deg,rgb(255_255_255/0.25),rgb(239_227_196/0.75)_30%,rgb(239_227_196/0.75)_70%,rgb(255_255_255/0.2))]",
                side === "top" ? "bottom-0" : "top-0",
              )}
            />
            <span
              className={cn(
                hand.className,
                "absolute left-[12%] -rotate-[4deg] text-[34px] leading-none text-[#2b2118]/80",
                side === "top"
                  ? "top-full -translate-y-1/2"
                  : "top-0 -translate-y-1/2",
              )}
            >
              toys
            </span>
          </>
        )}
        <motion.span
          className="absolute inset-0 block bg-[#2a1606]"
          style={{ opacity: shade }}
        />
      </span>
    </motion.span>
  );
};

/* ---------- the toys underneath ---------- */

type Hue = [base: string, light: string, dark: string];
const RED: Hue = ["#d0352b", "#e8655a", "#97231b"];
const BLUE: Hue = ["#2c64c4", "#5a8ae0", "#1c4690"];
const YELLOW: Hue = ["#f2c230", "#fad866", "#b88d12"];
const GREEN: Hue = ["#3a9a4c", "#66bd74", "#246e38"];
const WHITE: Hue = ["#ece7dd", "#ffffff", "#b6ae9f"];
const ORANGE: Hue = ["#ec7a2c", "#f69c5c", "#b0541a"];

// a lego brick (or a thin plate) seen from above: its top, a sliver of its
// side, and the studs, each catching the light on its top left
const Brick = ({
  x,
  y,
  r,
  cols,
  rows,
  hue: [base, light, dark],
  plate,
}: {
  x: number;
  y: number;
  r: number;
  cols: number;
  rows: number;
  hue: Hue;
  plate?: boolean;
}) => {
  const U = 8;
  const side = plate ? 1.4 : 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect y={side} width={cols * U} height={rows * U} rx="1" fill={dark} />
      <rect width={cols * U} height={rows * U} rx="1" fill={base} />
      <rect
        x=".5"
        y=".5"
        width={cols * U - 1}
        height={rows * U - 1}
        rx=".8"
        fill="none"
        stroke={light}
        strokeOpacity=".5"
        strokeWidth=".6"
      />
      {Array.from({ length: cols * rows }, (_, k) => {
        const cx = U / 2 + (k % cols) * U;
        const cy = U / 2 + Math.floor(k / cols) * U;
        return (
          <g key={k}>
            <circle cx={cx + 0.5} cy={cy + 1} r="2.6" fill={dark} />
            <circle cx={cx} cy={cy} r="2.6" fill={base} />
            <path
              d={`M${cx - 1.9} ${cy + 0.6}a2 2 0 0 1 2.5-2.5`}
              stroke={light}
              strokeWidth=".9"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}
    </g>
  );
};

const MARBLES: [number, number, string][] = [
  [54, 7, "#3aa59a"],
  [7, 84, "#7b5bd6"],
  [140, 129, "#e05a7a"],
  [150, 133, "#3aa59a"],
  [203, 104, "#f0a52c"],
];

// what's been in the box for years, seen from above: lego, marbles, a rubber
// ball, a letter block and a loose die-cast car, fitted into the gaps the
// cards leave and tucked under their edges. the floor is OPEN less the
// walls, 210 by 138
const Toys = () => (
  <svg
    aria-hidden
    viewBox={`0 0 ${OPEN_W - 2 * WALL} ${OPEN_H - 2 * WALL}`}
    className="absolute inset-0 size-full"
  >
    <defs>
      <filter id="toy-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow
          dx="1"
          dy="1.6"
          stdDeviation="1.2"
          floodColor="#2a1606"
          floodOpacity="0.5"
        />
      </filter>
      {/* the ball's roundness, laid over its panels */}
      <radialGradient id="toy-ball" cx="34%" cy="30%" r="75%">
        <stop offset="0" stopColor="#fff" stopOpacity=".45" />
        <stop offset=".45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#3a1a06" stopOpacity=".35" />
      </radialGradient>
      {MARBLES.map(([, , c], i) => (
        <radialGradient key={i} id={`toy-m${i}`} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".25" stopColor={c} stopOpacity=".85" />
          <stop offset="1" stopColor={c} />
        </radialGradient>
      ))}
    </defs>
    <g filter="url(#toy-shadow)">
      {/* peeking out from under the cards */}
      <Brick x={192} y={58} r={8} cols={3} rows={2} hue={YELLOW} />
      <Brick x={12} y={3} r={-4} cols={4} rows={1} hue={GREEN} plate />
      <Brick x={10} y={46} r={84} cols={2} rows={1} hue={ORANGE} />
      <Brick x={186} y={112} r={-20} cols={3} rows={2} hue={BLUE} />

      {/* a loose die-cast car, its paint worn, along the bottom */}
      <g transform="translate(68 122) rotate(3)">
        <rect width="34" height="15" rx="5" fill="#2e8a57" />
        <rect x="9" y="2.5" width="14" height="10" rx="2.5" fill="#a9d6c0" />
        <rect x="12" y="3.5" width="8" height="8" rx="1.5" fill="#2e8a57" />
        <path d="M27 4h3M27 11h3" stroke="#7fc4a0" strokeWidth=".8" />
        {[
          [5, -1.5],
          [25, -1.5],
          [5, 13.5],
          [25, 13.5],
        ].map(([x, y]) => (
          <rect
            key={`${x}${y}`}
            x={x}
            y={y}
            width="5"
            height="3"
            rx="1"
            fill="#1d1d1f"
          />
        ))}
      </g>

      {/* a beach ball, in the gap at the top between the cards, its panels
        running round from the cap on top */}
      <g transform="translate(86 15) rotate(-20) scale(.93)">
        {["#e5473b", "#fff8ea", "#f2b833", "#fff8ea", "#3f7fd6", "#fff8ea"].map(
          (c, i) => (
            <path
              key={i}
              d={`M0 0L${14 * Math.cos((i * Math.PI) / 3)} ${14 * Math.sin((i * Math.PI) / 3)}A14 14 0 0 1 ${14 * Math.cos(((i + 1) * Math.PI) / 3)} ${14 * Math.sin(((i + 1) * Math.PI) / 3)}Z`}
              fill={c}
            />
          ),
        )}
        <circle r="3.2" fill="#fff8ea" />
        <circle r="14" fill="url(#toy-ball)" />
      </g>

      {/* a little tower in the corner, a yellow 2x2 on a red 2x4 */}
      <Brick x={3} y={114} r={-5} cols={4} rows={2} hue={RED} />
      <Brick x={15} y={113} r={-5} cols={2} rows={2} hue={YELLOW} />
      <Brick x={40} y={122} r={-14} cols={2} rows={1} hue={WHITE} />

      {/* a letter block, in the top right corner */}
      <g transform="translate(184 5) rotate(10) scale(.92)">
        <rect y="2.5" width="24" height="24" rx="2" fill="#c99a2e" />
        <rect width="24" height="24" rx="2" fill="#f3d77f" />
        <rect
          x="2.2"
          y="2.2"
          width="19.6"
          height="19.6"
          rx="1.5"
          fill="none"
          stroke="#c99a2e"
          strokeWidth=".9"
        />
        <text
          x="12"
          y="17.4"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#2f68c9"
          fontFamily="Georgia, serif"
        >
          A
        </text>
      </g>

      {/* marbles */}
      {MARBLES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.2" fill={`url(#toy-m${i})`} />
      ))}
    </g>
  </svg>
);

/* ---------- one carded car ---------- */

const Card = ({
  car,
  index,
  up,
  onPoint,
  onLeave,
  onKeep,
}: {
  car: Car;
  index: number;
  up: boolean;
  onPoint: () => void;
  onLeave: () => void;
  onKeep: () => void;
}) => {
  const still = !!useReducedMotion();
  const width = widthOf(car);
  const { src, srcSet } = imageOf(car);
  const { x, y, r } = LIE[index];

  return (
    // the button stays where the card lies, so pointing at its edge never
    // has it slide out from under the cursor
    <button
      type="button"
      aria-label={`${car.name}, ${car.line}`}
      aria-pressed={up}
      data-sound="open"
      onPointerEnter={onPoint}
      onFocus={onPoint}
      onBlur={onLeave}
      onClick={onKeep}
      className="absolute cursor-pointer outline-none"
      style={{
        left: x,
        top: y,
        width,
        height: CARD_H,
        rotate: `${r}deg`,
        zIndex: up ? 10 : index + 1,
      }}
    >
      {/* lifted up out of the box towards you, turning a little straighter */}
      <motion.span
        className="absolute inset-0 block"
        initial={false}
        animate={
          up
            ? { scale: 1.14, rotate: -r * 0.4, y: -5 }
            : { scale: 1, rotate: 0, y: 0 }
        }
        transition={
          still
            ? { duration: 0 }
            : up
              ? { type: "spring", stiffness: 420, damping: 28 }
              : { duration: 0.35, ease: EASE }
        }
      >
        {/* the same files as were warmed */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          srcSet={srcSet}
          alt=""
          draggable={false}
          className={cn(
            "absolute inset-0 size-full object-contain transition-[filter] duration-300",
            up
              ? "drop-shadow-[2px_14px_10px_rgb(40_20_5/0.45)]"
              : "drop-shadow-[1px_2px_2px_rgb(40_20_5/0.5)]",
          )}
        />
      </motion.span>
    </button>
  );
};

/* ---------- a sticker ---------- */

// die-cut, with the white margin round it, a little worn and lifted at
// its edge
function Sticker({
  viewBox,
  pad,
  className,
  children,
}: {
  viewBox: string;
  // the white margin, in the drawing's own units
  pad: number;
  className?: string;
  children: React.ReactNode;
}) {
  const id = `sticker-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      overflow="visible"
      // drawn a little tall: the flaps lean back, and seen that steeply
      // they'd be flattened past making out
      className={cn("absolute block h-auto scale-y-[1.3]", className)}
    >
      <defs>
        <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius={pad}
            result="cut"
          />
          <feFlood floodColor="#fbf7ee" />
          <feComposite in2="cut" operator="in" result="paper" />
          <feGaussianBlur in="cut" stdDeviation={pad * 0.35} result="soft" />
          <feOffset in="soft" dy={pad * 0.35} result="drop" />
          <feComponentTransfer in="drop" result="shadow">
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="paper" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id})`} opacity=".94">
        {children}
      </g>
    </svg>
  );
}

// one of the logos, made into a sticker: fetched small, at about three
// times the size it's stuck on at
function Logo({
  src,
  w,
  h,
  className,
}: {
  src: string;
  w: number;
  h: number;
  className?: string;
}) {
  const { src: small } = getImageProps({
    src,
    alt: "",
    width: 192,
    height: Math.round((192 * h) / w),
  }).props;
  return (
    <Sticker viewBox={`0 0 ${w} ${h}`} pad={w / 40} className={className}>
      <image href={small} width={w} height={h} />
    </Sticker>
  );
}
