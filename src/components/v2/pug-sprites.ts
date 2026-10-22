/*
 * The old man's pug, one character per pixel ("." is clear), in the poses
 * his scene (fireside.tsx) and the way to it (pug-gate.tsx) both draw him
 * in. Kept apart so the gateway doesn't need the whole scene to draw him.
 *
 * A pug at this size is all in a few pixels: a round fawn head with its
 * ears folded down dark at the corners, a flat black muzzle, a stocky
 * body on short legs, and the tail curled over in a loop.
 */

export type Sprite = { rows: string[]; pal: Record<string, string> };

const PAL: Record<string, string> = {
  f: "#d9b384", // fawn
  F: "#b08656", // fawn in shadow, and his paws
  m: "#2b231e", // black: ears, eyes, nose
  M: "#5a4a40", // his muzzle
  t: "#c99d6c", // his tail
};

// sat facing you: eyes shut and content, open (looking at you), and his
// tail going
const sit = (eyes: string, wag: boolean): Sprite => ({
  rows: [
    ".mfffffm.",
    "mmfFfFfmm",
    eyes,
    ".ffMmMff.",
    wag ? "..fMMMf.t" : "..fMMMf..",
    wag ? ".fffffffF" : ".fffffff.",
    "fffffffff",
    "ffffffffF",
    ".FF...FF.",
  ],
  pal: PAL,
});
export const PUG_SIT = {
  rest: sit(".fMMfMMf.", false),
  restWag: sit(".fMMfMMf.", true),
  look: sit(".fmffmff.", false),
  lookWag: sit(".fmffmff.", true),
};

// lying down asleep, his head on his paws
export const PUG_ASLEEP: Sprite = {
  rows: [
    ".fff.....",
    "mfffm.tt.",
    "MffffftFt",
    "MmFffffff",
    ".MfffffFF",
    "..FF.FF..",
  ],
  pal: PAL,
};

// by day, about his business: two steps of a trot, and a pounce
export const PUG_TROT: Sprite[] = [
  {
    rows: [
      "......fff.",
      ".tt..mffff",
      "t..t.ffmff",
      ".ttfffffMm",
      "..ffffffM.",
      "..fFfffF..",
      "..f.F.f.F.",
    ],
    pal: PAL,
  },
  {
    rows: [
      "......fff.",
      ".tt..mffff",
      "t..t.ffmff",
      ".ttfffffMm",
      "..ffffffM.",
      "..fFfffF..",
      "...fF.fF..",
    ],
    pal: PAL,
  },
];
export const PUG_POUNCE: Sprite = {
  rows: [
    ".......fff.",
    ".tt...mffff",
    "t..t..ffmff",
    ".ttffffffMm",
    "..fFffffM..",
    ".fF.....fF.",
  ],
  pal: PAL,
};

/* ---------- by the page's thanks ---------- */

// the way to the old man (pug-gate.tsx) shows him bigger than his scene
// can, so his face can be drawn: round and wider than it's tall, ears
// folded down dark either side, big dark eyes with a glint in them, a flat
// black muzzle with his nose in it (and his tongue out when he's looking
// at you), a chubby chest on two front legs, his haunches either side
const GATE_PAL = {
  ...PAL,
  l: "#ecd2a8", // fawn, catching the light
  D: "#94683e", // fawn, deep in shadow
  e: "#fbf6ec", // the glint in his eyes
  p: "#e58a8a", // his tongue
};
const gate = (rows: string[]): Sprite => ({ rows, pal: GATE_PAL });
export const PUG_GATE = {
  // eyes shut and content
  rest: gate([
    "...fffffff...",
    ".mmlllllllmm.",
    "mmmfFlFlFfmmm",
    "mmfffffffffmm",
    "m.fmmMMMmmf.m",
    "..fMMMmMMMf..",
    "..fMMMMMMMf..",
    "...fMMMMMf...",
    "...fffffff...",
    "..fffffffff..",
    ".fffFfffFfff.",
    "ffffFfffFffff",
    ".FFDFFDFFDFF.",
  ]),
  // (with his tail going, peeking out at his side)
  restWag: gate([
    "...fffffff...",
    ".mmlllllllmm.",
    "mmmfFlFlFfmmm",
    "mmfffffffffmm",
    "m.fmmMMMmmf.m",
    "..fMMMmMMMf..",
    "..fMMMMMMMf..",
    "...fMMMMMf...",
    "...fffffff...",
    "..fffffffff.t",
    ".fffFfffFffft",
    "ffffFfffFffff",
    ".FFDFFDFFDFF.",
  ]),
  // looking at you, tongue out
  look: gate([
    "...fffffff...",
    ".mmlllllllmm.",
    "mmmfFlFlFfmmm",
    "mmfemfffemfmm",
    "m.fmmMMMmmf.m",
    "..fMMMmMMMf..",
    "..fMMMMMMMf..",
    "...fMMpMMf...",
    "...fffffff...",
    "..fffffffff..",
    ".fffFfffFfff.",
    "ffffFfffFffff",
    ".FFDFFDFFDFF.",
  ]),
  lookWag: gate([
    "...fffffff...",
    ".mmlllllllmm.",
    "mmmfFlFlFfmmm",
    "mmfemfffemfmm",
    "m.fmmMMMmmf.m",
    "..fMMMmMMMf..",
    "..fMMMMMMMf..",
    "...fMMpMMf...",
    "...fffffff...",
    "..fffffffff.t",
    ".fffFfffFffft",
    "ffffFfffFffff",
    ".FFDFFDFFDFF.",
  ]),
  // trotting off to the old man, and back
  trot: [
    gate([
      "..........lll..",
      "..tt.....mlllll",
      ".t..t...mmflllf",
      ".t.tt...mffmeff",
      "..ttffffffffMMm",
      "...fffffffffMMM",
      "...lffffffFfMM.",
      "...ffFFffFFf...",
      "...fF.Ff.fF.F..",
      "...FD.FD.FD.FD.",
    ]),
    gate([
      "..........lll..",
      "..tt.....mlllll",
      ".t..t...mmflllf",
      ".t.tt...mffmeff",
      "..ttffffffffMMm",
      "...fffffffffMMM",
      "...lffffffFfMM.",
      "...ffFFffFFf...",
      "....fFf...fFf..",
      "....FDD...FDD..",
    ]),
  ],
};
