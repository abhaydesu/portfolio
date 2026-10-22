"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { projects, type Project } from "@/constants/projects";
import { SectionLabel } from "./section-label";
import { ArrowLeft, ArrowRight, ArrowUpRight, Close, Plus } from "./icons";
import { ld } from "./theme";

/*
 * Work: two projects in the column, like the rest of the page. "show all"
 * hangs the rest around them, in the page itself, eight to a page: on a wide
 * screen, one either side of the two (where there's room past the column)
 * and a row of four beneath; narrower, two across, growing downward; on a
 * phone, one at a time down the column, three to a page. The two never
 * move.
 *
 * Every project that comes and goes moves the same way. Opening, each
 * comes out from behind the two, those nearest first; closing, each goes
 * back in towards them, and only once they're gone does the space they
 * took fold away. Paging, the projects slide out the way you're going and
 * the next page's slide in after them. Every page keeps the height of the
 * fullest, so nothing below moves while you page.
 */

const SHOWN = projects.filter((p) => p.href);
const FEATURED = SHOWN.slice(0, 2);
// how many to a page: eight, or on a phone three
const perPage = (cols: number) => (cols === 1 ? 3 : 8);

const title = (p: Project) => p.title.trim();
const live = (p: Project) => p.href && p.href !== "#";
// where a project goes: the site, or its source when it has none
const target = (p: Project) => (live(p) ? p.href : p.github);

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const GLIDE = [0.32, 0.72, 0, 1] as const;
const SHUT = [0.4, 0, 0.2, 1] as const;
// how long a project takes to go
const LEAVE = 0.22;

// what's on a page, in its slots read left to right, top to bottom. the
// first page has the page's two in the middle of its top row
function page(n: number, cols: number) {
  const per = perPage(cols);
  if (n > 0) return SHOWN.slice(n * per, (n + 1) * per);
  const first = SHOWN.slice(0, per);
  if (cols < 4) return first;
  const [a, b, ...more] = first;
  return [more[0], a, b, more[1], ...more.slice(2)];
}

// why things are moving: opening or closing (they come out from, and go back
// in towards, the two), or paging (they slide the way you're going)
type Why = { kind: "fold" } | { kind: "page"; dir: number };
type Cell = Why & { gx: number; gy: number; delay: number };

// coming and going, from a cell's point of view. the fade is of a variable
// the opacity reads (--shown), not the opacity itself: motion hands an
// opacity fade to the browser to run, and when that finishes the browser
// drops it a frame before the project is taken away, so it flashes back
// for that frame; a variable it runs itself, to the end
const cellMotion: Variants = {
  away: (c: Cell) =>
    c.kind === "page"
      ? { "--shown": 0, x: c.dir * 24, y: 0 }
      : { "--shown": 0, x: c.gx, y: c.gy },
  here: (c: Cell) => ({
    "--shown": 1,
    x: 0,
    y: 0,
    transition: { delay: c.delay, duration: 0.55, ease: EASE_OUT },
  }),
  gone: (c: Cell) => ({
    "--shown": 0,
    x: c.kind === "page" ? -c.dir * 24 : c.gx * 0.6,
    y: c.kind === "page" ? 0 : c.gy * 0.6,
    transition: { duration: LEAVE, ease: "easeIn" },
  }),
};

export const WorkSection = () => {
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(0);
  const [why, setWhy] = useState<Why>({ kind: "fold" });
  const reduce = !!useReducedMotion();
  // room either side of the column for a project each
  const wide = useMediaQuery("(min-width: 72rem)");
  // room in the column for two across
  const roomy = useMediaQuery("(min-width: 40rem)");
  // the width is only known once the page is up, and a wide screen then
  // re-slots the two (they move to the middle columns). that first change
  // is put straight in, both the leaving and the arriving (which mounts a
  // frame or two after); animating it would have the two leave and come
  // back on every load
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSettled(true), 250);
    return () => clearTimeout(id);
  }, []);
  const still = reduce || !settled;
  const cols = wide ? 4 : roomy ? 2 : 1;
  const per = perPage(cols);
  const pages = Math.ceil(SHOWN.length / per);
  // the places always out: the top row, or on a phone the two
  const head = Math.max(cols, 2);
  const slots = page(at, cols);

  const toggle = () => {
    setWhy({ kind: "fold" });
    if (open) setAt(0);
    setOpen((o) => !o);
  };
  const turn = (by: number) => {
    setWhy({ kind: "page", dir: by });
    setAt((a) => (a + by + pages) % pages);
  };

  // what's in a slot: closed, only the page's two
  const inSlot = (i: number) => {
    const p = slots[i];
    if (open || !p) return p;
    return FEATURED.includes(p) && at === 0 ? p : undefined;
  };
  const cell = (i: number): Cell => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // the way back in towards the two
    const gx = cols === 4 ? (col === 0 ? 18 : col === 3 ? -18 : 0) : 0;
    const gy = row ? -12 : 0;
    // nearest first: down the rows, and out from the middle
    const delay =
      why.kind === "page"
        ? i * 0.03
        : 0.08 + row * 0.07 + Math.abs(col - (cols - 1) / 2) * 0.03;
    return { ...why, gx, gy, delay };
  };

  // a change of layout starts again from the first page
  useEffect(() => setAt(0), [cols]);

  const grid = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <SectionLabel sketch>work</SectionLabel>
        <div className="flex items-center gap-5 text-sm text-neutral-500">
          {/* the pages, while they're out (always there, just faded and
            hidden while closed) */}
          {pages > 1 && (
            <Pager
              at={at}
              pages={pages}
              turn={turn}
              aria-hidden={!open}
              className={cn(
                "transition-[opacity,visibility]",
                open
                  ? "visible opacity-100 delay-200 duration-250"
                  : "invisible opacity-0 duration-150",
              )}
            />
          )}
          <button
            data-intro="control"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="work-more"
            data-sound={open ? "close" : "open"}
            // both labels are laid in the one place and only one shown, so it's
            // as wide as the wider and swapping them moves nothing beside it. it
            // reaches a little past its words (padding taken back by a
            // negative margin), so it's easy to hit and nothing shifts
            className="group/i -m-1.5 grid justify-items-end p-1.5 hover:text-neutral-900"
          >
            <span
              className={cn(
                "col-start-1 row-start-1 inline-flex items-center gap-1",
                !open && "invisible",
              )}
            >
              show less <Close />
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 inline-flex items-center gap-1",
                open && "invisible",
              )}
            >
              show all <Plus />
            </span>
          </button>
        </div>
      </header>

      {/* on a wide screen, four columns, reaching a column past the page's
        either side, the page's two in the middle ones; so they sit exactly
        where they would in the column alone */}
      <div id="work-more" className={cn(wide && "mx-[calc(-50%-0.75rem)]")}>
        <ul className="grid gap-x-6 gap-y-10 sm:gap-y-8" style={grid}>
          {Array.from({ length: head }, (_, i) => (
            <Slot
              key={i}
              project={inSlot(i)}
              cell={cell(i)}
              at={at}
              still={still}
            />
          ))}
        </ul>

        {/* the rows beneath. their space opens as they come, and folds only
          once they've gone; with no gap of the section's own, so the space
          above them goes with them */}
        <motion.div
          className="[overflow-y:clip]"
          initial={false}
          animate={{
            height: open ? "auto" : 0,
            transition: still
              ? { duration: 0 }
              : open
                ? { duration: 0.55, ease: GLIDE }
                : { duration: 0.4, ease: SHUT, delay: LEAVE * 0.8 },
          }}
        >
          <ul
            className="grid gap-x-6 gap-y-10 pt-10 sm:gap-y-8 sm:pt-8"
            style={grid}
          >
            {Array.from({ length: per - head }, (_, k) => (
              <Slot
                key={k + head}
                project={inSlot(k + head)}
                cell={cell(k + head)}
                at={at}
                still={still}
              />
            ))}
          </ul>
          {/* on a phone the page runs past the screen, so the pages are at
            its foot as well; turning one there goes back up to the top of
            the section, to start the new page from its first */}
          {cols === 1 && pages > 1 && (
            <div
              inert={!open}
              className="flex justify-end pt-8 text-sm text-neutral-500"
            >
              <Pager
                at={at}
                pages={pages}
                turn={(by) => {
                  turn(by);
                  document
                    .getElementById("work")
                    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// back and forward through the pages, with where you are between
const Pager = ({
  at,
  pages,
  turn,
  className,
  ...rest
}: {
  at: number;
  pages: number;
  turn: (by: number) => void;
  className?: string;
  "aria-hidden"?: boolean;
}) => (
  <span
    {...rest}
    className={cn("flex items-center gap-2 tabular-nums", className)}
  >
    <button
      aria-label="previous page"
      data-sound="open"
      onClick={() => turn(-1)}
      className="group/i -m-2.5 inline-flex p-2.5 hover:text-neutral-900"
    >
      <ArrowLeft />
    </button>
    <span>
      <span className="text-neutral-900">{at + 1}</span> / {pages}
    </span>
    <button
      aria-label="next page"
      data-sound="open"
      onClick={() => turn(1)}
      className="group/i -m-2.5 inline-flex p-2.5 hover:text-neutral-900"
    >
      <ArrowRight />
    </button>
  </span>
);

// one place on the wall. it keeps its height while its project comes and
// goes (and on a page with fewer): an unseen stand-in, as tall as the
// tallest project, with the project laid over it
const TALLEST = SHOWN.reduce((a, b) =>
  b.description.length > a.description.length ? b : a,
);

const Slot = ({
  project: p,
  cell: c,
  at,
  still,
}: {
  project?: Project;
  cell: Cell;
  at: number;
  still: boolean;
}) => (
  <li className="relative min-w-0">
    {/* (kept out of search snippets: it's only there for its height) */}
    <div aria-hidden data-nosnippet className="invisible flex flex-col gap-3">
      <div className="aspect-[16/9]" />
      <div className="flex flex-col gap-0.5 text-sm leading-relaxed">
        <span>{title(TALLEST)}</span>
        <span>{TALLEST.description}</span>
      </div>
    </div>
    <AnimatePresence mode="wait" initial={false} custom={c}>
      {p && <Placed key={`${at}-${p.id}`} project={p} cell={c} still={still} />}
    </AnimatePresence>
  </li>
);

// a project in its place. with nothing to animate (reduced motion, or the
// first re-slot on load), one that's been taken away is hidden at once,
// rather than left standing for the frame or two until it's removed
const Placed = ({
  project: p,
  cell: c,
  still,
}: {
  project: Project;
  cell: Cell;
  still: boolean;
}) => {
  const present = useIsPresent();
  return (
    <motion.div
      className={cn(
        "absolute inset-x-0 top-0 opacity-(--shown)",
        still && !present && "invisible",
      )}
      style={{ "--shown": 1 } as React.CSSProperties}
      custom={c}
      variants={still ? undefined : cellMotion}
      initial="away"
      animate="here"
      exit="gone"
    >
      <Tile project={p} />
    </motion.div>
  );
};

/* ---------- a project ---------- */

const Shot = ({ project: p, sizes }: { project: Project; sizes: string }) => (
  <>
    <Image
      src={p.src}
      alt={title(p)}
      fill
      sizes={sizes}
      className={cn("object-cover object-top", p.darkSrc && "dark:hidden")}
    />
    {p.darkSrc && (
      <Image
        src={p.darkSrc}
        alt=""
        fill
        sizes={sizes}
        className="hidden object-cover object-top dark:block"
      />
    )}
  </>
);

// each of the two sits on a mat in its own colour, drawn from the site
// by day a pale wash of the site's colours; at night the same hue, low
const MAT: Record<number, string> = {
  1: ld("#f6e6d8", "#2a211b"),
  // baithak: a wash of its violet board
  2: ld("#e9e5f2", "#1f1b2a"),
  // order book: a pale bench, green and red on white
  3: ld("#e4ebe6", "#1b221e"),
  // lexiq: a sky over fields
  4: ld("#e6ebe2", "#1d221b"),
  // git pilot: warm paper
  5: ld("#efe9df", "#25211b"),
  // dip-dash: a pixel sky
  6: ld("#dfeaf3", "#18222b"),
  // pathly: amber on charcoal
  7: ld("#f1e7d6", "#2a2318"),
  // the virtual gallery: a dark room, a wave
  8: ld("#e2e6ea", "#1c2026"),
  // throtl, aakar, aetos
  9: ld("#e4e5ea", "#1e1f25"),
  10: ld("#e3ece3", "#1b231c"),
  11: ld("#e1e6ef", "#1b2029"),
};
const NEUTRAL = ld("#ecebe7", "#211f1c");

const Tile = ({ project: p }: { project: Project }) => {
  const mat = MAT[p.id] ?? NEUTRAL;
  return (
    <div className="group/e flex flex-col gap-3">
      <a
        href={target(p)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title(p)} (opens ${live(p) ? "the site" : "its source"})`}
        data-intro="media"
        // the link stays put; the window inside it rises, so the edge being
        // pointed at never slides out from under the cursor
        className="group/f relative block aspect-[16/9] overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_rgb(0_0_0/0.04)]"
        style={{
          background: `radial-gradient(120% 90% at 30% 0%, ${ld("rgb(255 255 255 / 0.55)", "rgb(255 255 255 / 0.05)")}, transparent 60%), ${mat}`,
        }}
      >
        {/* the site, set into the mat and running just off its foot;
          pointed at, it rises a little */}
        <span className="absolute inset-x-[5%] top-[13%] block aspect-[16/9] overflow-hidden rounded-t-md bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.07),0_1px_2px_rgb(0_0_0/0.06),0_14px_28px_-14px_rgb(0_0_0/0.3)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/f:-translate-y-[3px] group-hover/f:shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_2px_4px_rgb(0_0_0/0.06),0_22px_36px_-16px_rgb(0_0_0/0.35)]">
          <Shot
            project={p}
            sizes="(min-width: 768px) 16rem, (min-width: 640px) 45vw, 90vw"
          />
        </span>
      </a>
      <div
        data-intro="text"
        className="flex flex-col gap-0.5 text-sm leading-relaxed"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-neutral-900">{title(p)}</span>
          <span className="flex shrink-0 gap-2.5">
            {live(p) && <Out href={p.href}>visit</Out>}
            {p.github && <Out href={p.github}>source</Out>}
          </span>
        </span>
        <span className="text-neutral-500">{p.description}</span>
      </div>
    </div>
  );
};

const Out = ({ href, children }: { href: string; children: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    // reaching past its words to be easy to hit, though not so far across
    // as to meet the link beside it
    className="group/i -mx-1 -my-1.5 inline-flex items-center gap-0.5 px-1 py-1.5 text-neutral-400 hover:text-neutral-900"
  >
    {children} <ArrowUpRight />
  </a>
);
