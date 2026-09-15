"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { bind, play, setVolume } from "cuelume";

export function CuelumeProvider() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Bind all data-cuelume-* attributes across the document once on mount
  useEffect(() => {
    bind();
    setVolume(0.5);
  }, []);

  // Play "arrival" sound on every client-side route change (skip the very first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    play("arrival", { volume: 0.4 });
  }, [pathname]);

  return null;
}
