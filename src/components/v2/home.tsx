"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { experiences } from "@/config/experience";
import { HOBBIES, LINKS, type HobbyId } from "./data";
import { BangaloreNow } from "./identity";
import { ClickFeedback } from "./feedback";
import { Cursors } from "./cursors";
import {
  GithubIcon,
  LeetcodeIcon,
  LinkedinIcon,
  ResumeIcon,
  XIcon,
} from "./icons";
import type { Weather } from "./weather";
import type { Football } from "./football";
import { placePanel, type Dock } from "./dock";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  CompanyLogo,
  EducationWord,
  Dotted,
  InternshipWord,
  PostcardWord,
} from "./intro-bits";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  HobbyPanel,
  pillTarget,
  warmPanel,
  warmPanels,
  type PillTarget,
} from "./hobby-panel";
import { SectionLabel } from "./section-label";
import { StackWord } from "./stack-word";
import {
  Devil,
  Sweep,
  RaceCar,
  ReadingBook,
  Polaroid,
  SketchPencil,
} from "./hobby-marks";

import { WorkSection } from "./work-gallery";
import { whenIdle } from "./lazy-part";
import { HaikyuWord } from "./haikyu-spike";
import { AvatarDock } from "./avatar-dock";
import { SunsetFooter } from "./sunset";
import { ld } from "./theme";

export const Home = ({
  football,
  weather,
}: {
  football: Football;
  weather: Weather;
}) => {
  // one hobby panel at a time. opening another closes the current one, and
  // the new one docks on the opposite side so both animations play out
  const [openHobby, setOpenHobby] = useState<
    ({ id: HobbyId; expanded: boolean } & Dock) | null
  >(null);
  // set when a window closes, so its exit flies back into its word
  const [exitInto, setExitInto] = useState<PillTarget | null>(null);
  const expanded = openHobby?.expanded ?? false;

  const toggleHobby = (id: HobbyId, anchor?: DOMRect) => {
    setExitInto(null);
    setOpenHobby(
      openHobby?.id === id
        ? null
        : {
            id,
            expanded: false,
            ...placePanel(anchor, openHobby?.side ?? null),
          },
    );
  };

  const closeHobby = () => {
    setExitInto(openHobby?.expanded ? pillTarget(openHobby.id) : null);
    setOpenHobby(null);
  };

  // while a window is up: page doesn't scroll, escape closes it
  useEffect(() => {
    if (!expanded) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeHobby();
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  });

  const docked = useMediaQuery("(min-width: 80rem)");
  const panel = openHobby && (
    <HobbyPanel
      key={openHobby.id}
      hobby={HOBBIES.find((h) => h.id === openHobby.id)!}
      dock={openHobby}
      expanded={openHobby.expanded}
      onExpand={() => setOpenHobby({ ...openHobby, expanded: true })}
      onClose={closeHobby}
      football={football}
      weather={weather}
    />
  );

  return (
    // the page's palette lives on this wrapper (see .v2 in globals.css), so
    // it follows the theme without touching the site's older pages
    <div className="v2">
      <ClickFeedback />
      <Cursors />
      <Warm />
      <main className="min-h-screen bg-(--paper) px-7 py-24 text-neutral-800 sm:px-8 md:py-32">
        {/* on its way in, each part fades up in turn, in the order it's
          read (v2-enter in globals.css, --enter its place in line) */}
        <div
          data-bp-column
          className="mx-auto flex max-w-[32rem] flex-col gap-20 md:gap-24"
        >
          {/* the intro and its links read as one block, like a letterhead */}
          <div className="flex flex-col gap-14 md:gap-16">
            <Intro weather={weather} />
            {/* the links sit as far from the text above as from work below */}
            <div className="flex flex-col gap-14 md:gap-16">
              <Bio />
              <Links />
            </div>
          </div>

          <div
            id="work"
            className="v2-enter -mt-6 scroll-mt-20 [--enter:3] md:-mt-8"
          >
            <WorkSection />
          </div>

          <section id="about" className="v2-enter scroll-mt-20 [--enter:4]">
            <AboutMe openId={openHobby?.id ?? null} onToggle={toggleHobby} />
          </section>

          {/* docked beside the column on xl, where on a switch the old panel
            exits on one side as the new one enters on the other; below
            that, in the page under the about text */}
          {docked ? (
            <AnimatePresence mode="sync" custom={exitInto}>
              {panel}
            </AnimatePresence>
          ) : (
            <InPage open={!!openHobby} openId={openHobby?.id} held={expanded}>
              <AnimatePresence mode="wait" custom={exitInto}>
                {panel}
              </AnimatePresence>
            </InPage>
          )}

          <SunsetFooter
            open={openHobby?.id === "fireside"}
            onToggle={(anchor) => toggleHobby("fireside", anchor)}
          />
        </div>
      </main>

      {/* behind an opened-up window; clicking it sends the window home */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="backdrop"
            aria-hidden
            onClick={closeHobby}
            data-sound="close"
            className="fixed inset-0 z-40 bg-(--paper)/60 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.1 } }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/*
 * A hobby panel in the page (below xl, where there's no room beside the
 * column). Its space opens and closes with it, so what's below glides rather
 * than jumps, and opening brings it into view: it opens under the about text,
 * which may be the last thing on screen. On a switch the old one goes before
 * the new one comes, the space easing between their heights. While the panel
 * is opened up into a window it's out of the page, and its space is held.
 */
// room for a panel's soft edge inside the in-page clip, past the 20px the
// ground reaches beyond the panel
const EDGE_ROOM = 24;

const InPage = ({
  open,
  openId,
  held,
  children,
}: {
  open: boolean;
  openId?: HobbyId;
  held: boolean;
  children: React.ReactNode;
}) => {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const heldRef = useRef(held);
  heldRef.current = held;
  const reduce = !!useReducedMotion();

  // the panel still to be brought into view: once it's in (on a switch,
  // after the old one has gone) and measured, scroll just far enough to
  // show it whole, or its top if it's taller than the screen
  const reveal = useRef<HobbyId | null>(null);
  const show = () => {
    const el = inner.current;
    const id = reveal.current;
    if (!el || !id || !el.querySelector(`[data-hobby-panel="${id}"]`)) return;
    const top = el.getBoundingClientRect().top;
    // or, opened from the fire below it, back up to its top
    const by =
      top < 72
        ? top - 72
        : Math.min(top + el.offsetHeight - innerHeight + 32, top - 72);
    // opened from the foot of the page, there's no room to scroll down yet:
    // that comes as its space opens, so it waits for that
    const room = document.documentElement.scrollHeight - innerHeight - scrollY;
    if (by > room + 1) return;
    reveal.current = null;
    if (by > 0 || top < 72)
      scrollBy({ top: by, behavior: reduce ? "auto" : "smooth" });
  };
  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // nothing in the page while it's a window; keep the space it had
      if (!heldRef.current) setH(el.offsetHeight);
      showRef.current();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    reveal.current = openId ?? null;
    showRef.current();
  }, [openId]);

  return (
    // pulled up over the column's gap, so it takes no room shut and sits
    // close under the text open. it clips as its space opens and closes, so
    // room is left inside it, above and below, for the panel's soft edge (it
    // reaches 20px past the panel; overflow-clip-margin can't be used, as it
    // only works when both axes clip, and not at all in Safari). the room
    // below is given back with a margin, so it takes no space in the page
    <motion.div
      className="-mt-20 [overflow-y:clip] md:-mt-24"
      initial={false}
      animate={{ height: open ? h : 0, marginBottom: open ? -EDGE_ROOM : 0 }}
      onAnimationComplete={() => showRef.current()}
      transition={
        reduce
          ? { duration: 0 }
          : open
            ? { duration: 0.45, ease: [0.32, 0.72, 0, 1] }
            : { duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.05 }
      }
    >
      <div ref={inner} className="pt-10" style={{ paddingBottom: EDGE_ROOM }}>
        {children}
      </div>
    </motion.div>
  );
};

/* ---------- intro ---------- */

const Intro = ({ weather }: { weather: Weather }) => (
  <header className="v2-enter flex items-center gap-4">
    <AvatarDock />
    <div className="flex-1">
      <h1
        data-intro="head"
        data-intro-name
        className="text-base text-neutral-900"
      >
        Abhay Singh
      </h1>
      <p data-intro="text" className="text-sm text-neutral-500">
        sweating the details
      </p>
    </div>
    <BangaloreNow weather={weather} />
  </header>
);

// links: a row of soft keys, each tinted in its own colour, its glyph in
// that colour. pointing at one picks it up off the page: it rises and tips a
// little, shows its edge underneath and throws a shadow, while the rest fade
// back; pressing it puts it down again. at night the keys are dark, a step
// up from the page with a little of their colour in them
const LINK_STYLE: Record<
  string,
  { Icon: () => React.ReactNode; day: string; night: string; tilt: number }
> = {
  resume: { Icon: ResumeIcon, day: "#b4532a", night: "#e08a5f", tilt: -2 },
  linkedin: { Icon: LinkedinIcon, day: "#2f6db5", night: "#6fa3e6", tilt: 1.5 },
  github: { Icon: GithubIcon, day: "#6b4fb5", night: "#a48ee6", tilt: -1.5 },
  leetcode: { Icon: LeetcodeIcon, day: "#c27a12", night: "#e9a845", tilt: 2 },
  x: { Icon: XIcon, day: "#1d8a6b", night: "#4fc7a1", tilt: -1 },
};

const Links = () => (
  // centred under the text (on a phone, where five don't fit a line, they
  // wrap); the others fade back while one is picked up
  <nav className="v2-enter flex flex-wrap justify-center gap-4 text-sm [--enter:2] [&:has(a:hover)>a:not(:hover)]:opacity-55 [&:has(a:hover)>a:not(:hover)]:saturate-[.35] [&:has(a:focus-visible)>a:not(:focus-visible)]:opacity-55">
    {LINKS.map((l) => {
      const { Icon, day, night, tilt } = LINK_STYLE[l.label];
      return (
        <a
          key={l.label}
          data-intro="control"
          href={l.href}
          target="_blank"
          // "me": these profiles are the same person as this page
          rel={
            l.label === "resume"
              ? "noopener noreferrer"
              : "me noopener noreferrer"
          }
          style={
            {
              "--accent": ld(day, night),
              "--key": ld(
                `color-mix(in srgb, ${day} 6%, #f7f7f5)`,
                `color-mix(in srgb, ${night} 8%, #1d1c19)`,
              ),
              "--key-up": ld(
                `color-mix(in srgb, ${day} 20%, #f7f7f5)`,
                `color-mix(in srgb, ${night} 24%, #1d1c19)`,
              ),
              // its edge, seen once it's lifted (at night lighter than the
              // page, not darker, or it vanishes into it)
              "--edge": ld(
                `color-mix(in srgb, ${day} 45%, #f7f7f5)`,
                `color-mix(in srgb, ${night} 42%, #24221f)`,
              ),
              "--tilt": `${tilt}deg`,
            } as React.CSSProperties
          }
          // the link stays where it is and only its face lifts, so the
          // pointer can't slip off a corner as it tips and set it flickering
          className="group/i transition-[opacity,filter] duration-250 outline-none"
        >
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-[6px] bg-(--key) px-2 py-1 text-neutral-600 group-hover/i:text-neutral-900 group-focus-visible/i:text-neutral-900",
              "shadow-[inset_0_1px_0_var(--hi),0_0_0_var(--edge),0_0_0_-6px_rgb(0_0_0/0)]",
              "transition-[translate,rotate,background-color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover/i:-translate-y-[3px] group-hover/i:rotate-(--tilt) group-hover/i:bg-(--key-up) group-hover/i:shadow-[inset_0_1px_0_var(--hi),0_3px_0_var(--edge),0_10px_14px_-6px_rgb(0_0_0/0.28)]",
              "group-focus-visible/i:-translate-y-[3px] group-focus-visible/i:rotate-(--tilt) group-focus-visible/i:bg-(--key-up) group-focus-visible/i:shadow-[inset_0_1px_0_var(--hi),0_3px_0_var(--edge),0_10px_14px_-6px_rgb(0_0_0/0.28)]",
              "group-active/i:-translate-y-px group-active/i:shadow-[inset_0_1px_0_var(--hi),0_1px_0_var(--edge),0_3px_5px_-3px_rgb(0_0_0/0.25)] group-active/i:duration-75",
              // at night a shadow can't show on a page that dark, so the
              // depth comes from light instead: the face lit faintly from
              // above, a brighter rim along its top and shade along its
              // foot, and the lit edge under it
              "dark:bg-[image:linear-gradient(to_bottom,rgb(255_255_255/0.05),transparent_75%)]",
              "dark:group-hover/i:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_-1px_0_rgb(0_0_0/0.3),0_3px_0_var(--edge),0_4px_0_rgb(0_0_0/0.55),0_14px_20px_-6px_rgb(0_0_0/0.9)]",
              "dark:group-focus-visible/i:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_-1px_0_rgb(0_0_0/0.3),0_3px_0_var(--edge),0_4px_0_rgb(0_0_0/0.55),0_14px_20px_-6px_rgb(0_0_0/0.9)]",
              "dark:group-active/i:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),inset_0_-1px_0_rgb(0_0_0/0.3),0_1px_0_var(--edge),0_2px_0_rgb(0_0_0/0.55)]",
            )}
          >
            <span className="text-(--accent)">
              <Icon />
            </span>
            {l.label}
          </span>
        </a>
      );
    })}
  </nav>
);

const seeqlo = experiences.find((e) => e.company === "Seeqlo")!;

// a div, not a p: the internship card rendered inside it is block content
const Bio = () => (
  <div
    data-intro="text"
    className="v2-enter text-[15px] leading-loose text-neutral-600 [--enter:1]"
  >
    Hi, I&apos;m a 20 year old <StackWord>full stack</StackWord> engineer based
    in <PostcardWord>Bangalore, India</PostcardWord>. A curious individual that
    loves learning, building intentional interfaces. Previously worked as a
    frontend developer intern at{" "}
    {/* just the company opens the card: the whole phrase was a long strip
      to cross on the way down to the links */}
    <InternshipWord experience={seeqlo}>
      <CompanyLogo
        src={seeqlo.image}
        alt=""
        className="mr-1 size-[18px] translate-y-[3px] grayscale transition duration-300 group-hover/w:-rotate-6 group-hover/w:scale-110 group-hover/w:grayscale-0 group-aria-expanded/w:-rotate-6 group-aria-expanded/w:scale-110 group-aria-expanded/w:grayscale-0"
      />
      <Dotted>Seeqlo</Dotted>
    </InternshipWord>
    . Open to new roles.
  </div>
);

// what the page fetches ahead of being asked: the hobby panels once it's
// idle, and the toy box's cars once the about text is getting near (so a
// phone on a slow line isn't spending on them before it's even looked)
const Warm = () => {
  useEffect(() => {
    whenIdle(() => void warmPanels());
    const about = document.getElementById("about");
    if (!about) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        whenIdle(() => void import("./hot-wheels").then((m) => m.warmCars()));
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(about);
    return () => io.disconnect();
  }, []);
  return null;
};

/* ---------- about me ---------- */

const AboutMe = ({
  openId,
  onToggle,
}: {
  openId: HobbyId | null;
  onToggle: (id: HobbyId, anchor?: DOMRect) => void;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel sketch>about me</SectionLabel>
      <div data-intro="text" className="text-[15px] leading-loose text-neutral-600">
        {" "}
        Currently in my <EducationWord>final year</EducationWord> of college. I
        like <HobbyWord id="football" openId={openId} onToggle={onToggle} />,
        both playing and watching, with <United /> through the highs and
        (mostly) the lows. I&apos;ve been collecting{" "}
        <HobbyWord id="hotwheels" openId={openId} onToggle={onToggle}>
          hot wheels
        </HobbyWord>{" "}
        since I was a kid, and find{" "}
        <HobbyWord id="photography" openId={openId} onToggle={onToggle}>
          photography
        </HobbyWord>{" "}
        fun. For a creative outlet I turn to{" "}
        <HobbyWord id="sketches" openId={openId} onToggle={onToggle}>
          sketching
        </HobbyWord>
        , and catching up to an ever‑growing{" "}
        <HobbyWord id="reading" openId={openId} onToggle={onToggle}>
          reading
        </HobbyWord>{" "}
        list is a perpetual work in progress. The daily{" "}
        <Puzzle {...PUZZLES.cryptic} /> and <Puzzle {...PUZZLES.wordle} /> are
        always on the to-do list, and I&apos;ll rewatch <HaikyuWord /> any day.
      </div>
    </div>
  );
};

// the daily puzzles, each a link to where it's played: its icon before its
// name, grey at rest like United's crest, and in its own colours on hover,
// with a little tilt, as its name takes the puzzle's colour
const PUZZLES = {
  cryptic: {
    name: "Minute Cryptic",
    href: "https://www.minutecryptic.com/",
    icon: "/puzzles/minute-cryptic.png",
    color: ld("#94589f", "#e4bdf0"),
  },
  wordle: {
    name: "Wordle",
    href: "https://www.nytimes.com/games/wordle/index.html",
    icon: "/puzzles/wordle.png",
    color: ld("#537749", "#b3d6a9"),
  },
};

const Puzzle = ({
  name,
  href,
  icon,
  color,
}: {
  name: string;
  href: string;
  icon: string;
  color: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ "--accent": color } as React.CSSProperties}
    // medium, a step up from the text round it: they're links out, and
    // should read as something to press, without the hobby words' bold
    className="group/u inline-flex items-baseline gap-1 font-medium text-neutral-800 transition-colors duration-300 hover:text-(--accent) focus-visible:text-(--accent)"
  >
    {/* eslint-disable-next-line @next/next/no-img-element -- a tiny static icon */}
    <img
      src={icon}
      alt=""
      width={15}
      height={15}
      className="size-[1.05em] translate-y-[0.18em] rounded-[3px] grayscale transition duration-300 group-hover/u:-rotate-6 group-hover/u:scale-110 group-hover/u:grayscale-0 group-focus-visible/u:grayscale-0"
    />
    {name}
  </a>
);

// "United", with the club's crest before it: grey at rest, in colour with a
// little cheer on hover. it isn't a link, so the word stays in the
// sentence's own ink, not the darker ink and hover colour the puzzle links
// beside it have; only the crest reacts
const United = () => (
  <span className="group/u inline-flex items-baseline gap-1">
    {/* eslint-disable-next-line @next/next/no-img-element -- a tiny static svg */}
    <img
      src="/football/manutd-crest.svg"
      alt=""
      width={15}
      height={15}
      className="size-[1.1em] translate-y-[0.2em] grayscale transition duration-300 group-hover/u:grayscale-0 group-hover/u:animate-[crest-cheer_0.6s_cubic-bezier(0.22,1,0.36,1)]"
    />
    United
  </span>
);

// a hobby named inside the about text, highlighted in the colour its panel
// opens in. on hover each one sweeps into its own colours, like a broadcast
// graphic. every one is set the same way, the word and a small icon of its
// own that does a little something on hover; the colour is what tells them
// apart
const HobbyWord = ({
  id,
  openId,
  onToggle,
  children,
}: {
  id: WordId;
  openId: HobbyId | null;
  onToggle: (id: HobbyId, anchor?: DOMRect) => void;
  // the wording used in the sentence; defaults to the hobby's label
  children?: React.ReactNode;
}) => {
  const hobby = HOBBIES.find((h) => h.id === id)!;
  const isOpen = openId === id;
  const look = LOOKS[id];
  const Icon = look.Icon;

  return (
    <button
      type="button"
      aria-pressed={isOpen}
      data-hobby-word={id}
      data-sound={isOpen ? "close" : "open"}
      onClick={(e) => onToggle(id, e.currentTarget.getBoundingClientRect())}
      // its panel's fetched as the pointer heads for it, if it isn't in yet
      onPointerEnter={() => void warmPanel(id)}
      onFocus={() => void warmPanel(id)}
      style={
        {
          "--pill": look.pill,
          "--ink": look.word,
          "--on": look.sweep.text,
          "--band": look.sweep.band,
        } as React.CSSProperties
      }
      className={cn(
        // at rest just the word, bold and in the hobby's ink, so it reads as
        // something to press before you're near it; a phone has no hover to
        // tell you. the hobby's sweep runs over it on hover, and its colour
        // stays while its panel is open, so the word and the panel still read
        // as one. the padding is for those, and taken back with the margin so
        // at rest the word sits in the sentence like any other. its hit area
        // reaches a few px above and below the band (an unseen ::before), so
        // a thumb finds it without the band itself growing
        "group/w relative -mx-[3px] inline-flex before:absolute before:inset-x-0 before:-inset-y-1 items-center gap-1 rounded-[5px] px-[5px] leading-normal font-bold transition-[color,background-color,box-shadow,translate] duration-300 active:translate-y-px",
        isOpen
          ? // open: a soft bubble standing off the page. a light edge on top,
            // a deeper curve below, and a plain shadow under it. at night the
            // ink is light, so the curve is shaded in black instead (in ink it
            // would glow from underneath), and the shadow is deeper to show
            "bg-(--pill) text-(--ink) shadow-[inset_0_1.5px_1px_var(--hi),inset_0_-2.5px_3px_color-mix(in_srgb,var(--ink)_16%,transparent),0_1px_1px_rgb(0_0_0/0.08),0_3px_6px_-2px_rgb(0_0_0/0.14)] dark:shadow-[inset_0_1px_0.5px_rgb(255_255_255/0.16),inset_0_-2.5px_3px_rgb(0_0_0/0.28),0_1px_1px_rgb(0_0_0/0.5),0_4px_8px_-2px_rgb(0_0_0/0.7)]"
          : "text-(--ink)",
        // the words take the sweep's own text colour as its band passes
        "hover:text-(--on) hover:delay-[140ms]",
      )}
    >
      {/* the sweep, behind the words */}
      <Sweep edge={look.sweep.edge} band={look.sweep.band} />
      <span className="relative">{children ?? hobby.label}</span>
      {/* in the hobby's ink, and the sweep's text colour on hover. centred
        on the word's lowercase letters (most marks sit cap-high in their
        boxes, which reads as resting on the baseline) */}
      <span
        className={cn(
          "relative inline-flex translate-y-[0.085em] text-[0.95em] transition-colors duration-300",
          "group-hover/w:text-(--on) group-hover/w:delay-[160ms]",
          "text-(--ink)",
        )}
      >
        <Icon />
      </span>
    </button>
  );
};

// the words in the about text (the fireside's is in the sunset)
type WordId = Exclude<HobbyId, "fireside">;

const LOOKS: Record<
  WordId,
  {
    Icon: () => React.ReactNode;
    // the word and its icon at rest: a soft, dusty shade of the hobby's
    // colour by day (as pale as it goes and still reads, 4.5:1 on the
    // paper), a pastel at night
    word: string;
    // the open bubble's ground: the panel's by day; at night lifted and
    // richer than the panel's, so the bubble stands off the dark page
    pill: string;
    // the hover sweep's two colours, its edge then its band, and the words'
    // colour on it
    sweep: { edge: string; band: string; text: string };
  }
> = {
  // each the same way: a pastel band in the hobby's own colour, led in by a
  // pastel edge that belongs to it, with the word deepened on it; at night a
  // soft dark tint, the word in a pale pastel
  football: {
    word: ld("#b4524a", "#f2b3ab"),
    pill: ld("#f1d7d4", "#5e2924"),
    Icon: Devil,
    // united's red and yellow, softened
    sweep: {
      edge: ld("#fbe9a6", "#8f7d3c"),
      band: ld("#f8d4cf", "#5a2a26"),
      text: ld("#8f2f27", "#fbd9d4"),
    },
  },
  hotwheels: {
    word: ld("#486dbf", "#a9c2f5"),
    pill: ld("#cfe0fb", "#264383"),
    Icon: RaceCar,
    // the packaging's orange track and blue
    sweep: {
      edge: ld("#fdd3a8", "#9a6a3d"),
      band: ld("#d3e0fa", "#263f73"),
      text: ld("#2c4f9e", "#dbe6fd"),
    },
  },
  photography: {
    word: ld("#58738d", "#b5cbe0"),
    pill: ld("#dfe6ec", "#30465c"),
    Icon: Polaroid,
    // the print's sky
    sweep: {
      edge: ld("#cbe5f6", "#4c6f88"),
      band: ld("#dbe6ef", "#2e4458"),
      text: ld("#3b5670", "#e1ebf4"),
    },
  },
  sketches: {
    word: ld("#836c50", "#dccbaa"),
    pill: ld("#e6e2d9", "#4f4433"),
    Icon: SketchPencil,
    // a pencil's yellow
    sweep: {
      edge: ld("#f8e6a6", "#8f7d45"),
      band: ld("#ece3d3", "#4a3f2f"),
      text: ld("#5f4d36", "#f1e7d2"),
    },
  },
  reading: {
    word: ld("#577945", "#b8d4a3"),
    pill: ld("#dde6d5", "#34512a"),
    Icon: ReadingBook,
    // a leaf's green
    sweep: {
      edge: ld("#e9f2d4", "#5f7d48"),
      band: ld("#dceacf", "#2f4a26"),
      text: ld("#3f5d2f", "#e1eed6"),
    },
  },
};
