"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <BarColour />
      {children}
    </NextThemesProvider>
  );
}

// the browser's bar (on phones, mostly) in the page's own colour, day or night
const BAR = { light: "#f7f7f5", dark: "#080605" };
const BarColour = () => {
  const { resolvedTheme } = useTheme();
  React.useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute("content", BAR[resolvedTheme]));
  }, [resolvedTheme]);
  return null;
};
