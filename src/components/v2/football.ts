// Manchester United, right now: the match that's on (or today's, or the last
// one), the run of recent results, and what's next. From ESPN's public
// schedule endpoints, server-side, refreshed every minute; null when they
// can't be reached, so the panel falls back to a line of text.
//
// Results come from the league and Europe schedules (the catch-all "all"
// schedule only lists friendlies once the season starts); fixtures come from
// the catch-all one, which does carry every competition.

const API = "https://site.api.espn.com/apis/site/v2/sports/soccer";
const UNITED = "360";
const IST = "Asia/Kolkata";

type Side = {
  name: string;
  // three letters, for the tv ("MUN")
  abbr: string;
  logo: string | null;
  score: string | null;
};

export type Result = "win" | "draw" | "lose";

export type Football = {
  state: "live" | "today" | "last";
  competition: string;
  // e.g. "sat 10 oct", in Bangalore time
  when: string;
  // live: the minute ("67'"), today: kick-off ("9:00 pm"), last: "ft"
  detail: string;
  // the ground, lowercase ("old trafford")
  venue: string | null;
  home: Side;
  away: Side;
  unitedHome: boolean;
  result: Result | null;
  // oldest to newest, up to five
  form: Result[];
  next: {
    opponent: string;
    abbr: string;
    logo: string | null;
    unitedHome: boolean;
    // "wed 14 oct" and "12:30 am", in Bangalore time
    day: string;
    time: string;
    competition: string;
  } | null;
} | null;

type EspnCompetitor = {
  homeAway: "home" | "away";
  winner?: boolean;
  score?: { displayValue?: string } | string;
  team: {
    id: string;
    abbreviation?: string;
    shortDisplayName?: string;
    displayName: string;
    logos?: { href: string }[];
  };
};
type EspnEvent = {
  date: string;
  seasonType?: { name?: string };
  league?: { name?: string };
  competitions: {
    status: { type: { state: "pre" | "in" | "post"; shortDetail?: string } };
    competitors: EspnCompetitor[];
    venue?: { fullName?: string };
  }[];
};

async function schedule(path: string, every: number): Promise<EspnEvent[]> {
  try {
    const res = await fetch(`${API}/${path}`, { next: { revalidate: every } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.events) ? data.events : [];
  } catch {
    return [];
  }
}

const lower = (s: string) => s.toLowerCase();
const day = (iso: string) =>
  lower(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: IST,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(iso)),
  ).replace(",", "");
const time = (iso: string) =>
  lower(
    new Intl.DateTimeFormat("en-US", {
      timeZone: IST,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso)),
  );
const sameDay = (a: Date, b: Date) =>
  day(a.toISOString()) === day(b.toISOString());

// "2026-27 English Premier League" → "premier league"; "League Phase" → "champions league"
function competitionOf(e: EspnEvent, fallback = "") {
  const name = e.seasonType?.name ?? e.league?.name ?? fallback;
  if (/premier league/i.test(name)) return "premier league";
  if (/league phase|champions/i.test(name)) return "champions league";
  if (/europa/i.test(name)) return "europa league";
  if (/fa cup/i.test(name)) return "fa cup";
  if (/carabao|league cup/i.test(name)) return "league cup";
  if (/friendly/i.test(name)) return "friendly";
  return lower(name.replace(/^\d{4}(-\d{2})?\s*/, ""));
}

const scoreOf = (c: EspnCompetitor) =>
  typeof c.score === "string" ? c.score : (c.score?.displayValue ?? null);
// espn calls united "MAN", which could be either side of the city
const abbr = (t: EspnCompetitor["team"]) =>
  t.id === UNITED
    ? "MUN"
    : (t.abbreviation ?? t.displayName.slice(0, 3)).toUpperCase();

const side = (c: EspnCompetitor): Side => ({
  name: lower(c.team.shortDisplayName ?? c.team.displayName),
  abbr: abbr(c.team),
  logo: c.team.logos?.[0]?.href ?? null,
  score: scoreOf(c),
});

function resultOf(e: EspnEvent): Result | null {
  const [a, b] = e.competitions[0].competitors;
  const us = a.team.id === UNITED ? a : b;
  const them = us === a ? b : a;
  if (us.winner) return "win";
  if (them.winner) return "lose";
  return "draw";
}

export async function unitedNow(every = 60): Promise<Football> {
  const [league, europe, fixtures] = await Promise.all([
    schedule(`eng.1/teams/${UNITED}/schedule`, every),
    schedule(`uefa.champions/teams/${UNITED}/schedule`, every),
    schedule(`all/teams/${UNITED}/schedule?fixture=true`, every),
  ]);
  const byDate = (a: EspnEvent, b: EspnEvent) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();
  const stateOf = (e: EspnEvent) => e.competitions[0].status.type.state;

  const played = [...league, ...europe]
    .filter((e) => stateOf(e) === "post")
    .sort(byDate);
  const upcoming = fixtures.filter((e) => stateOf(e) !== "post").sort(byDate);

  const now = new Date();
  const live = upcoming.find((e) => stateOf(e) === "in");
  const today = upcoming.find(
    (e) => stateOf(e) === "pre" && sameDay(new Date(e.date), now),
  );
  const last = played.at(-1);
  const shown = live ?? today ?? last;
  if (!shown) return null;

  const c = shown.competitions[0];
  const home = c.competitors.find((x) => x.homeAway === "home")!;
  const away = c.competitors.find((x) => x.homeAway === "away")!;
  const state = shown === live ? "live" : shown === today ? "today" : "last";

  const following = upcoming.find((e) => e !== shown && stateOf(e) === "pre");
  let next: NonNullable<Football>["next"] = null;
  if (following) {
    const [a, b] = following.competitions[0].competitors;
    const us = a.team.id === UNITED ? a : b;
    const them = us === a ? b : a;
    next = {
      opponent: lower(them.team.shortDisplayName ?? them.team.displayName),
      abbr: abbr(them.team),
      logo: them.team.logos?.[0]?.href ?? null,
      unitedHome: us.homeAway === "home",
      day: day(following.date),
      time: time(following.date),
      competition: competitionOf(following),
    };
  }

  return {
    state,
    competition: competitionOf(shown),
    when: day(shown.date),
    detail:
      state === "live"
        ? (c.status.type.shortDetail ?? "live")
        : state === "today"
          ? time(shown.date)
          : "ft",
    venue: c.venue?.fullName ? lower(c.venue.fullName) : null,
    home: side(home),
    away: side(away),
    unitedHome: home.team.id === UNITED,
    result: state === "last" ? resultOf(shown) : null,
    form: played.slice(-5).map((e) => resultOf(e)!),
    next,
  };
}
