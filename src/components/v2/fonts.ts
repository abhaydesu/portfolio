import { Caveat, VT323 } from "next/font/google";

// handwriting: the sketching word, and notes scribbled in panels
export const hand = Caveat({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  // only inside panels, so not fetched until one asks for it
  preload: false,
});

// the old tv's screen in the football panel
export const crt = VT323({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // only inside panels, so not fetched until one asks for it
  preload: false,
});
