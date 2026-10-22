import type { Weather } from "./weather";

/*
 * What the old man is up to, by Bangalore's clock and its weather (the same
 * weather the top of the page shows): fishing by day, by the fire at night,
 * and in his tent with a coffee whenever it rains.
 *
 * ?fireside=day | night | rain | storm (and rain-night, storm-day, …) in the
 * address shows any of them, whatever the time or the sky.
 */

export type Mood = {
  // by the clock
  time: "day" | "night";
  // raining, and whether there's thunder in it
  wet: boolean;
  storm: boolean;
};
export type Scene = "day" | "night" | "rain";
export const sceneOf = (m: Mood): Scene => (m.wet ? "rain" : m.time);

const hour = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  hourCycle: "h23",
});

// daylight, roughly, the year round: Bangalore's sun is up a little before
// six and down a little after six
const isDay = (h: number) => h >= 6 && h < 18;

export const moodNow = (weather: Weather): Mood => {
  const h = Number(hour.format(new Date()));
  const mood: Mood = {
    time: isDay(h) ? "day" : "night",
    wet: weather?.kind === "rain" || weather?.kind === "storm",
    storm: weather?.kind === "storm",
  };
  const ask = new URLSearchParams(window.location.search).get("fireside");
  if (!ask) return mood;
  return {
    time: /day/.test(ask) ? "day" : /night/.test(ask) ? "night" : mood.time,
    wet: /rain|storm/.test(ask),
    storm: /storm/.test(ask),
  };
};
