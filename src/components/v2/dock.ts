/*
 * Where an opening hobby panel docks (xl+): a side of the column, and its
 * distance in px from the viewport bottom to the panel's bottom edge.
 *  - side: opposite the panel currently open, so the outgoing one can play
 *    its exit undisturbed; with nothing open, the side nearer the clicked word
 *  - height: beside the clicked word
 * Decided once when it opens; the panel stays put until it closes.
 */

export type Side = "left" | "right";

export type Dock = { side: Side; fromBottom: number };

const EDGE = 32; // keep panels this far from the viewport edges
const BELOW_ANCHOR = 48; // the panel's bottom sits this far below the clicked word
const MIN_ROOM = 160; // never dock somewhere with less height than this available

export function placePanel(
  anchor: DOMRect | undefined,
  current: Side | null,
): Dock {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const nearer: Side =
    anchor && anchor.left + anchor.width / 2 > vw / 2 ? "right" : "left";
  const side = current ? (current === "left" ? "right" : "left") : nearer;

  const fromBottom = anchor ? vh - (anchor.bottom + BELOW_ANCHOR) : EDGE;
  return {
    side,
    fromBottom: Math.min(Math.max(fromBottom, EDGE), vh - EDGE - MIN_ROOM),
  };
}
