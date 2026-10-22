"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import { crt } from "./fonts";
import type { Football, Result } from "./football";

/*
 * The football panel: me (in pixels, reacting to the result) beside an old
 * tv on a little stand. The tv switches on as the panel opens, the way old
 * sets did (a line of light that opens out into the picture), and shows the
 * match. Tapping it changes channel through a burst of static: the match,
 * what's next, and the last five. The competition and day are on screen too,
 * with the competition's logo and the clubs' crests.
 */

const MOOD: Record<Result | "watching", string> = {
  win: "/football/me/win.png",
  draw: "/football/me/draw.png",
  lose: "/football/me/lose.png",
  // the watching pose ships with a tv of its own; this one's without
  watching: "/football/me/watching-room.png",
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const CHANNELS = ["match", "next", "form"] as const;
type Channel = (typeof CHANNELS)[number];

// the picture: dark type on a lit, pale screen
const GLOW = "#22343a";
const DIM = "#5f7a7c";
const RED = "#d8392b";

// while a match is on, the score is fetched again every half minute
// (`poll` off keeps the data as given, for previews)
const useScore = (initial: Football, poll: boolean) => {
  const [data, setData] = useState(initial);
  const live = data?.state === "live";
  useEffect(() => {
    if (!live || !poll) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/football");
        if (res.ok) setData(await res.json());
      } catch {}
    }, 30_000);
    return () => clearInterval(id);
  }, [live, poll]);
  return data;
};

export const FootballCard = ({
  data: first,
  poll = true,
}: {
  data: Football;
  poll?: boolean;
}) => {
  const data = useScore(first, poll);

  if (!data) {
    return (
      <p className="text-[15px] text-neutral-500">scores are taking a break.</p>
    );
  }

  return (
    // the room: me on the left, the tv on its stand to the right, both
    // standing on the same floor
    <div className="relative h-[9.5rem]">
      <span className="absolute inset-x-[4%] bottom-0 h-3 rounded-[50%] bg-(--ink) opacity-[0.12] blur-[5px]" />
      <Me result={data.result} />
      <Tv data={data} />
    </div>
  );
};

const Me = ({ result }: { result: Result | null }) => (
  <div className="group/m absolute bottom-0 left-[3%] h-[8.75rem] w-[5.25rem]">
    <Image
      src={MOOD[result ?? "watching"]}
      alt={`me, after a ${result ?? "match"}`}
      fill
      sizes="84px"
      quality={90}
      className="origin-bottom object-contain object-bottom transition-transform duration-300 ease-out group-hover/m:-rotate-3 group-hover/m:scale-105"
    />
  </div>
);

/* ---------- the tv ---------- */

const Tv = ({ data }: { data: NonNullable<Football> }) => {
  const [channel, setChannel] = useState<Channel>("match");
  // bumped on every change, so the static and the channel number replay
  const [flip, setFlip] = useState(0);
  const reduce = useReducedMotion();
  const [screen, animate] = useAnimate<HTMLDivElement>();

  // switching on: a line of light across the middle that opens out into the
  // picture. run by hand, as the panel holds back `initial` on first render
  useEffect(() => {
    if (reduce) return;
    animate(
      screen.current,
      {
        scaleX: [0, 1, 1],
        scaleY: [0.015, 0.015, 1],
        filter: ["brightness(4)", "brightness(3)", "brightness(1)"],
        opacity: [1, 1, 1],
      },
      { delay: 0.35, duration: 0.55, times: [0, 0.4, 1], ease: EASE_OUT },
    );
    // on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const change = () => {
    setChannel(CHANNELS[(CHANNELS.indexOf(channel) + 1) % CHANNELS.length]);
    setFlip((f) => f + 1);
  };

  return (
    <button
      type="button"
      onClick={change}
      data-sound="open"
      aria-label={`change channel (now showing ${channel})`}
      className="group/tv absolute right-[2%] bottom-0 w-[58%] cursor-pointer outline-none"
    >
      <TvSet channel={CHANNELS.indexOf(channel)} />

      {/* the picture, laid over the set's screen (as a share of its 200 ×
        168 drawing), rounded like the tube's face */}
      <div
        className="absolute overflow-hidden bg-[#2a3534]"
        style={{
          left: "10%",
          top: "27.4%",
          width: "58%",
          height: "45.2%",
          borderRadius: "12% / 18.4%",
        }}
      >
        <div
          ref={screen}
          className={cn(
            crt.className,
            "relative flex size-full flex-col items-center justify-center bg-[radial-gradient(90%_80%_at_50%_45%,#eef5ef,#c4d9d4)] text-[17px] leading-[0.95]",
          )}
          style={{
            color: GLOW,
            transform: reduce ? undefined : "scaleX(0) scaleY(0.015)",
          }}
        >
          <Picture channel={channel} data={data} />
          <AnimatePresence>
            {flip > 0 && (
              <motion.span
                key={flip}
                className="absolute top-1 right-1.5 text-[11px]"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: 0,
                  transition: { delay: 1.1, duration: 0.3 },
                }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
              >
                CH{CHANNELS.indexOf(channel) + 1}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* static between channels */}
        <AnimatePresence>
          {flip > 0 && !reduce && (
            <motion.span
              key={flip}
              aria-hidden
              className="tv-static absolute inset-0"
              initial={{ opacity: 0.95 }}
              animate={{
                opacity: 0,
                transition: { delay: 0.12, duration: 0.14 },
              }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
            />
          )}
        </AnimatePresence>
        {/* the glass: faint scanlines, the tube's curve shading its edges a
          little, and a sheen across the top where the room's light catches it */}
        <span className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(transparent_0_2px,rgb(30_60_60/0.06)_2px_3px)]" />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_10px_2px_rgb(40_70_70/0.28)]" />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_70%_at_35%_-10%,rgb(255_255_255/0.45),transparent_60%)]" />
      </div>
    </button>
  );
};

// what's on, per channel
const Picture = ({
  channel,
  data,
}: {
  channel: Channel;
  data: NonNullable<Football>;
}) => {
  if (channel === "next") {
    const n = data.next;
    if (!n) return <span style={{ color: DIM }}>NO FIXTURE</span>;
    return (
      <>
        <span className="flex items-center gap-1" style={{ color: DIM }}>
          NEXT
          <League name={n.competition} />
        </span>
        <span className="flex items-center gap-1">
          {n.unitedHome ? "v" : "@"}
          <Crest logo={n.logo} abbr={n.abbr} />
          {n.abbr}
        </span>
        <span className="text-[14px]" style={{ color: DIM }}>
          {n.day.toUpperCase()}
        </span>
        <span className="text-[14px]" style={{ color: DIM }}>
          {n.time.toUpperCase()}
        </span>
      </>
    );
  }

  if (channel === "form") {
    return (
      <>
        <span style={{ color: DIM }}>FORM</span>
        <span className="mt-1 flex gap-[5px]">
          {data.form.map((r, i) => (
            <span
              key={i}
              title={r}
              className="size-[7px]"
              style={{
                backgroundColor:
                  r === "win" ? RED : r === "draw" ? DIM : "transparent",
                boxShadow:
                  r === "lose" ? `inset 0 0 0 1.5px ${DIM}` : undefined,
              }}
            />
          ))}
        </span>
        <span className="mt-1 text-[13px]" style={{ color: DIM }}>
          {data.form.map((r) => r[0].toUpperCase()).join(" ")}
        </span>
      </>
    );
  }

  const { home, away } = data;
  const scored = data.state !== "today";
  return (
    <>
      <span
        className="flex items-center gap-1 text-[13px]"
        style={{ color: DIM }}
      >
        <League name={data.competition} />
        {data.when.toUpperCase()}
      </span>
      <span className="my-0.5 flex items-center gap-1.5 tabular-nums">
        <Crest logo={home.logo} abbr={home.abbr} />
        {scored ? `${home.score ?? "-"}-${away.score ?? "-"}` : "v"}
        <Crest logo={away.logo} abbr={away.abbr} />
      </span>
      <span
        className="mt-0.5 flex items-center gap-1 text-[14px]"
        style={{ color: data.state === "live" ? RED : DIM }}
      >
        {data.state === "live" && (
          <span
            className="size-[5px] animate-pulse motion-reduce:animate-none"
            style={{ backgroundColor: RED }}
          />
        )}
        {data.state === "live"
          ? data.detail.toUpperCase()
          : data.state === "today"
            ? `KO ${data.detail.toUpperCase()}`
            : "FT"}
      </span>
    </>
  );
};

// a club's crest, its three letters where espn has none
const Crest = ({ logo, abbr }: { logo: string | null; abbr: string }) =>
  logo ? (
    <Image
      src={logo}
      alt={abbr}
      width={40}
      height={40}
      className="size-[18px] object-contain"
    />
  ) : (
    <span>{abbr}</span>
  );

// the competitions' own logos, from espn
const LEAGUES: Record<string, number> = {
  "premier league": 23,
  "champions league": 2,
  "europa league": 2310,
  "fa cup": 40,
  "league cup": 41,
};
const League = ({ name }: { name: string }) => {
  const id = LEAGUES[name];
  if (!id) return null;
  return (
    <Image
      src={`https://a.espncdn.com/i/leaguelogos/soccer/500/${id}.png`}
      alt={name}
      width={32}
      height={32}
      className="size-[15px] object-contain"
    />
  );
};

/* ---------- the set itself ---------- */

// a walnut cabinet with a grain to it, the tube in a dark bezel, a brushed
// aluminium panel with two ridged knobs (the top one turns to the channel)
// over a fabric grille, rabbit ears, and splayed legs with brass feet
const TvSet = ({ channel }: { channel: number }) => {
  const u = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${u}`;
  const url = (name: string) => `url(#${id(name)})`;
  return (
    <svg
      viewBox="0 0 200 168"
      className="block w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={id("wood")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93603a" />
          <stop offset="0.55" stopColor="#734726" />
          <stop offset="1" stopColor="#583419" />
        </linearGradient>
        {/* long streaks of grain running across the cabinet */}
        <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.32"
            numOctaves="3"
            seed="7"
          />
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0 0.04  0 0 0 -1.7 1.2" />
        </filter>
        <clipPath id={id("cabinet")}>
          <rect x="4" y="30" width="192" height="108" rx="12" />
        </clipPath>
        <linearGradient id={id("bezel")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e2723" />
          <stop offset="1" stopColor="#151210" />
        </linearGradient>
        <linearGradient id={id("alu")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9c8c1" />
          <stop offset="0.45" stopColor="#e9e8e3" />
          <stop offset="1" stopColor="#b3b2ab" />
        </linearGradient>
        <pattern
          id={id("brushed")}
          width="1.6"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="0.6" height="4" fill="#000" opacity="0.06" />
        </pattern>
        <pattern
          id={id("fabric")}
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
        >
          <rect width="2" height="2" fill="#3a2e25" />
          <rect width="1" height="1" fill="#241c16" />
          <rect x="1" y="1" width="1" height="1" fill="#2c231c" />
        </pattern>
        <radialGradient id={id("knob")} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#6a6764" />
          <stop offset="1" stopColor="#252321" />
        </radialGradient>
        <radialGradient id={id("cap")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#b9b6b0" />
          <stop offset="1" stopColor="#56534f" />
        </radialGradient>
        <linearGradient id={id("chrome")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f2f0" />
          <stop offset="0.5" stopColor="#8f8f8b" />
          <stop offset="1" stopColor="#d4d4d0" />
        </linearGradient>
        <radialGradient id={id("dome")} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#4a4643" />
          <stop offset="1" stopColor="#1c1a18" />
        </radialGradient>
        <linearGradient id={id("leg")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a2c16" />
          <stop offset="0.5" stopColor="#6e4425" />
          <stop offset="1" stopColor="#3f2512" />
        </linearGradient>
      </defs>

      {/* rabbit ears on their dome, splaying a little more on hover */}
      <g stroke={url("chrome")} strokeWidth="1.6" strokeLinecap="round">
        <g className="origin-[96px_28px] transition-transform duration-500 ease-out group-hover/tv:-rotate-6">
          <path d="M96 28 L64 2" />
          <circle cx="64" cy="2" r="1.8" fill="#d4d4d0" stroke="none" />
        </g>
        <g className="origin-[104px_28px] transition-transform duration-500 ease-out group-hover/tv:rotate-6">
          <path d="M104 28 L140 5" />
          <circle cx="140" cy="5" r="1.8" fill="#d4d4d0" stroke="none" />
        </g>
      </g>
      <path d="M84 31 a16 9 0 0 1 32 0 z" fill={url("dome")} />

      {/* the legs, splayed, with brass feet; and the rail under the cabinet */}
      <path d="M34 134 h9 l-10 30 h-4 z" fill={url("leg")} />
      <path d="M157 134 h9 l5 30 h-4 z" fill={url("leg")} />
      <rect x="28" y="161" width="6" height="4" rx="1" fill="#c9a24a" />
      <rect x="166" y="161" width="6" height="4" rx="1" fill="#c9a24a" />
      <rect x="18" y="134" width="164" height="6" rx="2" fill="#3f2512" />

      {/* the cabinet: walnut, grained, lit along the top, darker below */}
      <rect x="4" y="30" width="192" height="108" rx="12" fill={url("wood")} />
      <g clipPath={url("cabinet")}>
        <rect
          x="4"
          y="30"
          width="192"
          height="108"
          filter={url("grain")}
          opacity="0.85"
        />
        <rect x="4" y="30" width="192" height="4" fill="#fff" opacity="0.14" />
        <rect
          x="4"
          y="128"
          width="192"
          height="10"
          fill="#000"
          opacity="0.18"
        />
      </g>
      <rect
        x="4.5"
        y="30.5"
        width="191"
        height="107"
        rx="11.5"
        fill="none"
        stroke="#2e1a0c"
        strokeOpacity="0.6"
      />

      {/* the tube's bezel, with a lip of light on its lower edge */}
      <rect x="14" y="40" width="128" height="88" rx="11" fill={url("bezel")} />
      <rect
        x="14.5"
        y="40.5"
        width="127"
        height="87"
        rx="10.5"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.07"
      />
      <rect x="20" y="46" width="116" height="76" rx="14" fill="#0e1712" />

      {/* the control panel: brushed aluminium, two knobs, the grille */}
      <rect x="150" y="42" width="36" height="84" rx="4" fill={url("alu")} />
      <rect
        x="150"
        y="42"
        width="36"
        height="84"
        rx="4"
        fill={url("brushed")}
      />
      <rect
        x="150.5"
        y="42.5"
        width="35"
        height="83"
        rx="3.5"
        fill="none"
        stroke="#000"
        strokeOpacity="0.25"
      />
      <Knob
        cx={168}
        cy={59}
        turn={channel * 45 - 45}
        fills={[url("knob"), url("cap")]}
      />
      <Knob cx={168} cy={83} turn={20} fills={[url("knob"), url("cap")]} />
      <rect x="155" y="99" width="26" height="21" rx="2" fill={url("fabric")} />
      <rect
        x="155"
        y="99"
        width="26"
        height="21"
        rx="2"
        fill="none"
        stroke="#000"
        strokeOpacity="0.35"
      />
    </svg>
  );
};

// a ridged knob with a lighter cap and a pointer, turned to `turn` degrees
const Knob = ({
  cx,
  cy,
  turn,
  fills: [body, cap],
}: {
  cx: number;
  cy: number;
  turn: number;
  fills: [string, string];
}) => (
  <g>
    <circle cx={cx} cy={cy + 1} r="9" fill="#000" opacity="0.25" />
    <circle cx={cx} cy={cy} r="9" fill={body} />
    <circle
      cx={cx}
      cy={cy}
      r="8.2"
      fill="none"
      stroke="#141312"
      strokeWidth="1.4"
      strokeDasharray="0.9 1.1"
    />
    <motion.g
      // turns about its own middle (the cap's box is centred on the knob)
      initial={false}
      animate={{ rotate: turn }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <circle cx={cx} cy={cy} r="5.6" fill={cap} />
      <rect
        x={cx - 0.7}
        y={cy - 5.4}
        width="1.4"
        height="3.6"
        rx="0.7"
        fill="#1d1c1b"
      />
    </motion.g>
  </g>
);
