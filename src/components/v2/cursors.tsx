"use client";

import { useEffect } from "react";

/*
 * The site's own cursors: still the system's (it draws them, so they never
 * lag the hand), only drawn in the site's hand. An arrow in the page's ink
 * with a paper edge (the other way round at night), a text cursor to
 * match, and a pointing hand, outlined in the colour of whatever it's over
 * (the word's, or the key's) where that has a colour of its own, and in ink
 * where it hasn't. Over the pixel pictures (the old man's island, the
 * sunset, his pug) they're pixels: an arrow, and a hand over whatever can
 * be poked.
 *
 * Each is drawn once into a small picture at one and two device pixels to
 * the css pixel, and the rules that use them written into the page's base
 * styles, so anything that sets a cursor of its own (a photo you can drag)
 * still does. The rules for both themes are written up front, so turning
 * the theme over swaps them at once, with nothing to draw or load (and the
 * page itself carries the arrow, so the crossfade between the two themes,
 * drawn over the page, shows it too). The hands' colours are worked out
 * again as new things come in (a panel opening). They're all one size: the
 * pixel ones are drawn as big as the others, not bigger.
 */

const INK = "#1d1a17";
const PAPER = "#fbfaf6";

// everything you can press, as the base styles have it (not merely
// everything that can be focused: a word that only shows something while
// you're on it can be, and pressing it does nothing)
const PRESS =
  'a[href], button:not(:disabled), summary, select, label[for], [role="button"]:not([aria-disabled="true"]), [role="tab"]';
const TEXT =
  'p, li, h1, h2, h3, h4, blockquote, figcaption, dd, dt, [data-intro="text"]';

type Draw = (g: CanvasRenderingContext2D) => void;

// a picture, w × h css px, at a scale, as a data url
const picture = (w: number, h: number, scale: number, draw: Draw) => {
  const c = document.createElement("canvas");
  c.width = w * scale;
  c.height = h * scale;
  const g = c.getContext("2d")!;
  g.scale(scale, scale);
  g.lineJoin = "round";
  g.lineCap = "round";
  draw(g);
  return c.toDataURL();
};

// a cursor rule's value: the picture at 1x and 2x, its hot spot, and the
// system's own as the last resort (three ways, as browsers differ on which
// they take; the ones they don't are dropped)
// (each look is drawn only once, however often the rules are written)
const drawn = new Map<string, [string, string]>();
const cursor = (
  w: number,
  h: number,
  hot: [number, number],
  fallback: string,
  draw: Draw,
  look: string,
) => {
  let pics = drawn.get(look);
  if (!pics) {
    pics = [picture(w, h, 1, draw), picture(w, h, 2, draw)];
    drawn.set(look, pics);
  }
  const [a, b] = pics;
  const at = `${hot[0]} ${hot[1]}`;
  return [
    `cursor: url(${a}) ${at}, ${fallback};`,
    `cursor: -webkit-image-set(url(${a}) 1x, url(${b}) 2x) ${at}, ${fallback};`,
    `cursor: image-set(url(${a}) 1x, url(${b}) 2x) ${at}, ${fallback};`,
  ].join(" ");
};

// the arrow, its tip at (2, 2): filled, with an edge round it
const arrow =
  (fill: string, edge: string): Draw =>
  (g) => {
    const p = new Path2D(
      "M2 2 L2 17.5 L6 14 L8.8 20 L11.4 18.9 L8.7 13 L13.6 13 Z",
    );
    g.lineWidth = 3;
    g.strokeStyle = edge;
    g.stroke(p);
    g.fillStyle = fill;
    g.fill(p);
  };

// the text cursor: a bar with a serif top and foot, centred at (6, 10)
const caret =
  (fill: string, edge: string): Draw =>
  (g) => {
    const p = new Path2D(
      "M3.5 2.5 Q6 2.5 6 4.5 Q6 2.5 8.5 2.5 M6 4.5 L6 15.5 M3.5 17.5 Q6 17.5 6 15.5 Q6 17.5 8.5 17.5",
    );
    g.lineWidth = 3.5;
    g.strokeStyle = edge;
    g.stroke(p);
    g.lineWidth = 1.5;
    g.strokeStyle = fill;
    g.stroke(p);
  };

// the hand, pointing, its fingertip at (8, 2): the index finger up at its
// left, the other three folded, stepping down to the right, and the thumb
// out to the left. drawn as shapes run together: each stroked thick in the
// outline first, then all of them filled with paper, so the outline goes
// round the whole hand; then a line between each finger
const hand =
  (line: string): Draw =>
  (g) => {
    const parts = [
      [6, 1, 4, 12.5, 2],
      [9.6, 7, 3.4, 6.5, 1.7],
      [12.6, 8, 3.4, 5.5, 1.7],
      [15.6, 9.4, 3.2, 4.4, 1.6],
      [4.5, 10.5, 14.3, 10.5, 4],
    ] as const;
    const thumb = new Path2D("M5.6 16.6 L2.4 12.8");
    const outline = new Path2D();
    for (const [x, y, w, h, r] of parts) outline.roundRect(x, y, w, h, r);
    g.lineWidth = 3;
    g.strokeStyle = line;
    g.stroke(outline);
    g.fillStyle = line;
    g.fill(outline);
    g.lineWidth = 7;
    g.stroke(thumb);
    g.fillStyle = PAPER;
    for (const [x, y, w, h, r] of parts) {
      g.beginPath();
      g.roundRect(x, y, w, h, r);
      g.fill();
    }
    g.lineWidth = 4;
    g.strokeStyle = PAPER;
    g.stroke(thumb);
    g.lineWidth = 1;
    g.strokeStyle = line;
    g.beginPath();
    for (const [x, top] of [
      [9.8, 9],
      [12.8, 9.6],
      [15.8, 10.6],
    ]) {
      g.moveTo(x, top);
      g.lineTo(x, 13.2);
    }
    g.stroke();
  };

// the pixel ones: one character per pixel, two css px each, so they come
// out the same size as the others
const PIXEL_ARROW = [
  "X......",
  "XX.....",
  "XWX....",
  "XWWX...",
  "XWWWX..",
  "XWWWWX.",
  "XWWWXXX",
  "XWXWX..",
  "XX.XWX.",
  "X...XX.",
];
const PIXEL_HAND = [
  "...XX.....",
  "..XWWX....",
  "..XWWXXX..",
  "..XWWXWWXX",
  "XXXWWWWWWX",
  "XWXWWWWWWX",
  "XWWWWWWWWX",
  ".XWWWWWWWX",
  "..XWWWWWX.",
  "...XXXXXX.",
];
const pixels =
  (rows: string[]): Draw =>
  (g) =>
    rows.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (c === ".") return;
        g.fillStyle = c === "X" ? INK : PAPER;
        g.fillRect(x * 2, y * 2, 2, 2);
      }),
    );

// what colour a thing's hand should be: its own (its accent, or a hobby
// word's ink), as it shows in the theme it's in. read straight off its
// style (a colour, or light-dark(day, night)), so nothing's ever added to
// the page to find it out: the page is being watched for things arriving
const colourOf = (el: HTMLElement, night: boolean) => {
  const cs = getComputedStyle(el);
  const v = (
    cs.getPropertyValue("--accent") || cs.getPropertyValue("--ink")
  ).trim();
  const m = v.match(/^light-dark\((.*)\)$/);
  if (!m) return v;
  // its two colours, split at the comma between them (not one inside them)
  let depth = 0;
  for (let i = 0; i < m[1].length; i++) {
    const c = m[1][i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (c === "," && !depth)
      return (night ? m[1].slice(i + 1) : m[1].slice(0, i)).trim();
  }
  return v;
};

export const Cursors = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.cursors = "";
    document.head.append(style);
    let frame = 0;

    const write = () => {
      frame = 0;

      // the things with a colour of their own, and the colours among them
      // (by day and at night, as a pair)
      const pairs: [string, string][] = [];
      for (const el of document.querySelectorAll<HTMLElement>(
        '.v2 [style*="--accent"], .v2 [data-hobby-word][style*="--ink"]',
      )) {
        const day = colourOf(el, false);
        const night = colourOf(el, true);
        if (!day) continue;
        let i = pairs.findIndex(([d, n]) => d === day && n === night);
        if (i < 0) i = pairs.push([day, night]) - 1;
        if (el.dataset.hand !== `${i}`) el.dataset.hand = `${i}`;
      }

      const rule = (selector: string, value: string) =>
        `${selector} { ${value} }`;
      const hand_ = (c: string) =>
        cursor(22, 24, [8, 2], "pointer", hand(c), `hand ${c}`);
      const base: string[] = [];
      const classed: string[] = [
        // the few things you can press that aren't links or buttons say so
        // with a class of their own; the hand takes over from it
        rule(".v2 .cursor-pointer", hand_(INK)),
      ];
      for (const night of [false, true]) {
        const t = night ? ":where(html.dark)" : ":where(html:not(.dark))";
        const [fill, edge] = night ? [PAPER, INK] : [INK, PAPER];
        const arrow_ = cursor(
          18,
          24,
          [2, 2],
          "default",
          arrow(fill, edge),
          `arrow ${night}`,
        );
        base.push(
          // the page itself carries the arrow, and everything in it
          rule(t, arrow_),
          rule(
            `${t} :where(${TEXT})`,
            cursor(
              12,
              20,
              [6, 10],
              "text",
              caret(fill, edge),
              `caret ${night}`,
            ),
          ),
          rule(`${t} :where(${PRESS})`, hand_(INK)),
          ...pairs.map((p, i) =>
            rule(
              `${t} [data-hand="${i}"]:where(${PRESS}), ${t} [data-hand="${i}"] :where(${PRESS})`,
              hand_(p[+night]),
            ),
          ),
          // (where a word only shows something while you're on it, or
          // won't take a press just now, there's nothing to press: an
          // arrow)
          rule(
            `${t} [data-cursor="arrow"], ${t} [aria-disabled="true"]`,
            arrow_,
          ),
        );
        classed.push(
          ...pairs.map((p, i) =>
            rule(
              `${t} [data-hand="${i}"].cursor-pointer, ${t} [data-hand="${i}"] .cursor-pointer`,
              hand_(p[+night]),
            ),
          ),
        );
      }
      base.push(
        rule(
          '[data-cursor="pixel"]',
          cursor(14, 20, [0, 0], "default", pixels(PIXEL_ARROW), "pixel arrow"),
        ),
        rule(
          'button[data-cursor="pixel"], [data-cursor="pixel"][data-poke]',
          cursor(20, 20, [7, 0], "pointer", pixels(PIXEL_HAND), "pixel hand"),
        ),
      );
      const next = `@layer base {\n${base.join("\n")}\n}\n@layer utilities {\n${classed.join("\n")}\n}`;
      // (unchanged, the page isn't asked to restyle itself)
      if (next !== style.textContent) style.textContent = next;
    };
    const later = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    write();
    // (and every picture loaded now, the night's too, so none has to load
    // the moment it's first wanted)
    for (const [a, b] of drawn.values())
      for (const src of [a, b]) new Image().src = src;
    // things coming in that have a colour
    const arrivals = new MutationObserver((records) => {
      if (
        records.some((r) =>
          [...r.addedNodes].some(
            (n) =>
              n instanceof HTMLElement &&
              (n.matches('[style*="--accent"], [style*="--ink"]') ||
                !!n.querySelector('[style*="--accent"], [style*="--ink"]')),
          ),
        )
      )
        later();
    });
    arrivals.observe(document.body, { childList: true, subtree: true });
    return () => {
      arrivals.disconnect();
      cancelAnimationFrame(frame);
      style.remove();
    };
  }, []);
  return null;
};
