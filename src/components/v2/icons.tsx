import { cn } from "@/lib/utils";

/*
 * Small line icons, drawn in currentColor at 1em.
 *
 * UI icons animate when their trigger is hovered: give the trigger the
 * `group/i` class. Word icons (beside text that opens something) animate on
 * `group/w`. Weather icons move on their own, slowly. Keyframes live in
 * globals.css ("v2: icons") and all stand still under reduced motion.
 */

const Svg = ({
  className,
  children,
  viewBox = "0 0 16 16",
  strokeWidth = 1.4,
}: {
  className?: string;
  children: React.ReactNode;
  viewBox?: string;
  strokeWidth?: number;
}) => (
  <svg
    aria-hidden
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    // icons are never the target themselves: one that moves on hover (the
    // close cross turns) would otherwise drag the hit area with it, and the
    // hover flickers on and off at its edge
    className={cn(
      "pointer-events-none inline-block size-[1em] shrink-0 overflow-visible",
      className,
    )}
  >
    {children}
  </svg>
);

/* ---------- UI: arrows loop through, close turns, expand pushes out ---------- */

// the arrow leaves through one edge while its twin arrives through the other
const Loop = ({
  out,
  back,
  children,
}: {
  out: string;
  back: string;
  children: React.ReactNode;
}) => (
  <span className="relative inline-block size-[0.9em] shrink-0 overflow-hidden">
    <span
      className={cn(
        "absolute inset-0 transition-transform duration-300 ease-out",
        out,
      )}
    >
      {children}
    </span>
    <span
      className={cn(
        "absolute inset-0 transition-transform duration-300 ease-out",
        back,
      )}
    >
      {children}
    </span>
  </span>
);

const upRight = (
  <Svg className="block size-full">
    <path d="M3.5 12.5l9-9M5 3.5h7.5V11" />
  </Svg>
);
export const ArrowUpRight = () => (
  <Loop
    out="group-hover/i:translate-x-full group-hover/i:-translate-y-full"
    back="-translate-x-full translate-y-full group-hover/i:translate-x-0 group-hover/i:translate-y-0"
  >
    {upRight}
  </Loop>
);

const right = (
  <Svg className="block size-full">
    <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" />
  </Svg>
);
export const ArrowRight = () => (
  <Loop
    out="group-hover/i:translate-x-full"
    back="-translate-x-full group-hover/i:translate-x-0"
  >
    {right}
  </Loop>
);

const left = (
  <Svg className="block size-full">
    <path d="M13.5 8h-11M7 3.5L2.5 8 7 12.5" />
  </Svg>
);
export const ArrowLeft = () => (
  <Loop
    out="group-hover/i:-translate-x-full"
    back="translate-x-full group-hover/i:translate-x-0"
  >
    {left}
  </Loop>
);

// for something that opens out in place, where an arrow would promise
// going somewhere else
export const Plus = () => (
  <Svg className="size-[0.85em] transition-transform duration-300 ease-out group-hover/i:rotate-90">
    <path d="M8 3v10M3 8h10" />
  </Svg>
);

export const Close = () => (
  <Svg className="size-[0.85em] transition-transform duration-300 ease-out group-hover/i:rotate-90">
    <path d="M4 4l8 8M12 4l-8 8" />
  </Svg>
);

export const Expand = () => (
  <Svg className="size-[0.85em]">
    <g className="transition-transform duration-300 ease-out group-hover/i:translate-x-[1.5px] group-hover/i:-translate-y-[1.5px]">
      <path d="M9.5 2.5h4v4M13.5 2.5L9 7" />
    </g>
    <g className="transition-transform duration-300 ease-out group-hover/i:-translate-x-[1.5px] group-hover/i:translate-y-[1.5px]">
      <path d="M6.5 13.5h-4v-4M2.5 13.5L7 9" />
    </g>
  </Svg>
);

/* ---------- links: solid and a touch heavy, each with its own small move ---------- */

// filled glyphs on a 16 grid. strokes are set per part, so the svg's own
// default stroke is switched off
const Solid = ({
  children,
  viewBox,
}: {
  children: React.ReactNode;
  viewBox?: string;
}) => (
  <Svg className="stroke-0 fill-current" viewBox={viewBox}>
    {children}
  </Svg>
);
const cut = "var(--wx-bg, var(--paper))";

export const ResumeIcon = () => (
  <Solid viewBox="0 1 15 15">
    <g className="group-hover/i:animate-[icon-hop_0.6s_ease-out]">
      <path d="M4 1.5h5l3.5 3.5v8a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 13V3A1.5 1.5 0 014 1.5z" />
      <path
        d="M5.2 8.2h5.6"
        stroke={cut}
        strokeWidth={1.3}
        strokeLinecap="round"
        className="origin-left [transform-box:fill-box] group-hover/i:animate-[icon-write_0.45s_0.1s_ease-out_both]"
      />
      <path
        d="M5.2 10.9h3.4"
        stroke={cut}
        strokeWidth={1.3}
        strokeLinecap="round"
        className="origin-left [transform-box:fill-box] group-hover/i:animate-[icon-write_0.4s_0.28s_ease-out_both]"
      />
    </g>
  </Solid>
);

export const LinkedinIcon = () => (
  <Solid viewBox="-0.146 0.32 16.364 16.364">
    <rect
      x="1.5"
      y="1.5"
      width="13"
      height="13"
      rx="3"
      className="origin-center [transform-box:fill-box] transition-transform duration-300 ease-out group-hover/i:scale-105"
    />
    <circle
      cx="5"
      cy="5"
      r="1.1"
      fill={cut}
      stroke="none"
      className="origin-center [transform-box:fill-box] group-hover/i:animate-[icon-pop_0.5s_ease-out]"
    />
    <path
      d="M5 7.2v4.3M7.7 11.5V7.2m0 1.9c0-1 .7-1.9 1.9-1.9s1.7.8 1.7 1.9v2.4"
      stroke={cut}
      strokeWidth={1.35}
      strokeLinecap="round"
      fill="none"
    />
  </Solid>
);

export const GithubIcon = () => (
  <Solid viewBox="0.244 0.832 15.333 15.333">
    <path
      d="M4.5 4.5v7"
      strokeWidth={1.9}
      strokeLinecap="round"
      className="stroke-current"
      fill="none"
    />
    {/* the branch is pulled down with the node riding on it: it squashes
        towards the stem as the node drops, on the node's own timing */}
    <path
      d="M4.5 11.5c0-3.2 6.5-1.2 6.5-5.2"
      strokeWidth={1.9}
      strokeLinecap="round"
      className="origin-bottom stroke-current [transform-box:fill-box] [vector-effect:non-scaling-stroke] group-hover/i:animate-[icon-branch_0.7s_ease-in-out]"
      fill="none"
    />
    <circle cx="4.5" cy="3.3" r="1.9" />
    <circle cx="4.5" cy="12.7" r="1.9" />
    <circle
      cx="11"
      cy="5.5"
      r="1.9"
      className="group-hover/i:animate-[icon-node_0.7s_ease-in-out]"
    />
  </Solid>
);

// leetcode's mark and the X mark: the real glyphs, with a round stroke of the
// same colour added all round, which softens every corner and gives them the
// weight of the other icons. leetcode's dash is written out on hover; the X
// just takes its colour
// (the five link icons' viewBoxes are fitted so each mark's drawn size, stroke
// included, is 12px on its long side (11 for linkedin's square), centred in
// the 14px box, whose middle is the middle of the text's x-height)
const SOFT = "stroke-current stroke-[1.3] [stroke-linejoin:round]";

export const LeetcodeIcon = () => (
  <Solid viewBox="-2.641 -1.707 29.423 29.423">
    <path
      d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"
      className={SOFT}
    />
    <path
      d="M10.617 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
      className={cn(
        SOFT,
        "origin-left [transform-box:fill-box] group-hover/i:animate-[icon-write_0.55s_0.1s_ease-out_both]",
      )}
    />
  </Solid>
);

export const XIcon = () => (
  <Solid viewBox="-0.528 -0.444 26.437 26.437">
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      className={cn(SOFT, "[stroke-width:0.7]")}
    />
  </Solid>
);

// a mortarboard: tossed up with a tilt, it lands with a little squash and
// the tassel swings
export const Cap = () => (
  <Solid>
    <g className="origin-center [transform-box:fill-box] group-hover/w:animate-[cap-toss_0.9s_cubic-bezier(0.3,0,0.3,1)]">
      <path d="M8 2L.9 5.8 8 9.6l7.1-3.8L8 2z" />
      <path d="M3.9 8.9v2.4c0 1.3 1.9 2.4 4.1 2.4s4.1-1.1 4.1-2.4V8.9L8 11.1 3.9 8.9z" />
      <path
        d="M14.2 6.6v4"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        fill="none"
        className="origin-top [transform-box:fill-box] group-hover/w:animate-[icon-swing_0.8s_0.75s_ease-in-out]"
      />
    </g>
  </Solid>
);

/* ---------- words: grey at rest, coloured and moving on hover ---------- */

export const Pin = () => (
  <Solid>
    <g className="origin-bottom [transform-box:fill-box] group-hover/w:animate-[icon-hop_0.6s_ease-out]">
      <path d="M8 15.2s4.9-4.5 4.9-8.3a4.9 4.9 0 10-9.8 0c0 3.8 4.9 8.3 4.9 8.3z" />
      <circle
        cx="8"
        cy="6.8"
        r="1.7"
        fill={cut}
        className="origin-center [transform-box:fill-box] group-hover/w:animate-[icon-pop_0.5s_0.15s_ease-out]"
      />
    </g>
  </Solid>
);

export const Ball = () => (
  <Svg className="group-hover/w:animate-[icon-roll_0.7s_cubic-bezier(0.22,1,0.36,1)]">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5.2l2.4 1.7-.9 2.8H6.5l-.9-2.8L8 5.2zM8 5.2V2M10.4 6.9l2.9-1M9.5 9.7l1.8 2.5M6.5 9.7l-1.8 2.5M5.6 6.9l-2.9-1" />
  </Svg>
);

export const Car = () => (
  <Svg className="group-hover/w:animate-[icon-drive_0.7s_cubic-bezier(0.22,1,0.36,1)]">
    <path d="M1.5 10.5V8.8c0-.6.4-1.1 1-1.2l2-.4 1.8-2.1c.3-.3.7-.5 1.1-.5h3.2c.4 0 .8.2 1 .5l1.6 2 1.3.4c.5.2.9.7.9 1.2v1.8" />
    <path d="M1.5 10.5h1.4M6.4 10.5h3.2M13.1 10.5h1.4" />
    <circle cx="4.6" cy="10.6" r="1.6" />
    <circle cx="11.4" cy="10.6" r="1.6" />
  </Svg>
);

export const Camera = () => (
  <Svg>
    <path d="M2 5.5c0-.6.4-1 1-1h2l1-1.5h4l1 1.5h2c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5.5z" />
    <circle
      cx="8"
      cy="8.6"
      r="2.4"
      className="origin-[8px_8.6px] group-hover/w:animate-[icon-shutter_0.5s_ease-out]"
    />
    {/* the flash */}
    <path
      d="M12.4 6.3h.01"
      strokeWidth={2}
      className="opacity-0 group-hover/w:animate-[icon-flash_0.5s_ease-out]"
    />
  </Svg>
);

export const Pencil = () => (
  <Svg className="origin-[3px_13px] group-hover/w:animate-[icon-scribble_0.6s_ease-in-out]">
    <path d="M10.8 2.7l2.5 2.5-7.6 7.6-3.3.8.8-3.3 7.6-7.6zM9.4 4.1l2.5 2.5" />
  </Svg>
);

export const Book = () => (
  <Svg>
    <path d="M8 4.3C6.7 3.2 4.6 3 2.5 3.4v8.8c2.1-.4 4.2-.2 5.5.9 1.3-1.1 3.4-1.3 5.5-.9V3.4c-2.1-.4-4.2-.2-5.5.9zM8 4.3v8.8" />
    {/* a page turning over the spine */}
    <path
      d="M8 4.3c1.3-1.1 3.4-1.3 5.5-.9v8.8c-2.1-.4-4.2-.2-5.5.9"
      className="origin-[8px_8px] opacity-0 group-hover/w:animate-[icon-page_0.6s_ease-in-out]"
    />
  </Svg>
);

/* ---------- weather: ambient, slow ---------- */

export type WeatherKind =
  | "sun"
  | "moon"
  | "partly"
  | "cloud"
  | "fog"
  | "rain"
  | "storm";

const cloud = "M4.5 12.5h7a3 3 0 00.4-6 4 4 0 00-7.6.9A2.6 2.6 0 004.5 12.5z";

export const WeatherIcon = ({ kind }: { kind: WeatherKind }) => {
  switch (kind) {
    case "sun":
      return (
        <Svg>
          <circle cx="8" cy="8" r="2.8" />
          <g className="origin-center animate-[wx-spin_24s_linear_infinite]">
            <path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
          </g>
        </Svg>
      );
    case "moon":
      return (
        <Svg>
          <path d="M12.8 9.6A5.2 5.2 0 016.4 3.2a5.2 5.2 0 106.4 6.4z" />
          <path
            d="M12 2.5v1.6M11.2 3.3h1.6"
            className="animate-[wx-twinkle_3s_ease-in-out_infinite]"
            strokeWidth={1.1}
          />
        </Svg>
      );
    case "partly":
      return (
        <Svg>
          <g className="animate-[wx-peek_6s_ease-in-out_infinite]">
            <circle cx="10.5" cy="5.5" r="2.2" />
            <path d="M10.5 1.6v.8M14.4 5.5h-.8M13.3 2.7l-.6.6" />
          </g>
          <path
            d={cloud}
            fill="var(--wx-bg, var(--paper))"
            className="animate-[wx-drift_6s_ease-in-out_infinite]"
          />
        </Svg>
      );
    case "cloud":
      return (
        <Svg>
          {/* a second cloud behind, peeking out over the first one's
            shoulder; the first is filled, so it hides the rest of it */}
          <path
            d="M7.6 4.6a3.2 3.2 0 016.2 1.5 2.3 2.3 0 01-.4 4.4"
            className="animate-[wx-drift_7s_ease-in-out_infinite_reverse] opacity-60"
          />
          <path
            d={cloud}
            fill="var(--wx-bg, var(--paper))"
            className="animate-[wx-drift_7s_ease-in-out_infinite]"
          />
        </Svg>
      );
    case "fog":
      return (
        <Svg>
          <path
            d="M2.5 5.5h9"
            className="animate-[wx-drift_5s_ease-in-out_infinite]"
          />
          <path
            d="M4.5 8.5h9"
            className="animate-[wx-drift_5s_ease-in-out_infinite_reverse]"
          />
          <path
            d="M2.5 11.5h9"
            className="animate-[wx-drift_5s_ease-in-out_infinite]"
          />
        </Svg>
      );
    case "rain":
      return (
        <Svg>
          <path d="M4.5 9.5h7a3 3 0 00.4-6 4 4 0 00-7.6.9A2.6 2.6 0 004.5 9.5z" />
          {[5.5, 8, 10.5].map((x, i) => (
            <path
              key={x}
              d={`M${x} 11.2v1.6`}
              className="animate-[wx-fall_1.4s_ease-in_infinite]"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
          ))}
        </Svg>
      );
    case "storm":
      return (
        <Svg>
          <path d="M4.5 9.5h7a3 3 0 00.4-6 4 4 0 00-7.6.9A2.6 2.6 0 004.5 9.5z" />
          <path
            d="M8.6 9.8L7 12.3h2l-1.4 2.4"
            className="animate-[wx-flash_4s_ease-in-out_infinite]"
          />
        </Svg>
      );
  }
};

// a small fire: the flame leans and catches on hover
export const Flame = () => (
  <Solid>
    <g className="origin-bottom [transform-box:fill-box] group-hover/w:animate-[icon-flicker_0.9s_ease-in-out]">
      <path d="M8 15c-2.8 0-4.6-1.9-4.6-4.4 0-2.3 1.5-3.6 2.4-5.4.4 1.1 1 1.8 1.7 2.1C7.3 4.8 8.3 2.6 10 1c-.2 2.4.8 3.8 1.8 5.2.6.9 1 1.9 1 3.1C12.8 12.9 10.9 15 8 15z" />
      <path
        d="M8 13.6c-1.1 0-1.9-.8-1.9-1.8 0-1 .7-1.6 1.2-2.4.2.5.5.8.9.9.1-.8.5-1.6 1.1-2.2 0 1.1.6 1.7.9 2.4.2.4.3.8.3 1.2 0 1.1-.9 1.9-2.5 1.9z"
        fill={cut}
      />
    </g>
  </Solid>
);
