"use client";

import { getImageProps } from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { groundMask } from "./ground";
import { preload } from "react-dom";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./section-label";
import { Close, Expand } from "./icons";
import { PHOTOS, PHOTO_PREVIEW, type Hobby, type HobbyId } from "./data";
import type { Dock } from "./dock";
import type { Football } from "./football";
import type { Weather } from "./weather";
import { moodNow, sceneOf, type Mood } from "./fireside-mood";
import { lazyPart } from "./lazy-part";

// what's inside the panels: only wanted once one's opened, so each is its
// own small download, fetched ahead of time (see warmPanel)
const FootballCard = lazyPart(() =>
  import("./football-card").then((m) => m.FootballCard),
);
const Bedside = lazyPart(() => import("./bedside").then((m) => m.Bedside));
const ToyBox = lazyPart(() => import("./hot-wheels").then((m) => m.ToyBox));
const PhotoTable = lazyPart(() =>
  import("./photo-table").then((m) => m.PhotoTable),
);
const Sketchbook = lazyPart(() =>
  import("./sketchbook").then((m) => m.Sketchbook),
);
const Fireside = lazyPart(() => import("./fireside").then((m) => m.Fireside));

const PARTS: Record<HobbyId, { warm: () => Promise<void> }[]> = {
  football: [FootballCard],
  reading: [Bedside],
  hotwheels: [ToyBox],
  photography: [PhotoTable],
  sketches: [Sketchbook],
  fireside: [Fireside],
};

// fetch a hobby's panel ahead of its opening: as the pointer heads for its
// word, or for all of them once the page is idle
export const warmPanel = (id: HobbyId) =>
  Promise.all(PARTS[id].map((p) => p.warm()));
export const warmPanels = () =>
  Promise.all((Object.keys(PARTS) as HobbyId[]).map((id) => warmPanel(id)));

// panels whose scene says what they are, so they go without a heading
const UNTITLED = new Set<HobbyId>([
  "hotwheels",
  "football",
  "reading",
  "sketches",
  "fireside",
]);

// panels set at night, whose ground is dark and whose buttons are light
// (the fireside's, unless it's a dry day there)
const DARK = new Set<HobbyId>(["fireside"]);
const isDark = (id: HobbyId, mood: Mood) =>
  DARK.has(id) && !(id === "fireside" && sceneOf(mood) === "day");
// the fireside's sky, behind its scene (see .hobby-ground in globals.css)
const skyOf = (mood: Mood) => (mood.wet ? `rain-${mood.time}` : mood.time);

// windows that take their content's height rather than the full one
const FIT_WINDOW = new Set<HobbyId>(["reading"]);

// hobbies with enough to say that their panel can open up into a window
export const HAS_MORE: ReadonlySet<HobbyId> = new Set([
  "photography",
  "reading",
]);

/*
 * Where a closing window flies to: its hobby word in the about text, as a
 * transform from the window's current box. Passed to the exit through
 * AnimatePresence's `custom`, since it's only known at the moment of closing.
 */
export type PillTarget = { x: number; y: number; sx: number; sy: number };

export function pillTarget(id: HobbyId): PillTarget | null {
  const panel = document
    .querySelector(`[data-hobby-panel="${id}"]`)
    ?.getBoundingClientRect();
  const pill = document
    .querySelector(`[data-hobby-word="${id}"]`)
    ?.getBoundingClientRect();
  if (!panel || !pill) return null;
  return {
    x: pill.left + pill.width / 2 - (panel.left + panel.width / 2),
    y: pill.top + pill.height / 2 - (panel.top + panel.height / 2),
    sx: pill.width / panel.width,
    sy: pill.height / panel.height,
  };
}

// the window's images, and the `sizes` they render at. kept in one place so
// warmMore() preloads exactly the files the window will ask for
const MORE_IMAGES: Partial<
  Record<HobbyId, { srcs: readonly string[]; sizes: string }>
> = {
  // the window's first rows; the rest load as they scroll into view
  // the whole table is on show at once
  photography: { srcs: PHOTOS, sizes: "10rem" },
};

// fetch a window's images while its panel sits docked, so the first glide
// into the window isn't held up by image requests and decodes
function warmMore(id: HobbyId) {
  const more = MORE_IMAGES[id];
  if (!more) return;
  for (const src of more.srcs) {
    const { props } = getImageProps({
      src,
      alt: "",
      fill: true,
      sizes: more.sizes,
    });
    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
    });
  }
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
// long, soft settle for big moves: docked ⇄ window, window → word
const GLIDE = [0.32, 0.72, 0, 1] as const;

// the fade and the blur are of variables the panel's opacity and filter
// read (--shown, --blur), not the properties themselves: motion hands an
// opacity or filter animation to the browser to run, and the browser drops
// it a frame before motion has set the final value, so an arriving panel
// blinked back to nothing at the end, and a leaving one flashed back in
// before it was taken away. variables it runs itself, to the end
const panelVariants: Variants = {
  hidden: { "--shown": 0, scale: 0.96, "--blur": "6px" },
  shown: {
    "--shown": 1,
    scale: 1,
    "--blur": "0px",
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  exit: (into: PillTarget | null) =>
    into
      ? {
          x: into.x,
          y: into.y,
          scaleX: into.sx,
          scaleY: into.sy,
          "--shown": 0,
          "--blur": "2px",
          transition: {
            duration: 0.55,
            ease: GLIDE,
            // stays visible for most of the flight, fades as it lands
            "--shown": { duration: 0.3, delay: 0.25, ease: "easeIn" },
          },
        }
      : {
          "--shown": 0,
          scale: 0.98,
          "--blur": "6px",
          transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
        },
};

// panels grow from the corner nearest the column and the text below
const DOCK_SIDE = {
  left: "xl:right-(--dock-offset) xl:origin-bottom-right",
  right: "xl:left-(--dock-offset) xl:origin-bottom-left",
};

const LAYOUT = { layout: { duration: 0.6, ease: GLIDE } };

export const HobbyPanel = ({
  ref,
  hobby,
  dock,
  expanded,
  onExpand,
  onClose,
  football,
  weather,
}: {
  // AnimatePresence's popLayout needs the panel's element
  ref?: React.Ref<HTMLDivElement>;
  hobby: Hobby;
  dock: Dock;
  expanded: boolean;
  onExpand: () => void;
  onClose: () => void;
  football: Football;
  weather: Weather;
}) => {
  // what the old man's up to, settled as the panel opens (not changing under
  // you while it's open)
  const [mood] = useState(() => moodNow(weather));
  // the window's pictures, fetched while the panel's docked: on a laptop as
  // soon as it opens (so the glide into the window isn't held up), but on
  // a phone only once "more" is pressed, rather than spend someone's data
  // on a window they mostly won't open
  if (!expanded && matchMedia("(hover: hover)").matches) warmMore(hobby.id);
  const card = useRef<HTMLDivElement>(null);
  // once it's in, the filter goes altogether: one left in place, even at
  // nothing, keeps the panel on a separately rasterised layer, which can
  // leave its images and text soft. it's back as soon as the panel leaves
  const present = useIsPresent();
  const [arrived, setArrived] = useState(false);
  const crisp = arrived && present;
  // if the content doesn't fit above the clicked word's spot, lift the panel
  // by what's missing (never past the top margin) rather than clip it
  const [lift, setLift] = useState(0);
  useLayoutEffect(() => {
    const el = card.current;
    if (!el || expanded) return;
    const missing = el.scrollHeight - el.clientHeight;
    if (missing > 0) setLift((l) => l + missing);
  }, [expanded, hobby.id]);
  return (
    // outer layer is positioned and unclipped so the effect can bleed past the
    // card; the card itself scrolls when content overflows. `layout` glides it
    // between its docked spot and the centred window.
    <motion.div
      ref={ref}
      layout
      data-hobby-panel={hobby.id}
      style={
        {
          "--from-bottom": `${Math.max(32, dock.fromBottom - lift)}px`,
          opacity: "var(--shown)",
          filter: crisp ? "none" : "blur(var(--blur))",
          ...(expanded && { originX: 0.5, originY: 0.5 }),
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-col",
        expanded
          ? cn(
              "fixed inset-0 z-50 m-auto w-[min(60rem,calc(100vw-2rem))]",
              // a window as tall as what it holds, or the full height
              FIT_WINDOW.has(hobby.id)
                ? "h-fit max-h-[calc(100vh-4rem)]"
                : "h-[min(42rem,calc(100vh-4rem))]",
            )
          : [
              "relative xl:fixed xl:bottom-(--from-bottom) xl:z-10 xl:max-h-[calc(100vh_-_var(--from-bottom)_-_2rem)] xl:w-(--dock-w)",
              DOCK_SIDE[dock.side],
            ],
      )}
      variants={panelVariants}
      initial="hidden"
      animate="shown"
      exit="exit"
      onAnimationComplete={(done) => done === "shown" && setArrived(true)}
      transition={LAYOUT}
    >
      <Ground
        hobby={hobby}
        expanded={expanded}
        sky={hobby.id === "fireside" ? skyOf(mood) : undefined}
      />
      <motion.div
        ref={card}
        layout
        transition={LAYOUT}
        style={{ "--ink": hobby.ink } as React.CSSProperties}
        className={cn(
          "no-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto",
          expanded ? "gap-6 p-8" : "gap-4 p-5",
        )}
      >
        <motion.div
          layout="position"
          transition={LAYOUT}
          className="flex items-center justify-between"
        >
          {UNTITLED.has(hobby.id) ? (
            <h2 className="sr-only">{hobby.label}</h2>
          ) : (
            <SectionLabel>{hobby.label}</SectionLabel>
          )}
          {/* the buttons reach a little past their glyphs (padding taken back
            by a negative margin), so they're easy to hit and nothing shifts */}
          <div
            className={cn(
              "ml-auto flex items-center gap-4 text-xs",
              isDark(hobby.id, mood)
                ? "text-[#efe6d2]/45 [&_button]:hover:text-[#efe6d2]"
                : "text-neutral-500",
            )}
          >
            {!expanded && HAS_MORE.has(hobby.id) && (
              <button
                onClick={onExpand}
                onPointerDown={() => warmMore(hobby.id)}
                onFocus={() => warmMore(hobby.id)}
                data-sound="open"
                className="group/i -m-1.5 inline-flex items-center gap-1 p-1.5 hover:text-neutral-900"
              >
                more <Expand />
              </button>
            )}
            <button
              onClick={onClose}
              data-sound="close"
              aria-label={`close ${hobby.label}`}
              className="group/i -m-1.5 inline-flex items-center gap-1 p-1.5 hover:text-neutral-900"
            >
              {expanded && "close"} <Close />
            </button>
          </div>
        </motion.div>

        {/* the docked content steps aside quickly; the window's fades in once
          the glide is mostly done, so nothing is seen mid-stretch. the one
          leaving is popped out of the flow at the size it was, so it doesn't
          reflow to the new width as it fades, and the one arriving is laid
          out at once, so a window sized to its content glides straight to
          its final height instead of jumping when the swap lands */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={expanded ? "more" : "less"}
            layout="position"
            // a variable the opacity reads, as with the panel
            style={{ opacity: "var(--in)" }}
            initial={{ "--in": 0, y: 6 }}
            animate={{
              "--in": 1,
              y: 0,
              transition: {
                duration: 0.35,
                delay: expanded ? 0.25 : 0,
                ease: EASE_OUT,
              },
            }}
            exit={{ "--in": 0, transition: { duration: 0.1 } }}
            // the window's content fills it, so a table can take the room left
            className={cn(expanded && "flex min-h-0 flex-1 flex-col")}
          >
            {expanded ? (
              <HobbyMore id={hobby.id} />
            ) : (
              <HobbyContent
                id={hobby.id}
                football={football}
                mood={mood}
                onClose={onClose}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// the ground the scene sits on, in the hobby's colour (see .hobby-ground),
// fading into the paper at a soft, wavering edge. it reaches past the card
// so the fade happens around the content, not over it. the edge is drawn for
// the ground's actual size, so the fade is the same width on every side
const Ground = ({
  hobby,
  expanded,
  sky,
}: {
  hobby: Hobby;
  expanded: boolean;
  sky?: string;
}) => {
  const el = useRef<HTMLDivElement>(null);
  const [mask, setMask] = useState<string | null>(null);
  useLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    const draw = () =>
      setMask(
        groundMask(node.offsetWidth, node.offsetHeight, hobby.id, expanded),
      );
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(node);
    return () => ro.disconnect();
  }, [hobby.id, expanded]);
  return (
    <motion.div
      ref={el}
      aria-hidden
      data-ground={hobby.id}
      data-sky={sky}
      layout
      transition={LAYOUT}
      style={
        {
          "--ground": hobby.color,
          "--ink": hobby.ink,
          ...(mask && {
            mask: `${mask} 0 0 / 100% 100% no-repeat`,
            WebkitMask: `${mask} 0 0 / 100% 100% no-repeat`,
          }),
        } as React.CSSProperties
      }
      className={cn(
        "hobby-ground pointer-events-none absolute",
        expanded ? "-inset-7" : "-inset-5",
      )}
    />
  );
};

const HobbyContent = ({
  id,
  football,
  mood,
  onClose,
}: {
  id: HobbyId;
  football: Football;
  mood: Mood;
  onClose: () => void;
}) => {
  switch (id) {
    case "photography":
      return (
        <PhotoTable
          srcs={PHOTO_PREVIEW}
          sizes="8rem"
          delay={0.15}
          className="aspect-[4/3]"
        />
      );
    case "sketches":
      return <Sketchbook sizes="14rem" />;
    case "hotwheels":
      return <ToyBox />;
    case "fireside":
      return <Fireside mood={mood} onLeave={onClose} />;
    case "football":
      return <FootballCard data={football} />;
    case "reading":
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[15px] text-neutral-700">A few recommendations.</p>
          <Bedside delay={0.15} />
        </div>
      );
  }
};

/* ---------- the opened-up window; all copy here is placeholder ---------- */

const HobbyMore = ({ id }: { id: HobbyId }) => {
  switch (id) {
    case "photography":
      return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <MoreIntro>
            &ldquo;photography&rdquo; seems a bit overkill, just some photos i clicked with
            my phone - Samsung s22.
          </MoreIntro>
          <PhotoTable
            srcs={PHOTOS}
            sizes={MORE_IMAGES.photography!.sizes}
            delay={0.3}
            className="min-h-0 flex-1"
          />
        </div>
      );
    case "reading":
      return (
        <div className="flex flex-col gap-8">
          <div className="no-scrollbar min-w-0 overflow-x-auto pt-2">
            <Bedside big delay={0.3} />
          </div>
        </div>
      );
    default:
      return null;
  }
};

const MoreIntro = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] leading-relaxed text-neutral-700">{children}</p>
);
