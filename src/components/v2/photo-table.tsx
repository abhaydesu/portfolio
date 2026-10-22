"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

/*
 * Photos as prints on a table, seen from above. Each is a white-bordered
 * print lying a little askew, a touch off its spot, overlapping the ones
 * around it. They're tossed down one after another as the panel opens (not
 * in reading order, as a handful of prints would land). Pointing at one
 * lifts it off the table; with a mouse they can be pushed around, and
 * whichever is picked up comes to the top of the pile.
 *
 * The table is whatever box it's given: the prints are spread over it in
 * the rows and columns that let them be biggest, so they all fit at once
 * and nothing scrolls.
 */

// a print's height for its width: a 4:5 photo inside a 5% border
const TALL = 0.9 * 1.25 + 0.1;
// prints a little bigger than their spot, so neighbours overlap
const OVERLAP = 1.07;
// kept this far inside the table's edges
const MARGIN = 6;

// a stable little scatter per print: its tilt, how far it sits off its spot
// (as a share of the spot), and where it falls in the tossing order
function scatter(i: number) {
  let h = (i + 1) * 2654435761;
  const next = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    return (h % 1000) / 1000;
  };
  return {
    tilt: (next() - 0.5) * 16,
    dx: (next() - 0.5) * 0.22,
    dy: (next() - 0.5) * 0.18,
    drop: next(),
  };
}

// the grid that gives n prints the most room in a w × h table
function spread(n: number, w: number, h: number) {
  let best = { cols: 1, rows: n, size: 0 };
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);
    const size = Math.min(w / cols, h / rows / TALL);
    if (size > best.size) best = { cols, rows, size };
  }
  return best;
}

// each column sits a little higher or lower than its neighbours, and each
// row a little to one side, as a share of the step between them, so the
// gaps never line up into rows or columns
const COL_SHIFT = 0.4;
const ROW_SHIFT = 0.2;
const offset = (n: number, k: number) => ((n * k + 0.3) % 1) - 0.5;

const LANDING = [0.22, 1.2, 0.36, 1] as const;

export const PhotoTable = ({
  srcs,
  sizes,
  delay = 0,
  className,
}: {
  srcs: readonly string[];
  // the `sizes` the prints render at (matching what was preloaded)
  sizes: string;
  delay?: number;
  // gives the table its size
  className?: string;
}) => {
  const table = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canDrag = useMediaQuery("(pointer: fine)");
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  // the pile, bottom to top
  const [pile, setPile] = useState(() => srcs.map((_, i) => i));
  const toTop = (i: number) =>
    setPile((p) => (p.at(-1) === i ? p : [...p.filter((n) => n !== i), i]));

  useLayoutEffect(() => {
    const el = table.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // tossing order: by each print's own draw, so it's the same every time
  const order = srcs
    .map((_, i) => i)
    .sort((a, b) => scatter(a).drop - scatter(b).drop);

  const layout =
    box &&
    box.w > 0 &&
    box.h > 0 &&
    (() => {
      const w = box.w - MARGIN * 2;
      const h = box.h - MARGIN * 2;
      const { cols, rows, size } = spread(srcs.length, w, h);
      // the prints are packed as close down the table as across it, and the
      // pile sits in the middle: where the table is longer than they need (a
      // phone's), the room is left round the pile, not in bands between rows
      const cellW = Math.min(w / cols, size);
      const cellH = Math.min(h / rows, size * TALL);
      const x0 = (w - cellW * cols) / 2;
      // (a little above the middle, nearer whatever's written over it)
      const y0 = (h - cellH * rows) * 0.35;
      const pw = size * OVERLAP;
      const ph = pw * TALL;
      return srcs.map((_, i) => {
        const s = scatter(i);
        const row = Math.floor(i / cols);
        // a short last row sits in the middle
        const inRow = row === rows - 1 ? srcs.length - row * cols : cols;
        const col = i - row * cols + (cols - inRow) / 2;
        const clamp = (v: number, lo: number, hi: number) =>
          Math.min(Math.max(v, lo), hi);
        const cx = clamp(
          x0 + (col + 0.5 + s.dx + offset(row, 0.382) * ROW_SHIFT) * cellW,
          pw / 2,
          w - pw / 2,
        );
        const cy = clamp(
          y0 +
            (row + 0.5 + s.dy + offset(Math.floor(col), 0.618) * COL_SHIFT) *
              cellH,
          ph / 2,
          h - ph / 2,
        );
        return {
          left: MARGIN + cx - pw / 2,
          top: MARGIN + cy - ph / 2,
          width: pw,
        };
      });
    })();

  return (
    <div ref={table} className={cn("relative", className)}>
      {layout &&
        srcs.map((src, i) => {
          const s = scatter(i);
          const at = delay + order.indexOf(i) * 0.06;
          return (
            <motion.div
              key={src}
              drag={canDrag}
              dragConstraints={table}
              dragElastic={0.12}
              dragTransition={{ power: 0.15, timeConstant: 180 }}
              onPointerDown={() => toTop(i)}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 1.14, y: -14, rotate: s.tilt * 1.8 }
              }
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: s.tilt,
                transition: {
                  delay: at,
                  duration: reduce ? 0.3 : 0.5,
                  ease: LANDING,
                  opacity: { duration: 0.15, delay: at },
                },
              }}
              whileHover={canDrag ? { scale: 1.035 } : undefined}
              whileDrag={{ scale: 1.07, rotate: s.tilt * 0.4 }}
              style={{ ...layout[i], zIndex: pile.indexOf(i) }}
              data-cursor={canDrag ? "grab" : undefined}
              className={cn(
                "group/p absolute",
                canDrag && "cursor-grab active:cursor-grabbing",
              )}
            >
              {/* the print: a photo in a white border, with a shadow on the
                table that grows as it's lifted */}
              <div className="bg-[#fbfaf6] p-[5%] shadow-[0_1px_1px_rgb(0_0_0/0.14),0_3px_6px_-2px_color-mix(in_srgb,var(--ink)_40%,transparent)] transition-shadow duration-300 group-hover/p:shadow-[0_2px_2px_rgb(0_0_0/0.1),0_12px_18px_-6px_color-mix(in_srgb,var(--ink)_45%,transparent)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes={sizes}
                    draggable={false}
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
    </div>
  );
};
