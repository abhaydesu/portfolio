"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Experience } from "@/config/experience";
import { EDUCATION, INTERNSHIP } from "./data";
import { ArrowRight, Cap, Pin } from "./icons";
import { ld } from "./theme";
import { whenIdle } from "./lazy-part";

// dotted underline = "there's something here". on hover the words take on
// their own accent (--accent) and a hairline more weight (Satoshi has one
// weight, so a stroke in the text colour; no reflow), and their solid icon
// colours in and moves. a word whose card is open (aria-expanded) stays
// that way for as long as it is, pointed at or not
export const hint =
  "group/w text-neutral-900 [-webkit-text-stroke:0.3px_currentColor] transition-[color,text-decoration-color,-webkit-text-stroke-width] duration-300 hover:text-(--accent) hover:[-webkit-text-stroke-width:0.5px] focus-visible:text-(--accent) focus-visible:[-webkit-text-stroke-width:0.5px] aria-expanded:text-(--accent) aria-expanded:[-webkit-text-stroke-width:0.5px]";

// the words that show a card when you're on them have a dotted underline,
// where the ones that open a panel are soft keys (see HobbyWord): drawn as
// a row of dots (a dotted text-decoration can't be spaced), a little apart.
// on the words only, not their icon
const underlined =
  "bg-[radial-gradient(circle,var(--dot)_0.8px,transparent_1.15px)] bg-[length:5px_3px] bg-[position:0_calc(100%-1px)] bg-repeat-x [--dot:var(--color-neutral-400)] hover:[--dot:var(--accent)] focus-visible:[--dot:var(--accent)] aria-expanded:[--dot:var(--accent)]";
export const Dotted = ({ children }: { children: React.ReactNode }) => (
  <span
    // a little padding below, which the line doesn't make room for, keeps
    // the dots clear of the letters' tails
    className={cn(
      underlined,
      "pb-[3px] group-hover/w:[--dot:var(--accent)] group-focus-visible/w:[--dot:var(--accent)] group-aria-expanded/w:[--dot:var(--accent)]",
    )}
  >
    {children}
  </span>
);

// the small icon after a hint's words: grey at rest, in the accent on hover
export const WordIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="near-icon near-tint ml-1 inline-flex translate-y-[-0.04em] align-middle text-neutral-400 transition-colors duration-300 group-hover/w:text-(--accent) group-focus-visible/w:text-(--accent) group-aria-expanded/w:text-(--accent)">
    {children}
  </span>
);

/* ---------- Bangalore postcard ---------- */

export const PostcardWord = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  // the stamp's picture is fetched once the page is idle (or on the first
  // point), not as part of the first load: it's only seen on hover
  const [stamp, setStamp] = useState(false);
  useEffect(() => whenIdle(() => setStamp(true)), []);
  const reduceMotion = useReducedMotion();

  return (
    <span
      tabIndex={0}
      style={{ "--accent": ld("#b4532a", "#e08a5f") } as React.CSSProperties}
      data-cursor="arrow"
      className={cn("relative inline-block", hint)}
      onMouseEnter={() => {
        setStamp(true);
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        setStamp(true);
        setOpen(true);
      }}
      onBlur={() => setOpen(false)}
    >
      <Dotted>{children}</Dotted>
      <WordIcon>
        <Pin />
      </WordIcon>
      {/* static centering wrapper, so the animated child only ever touches transform + opacity */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 block w-[7rem] -translate-x-1/2"
      >
        {/* stays mounted, so nothing has to draw on first hover */}
        {/* (no will-change: a layer kept for the motion is painted once, at
          the size it starts from, and blurs as it's scaled up from it) */}
        <motion.span
          className="block"
          style={{ transformOrigin: "50% 100%" }}
          initial={false}
          animate={
            open
              ? { opacity: 1, y: 0, scale: 1, rotate: -3 }
              : {
                  opacity: 0,
                  y: reduceMotion ? 0 : 8,
                  scale: reduceMotion ? 1 : 0.9,
                  rotate: reduceMotion ? -3 : -7,
                }
          }
          transition={
            reduceMotion
              ? { duration: 0.12 }
              : open
                ? {
                    // soft, critically-damped-ish spring: lands without wobble
                    y: {
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                      mass: 0.8,
                    },
                    scale: {
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                      mass: 0.8,
                    },
                    rotate: {
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      mass: 0.8,
                    },
                    opacity: { duration: 0.18, ease: "easeOut" },
                  }
                : { duration: 0.2, ease: [0.4, 0, 0.6, 1] }
          }
        >
          {stamp && <Postcard />}
        </motion.span>
      </span>
    </span>
  );
};

// the stamp: Vidhana Soudha in a red-orange wash, on cream paper with
// its perforations cut out, so the shadow follows the teeth
const Postcard = () => (
  <Image
    src="/blr-stamp.png"
    alt=""
    width={736}
    height={985}
    // fetched at about twice the size it's shown, and less compressed, so
    // its fine print and the building's detail stay sharp once it's turned
    sizes="15rem"
    quality={90}
    draggable={false}
    className="block h-auto w-full drop-shadow-[0_1px_1px_rgb(0_0_0/0.1)] drop-shadow-[0_6px_10px_rgb(0_0_0/0.16)]"
  />
);

/* ---------- the two cards ---------- */

// the internship's and education's cards share one surface: a sheet lifted
// off the page (by day a soft drop; at night a faint top edge and a deeper
// shadow, since a drop alone doesn't read on a dark page), and one width.
// each opens on a byline (dates, place) a size under its text
const CARD =
  "rounded-lg border border-neutral-200 bg-white p-4 text-left text-sm leading-relaxed shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_36px_-14px_rgb(0_0_0/0.22)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.4),0_20px_44px_-14px_rgb(0_0_0/0.75)]";
const CARD_W = 352;

/* ---------- internship ---------- */

const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");
const month = (s: string) => {
  const [m, y] = s.toLowerCase().split(" ");
  return { i: MONTHS.indexOf(m.slice(0, 3)), y: Number(y) };
};
// "dec 2025 – mar 2026 · 4 months", counting both end months
const tenure = (e: Experience) => {
  const a = month(e.startDate);
  const now = new Date();
  const b = e.isCurrent
    ? { i: now.getMonth(), y: now.getFullYear() }
    : month(e.endDate);
  const n = (b.y - a.y) * 12 + b.i - a.i + 1;
  const end = e.isCurrent ? "present" : `${MONTHS[b.i]} ${b.y}`;
  return {
    range: `${MONTHS[a.i]} ${a.y} – ${end}`,
    length: n === 1 ? "1 month" : `${n} months`,
  };
};

// hover previews the card, a click brings it out to stay (or puts it away
// if it's out); "details" unfolds the same card (and pins it, so the pointer
// can wander off while reading)
export const InternshipWord = ({
  experience,
  children,
}: {
  experience: Experience;
  children: React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const open = hovered || pinned;
  // the card starts at the word, nudged left only as far as it must to stay
  // inside the column (the word can sit near its right edge on a phone), and
  // below the end of the paragraph, so it never covers the rest of the
  // sentence when that wraps onto another line
  const [fit, setFit] = useState({ shift: 0, width: CARD_W, drop: 0 });
  const measure = () => {
    const col = ref.current?.closest("[data-bp-column]");
    if (!col || !ref.current) return;
    const c = col.getBoundingClientRect();
    const word = ref.current.getBoundingClientRect();
    const text = ref.current.closest("[data-intro]")?.getBoundingClientRect();
    const width = Math.min(CARD_W, c.width);
    setFit({
      width,
      shift: Math.max(
        c.left - word.left,
        Math.min(0, c.right - word.left - width),
      ),
      drop: text ? Math.max(0, Math.round(text.bottom - word.bottom)) : 0,
    });
  };

  const unpin = () => {
    setPinned(false);
    setExpanded(false);
  };

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) unpin();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && unpin();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  // small grace period so the pointer can travel from the words into the
  // card. hover is a mouse's only: a tap's would open the card a moment
  // before its click shut it again
  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (!open) measure();
    setHovered(true);
  };
  const leave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setHovered(false), 140);
  };
  // a click on the words puts the card away if it's out (however it got
  // there), and brings it out to stay if it isn't
  const close = () => {
    clearTimeout(closeTimer.current);
    setHovered(false);
    unpin();
  };

  return (
    <span
      ref={ref}
      className="relative inline-block"
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <button
        type="button"
        aria-expanded={open}
        style={{ "--accent": ld("#3f4ab5", "#8f98ec") } as React.CSSProperties}
        onClick={() => {
          if (open) return close();
          measure();
          setPinned(true);
        }}
        data-sound={open ? "close" : "open"}
        data-cursor="arrow"
        className={cn("text-left", hint)}
      >
        {children}
      </button>
      <AnimatePresence onExitComplete={() => setExpanded(false)}>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`${experience.position} at ${experience.company}`}
            // (an unseen bridge over the gap, so the pointer can cross the
            // line between the word and the card without it closing)
            className={cn(
              CARD,
              "absolute z-20 text-neutral-600 before:absolute before:inset-x-0 before:bottom-full before:h-(--bridge)",
            )}
            initial={{ opacity: 0, y: -6, scale: 0.97, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transitionEnd: { filter: "none" },
            }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.98,
              filter: "blur(4px)",
              transition: { duration: 0.15 },
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={
              {
                top: `calc(100% + ${fit.drop + 12}px)`,
                left: fit.shift,
                width: fit.width,
                transformOrigin: `${-fit.shift + 24}px 0`,
                "--bridge": `${fit.drop + 12}px`,
              } as React.CSSProperties
            }
          >
            <InternshipCard
              experience={experience}
              expanded={expanded}
              onToggle={() => {
                setPinned(true);
                setExpanded((x) => !x);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

const ease = [0.22, 1, 0.36, 1] as const;

// the short version (when, what with, what for), unfolding into the full one
const InternshipCard = ({
  experience: e,
  expanded,
  onToggle,
}: {
  experience: Experience;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const { range, length } = tenure(e);
  const [first, second] = e.technologies.map((t) => t.name.toLowerCase());
  return (
    <div className="flex flex-col">
      <p className="flex items-baseline justify-between gap-3 text-xs text-neutral-400">
        <span>
          <span className="text-neutral-500">{range}</span> · {length}
        </span>
        <span>{e.location.toLowerCase()}</span>
      </p>
      <p className="mt-2 text-neutral-600">
        Worked with <span className="text-neutral-900">{first}</span> and{" "}
        <span className="text-neutral-900">{second}</span> to{" "}
        {INTERNSHIP.summary}
      </p>

      {/* height opens first, then the points settle in one after another */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="more"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease },
                opacity: { duration: 0.2 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 },
              },
            }}
          >
            <ol className="flex flex-col gap-3.5 pt-4">
              {INTERNSHIP.highlights.map((h, i) => (
                <motion.li
                  key={h.title}
                  className="grid grid-cols-[1.5rem_1fr]"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
                >
                  <span className="text-neutral-400 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-neutral-900">{h.title}</p>
                    <p>{h.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="mt-4 border-t border-neutral-100 pt-3 text-neutral-400">
              {e.technologies.map((t) => t.name.toLowerCase()).join(" · ")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={expanded}
        data-sound={expanded ? "close" : "open"}
        onClick={onToggle}
        className="group/i mt-3 inline-flex items-center gap-1 self-start text-neutral-500 transition-colors hover:text-neutral-900"
      >
        {expanded ? "less" : "details"}
        <span
          className={cn(
            "inline-flex transition-transform duration-300 ease-out",
            expanded ? "-rotate-90" : "rotate-90",
          )}
        >
          <ArrowRight />
        </span>
      </button>
    </div>
  );
};

/* ---------- education ---------- */

// hover previews, a click brings it out to stay or puts it away; escape or a
// click outside lets go
export const EducationWord = ({ children }: { children: React.ReactNode }) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduceMotion = useReducedMotion();
  const open = hovered || pinned;
  // the card starts at the word, nudged left only if it would run past the
  // column's right edge
  const [fit, setFit] = useState({ shift: 0, width: CARD_W });
  const measure = () => {
    const col = ref.current?.closest("[data-bp-column]");
    if (!col || !ref.current) return;
    const c = col.getBoundingClientRect();
    const word = ref.current.getBoundingClientRect().left;
    // never wider than the column, never past either of its edges
    const width = Math.min(CARD_W, c.width);
    setFit({
      width,
      shift: Math.max(c.left - word, Math.min(0, c.right - word - width)),
    });
  };

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPinned(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPinned(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  // (a mouse's hover only, as with the internship's)
  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    measure();
    setHovered(true);
  };
  const leave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setHovered(false), 140);
  };

  return (
    <span
      ref={ref}
      style={{ "--accent": ld("#98588a", "#e6b8da") } as React.CSSProperties}
      data-near="hint"
      className="relative inline-block"
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            clearTimeout(closeTimer.current);
            setHovered(false);
            setPinned(false);
            return;
          }
          measure();
          setPinned(true);
        }}
        data-sound={open ? "close" : "open"}
        data-cursor="arrow"
        className={cn("text-left tracking-tighter", hint)}
      >
        <Dotted>{children}</Dotted>
        <WordIcon>
          <Cap />
        </WordIcon>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Education"
            className={cn(
              CARD,
              "absolute bottom-full z-20 mb-3 text-neutral-500",
            )}
            style={{
              left: fit.shift,
              width: fit.width,
              transformOrigin: `${-fit.shift + 24}px 100%`,
            }}
            initial={{ opacity: 0, y: 6, scale: 0.97, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transitionEnd: { filter: "none" },
            }}
            exit={{
              opacity: 0,
              y: 4,
              scale: 0.98,
              filter: "blur(4px)",
              transition: { duration: 0.15 },
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Timeline still={!!reduceMotion} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

/*
 * Where I've studied, along one hairline of years: school, a dot for each
 * board exam, then college, drawn as a stretch with as much of it filled as
 * has gone, up to today. Each with its marks beneath. The line draws itself
 * in as the card opens, and the stops arrive along it.
 */

const monthOf = ([y, m]: readonly number[]) => y * 12 + m;
const START = monthOf([2019, 9]);
const END = monthOf([2027, 9]);
const [X, XII, COLLEGE] = EDUCATION;
// how far along the line a month is, 0..1
const along = (m: number) => (m - START) / (END - START);
const nowMonth = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};

const STOPS = [
  {
    at: along(monthOf(X.at)),
    year: "2020",
    label: "class x",
    detail: X.detail,
  },
  {
    at: along(monthOf(XII.at)),
    year: "2022",
    label: "class xii",
    detail: XII.detail.toLowerCase(),
  },
];

const Timeline = ({ still }: { still: boolean }) => {
  const from = along(monthOf(COLLEGE.from));
  const to = along(monthOf(COLLEGE.to));
  const now = Math.min(to, Math.max(from, along(nowMonth())));
  const mid = (from + to) / 2;
  const draw = (delay: number) =>
    still
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 3 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.35, ease },
        };

  return (
    <div className="flex flex-col gap-3">
      {/* the same head as the internship card's: when and what, and where */}
      <p className="flex items-baseline justify-between gap-3 text-xs text-neutral-400">
        <span>
          <span className="text-neutral-500">2023 – 2027</span> · b.e.
          information science
        </span>
        <span>{COLLEGE.place.toLowerCase()}</span>
      </p>

      <div className="relative mx-1 h-[4.75rem]">
        {/* above: the exams' years, and today (college's own years are in
          the head, and would only crowd the exams' here) */}
        {STOPS.map((s) => (
          <motion.span
            key={s.year}
            className="absolute top-0 -translate-x-1/2 text-neutral-400 tabular-nums"
            style={{ left: `${s.at * 100}%` }}
            {...draw(0.12 + s.at * 0.35)}
          >
            {s.year}
          </motion.span>
        ))}
        <motion.span
          className="absolute top-0 -translate-x-1/2 text-(--accent)"
          style={{ left: `${now * 100}%` }}
          {...draw(0.85)}
        >
          now
        </motion.span>

        {/* the line, drawing itself in */}
        <motion.span
          className="absolute top-[1.55rem] right-0 left-0 block h-px origin-left bg-neutral-200"
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease }}
        />
        {/* college: the stretch of it, and how much has gone */}
        <motion.span
          className="absolute top-[calc(1.55rem-1px)] block h-[3px] origin-left rounded-full bg-neutral-200"
          style={{ left: `${from * 100}%`, width: `${(to - from) * 100}%` }}
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease }}
        />
        <motion.span
          className="absolute top-[calc(1.55rem-1px)] block h-[3px] origin-left rounded-full bg-(--accent)"
          style={{ left: `${from * 100}%`, width: `${(now - from) * 100}%` }}
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
        />
        {/* today */}
        <motion.span
          className="absolute top-[1.55rem] block size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--accent) shadow-[0_0_0_3px_var(--color-white)]"
          style={{ left: `${now * 100}%` }}
          {...draw(0.8)}
        />

        {/* the board exams */}
        {STOPS.map((s) => (
          <motion.span
            key={s.label}
            className="absolute top-[1.55rem] block size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-800 shadow-[0_0_0_3px_var(--color-white)]"
            style={{ left: `${s.at * 100}%` }}
            {...draw(0.15 + s.at * 0.35)}
          />
        ))}

        {/* and beneath, what each was */}
        {STOPS.map((s) => (
          <motion.span
            key={s.label}
            className="absolute top-[2.4rem] flex -translate-x-1/2 flex-col items-center leading-snug whitespace-nowrap"
            style={{ left: `${s.at * 100}%` }}
            {...draw(0.2 + s.at * 0.35)}
          >
            <span className="text-neutral-900">{s.label}</span>
            <span>{s.detail}</span>
          </motion.span>
        ))}
        <motion.span
          className="absolute top-[2.4rem] flex -translate-x-1/2 flex-col items-center leading-snug whitespace-nowrap"
          style={{ left: `${mid * 100}%` }}
          {...draw(0.5)}
        >
          <span className="text-neutral-900">college</span>
          <span>{COLLEGE.detail.split(" · ")[1].toLowerCase()}</span>
        </motion.span>
      </div>
    </div>
  );
};

export const CompanyLogo = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <span
    className={cn(
      "relative inline-block shrink-0 overflow-hidden rounded-[3px] border border-neutral-200 bg-white",
      className,
    )}
  >
    <Image src={src} alt={alt} fill sizes="32px" className="object-cover" />
  </span>
);
