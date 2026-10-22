// Bangalore's current weather, from Open-Meteo (free, no key). Server-side,
// refreshed every 15 minutes; null when it can't be reached, so the page
// just leaves the weather out.

import type { WeatherKind } from "./icons";

export type Weather = { temp: number; label: string; kind: WeatherKind } | null;

const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata";

// WMO weather codes, in the site's lowercase voice
function describe(code: number) {
  if (code === 0) return "clear";
  if (code === 1) return "mostly clear";
  if (code === 2) return "partly cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "foggy";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 95) return "thunderstorms";
  return "";
}

// which little drawing goes with it
function kindOf(code: number, isDay: boolean): WeatherKind {
  if (code <= 1) return isDay ? "sun" : "moon";
  if (code === 2) return isDay ? "partly" : "moon";
  if (code === 3) return "cloud";
  if (code === 45 || code === 48) return "fog";
  if (code >= 95) return "storm";
  if (code >= 51) return "rain";
  return "cloud";
}

export async function bangaloreWeather(): Promise<Weather> {
  try {
    const res = await fetch(URL, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    const { current } = await res.json();
    if (typeof current?.temperature_2m !== "number") return null;
    return {
      temp: Math.round(current.temperature_2m),
      label: describe(current.weather_code),
      kind: kindOf(current.weather_code, current.is_day === 1),
    };
  } catch {
    return null;
  }
}
