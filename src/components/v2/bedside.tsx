"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import { hand } from "./fonts";
import { SHELVES, type Book } from "./data";

/*
 * Books on the bedside table, seen from above, like the toy box, the prints
 * and the sketchbook: lying where they were put down, covers up, a little
 * askew and over one another, with what else ends up there (reading
 * glasses, a pencil, a bus ticket for a bookmark).
 *
 * They're set down one after another as the panel opens. Pointing at one
 * (or focusing it) lifts it towards you, and what it is is written beneath.
 * Clicking keeps it up (and is how it works on a touch screen).
 *
 * The small table has the few I'd recommend; the big one has every pile,
 * each labelled in pencil, the book being read with its ribbon hanging out.
 */

const LANDING = [0.22, 1.15, 0.36, 1] as const;
const EASE = [0.32, 0.72, 0, 1] as const;

// where a book lies (its top left, px) and how it's turned
type Lie = { x: number; y: number; r: number };

type Layout = {
  w: number;
  h: number;
  // a cover's height; its width is the cover's own
  book: number;
  books: (Lie & { book: Book; reading?: boolean })[];
  labels?: { text: string; x: number; y: number; r: number }[];
  props: React.ReactNode;
};

const [FAVOURITES, READING, NEXT] = SHELVES;
const by = (b: Book) => b.title;
const aspect = (b: Book) => COVER_ASPECT[b.cover] ?? 0.65;
// the covers' own widths for their heights (from public/books)
const COVER_ASPECT: Record<string, number> = {
  "/books/1984.jpg": 271 / 420,
  "/books/algernon.jpg": 247 / 420,
  "/books/coffee.jpg": 277 / 420,
  "/books/held.jpg": 286 / 420,
  "/books/if-cats.jpg": 280 / 420,
  "/books/kamogawa.jpg": 283 / 420,
  "/books/library.jpg": 270 / 420,
  "/books/miss-prym.jpg": 255 / 420,
  "/books/one-more-day.jpg": 279 / 420,
  "/books/red-rising.jpg": 277 / 420,
  "/books/travelling-cat.jpg": 268 / 420,
};

/* ---------- the two tables ---------- */

const SMALL: Layout = {
  w: 300,
  h: 196,
  book: 100,
  books: [
    { x: 6, y: 58, r: -9 },
    { x: 60, y: 14, r: 4 },
    { x: 116, y: 66, r: -3 },
    { x: 170, y: 20, r: 8 },
    { x: 226, y: 72, r: -6 },
  ].map((l, i) => ({ ...l, book: FAVOURITES.books[i] })),
  props: (
    <>
      <Ticket x={262} y={50} r={14} />
      <Pencil x={118} y={176} r={-4} length={120} />
      <Glasses x={2} y={160} r={-10} />
    </>
  ),
};

const BIG: Layout = {
  w: 860,
  h: 300,
  book: 128,
  books: [
    // the ones I'd recommend, spread out
    ...[
      { x: 10, y: 72, r: -8 },
      { x: 78, y: 22, r: 5 },
      { x: 128, y: 98, r: -2 },
      { x: 194, y: 34, r: 9 },
      { x: 226, y: 116, r: -6 },
    ].map((l, i) => ({ ...l, book: FAVOURITES.books[i] })),
    // on the nightstand: the one being read, put down on the next
    { x: 436, y: 30, r: -7, book: READING.books[0] },
    { x: 482, y: 84, r: 5, book: READING.books[1], reading: true },
    // the pile, squared up more or less
    ...[
      { x: 664, y: 58, r: -8 },
      { x: 694, y: 40, r: 7 },
      { x: 678, y: 80, r: -2 },
      { x: 706, y: 70, r: 4 },
    ].map((l, i) => ({ ...l, book: NEXT.books[i] })),
  ],
  labels: [
    { text: FAVOURITES.label, x: 150, y: 270, r: -2 },
    { text: READING.label, x: 510, y: 270, r: 1.5 },
    { text: NEXT.label, x: 742, y: 270, r: -1 },
  ],
  props: (
    <>
      <Glasses x={598} y={214} r={12} />
      <Pencil x={566} y={24} r={-14} length={140} />
      <Ticket x={150} y={14} r={-10} />
    </>
  ),
};

export const Bedside = ({
  big = false,
  delay = 0,
}: {
  big?: boolean;
  delay?: number;
}) => {
  const t = big ? BIG : SMALL;
  const [pointed, setPointed] = useState<string | null>(null);
  const [kept, setKept] = useState<string | null>(null);
  const up = pointed ?? kept;
  const shown = t.books.find((b) => by(b.book) === up);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative mx-auto shrink-0"
        style={{ width: t.w, height: t.h }}
        onPointerLeave={() => setPointed(null)}
      >
        <SetDown delay={delay + 0.45} className="absolute inset-0">
          {t.props}
        </SetDown>
        {t.books.map((b, i) => (
          <Lying
            key={by(b.book)}
            {...b}
            height={t.book}
            index={i}
            up={up === by(b.book)}
            delay={delay + i * 0.06}
            onPoint={() => setPointed(by(b.book))}
            onLeave={() => setPointed((p) => (p === by(b.book) ? null : p))}
            onKeep={() =>
              setKept((k) => (k === by(b.book) ? null : by(b.book)))
            }
          />
        ))}
        {t.labels?.map((l) => (
          <SetDown
            key={l.text}
            delay={delay + 0.6}
            className="absolute -translate-x-1/2"
            style={{ left: l.x, top: l.y, rotate: `${l.r}deg` }}
          >
            <span
              className={cn(
                hand.className,
                "text-lg leading-none whitespace-nowrap text-(--ink) opacity-70",
              )}
            >
              {l.text}
            </span>
          </SetDown>
        ))}
      </div>

      {/* beneath: the book that's up */}
      <div className="relative h-4 text-xs">
        <AnimatePresence mode="wait" initial={false}>
          {shown && (
            <motion.p
              key={by(shown.book)}
              className="absolute inset-0 truncate text-center"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <span className="text-neutral-800">{shown.book.title}</span>
              <span className="text-neutral-500">
                {" "}
                · {shown.book.author}
                {shown.reading && ", reading now"}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ---------- a book, lying on the table ---------- */

const Lying = ({
  book: b,
  x,
  y,
  r,
  reading,
  height,
  index,
  up,
  delay,
  onPoint,
  onLeave,
  onKeep,
}: Lie & {
  book: Book;
  reading?: boolean;
  height: number;
  index: number;
  up: boolean;
  delay: number;
  onPoint: () => void;
  onLeave: () => void;
  onKeep: () => void;
}) => {
  const still = !!useReducedMotion();
  const width = Math.round(height * aspect(b));
  // the block of pages showing past the cover, thicker for longer books
  const edge = Math.max(2, Math.min(4, b.pages / 90));

  return (
    // the button stays where the book lies, so pointing at its edge never
    // has it slide out from under the cursor
    <button
      type="button"
      aria-label={`${b.title} by ${b.author}${reading ? ", reading now" : ""}`}
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
        height,
        rotate: `${r}deg`,
        zIndex: up ? 50 : index + 1,
      }}
    >
      <SetDown delay={delay} className="absolute inset-0" drop>
        {/* lifted towards you, turning a little straighter */}
        <motion.span
          className="absolute inset-0 block"
          initial={false}
          animate={
            up
              ? { scale: 1.07, rotate: -r * 0.35, y: -4 }
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
          {/* a ribbon hanging out of its pages, where it's being read */}
          {reading && (
            <span
              className="absolute block w-[5px] bg-(--ink) [clip-path:polygon(0_0,100%_0,100%_100%,50%_84%,0_100%)]"
              style={{ left: "62%", top: "90%", height: 26, rotate: "-8deg" }}
            />
          )}
          <span
            className={cn(
              "absolute inset-0 block rounded-[1px_3px_3px_1px] transition-shadow duration-300",
              up
                ? "shadow-[3px_14px_18px_-6px_rgb(0_0_0/0.4)]"
                : "shadow-[1px_2px_3px_rgb(0_0_0/0.28)]",
            )}
            style={{
              // the pages, showing past the cover at its foot and fore-edge
              background: `repeating-linear-gradient(0deg, #e9e2d0 0 1px, #f7f2e6 1px 2px)`,
            }}
          >
            <span
              className="absolute top-0 left-0 block overflow-hidden rounded-[1px_2px_2px_1px]"
              style={{ right: edge, bottom: edge }}
            >
              <Image
                src={b.cover}
                alt=""
                fill
                sizes={`${width * 2}px`}
                className="object-cover"
              />
              {/* the spine's hinge, and the light across the cover */}
              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.22),rgb(0_0_0/0.03)_5%,transparent_9%,rgb(255_255_255/0.12)_40%,transparent_70%)]" />
            </span>
          </span>
        </motion.span>
      </SetDown>
    </button>
  );
};

/* ---------- what else is on the table ---------- */

// a pair of reading glasses, folded
function Glasses({ x, y, r }: Lie) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 74 30"
      className="absolute w-[74px] drop-shadow-[1px_3px_2px_rgb(0_0_0/0.25)]"
      style={{ left: x, top: y, rotate: `${r}deg` }}
    >
      <g stroke="#2c2a28" strokeWidth="2.4" fill="rgb(255 255 255 / 0.22)">
        <rect x="3" y="6" width="27" height="20" rx="9" />
        <rect x="44" y="6" width="27" height="20" rx="9" />
      </g>
      <path
        d="M30 13q7-5 14 0M3 11 1 4M71 11l2-7"
        stroke="#2c2a28"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* the glint on each lens */}
      <path
        d="M9 12q3-3 7-3M50 12q3-3 7-3"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// a pencil, sharpened
function Pencil({ x, y, r, length }: Lie & { length: number }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${length} 8`}
      className="absolute drop-shadow-[1px_2px_1.5px_rgb(0_0_0/0.25)]"
      style={{ left: x, top: y, width: length, rotate: `${r}deg` }}
    >
      <rect x="10" y="0.5" width={length - 26} height="7" fill="#f2c230" />
      <rect x="10" y="0.5" width={length - 26} height="2.4" fill="#f8d968" />
      <path d={`M10 0.5 0.5 4 10 7.5z`} fill="#e3c08f" />
      <path d="M3.4 2.9.5 4l2.9 1.1z" fill="#3a3632" />
      <rect x={length - 16} y="0.5" width="6" height="7" fill="#b9b6ae" />
      <rect
        x={length - 10}
        y="0.5"
        width="9.5"
        height="7"
        rx="1.5"
        fill="#e98a8f"
      />
    </svg>
  );
}

// a bus ticket, kept as a bookmark
function Ticket({ x, y, r }: Lie) {
  return (
    <span
      aria-hidden
      className="absolute block h-[46px] w-[20px] bg-[#f1ead6] shadow-[1px_2px_2px_rgb(0_0_0/0.18)]"
      style={{ left: x, top: y, rotate: `${r}deg` }}
    >
      <span className="absolute inset-x-[3px] top-[4px] block h-[3px] bg-[#c0473b]/70" />
      <span className="absolute inset-x-[3px] top-[10px] bottom-[6px] block bg-[repeating-linear-gradient(180deg,rgb(60_50_40/0.35)_0_1px,transparent_1px_4px)]" />
    </span>
  );
}

/* ---------- setting things down ---------- */

// set down from just above. run on mount (not with `initial`, which the
// panel suppresses on its first render)
const SetDown = ({
  delay,
  drop,
  className,
  style,
  children,
}: {
  delay: number;
  // a book, put down: it comes down from a little higher, and settles
  drop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const still = !!useReducedMotion();
  useEffect(() => {
    if (still) return;
    animate(
      scope.current,
      drop
        ? { opacity: [0, 1], scale: [1.08, 1], y: [-10, 0] }
        : { opacity: [0, 1] },
      drop
        ? { delay, duration: 0.5, ease: LANDING }
        : { delay, duration: 0.5, ease: "easeOut" },
    );
    // on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <span
      ref={scope}
      className={cn("block", className)}
      style={{ ...style, opacity: still ? 1 : 0 }}
    >
      {children}
    </span>
  );
};
