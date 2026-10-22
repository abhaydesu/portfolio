"use client";

import { cn } from "@/lib/utils";

/*
 * The marks the about-me words wear, each with its own move on hover (they
 * animate on the word's `group/w`). Keyframes live in globals.css ("v2:
 * hobby marks") and stand still under reduced motion.
 */

/* ---------- hot wheels ---------- */

export const HW_FLAME =
  "M352.6,192.8c-51.9-5-141.2,16.2-214.9,32.4c-59,13-107.1,21.1-139.3,19.9 c-18.1-1.2-35.9-6.4-50.1-18c2.2,5.6,13.2,21.4,17.9,23.1c-18.8,1.5-38.2,3.7-56.9-0.3c-14.9-3.2-31.4-8.6-43.2-19.6 c9.1,16.9,23,32.6,38.3,44.1c27.4,20.6,65.5,20,96.8,9.9c0.6-0.2,6.9-2,10.3-2c8,0.3,13.9,5.9,9.3,19c-3.9,9.8-11.7,17.5-20.8,17.7 c-12.1,0-12.9-9.6-26.7-9.1c-24.1-0.6-39.6,10-72-8.1c6.6,6.5,44.6,48.2,126,56.8c20.8,2.2,44,0.4,54.9-0.8 c70.6-7.4,125.7-31.4,174.3-52.6c41.2-18.6,90.7-37.9,127.7-39.9c31.1-2.5,55.2,7.5,64.5,26.8c4.2,8.6,5.2,18.5,3,28.7 C482.9,276.4,469.3,201.7,352.6,192.8";
export const HW_LETTERS =
  "M439.5,261.4h3.9l-0.1,0.6l-0.3,0.3h-1.1l-0.9,5h-1.1l0.9-5h-1.4L439.5,261.4z M446.4,266.5 l1.5-3.1h0.1l-0.4,3.9h1.1l0.1-0.5l0.4-5.4h-1.3l-1.6,3.3h-0.1l-0.5-3.3h-1.3l-1.5,5.4l-0.1,0.5h1.1l1-3.9h0.1l0.4,3.1H446.4z M128.8,242c16.9,5.4,19.4,36.2,18.5,46.6c-0.9,10-1,17.7-7,33.4c-1.8,4.1-3.1,10.7,7,7.5c14.5-4.7,28.9-22,31.8-45.4 c0,0,0.1-0.7,0,0c-3.8,10.6-10,12.1-12.1,12c-2.5-0.1-1.4-2.8-1.2-4.1c0.6-2.8,1.6-13.2,1.6-15.2c0-2.1,2-3.1,2-3.1 c14.2-7.2,10.9-19.3,10.9-19.3c-3.3,4-12.9,5.7-14.4,5.7c-0.7,0-1.5-0.3-2.1-1.8l0,0C158.4,246.2,144.9,237.6,128.8,242 M117.1,262.8c4.2-0.9,6.5,9.4,6.1,26c-0.4,16.6-0.9,32-6.9,33.3c-6,1.2-7.2-13.5-6.7-30.1C110.2,275.5,112.7,263.8,117.1,262.8 M141,284.7c0.6-24.6-10.3-40.2-24-36.5c-14.5,4-23.8,21.7-24.8,46.8c-2.2,18.1,6.7,44.8,23.6,42C133.7,333,140.3,309.4,141,284.7 M111.9,239.4c-22.1,4.9-30.9,6.1-43.9,8.4c0,0,2.6,5.8,2,20.9c-0.5,14.8-3.6,22-6.8,22c-2.7,0-5.7-7.3-5.7-21.2 c0-15.2,3.5-20.7,3.5-20.7c-28.1,4.2-41.6,5.3-61,4.7c13.5,5.6,43.1,14.4,39.5,48.1c-3.3,30.2-29,44.8-32,45.2 c22.8,4.5,40.9,4.2,50.8,3.9c0,0-2.8-9.5-2.5-22.5c0.3-9.8,3.9-20.9,7.1-21.4c4.3-0.6,6.1,9.2,5.6,20.9c-0.5,14.2-3.1,22.6-3.1,22.6 c8.9-0.3,27-2.5,43.6-5.1c-25.4-11.4-23.3-45.8-23-50.7C87.3,271,97.8,248.3,111.9,239.4 M162.6,228.5c5.6-1.2,31.7-6.9,37.8-8.2 c2.9,1.6,9.8,6.6,13.1,19.4c3.5,13.9,0,27.6,0,27.6s4.4-3.4,7.8-9.8c4.4-8.2,4.8-15.7,4.8-15.7s3.7,1.3,7.4,6.6 c4,5.6,3.4,10.5,3.4,10.5s5.6-9.4,4.4-20.3c-1.8-16-11.4-21.7-15.8-23.6c4.1-0.8,22.4-4.3,24.7-4.7c2,2.3,5.8,7.8,8.9,17.3 c5.8,18.4-1.3,33.8-7,46.4c-6.8,14.9-2.3,24.8-2.3,24.8l-14.5,6.5c0,0-4.4-2.6-8.2-12.5c-3.9-10-2.6-15.4-2.6-15.4s-5.1,3.8-8.6,17 c-3.3,12.2-0.6,19.1-0.6,19.1s-9.4,3.8-19,7.4c-8.8,3.4-17.2,6.2-17.2,6.2c3.9-4.9,16.8-23.8,15.4-55.1 C192.8,237.8,168.1,229.8,162.6,228.5 M291.3,203.8c5.4-0.7,20.9-2.2,26.7-2.6c-24.8,25.3-13.7,64.6-0.8,70.4 c-10.1,3.5-19.7,6.9-26.7,9.9c3.8-9.6,0-30.8-4-29.5c-4.6,1.5-7,19.5-3.4,32.5c-7.6,3.1-21.2,9-29,12.5 c13.2-25.5,24.1-61.1,0.9-87.5c6.7-1.2,21.9-3.6,27.2-4.4c-3,11.8-0.6,31.4,3.5,30.4C290.7,234.3,292.7,216.7,291.3,203.8 M430.4,261.8c3.1-0.5,5.2-2.5,6-5.6c1.5-5.6,0.7-9.6-5.2-14.9c-4.4-3.9-8.7-7.2-6.9-9.4c2.7-3.4,10.2,5.1,11.4,8.1 c0.5-3-0.3-5.8-1.4-8.3c-1.9-4.4-6.1-8.8-11.3-9.8c-1.4-0.3-4.9-0.9-7.8,1.6c-2,1.7-5.6,8.2,3,17.7c1.9,2.1,4.2,4.4,5.5,5.8 c1.3,1.4,1.8,2.7,1.6,3.8c-0.1,0.7-0.7,1.2-1.4,1.3c-2.6,0.4-7.3-3.4-8.8-6.6l-0.2,12.4c3.1,1.2,5.7,2.2,9.3,3.3 C426.3,261.9,428.5,262.1,430.4,261.8 M324.4,234.4c0,0,1.1-2.8,4.2-5.5c3-2.7,4.5-4.1,6.8-7c2.4-2.9,4.5-7.7,1.8-10.2 c-2.9-2.5-7.2,1.3-10.1,8.3C324.2,227,324.4,234.4,324.4,234.4 M329.6,239.9c-5.6,5.2-4.1,12.7,1.8,12.4 c5.7-0.4,11.9-11.5,11.9-11.5s0.6,24.2-16.2,27.5c-9.6,1.9-14.6-6.2-17.1-14.9c-3-10.2-1-31.1,9.4-43.2c9.5-11.1,19.4-11.3,24.8-7.9 c5.8,3.6,5.8,9.2,2.9,17.4C344.2,227.9,336.4,233.5,329.6,239.9 M363.5,219.7c-2.3,5.7-2.1,11.7-2.1,11.7s0.9-2.3,3.4-4.5 c2.4-2.2,3.6-3.4,5.5-5.8c1.9-2.4,3.6-6.3,1.4-8.3C369.3,210.8,365.8,213.9,363.5,219.7 M367.4,245.7c6-0.5,13.2-9.2,13.2-9.2 s-3.4,19.1-16.1,22.5c-8.4,2.2-12.8-3.2-15.2-11.6c-2.4-8.3-0.6-25.6,7.8-35.5c7.6-9.1,15.8-9.5,20.2-6.7c4.7,2.9,4.8,7.5,2.5,14.1 c-2.3,6.7-8.6,11.3-14.1,16.5C361.1,240.2,361.7,246.1,367.4,245.7 M385.7,206.3c4.1,14.4,1.2,39.9-7.8,50.8 c11.2-1.1,21.6-1.3,31.4,0.3l0.6-20.1c-3.7,9.1-24.3,20.7-7.9-26.2C397.9,209.7,393.3,208,385.7,206.3";

// the hot wheels mark: grey at rest like the other icons, in its own colours
// on hover, when the whole mark leans into speed (flame and letters together,
// so they never come apart), the flame stretches back once, and a glint runs
// across the letters
// the logo as it's printed: red flame, yellow letters, nothing moving. for
// the hot wheels panel's header
export const HotWheelsLogo = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="-136 190 604 172" className={className}>
    <path d={HW_FLAME} fill="#e22d3e" />
    <path
      d={HW_LETTERS}
      fill="#ffe900"
      stroke="#b3121f"
      strokeWidth={3}
      paintOrder="stroke"
    />
  </svg>
);

/* ---------- football ---------- */

// united's red devil (the club's devil mark, one silhouette in the text's
// colour). on hover he celebrates: springs up off his feet with a jab of the
// trident while sparks burst around him
const DEVIL =
  "M1092 3445 l-61 -124 -90 -3 -90 -3 75 -115 c125 -189 214 -383 214 -466 0 -43 -4 -50 -69 -114 -86 -86 -106 -131 -99 -231 5 -65 9 -76 61 -152 78 -116 83 -128 67 -179 -18 -63 -106 -234 -132 -257 -47 -44 -89 -19 -108 64 -19 86 -40 462 -28 524 6 33 37 106 79 186 38 73 69 135 69 138 0 4 -18 16 -39 26 -98 51 -186 201 -235 403 -17 71 -34 128 -37 128 -3 0 -19 -20 -37 -45 -17 -25 -39 -45 -47 -45 -9 0 -43 12 -76 26 -34 14 -75 24 -93 22 -29 -3 -35 -10 -93 -129 -55 -112 -66 -128 -100 -144 -38 -18 -38 -18 -125 12 -48 17 -89 28 -92 26 -2 -3 4 -21 14 -41 44 -85 60 -138 76 -245 9 -61 18 -114 20 -116 2 -2 27 18 56 45 109 102 192 150 281 160 117 14 171 -20 147 -92 -13 -39 -76 -106 -122 -130 -37 -19 -37 -51 -1 -60 53 -13 85 -35 99 -70 12 -28 18 -143 29 -527 16 -543 20 -579 79 -642 40 -42 88 -55 204 -55 l92 0 0 -82 c0 -46 -9 -168 -21 -271 -25 -223 -21 -266 38 -353 21 -31 56 -84 78 -118 l40 -61 0 -142 c0 -135 1 -144 23 -165 19 -19 33 -23 80 -22 102 3 270 72 328 136 55 61 49 90 -45 229 -69 102 -122 207 -121 242 1 22 24 43 97 90 122 78 123 100 9 269 -46 69 -93 152 -106 184 -26 70 -37 149 -22 158 6 3 148 -139 315 -316 167 -178 316 -334 330 -346 57 -53 88 -3 68 111 -22 126 -24 244 -7 349 9 54 16 123 16 154 0 75 -31 108 -109 117 -81 10 -88 21 -72 109 23 121 24 138 11 153 -17 20 -84 19 -101 -1 -30 -36 -128 -60 -143 -35 -9 15 80 184 121 230 l38 43 68 -26 c91 -34 214 -99 260 -137 l37 -30 0 -538 c0 -404 3 -540 12 -549 19 -19 113 -15 129 5 11 13 14 117 16 565 1 471 4 552 17 566 8 10 26 41 41 70 24 47 27 64 24 130 -3 66 0 82 19 112 43 68 21 184 -55 299 l-43 64 0 103 0 104 140 0 140 0 0 228 c0 210 2 229 20 257 11 17 20 36 20 43 0 17 -102 201 -112 202 -3 0 -32 -46 -63 -101 l-56 -101 25 -39 c24 -36 26 -47 26 -159 l0 -120 -75 0 -75 0 0 123 c0 104 3 127 20 155 11 18 20 37 20 42 0 13 -104 199 -112 200 -6 0 -33 -43 -88 -143 l-31 -58 26 -44 c24 -42 25 -51 23 -157 l-3 -113 -75 0 -75 0 -3 114 c-3 108 -1 116 23 152 14 21 25 43 25 48 0 7 -98 186 -114 208 -3 4 -116 -199 -116 -208 0 -6 11 -27 25 -47 25 -36 25 -38 25 -259 l0 -222 138 -3 137 -3 0 -70 0 -70 -70 -7 c-70 -6 -89 -13 -238 -82 -84 -39 -141 -47 -151 -20 -9 24 18 61 63 83 44 23 101 69 101 81 0 5 -45 44 -100 87 -99 77 -101 79 -95 113 3 19 10 100 14 180 10 182 38 269 118 367 l34 42 -92 3 -91 3 -52 117 c-28 65 -53 118 -56 118 -3 0 -35 -53 -71 -118 l-66 -117 -74 -3 -75 -3 -63 123 c-35 68 -65 124 -66 126 -1 1 -29 -54 -63 -123z m166 -300 c55 -46 67 -126 22 -140 -48 -15 -80 32 -80 116 0 57 12 62 58 24z m317 15 c12 -19 -8 -112 -30 -138 -27 -31 -71 -25 -81 12 -13 55 85 168 111 126z m-85 -404 c0 -30 -81 -206 -95 -206 -14 0 -95 176 -95 206 0 2 43 4 95 4 52 0 95 -2 95 -4z m640 -531 c51 -26 61 -47 58 -121 l-3 -69 -60 3 c-102 4 -235 86 -235 144 0 55 159 84 240 43z";

export const Devil = () => (
  <svg
    aria-hidden
    viewBox="0 0 268 358"
    className="inline-block h-[1.2em] w-auto shrink-0 overflow-visible"
  >
    <g className="origin-[134px_358px] group-hover/w:animate-[devil-jab_0.65s_0.2s_cubic-bezier(0.22,1,0.36,1)]">
      <g
        transform="translate(0.000000,358.000000) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={80}
        strokeLinejoin="round"
      >
        <path d={DEVIL} />
      </g>
    </g>
    {/* celebration sparks */}
    <g stroke="currentColor" strokeWidth={26} strokeLinecap="round" fill="none">
      {[
        "M-30 70L-95 30",
        "M10 -20L-25 -85",
        "M258 -20L293 -85",
        "M298 70L363 30",
      ].map((d, i) => (
        <path
          key={d}
          d={d}
          className="origin-[134px_150px] opacity-0 group-hover/w:animate-[spark-burst_0.6s_ease-out]"
          style={{ animationDelay: `${0.32 + (i % 2) * 0.06}s` }}
        />
      ))}
    </g>
  </svg>
);

// the hover sweep every hobby word shares, like a broadcast graphic: an edge
// band then the main band sweep across the word on a slant, in the hobby's
// own colours (football's is united's gold and red). sits behind the words;
// leaving sweeps it back. `className` sizes it where the word has no padding
export const Sweep = ({
  edge,
  band,
  className,
}: {
  edge: string;
  band: string;
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn(
      "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
      className,
    )}
  >
    <span
      style={{ backgroundColor: edge }}
      className="absolute inset-0 transition-[clip-path] duration-[380ms] ease-[cubic-bezier(0.65,0,0.35,1)] [clip-path:polygon(0_0,0_0,-0.8em_100%,0_100%)] group-hover/w:[clip-path:polygon(0_0,calc(100%+0.8em)_0,100%_100%,0_100%)]"
    />
    <span
      style={{ backgroundColor: band }}
      className="absolute inset-0 transition-[clip-path] delay-[50ms] duration-[420ms] ease-[cubic-bezier(0.65,0,0.35,1)] [clip-path:polygon(0_0,0_0,-0.8em_100%,0_100%)] group-hover/w:[clip-path:polygon(0_0,calc(100%+0.8em)_0,100%_100%,0_100%)]"
    />
  </span>
);

/* ---------- photography ---------- */

// an instant camera, face on: viewfinder, flash window, big lens, and the
// slot along the bottom. on hover it hops as the button presses, the flash
// fires and a print slides out of the slot and develops, dark to light
export const Polaroid = () => (
  <svg
    aria-hidden
    viewBox="0 0 16 16"
    className="inline-block size-[1.05em] shrink-0 overflow-visible"
    fill="currentColor"
  >
    <defs>
      {/* the print only ever shows below the slot, never through the lens */}
      <clipPath id="pola-out">
        <rect x="-2" y="12.6" width="20" height="10" />
      </clipPath>
    </defs>
    <g className="origin-[8px_14px] group-hover/w:animate-[mark-hop_0.65s_0.15s_cubic-bezier(0.22,1,0.36,1)]">
      {/* the print: tucked inside until it's ejected through the slot */}
      <g clipPath="url(#pola-out)">
        <g className="origin-[8px_10.9px] group-hover/w:animate-[pola-eject_1.1s_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <rect
            x="4.2"
            y="8.1"
            width="7.6"
            height="5.6"
            rx=".5"
            fill="var(--pill, var(--paper))"
            stroke="currentColor"
            strokeWidth=".8"
          />
          {/* the photo: sky, sun and a green hill, coming up as it develops */}
          <g className="opacity-0 group-hover/w:animate-[pola-develop_1.4s_0.7s_ease-out_forwards]">
            <rect x="5.3" y="10.5" width="5.4" height="2.7" fill="#8cc4ee" />
            <circle cx="9.3" cy="11.5" r=".65" fill="#ffc933" />
            <path
              d="M5.3 13.2v-.9c1.1-.8 2-.5 2.8.1.8.5 1.6.4 2.6-.2v1z"
              fill="#5da35a"
            />
          </g>
        </g>
      </g>
      {/* the shutter button, on top */}
      <rect
        x="2.6"
        y="1.7"
        width="2.6"
        height="1.6"
        rx=".5"
        className="group-hover/w:animate-[cam-press_0.4s_ease-out]"
      />
      {/* body: lens well, flash window and the print slot cut through */}
      <path
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth=".5"
        strokeLinejoin="round"
        d="M3 2.9h10c1.1 0 2 .9 2 2v7.2c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4.9c0-1.1.9-2 2-2zM7.2 5.2a3 3 0 100 6 3 3 0 000-6zM11 4.3h2.6v1.5H11zM3.6 12.6h8.8v.55H3.6z"
      />
      {/* the glass */}
      <circle cx="7.2" cy="8.2" r="1.85" />
      <circle
        cx="6.5"
        cy="7.5"
        r=".5"
        fill="var(--wx-bg, var(--paper))"
        opacity=".75"
      />
      {/* flash burst */}
      <path
        d="M12.3 3.1V1.6M14.1 3.6l1-1M10.5 3.6l-1-1"
        stroke="currentColor"
        strokeWidth=".9"
        strokeLinecap="round"
        fill="none"
        className="opacity-0 group-hover/w:animate-[cam-flash_0.45s_0.15s_ease-out]"
      />
    </g>
  </svg>
);

/* ---------- sketching ---------- */

// a pencil that scribbles a little line beneath itself
export const SketchPencil = () => (
  <svg
    aria-hidden
    viewBox="0 0 16 16"
    className="inline-block size-[1.05em] shrink-0 overflow-visible"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0.7}
    strokeLinejoin="round"
  >
    <path
      d="M4.6 14.8c1.3-.9 2.2.5 3.5-.2s2-.4 3.4-.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset="1"
      className="group-hover/w:animate-[pencil-line_0.7s_0.1s_ease-out_forwards]"
    />
    <g className="origin-[3px_13px] group-hover/w:animate-[pencil-scribble_0.8s_0.1s_ease-in-out]">
      <path d="M11.3 1.6a1.3 1.3 0 011.8 0l1.3 1.3a1.3 1.3 0 010 1.8l-.9.9-3.1-3.1.9-.9z" />
      <path d="M9.6 3.3l3.1 3.1-6.5 6.5-3.6.9a.4.4 0 01-.5-.5l.9-3.6 6.6-6.4z" />
    </g>
  </svg>
);

/* ---------- reading ---------- */

const LEAF =
  "M8.6 3.7c1.5-1 3.5-1.3 5.7-1a.6.6 0 01.5.6v8.9c0 .4-.3.7-.7.6-2-.3-3.8 0-5.5 1V3.7z";

// an open book that hops as its right page turns over the spine
export const ReadingBook = () => (
  <svg
    aria-hidden
    viewBox="0 0 16 16"
    className="inline-block size-[1.05em] shrink-0 overflow-visible"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0.7}
    strokeLinejoin="round"
  >
    <g className="origin-[8px_13.6px] group-hover/w:animate-[mark-hop_0.65s_0.15s_cubic-bezier(0.22,1,0.36,1)]">
      <path d="M7.4 3.7C5.9 2.7 3.9 2.4 1.7 2.7a.6.6 0 00-.5.6v8.9c0 .4.3.7.7.6 2-.3 3.8 0 5.5 1V3.7zM8.6 3.7c1.5-1 3.5-1.3 5.7-1a.6.6 0 01.5.6v8.9c0 .4-.3.7-.7.6-2-.3-3.8 0-5.5 1V3.7z" />
      {/* a page turning: once the sweep has settled, the right page itself
        lifts and swings over the spine, landing exactly on the left one. its
        edge is the sweep's colour, so it reads as a separate sheet, and where
        it starts and lands it matches the page under it, so nothing pops */}
      <g className="origin-[8px_8px] opacity-0 group-hover/w:animate-[book-turn_0.6s_0.5s_cubic-bezier(0.45,0,0.25,1)]">
        {/* a halo in the sweep's colour under the page, then the page drawn
          just as the book's own right page is */}
        <path d={LEAF} stroke="var(--band, var(--paper))" strokeWidth={1.5} />
        <path d={LEAF} />
      </g>
    </g>
  </svg>
);

/* ---------- hot wheels ---------- */

// a low sports car, side on. on hover it winds back on its springs, nose up,
// and launches forward, with a couple of speed lines left behind. its body
// sits low in its box, so the box is raised to centre it on the word
export const RaceCar = () => (
  <svg
    aria-hidden
    viewBox="0 0 16 16"
    className="inline-block size-[1.1em] shrink-0 -translate-y-[0.13em] overflow-visible"
    fill="currentColor"
  >
    <g
      stroke="currentColor"
      strokeWidth=".9"
      strokeLinecap="round"
      className="opacity-0 group-hover/w:animate-[car-lines_0.7s_0.25s_ease-out]"
    >
      <path d="M-3.4 8.2h3.6M-2.4 10.6h3.2" />
    </g>
    <g className="origin-[4.4px_13.9px] group-hover/w:animate-[car-dash_0.75s_0.15s_cubic-bezier(0.22,1,0.36,1)]">
      <path d="M1 11.4V9.6c0-.5.3-.8.8-.9l2.6-.5 2.4-2.1c.3-.3.7-.4 1.1-.4h2.6c.5 0 .9.2 1.2.6l1.4 1.8 1.6.4c.5.1.9.6.9 1.1v1.8c0 .3-.2.5-.5.5H1.5a.5.5 0 01-.5-.5z" />
      {/* the window, in the colour behind it */}
      <path
        d="M6.2 8.1l1.4-1.2c.2-.1.4-.2.6-.2h2.3c.2 0 .4.1.5.3l.9 1.1z"
        fill="var(--pill, var(--paper))"
      />
      {[4.4, 11.8].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="11.9" r="2" />
          <circle cx={cx} cy="11.9" r=".8" fill="var(--pill, var(--paper))" />
        </g>
      ))}
    </g>
  </svg>
);

/* ---------- haikyu ---------- */

// the series' own logo, standing in for its name: a title, quoted, rather
// than one of the hobby words. grey at rest, and in its black and orange
// (with a little tilt) when pointed at; clicking it plays Hinata's spike
// (haikyu-spike.tsx), which knocks it askew
// (its lettering is outlined in black, so at night it rests inverted, light
// on dark, and only comes back to its own colours on hover)
export const HaikyuMark = () => (
  // eslint-disable-next-line @next/next/no-img-element -- a small static logo
  <img
    // drawn about 18px tall: a copy at three times that, not the 560px
    // original (106kb, for a mark this size). in colour while pointed at,
    // and for as long as Hinata's spike is playing (the button's disabled
    // till then; see haikyu-spike.tsx)
    src="/haikyu/logo-sm.webp"
    alt="haikyu!!"
    width={168}
    height={56}
    draggable={false}
    className="mx-0.5 block h-[1.2em] w-auto translate-y-[0.1em] opacity-60 grayscale transition dark:invert dark:group-hover/w:invert-0 duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/w:-rotate-2 group-hover/w:scale-105 group-hover/w:opacity-100 group-hover/w:grayscale-0 group-aria-disabled/w:opacity-100 group-aria-disabled/w:grayscale-0 dark:group-aria-disabled/w:invert-0"
  />
);
