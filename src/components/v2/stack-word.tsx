"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Dotted, hint } from "./intro-bits";
import { STACK } from "./stack";
import { ld } from "./theme";

/*
 * "full stack", with a little manila folder after it. Pointing at it (or
 * focusing, or tapping) opens the folder: its front tips forward and what
 * I work with comes up out of it, a tile at a time, fanning out in an arc
 * above. Pointing at a tile lifts it and names it. Closing tucks them all
 * back in.
 */

const ACCENT = ld("#a8741a", "#e0aa4a");
// the fan: small tiles in a tidy row, barely arched, resting in the gap
// above the line rather than over the name
const TILE = 24;
const STEP = 27;
const RISE = { base: 25, arch: 5 };
const HALF = ((STACK.length - 1) / 2) * STEP;
// keep the fan this far inside the viewport
const EDGE = 12;

const fan = (i: number) => {
  const x = (i - (STACK.length - 1) / 2) * STEP;
  const t = x / (HALF + STEP);
  return { x, y: -(RISE.base + RISE.arch * (1 - t * t)), rotate: t * 6 };
};

const SPRING = {
  type: "spring",
  stiffness: 340,
  damping: 26,
  mass: 0.7,
} as const;

export const StackWord = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [named, setNamed] = useState<string | null>(null);
  // sideways shift so the whole fan stays on screen
  const [shift, setShift] = useState(0);
  const folder = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const show = (on: boolean) => {
    if (on && folder.current) {
      const r = folder.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const reach = HALF + TILE / 2 + EDGE;
      setShift(
        Math.max(reach - cx, 0) + Math.min(window.innerWidth - reach - cx, 0),
      );
    }
    if (!on) setNamed(null);
    setOpen(on);
  };

  return (
    <span
      tabIndex={0}
      style={{ "--accent": ACCENT } as React.CSSProperties}
      // (an arrow, not a hand: see cursors.tsx)
      data-cursor="arrow"
      className={cn("relative inline-block", hint)}
      onMouseEnter={() => show(true)}
      onMouseLeave={() => show(false)}
      onFocus={() => show(true)}
      onBlur={() => show(false)}
      onClick={() => show(!open)}
    >
      <Dotted>{children}</Dotted>
      <span className="sr-only">: {STACK.map((t) => t.name).join(", ")}</span>
      <span
        ref={folder}
        aria-hidden
        // centred on the words' ink, measured in a headless browser
        className="relative ml-1 inline-flex translate-y-[-0.16em] align-middle"
      >
        <FolderBack open={open} />

        {/* the tiles, from the folder's mouth; above its back, under its front */}
        <span
          className={cn(
            "absolute top-[40%] left-1/2 z-10",
            !open && "pointer-events-none",
          )}
          style={{ translate: `${shift}px 0` }}
        >
          {STACK.map((t, i) => {
            const to = fan(i);
            // left to right going out; all at once, quickly, going back in
            const delay = open ? 0.04 + i * 0.03 : 0;
            return (
              <motion.span
                key={t.id}
                className="absolute block"
                style={{
                  width: TILE,
                  height: TILE,
                  left: -TILE / 2,
                  top: -TILE / 2,
                }}
                initial={false}
                animate={
                  open
                    ? { ...to, scale: 1, opacity: 1 }
                    : reduce
                      ? { ...to, scale: 1, opacity: 0 }
                      : { x: -shift, y: 2, rotate: 0, scale: 0.3, opacity: 0 }
                }
                transition={
                  reduce
                    ? { duration: 0.15 }
                    : open
                      ? {
                          ...SPRING,
                          delay,
                          opacity: { duration: 0.12, delay },
                        }
                      : {
                          duration: 0.22,
                          ease: [0.4, 0, 0.6, 1],
                          opacity: { duration: 0.12, delay: 0.1 },
                        }
                }
                onMouseEnter={() => setNamed(t.id)}
                onMouseLeave={() => setNamed(null)}
              >
                <Tile tech={t} lifted={named === t.id} tilt={to.rotate} />
              </motion.span>
            );
          })}
        </span>

        <FolderFront open={open} />
      </span>
    </span>
  );
};

// the colour a tile is tinted from, where the logo's own is too light to
// give it any body: javascript's yellow, so pale it comes out near white
const TONE: Record<string, string> = { javascript: "#d9b300" };

// a tile like the open hobby words: a soft bubble in a tint of the logo's
// colour, lit along the top and deeper along the bottom. lifted, it rises a
// touch and its name shows above it on a little label, level (turned back by
// the tile's tilt). at night the tile is dark, a step up from the page with
// a little more of the colour in it, the logo a touch lighter so it shows,
// and the black logos turn light
const NIGHT_TILE = "#24221e";
const black = (c: string) => c === "#000000";
const logoFill = (c: string) =>
  black(c)
    ? "var(--color-neutral-900)"
    : ld(c, `color-mix(in srgb, ${c} 78%, #fff)`);
const Tile = ({
  tech,
  lifted,
  tilt,
}: {
  tech: (typeof STACK)[number];
  lifted: boolean;
  tilt: number;
}) => (
  <span
    style={
      {
        "--brand": TONE[tech.id] ?? tech.color,
        // a black logo's tint is just grey, so it's kept faint
        "--tint": black(tech.color) ? "6%" : "13%",
        "--tint-night": black(tech.color) ? "0%" : "20%",
        "--night": NIGHT_TILE,
      } as React.CSSProperties
    }
    className={cn(
      "relative flex size-full items-center justify-center rounded-[6px] bg-[color-mix(in_srgb,var(--brand)_var(--tint),#fff)] transition-[translate,scale,box-shadow] duration-200 ease-out dark:bg-[color-mix(in_srgb,var(--brand)_var(--tint-night),var(--night))]",
      "shadow-[inset_0_1.5px_1px_rgb(255_255_255/0.9),inset_0_-2px_3px_color-mix(in_srgb,var(--brand)_18%,transparent),0_1px_1px_rgb(0_0_0/0.08)]",
      "dark:shadow-[inset_0_1px_0.5px_rgb(255_255_255/0.12),inset_0_-2px_3px_rgb(0_0_0/0.35),0_1px_2px_rgb(0_0_0/0.5)]",
      lifted &&
        "-translate-y-0.5 scale-110 shadow-[inset_0_1.5px_1px_rgb(255_255_255/0.9),inset_0_-2px_3px_color-mix(in_srgb,var(--brand)_18%,transparent),0_2px_2px_rgb(0_0_0/0.08),0_4px_6px_-3px_rgb(0_0_0/0.12)] dark:shadow-[inset_0_1px_0.5px_rgb(255_255_255/0.14),inset_0_-2px_3px_rgb(0_0_0/0.35),0_2px_2px_rgb(0_0_0/0.5),0_6px_8px_-3px_rgb(0_0_0/0.6)]",
    )}
  >
    <svg
      viewBox="0 0 24 24"
      className="size-[14px]"
      style={{ fill: logoFill(tech.color) }}
    >
      {/* the javascript square has its letters cut out; ink shows through
        them (inset, so no dark hairline shows round the square's edge) */}
      {tech.id === "javascript" && (
        <rect x="0.5" y="0.5" width="23" height="23" fill="#323330" />
      )}
      <path d={tech.path} />
    </svg>
    <span
      style={{ rotate: `${-tilt}deg` }}
      className={cn(
        "absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded-full border border-neutral-200/80 bg-white px-1.5 py-[3px] text-[11px] leading-none whitespace-nowrap text-neutral-600 shadow-[0_1px_2px_rgb(0_0_0/0.06)] [-webkit-text-stroke:0] transition-opacity duration-200",
        lifted ? "opacity-100" : "opacity-0",
      )}
    >
      {tech.name.toLowerCase()}
    </span>
  </span>
);

/* ---------- the folder: back (with its papers), and front ---------- */

// grey at rest; manila on hover, or while open
const back =
  "fill-neutral-300 transition-[fill] duration-300 group-hover/w:fill-[#d9a441] group-focus-visible/w:fill-[#d9a441]";
const front =
  "fill-neutral-400 transition-[fill] duration-300 group-hover/w:fill-[#efc45e] group-focus-visible/w:fill-[#efc45e]";

const FolderBack = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 16 16" className="size-[1.1em] overflow-visible">
    <path
      className={back}
      d="M1.5 4a1 1 0 0 1 1-1h3.4l1.5 1.5h6.1a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z"
    />
    {/* the papers inside; they rise a little as it opens */}
    <motion.g
      initial={false}
      animate={{ y: open ? -1.6 : 0 }}
      transition={SPRING}
    >
      <rect x="3.2" y="5.6" width="9.6" height="6" rx="0.5" fill="#fff" />
      <rect x="4" y="6.4" width="8.4" height="6" rx="0.5" fill="#f4f1ea" />
    </motion.g>
  </svg>
);

const FolderFront = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 16 16"
    className="pointer-events-none absolute inset-0 z-20 size-[1.1em] overflow-visible"
  >
    <motion.path
      className={front}
      d="M1.5 7.2h13V13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z"
      style={{ originX: "50%", originY: "100%", transformBox: "fill-box" }}
      initial={false}
      // tips forward: shorter, and leaning away
      animate={open ? { scaleY: 0.72, skewX: -12 } : { scaleY: 1, skewX: 0 }}
      transition={SPRING}
    />
  </svg>
);
