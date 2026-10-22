"use client";

import { useEffect, useState } from "react";

/*
 * A part of the page that isn't needed until it's asked for (a hobby's
 * panel, say), kept out of the first load and fetched on its own.
 *
 * Unlike next/dynamic it never shows a fallback once it's in: warm() fetches
 * it ahead of time (when the page is idle, or the moment the pointer heads
 * for the word that opens it), and from then on it renders straight away, in
 * the same frame, so a panel's opening is exactly as it was. Asked for before
 * it's in, it renders nothing for the moment it takes, then itself.
 */
export function lazyPart<P extends object>(
  load: () => Promise<React.ComponentType<P>>,
) {
  let Part: React.ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;
  const warm = () =>
    (pending ??= load().then((c) => {
      Part = c;
    }));

  const Lazy = (props: P) => {
    const [, loaded] = useState(0);
    useEffect(() => {
      if (!Part) void warm().then(() => loaded((n) => n + 1));
    }, []);
    return Part ? <Part {...props} /> : null;
  };
  return Object.assign(Lazy, { warm });
}

// when the page has nothing better to do (or, where the browser can't say,
// a little after it's up)
export const whenIdle = (fn: () => void) => {
  const idle =
    window.requestIdleCallback ??
    ((cb: () => void) => setTimeout(cb, 1500) as unknown as number);
  idle(fn, { timeout: 4000 } as IdleRequestOptions);
};
