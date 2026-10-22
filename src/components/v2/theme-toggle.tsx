"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { flick } from "./feedback";

/*
 * Day and night, in its bubble on the picture's corner (avatar-dock.tsx).
 * It shows the theme it takes you to (a crescent by day, a sun at night) and turns it over on a click, with
 * the snap of a wall switch: the new one spreads out from the switch across
 * the page, where the browser can. The icon is picked by the .dark class
 * alone, so the server's render always matches.
 */
export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const flip = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    flick(next === "light");
    const apply = () => {
      // next-themes sets the class in an effect, a beat too late for the
      // transition's snapshot, so it's set here first and then remembered
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return apply();
    // from the middle of the switch, out to the farthest corner
    const box = e.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const reach = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    const root = document.documentElement;
    root.classList.add("theme-flip");
    const t = document.startViewTransition(apply);
    t.ready.then(() =>
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${reach}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      ),
    );
    t.finished.finally(() => root.classList.remove("theme-flip"));
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Switch between light and dark"
      title="Light / dark"
      data-sound="switch"
      className={className}
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 overflow-visible"
      >
        {/* it shows where it takes you: the moon by day, the sun at night.
          the moon goes, turning away, as the sun comes up in its place */}
        <g
          className={cn(
            "origin-center scale-50 rotate-45 opacity-0 transition duration-300 ease-out",
            "dark:scale-100 dark:rotate-0 dark:opacity-100",
          )}
        >
          <circle cx="8" cy="8" r="2.6" />
          <path d="M8 1.6v1.3M8 13.1v1.3M1.6 8h1.3M13.1 8h1.3M3.5 3.5l.9.9M11.6 11.6l.9.9M3.5 12.5l.9-.9M11.6 4.4l.9-.9" />
        </g>
        <path
          d="M8.2 2.3a4.2 4.2 0 0 0 5.5 5.5A5.8 5.8 0 1 1 8.2 2.3Z"
          className={cn(
            "origin-center transition duration-300 ease-out",
            "dark:scale-50 dark:-rotate-45 dark:opacity-0",
          )}
        />
      </svg>
    </button>
  );
};
