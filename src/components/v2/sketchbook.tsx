"use client";

import Image from "next/image";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { SKETCH_PAGES } from "./data";

/*
 * A spiral-bound sketchbook lying on the desk, seen from above, with the
 * pencil beside it and a few crumbs of eraser. Tapping the page turns it:
 * it lifts up over the binding and away, uncovering the next sketch
 * beneath. Past the last page they all fall back, and it starts again from
 * the first.
 * Pointing at the page lifts its bottom edge a touch, like a page about to
 * be turned.
 */

const PAPER = "#fdfcf8";
const EASE = [0.32, 0.72, 0, 1] as const;

export const Sketchbook = ({
  sizes,
  className,
}: {
  // the `sizes` a page's image renders at
  sizes: string;
  className?: string;
}) => {
  const [at, setAt] = useState(0);
  // the page we came from, so a wrap back to the start can stagger the fall
  const [from, setFrom] = useState(0);
  const n = SKETCH_PAGES.length;
  const turn = () => {
    setFrom(at);
    setAt((at + 1) % n);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* the desk: the book a little askew, the pencil to its right */}
      <div className="relative aspect-[10/9]">
        <div className="absolute top-[3%] left-[4%] w-[66%] -rotate-[2.5deg]">
          <Book at={at} from={from} onTurn={turn} sizes={sizes} />
        </div>
        <Pencil />
        <Shavings />
      </div>
      <p className="text-xs">
        <span className="text-neutral-800">page {at + 1}</span>
        <span className="text-neutral-500"> of {n}</span>
      </p>
    </div>
  );
};

const Book = ({
  at,
  from,
  onTurn,
  sizes,
}: {
  at: number;
  from: number;
  onTurn: () => void;
  sizes: string;
}) => {
  const n = SKETCH_PAGES.length;
  return (
    // the kraft back board shows a little below and to the right of the pages
    <div className="relative rounded-[3px] bg-[#b59b76] pr-[1.2%] pb-[1.6%] shadow-[0_1px_1px_rgb(0_0_0/0.12),0_8px_16px_-8px_rgb(60_40_20/0.45)]">
      <div className="relative aspect-[4/5] [perspective:1100px]">
        {/* the edges of the pages under the top one */}
        <span className="absolute inset-x-0 top-0 -bottom-[3px] rounded-b-[2px] bg-[#ece8de]" />
        <span className="absolute inset-x-0 top-0 -bottom-[1.5px] rounded-b-[2px] bg-[#f5f2ea]" />
        {SKETCH_PAGES.map((page, i) => (
          <Page
            key={page.src}
            src={page.src}
            sizes={sizes}
            index={i}
            at={at}
            // wrapping back: the pages fall back in, the first one last
            backDelay={at === 0 && from > 0 ? (from - 1 - i) * 0.09 : 0}
            z={n - i}
            onTurn={onTurn}
          />
        ))}
      </div>
      <Binding />
    </div>
  );
};

const Page = ({
  src,
  sizes,
  index,
  at,
  backDelay,
  z,
  onTurn,
}: {
  src: string;
  sizes: string;
  index: number;
  at: number;
  backDelay: number;
  z: number;
  onTurn: () => void;
}) => {
  const reduce = useReducedMotion();
  const top = index === at;
  const gone = index < at;
  // pointed at (or focused), the top page lifts its bottom edge a touch. one
  // animate target for everything, so the lift can never fight the turn
  const [lifted, setLifted] = useState(false);
  const state = gone ? "gone" : top && lifted && !reduce ? "lift" : "flat";
  // how far over it is. the fades follow the angle rather than running
  // alongside it, so a page lying flat is always fully there: the page goes
  // as it passes over the binding, and its sketch before it stands on edge,
  // so what goes over is the blank back of the sheet
  const angle = useMotionValue(0);
  const opacity = useTransform(angle, [45, 100], [1, 0]);
  const ink = useTransform(angle, [50, 88], [1, 0]);

  return (
    <motion.button
      type="button"
      onClick={onTurn}
      disabled={!top}
      aria-label={top ? "turn the page" : undefined}
      aria-hidden={!top}
      data-sound="open"
      tabIndex={top ? 0 : -1}
      className={cn(
        "absolute inset-0 block rounded-b-[2px] outline-none",
        top ? "cursor-pointer" : "pointer-events-none",
      )}
      style={{
        zIndex: z,
        backgroundColor: PAPER,
        originY: 0,
        rotateX: angle,
        opacity,
      }}
      initial={false}
      animate={state}
      onHoverStart={() => setLifted(true)}
      onHoverEnd={() => setLifted(false)}
      onFocus={() => setLifted(true)}
      onBlur={() => setLifted(false)}
      variants={{
        flat: {
          rotateX: 0,
          boxShadow: "0 1px 1px rgb(0 0 0 / 0.06)",
          transition: reduce
            ? { duration: 0 }
            : { duration: 0.6, ease: EASE, delay: backDelay },
        },
        lift: {
          rotateX: 7,
          boxShadow: "0 6px 10px -4px rgb(0 0 0 / 0.18)",
          transition: { duration: 0.35, ease: EASE },
        },
        gone: {
          rotateX: 100,
          boxShadow: "0 18px 24px -8px rgb(0 0 0 / 0.2)",
          transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE },
        },
      }}
    >
      {/* the sketch, drawn on the page: its own paper multiplies into this
        one, so only the pencil and ink show */}
      <motion.span
        className="absolute inset-[6%] block"
        style={{ opacity: ink }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-contain mix-blend-multiply"
        />
      </motion.span>
    </motion.button>
  );
};

// the wire coil along the top: a loop through each punched hole, a whole
// number of them spread across the page
const RINGS = 22;
const Binding = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-x-[4%] -top-[7px] z-50 flex justify-between"
  >
    {Array.from({ length: RINGS }, (_, i) => (
      <svg key={i} viewBox="0 0 6 14" className="h-[14px] w-[6px]">
        {/* the hole in the page, then the wire over it */}
        <circle cx="3" cy="10.2" r="1.5" fill="#3a352d" opacity="0.55" />
        <rect
          x="0.9"
          y="1"
          width="4.2"
          height="10.5"
          rx="2.1"
          fill="none"
          stroke="#2d2c2a"
          strokeWidth="1.4"
        />
        <path
          d="M1.7 2.4v4"
          stroke="#8b8a86"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </svg>
    ))}
  </span>
);

// a pencil lying on the desk beside the book; it rolls a little when
// pointed at
const Pencil = () => (
  <motion.svg
    aria-hidden
    viewBox="0 0 160 14"
    className="absolute top-[46%] left-[58%] w-[62%] drop-shadow-[0_2px_1.5px_rgb(60_40_20/0.3)]"
    style={{ rotate: -64, originX: 0.5, originY: 0.5 }}
    whileHover={{ y: -2, rotate: -61 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
  >
    {/* eraser, ferrule, painted body with a lit facet, the sharpened wood and
      the lead */}
    <rect x="0" y="1.5" width="12" height="11" rx="2.5" fill="#e3a49b" />
    <rect x="11" y="1" width="12" height="12" fill="#c9c7c1" />
    <path d="M14 1v12M17 1v12M20 1v12" stroke="#a9a69f" strokeWidth="0.8" />
    <rect x="23" y="1" width="110" height="12" fill="#3f5a48" />
    <rect x="23" y="3.4" width="110" height="2.6" fill="#5f7d69" />
    <rect x="23" y="10" width="110" height="1.6" fill="#33493b" />
    <path d="M133 1 L151 5.6 L151 8.4 L133 13 Z" fill="#e8cfa3" />
    <path
      d="M133 1 L136.5 3.2 L133 5 Z M133 9 L136.5 10.8 L133 13 Z"
      fill="#3f5a48"
    />
    <path d="M151 5.6 L159 7 L151 8.4 Z" fill="#3b3b3a" />
  </motion.svg>
);

// a few crumbs of eraser by the pencil's end
const Shavings = () => (
  <svg
    aria-hidden
    viewBox="0 0 60 30"
    className="pointer-events-none absolute right-[8%] bottom-[4%] w-[20%]"
  >
    <circle cx="8" cy="18" r="1.3" fill="#c9a19b" />
    <circle cx="13" cy="21" r="0.9" fill="#bfa29d" />
    <circle cx="21" cy="16" r="1.1" fill="#c9a19b" />
    <circle cx="30" cy="23" r="0.7" fill="#a59a96" />
    <circle cx="17" cy="25" r="0.6" fill="#a59a96" />
  </svg>
);
