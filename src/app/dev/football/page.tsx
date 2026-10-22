// TEMPORARY: a preview of the football panel in every state it can be in,
// with made-up data. delete this folder (src/app/dev) when done.

import type { Metadata } from "next";
import { FootballCard } from "@/components/v2/football-card";
import { HOBBIES } from "@/components/v2/data";
import type { Football } from "@/components/v2/football";

export const metadata: Metadata = {
  title: "football panel preview",
  robots: { index: false, follow: false },
};

type Match = NonNullable<Football>;

const crest = (id: number) =>
  `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`;
const IDS: Record<string, number> = {
  LEE: 357,
  LIV: 364,
  ARS: 359,
  CHE: 363,
  TOT: 367,
  NEW: 361,
  EVE: 368,
  ATM: 1068,
  BHA: 331,
  FUL: 370,
};
const united = (score: string | null) => ({
  name: "united",
  abbr: "MUN",
  logo: crest(360),
  score,
});
const them = (name: string, abbr: string, score: string | null) => ({
  name,
  abbr,
  logo: crest(IDS[abbr]),
  score,
});
const next: Match["next"] = {
  opponent: "leeds",
  abbr: "LEE",
  logo: crest(IDS.LEE),
  unitedHome: false,
  day: "sun 18 oct",
  time: "6:30 pm",
  competition: "premier league",
};
const base = {
  competition: "premier league",
  when: "sat 17 oct",
  venue: "old trafford",
  unitedHome: true,
  form: ["win", "lose", "draw", "win", "win"],
  next,
} satisfies Partial<Match>;

const SCENARIOS: { label: string; data: Football }[] = [
  {
    label: "live, united winning",
    data: {
      ...base,
      state: "live",
      detail: "67'",
      home: united("2"),
      away: them("liverpool", "LIV", "1"),
      result: null,
    },
  },
  {
    label: "live, united losing (away)",
    data: {
      ...base,
      state: "live",
      detail: "81'",
      unitedHome: false,
      home: them("arsenal", "ARS", "2"),
      away: united("0"),
      result: null,
    },
  },
  {
    label: "live, half-time",
    data: {
      ...base,
      state: "live",
      detail: "HT",
      home: united("1"),
      away: them("chelsea", "CHE", "1"),
      result: null,
    },
  },
  {
    label: "match day, before kick-off",
    data: {
      ...base,
      state: "today",
      detail: "12:30 am",
      home: united(null),
      away: them("tottenham", "TOT", null),
      result: null,
    },
  },
  {
    label: "full time, won",
    data: {
      ...base,
      state: "last",
      detail: "ft",
      home: united("3"),
      away: them("newcastle", "NEW", "1"),
      result: "win",
    },
  },
  {
    label: "full time, drew",
    data: {
      ...base,
      state: "last",
      detail: "ft",
      home: united("1"),
      away: them("everton", "EVE", "1"),
      result: "draw",
    },
  },
  {
    label: "full time, lost (champions league, away)",
    data: {
      ...base,
      state: "last",
      detail: "ft",
      competition: "champions league",
      when: "wed 14 oct",
      unitedHome: false,
      home: them("atlético", "ATM", "2"),
      away: united("0"),
      result: "lose",
      form: ["win", "lose", "draw", "draw", "lose"],
    },
  },
  {
    label: "no next fixture (end of season)",
    data: {
      ...base,
      state: "last",
      detail: "ft",
      when: "sun 24 may",
      home: united("2"),
      away: them("brighton", "BHA", "0"),
      result: "win",
      next: null,
    },
  },
  {
    label: "start of season, no form yet",
    data: {
      ...base,
      state: "today",
      detail: "8:30 pm",
      home: united(null),
      away: them("fulham", "FUL", null),
      result: null,
      form: [],
    },
  },
  { label: "scores unavailable", data: null },
];

const hobby = HOBBIES.find((h) => h.id === "football")!;

export default function FootballPreview() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-16 text-neutral-800">
      <div className="mx-auto max-w-[72rem]">
        <h1 className="text-sm text-neutral-900">
          football panel, every state
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          temporary preview with made-up data.
        </p>
        <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-x-10 gap-y-14">
          {SCENARIOS.map((s) => (
            <section key={s.label} className="flex flex-col gap-4">
              <h2 className="text-sm text-neutral-500">{s.label}</h2>
              {/* the panel as it docks: its ground, then the card */}
              <div
                className="relative w-[22rem] max-w-full"
                style={
                  {
                    "--ground": hobby.color,
                    "--ink": hobby.ink,
                  } as React.CSSProperties
                }
              >
                <div aria-hidden className="hobby-ground absolute -inset-2.5" />
                <div className="relative p-5">
                  <FootballCard data={s.data} poll={false} />
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
