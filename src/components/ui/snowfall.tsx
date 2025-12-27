"use client";
import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import { useTheme } from "next-themes";

export default function SnowfallClient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Light: subtle pink. Dark: darker, near-transparent with pink hint.
  const lightColor = "rgba(255,182,193,0.55)"; // light pink
  const darkColor = "rgba(255,182,193,0.22)";

  const colors = theme === "dark" ? [darkColor] : [lightColor];

  return (
    <Snowfall
      snowflakeCount={160}
      color={colors}
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: 9999,
        pointerEvents: "none",
        top: 0,
        left: 0,
      }}
    />
  );
}
