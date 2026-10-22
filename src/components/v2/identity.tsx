"use client";

import { useEffect, useState } from "react";
import { WeatherIcon } from "./icons";
import type { Weather } from "./weather";

const clock = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

// "bangalore, 7:16 pm / ☀ 24°, partly cloudy". the time is only known in the
// browser, so it fades in after mount rather than mismatching the server
export const BangaloreNow = ({ weather }: { weather: Weather }) => {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(clock.format(new Date()).toLowerCase());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-intro="text"
      className="text-right text-[13px] leading-relaxed text-neutral-400"
    >
      <p>
        bangalore
        <span
          className="transition-opacity duration-500"
          style={{ opacity: now ? 1 : 0 }}
        >
          , {now ?? "0:00 am"}
        </span>
      </p>
      {weather && (
        <p className="inline-flex items-center gap-1.5">
          <span className="text-neutral-500">
            <WeatherIcon kind={weather.kind} />
          </span>
          {weather.temp}°{weather.label && `, ${weather.label}`}
        </p>
      )}
    </div>
  );
};
