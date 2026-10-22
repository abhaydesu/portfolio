/*
 * A colour for each theme. Inside the page's .v2 wrapper the color-scheme
 * follows the theme (see globals.css), so the browser picks the right one;
 * nothing has to re-render when the theme changes. Only for colours that end
 * up in CSS (a style, or a custom property), never ones read in script.
 */
export const ld = (day: string, night: string) =>
  `light-dark(${day}, ${night})`;
