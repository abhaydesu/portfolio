import { ld } from "./theme";

export type HobbyId =
  | "photography"
  | "football"
  | "hotwheels"
  | "sketches"
  | "reading"
  // not a hobby: the old man by the fire, who opens in a panel all the same
  | "fireside";

export type Hobby = {
  id: HobbyId;
  label: string;
  // each hobby owns a colour; its pill and its expanded panel share it. both
  // are CSS colours for either theme (see theme.ts), so only ever used in CSS
  color: string;
  // a deeper shade of it, for the word and its icon on hover
  ink: string;
};

// by day a pale ground and a deep ink; at night a dark ground and a light one
export const HOBBIES: Hobby[] = [
  {
    id: "photography",
    label: "photography",
    color: ld("#dfe6ec", "#1c232a"),
    ink: ld("#3d5a75", "#a3bed6"),
  },
  {
    id: "hotwheels",
    label: "hot wheels",
    color: ld("#cfe0fb", "#1a2540"),
    ink: ld("#1f5fd6", "#8db0f4"),
  },
  {
    id: "football",
    label: "football",
    color: ld("#f1d7d4", "#2c1c1b"),
    ink: ld("#b2352b", "#ef9a8f"),
  },
  {
    id: "reading",
    label: "reading",
    color: ld("#dde6d5", "#1d2519"),
    ink: ld("#4a6b37", "#a8c991"),
  },
  {
    id: "sketches",
    label: "sketches",
    color: ld("#e6e2d9", "#26231e"),
    ink: ld("#6b5a43", "#d2bf9c"),
  },
  {
    id: "fireside",
    label: "fireside",
    color: ld("#ebe2d4", "#241c14"),
    ink: ld("#a8541a", "#eba065"),
  },
];

export const LINKS = [
  {
    label: "resume",
    href: "https://drive.google.com/file/d/1erDudIvT4ixp0DYmVp_E6AqKTLDij2Xf/view?usp=sharing",
  },
  { label: "linkedin", href: "https://www.linkedin.com/in/abhaydesu/" },
  { label: "github", href: "https://github.com/abhaydesu/" },
  // TODO: confirm leetcode handle
  { label: "leetcode", href: "https://leetcode.com/u/abhaydesu/" },
  { label: "x", href: "https://www.x.com/abhaydesu/" },
];

// public/photography, numbered in the order they appear
export const PHOTOS = Array.from(
  { length: 16 },
  (_, i) => `/photography/photo-${String(i + 1).padStart(2, "0")}.jpg`,
);

// the docked panel shows the first few; the window shows them all
export const PHOTO_PREVIEW = PHOTOS.slice(0, 6);

// the sketchbook's pages, in order: each sketch cropped to its drawing and
// levelled so the paper is white (photos in public/sketches/sketch-*.jpg).
// a new sketch is a new page here
export const SKETCH_PAGES = [1, 2, 3, 4].map((n) => ({
  src: `/sketches/page-${n}.jpg`,
}));

// shown in the footer; bump it when the site changes
export const UPDATED = "october 2026";

// the internship, as the intro tells it: a one-line summary for the card, and
// the highlights its details window opens onto. dates, logo and stack come
// from config/experience
export const INTERNSHIP = {
  company: "Seeqlo",
  role: "frontend developer intern",
  where: "remote, canada",
  // finishes "worked with react and javascript to …"
  summary:
    "redesign a presentation platform end to end, and make it dependable.",
  highlights: [
    {
      title: "Redesigned the platform",
      body: "Led the end-to-end UI/UX redesign: responsive, themeable, with consistent slide styling.",
    },
    {
      title: "Built core product features",
      body: "Presentation history with caching, a credit-based usage system, and PPT export with SVG icons.",
    },
    {
      title: "Made it reliable",
      body: "Fixed data lost on refresh, inconsistent routing, and scaling and render mismatches.",
    },
  ],
};

// education, shortened from constants/education for the timeline card.
// `from`/`to` (year, month 0-11) let the current one show how far along it is
// the education timeline: two exams as peaks, then college as a stretch.
// months are 0-based (4 = may)
export const EDUCATION = [
  { label: "X", detail: "94%", place: "Narayana E‑Techno", at: [2020, 4] },
  {
    label: "XII",
    detail: "PCM · 81%",
    place: "Narayana E‑Techno",
    at: [2022, 4],
  },
  {
    label: "DSCE",
    detail: "B.E. ISE · 9.4 CGPA",
    place: "DSCE",
    from: [2023, 7],
    to: [2027, 5],
  },
] as const;

// the reading panel's shelves. covers in public/books; spine is the colour
// of the book's spine and ink its lettering, pages sets how thick it stands
export type Book = {
  title: string;
  author: string;
  cover: string;
  spine: string;
  ink: string;
  pages: number;
  // a shorter title for the spine, where the full one won't fit
  spineTitle?: string;
};

const book = (
  slug: string,
  title: string,
  author: string,
  spine: string,
  ink: string,
  pages: number,
  spineTitle?: string,
): Book => ({
  title,
  author,
  cover: `/books/${slug}.jpg`,
  spine,
  ink,
  pages,
  spineTitle,
});

export const SHELVES: { id: string; label: string; books: Book[] }[] = [
  {
    id: "favourites",
    label: "five i'd recommend",
    books: [
      book(
        "travelling-cat",
        "The Travelling Cat Chronicles",
        "Hiro Arikawa",
        "#e8ebef",
        "#27375a",
        256,
        "Travelling Cat",
      ),
      book(
        "miss-prym",
        "The Devil and Miss Prym",
        "Paulo Coelho",
        "#5d7d66",
        "#f1eee2",
        208,
        "Devil and Miss Prym",
      ),
      book(
        "one-more-day",
        "For One More Day",
        "Mitch Albom",
        "#2b0c0c",
        "#d8b277",
        197,
      ),
      book(
        "if-cats",
        "If Cats Disappeared from the World",
        "Genki Kawamura",
        "#f2f0e5",
        "#262626",
        176,
        "If Cats Disappeared",
      ),
      book(
        "algernon",
        "Flowers for Algernon",
        "Daniel Keyes",
        "#eef2f6",
        "#cf5a2c",
        311,
      ),
    ],
  },
  {
    id: "reading",
    label: "on the nightstand",
    books: [
      book(
        "kamogawa",
        "The Kamogawa Food Detectives",
        "Hisashi Kashiwai",
        "#40bcb0",
        "#1b2b5a",
        224,
        "Kamogawa Food Detectives",
      ),
      book(
        "coffee",
        "Before the Coffee Gets Cold",
        "Toshikazu Kawaguchi",
        "#f3f0e8",
        "#3f9396",
        224,
        "Before the Coffee…",
      ),
    ],
  },
  {
    id: "next",
    label: "the pile that keeps growing",
    books: [
      book("1984", "1984", "George Orwell", "#b3130f", "#f6eee4", 328),
      book(
        "library",
        "What You Are Looking For Is in the Library",
        "Michiko Aoyama",
        "#dce9f5",
        "#2a2f3a",
        288,
        "In the Library",
      ),
      book(
        "red-rising",
        "Red Rising",
        "Pierce Brown",
        "#111111",
        "#d9312a",
        382,
      ),
      book("held", "Held", "Anne Michaels", "#efede4", "#2b2b2b", 240),
    ],
  },
];

// the hot wheels panel: cars from the collection, still carded, hung on
// pegs. images in public/hot-wheels, trimmed to the card; peg is where the
// hook passes through the card's hang slot, as fractions of its width and
// height
export const HOT_WHEELS = [
  {
    name: "Ferrari 12Cilindri",
    line: "mainline, 2026",
    src: "/hot-wheels/ferrari-12-cillindri.png",
    aspect: 0.656,
    peg: [0.558, 0.055],
  },
  {
    name: "Ferrari Testarossa",
    line: "modern classics",
    src: "/hot-wheels/ferrari-testarossa.png",
    aspect: 0.808,
    peg: [0.553, 0.047],
  },
  {
    name: "'66 Porsche 906 Carrera 6",
    line: "forza, pop culture",
    src: "/hot-wheels/forza-porsche.png",
    aspect: 0.811,
    peg: [0.554, 0.062],
  },
  {
    name: "Volkswagen T2 Pickup",
    line: "the hot ones",
    src: "/hot-wheels/vw-t2-pickup.png",
    aspect: 0.653,
    peg: [0.557, 0.058],
  },
] as const;

// what the old man by the fire says, in order. `quote` lines are ones that
// stuck with me, and carry where they came from; the rest is him talking
/*
 * The old man by the fire. A scene, not a list of quotes: narration sets it,
 * he talks, and you pick what to ask him next. Everything he says is his own
 * hard-won sense, in his own words.
 */
export type Beat = { by: "him" | "scene"; say: string };
export type Topic = {
  id: string;
  ask: string;
  beats: Beat[];
  // does the scene's chore: a log on the fire, a bite on the line, a fresh
  // coffee
  stoke?: boolean;
};

const him = (say: string): Beat => ({ by: "him", say });
const scene = (say: string): Beat => ({ by: "scene", say });

// what the old man says, which hangs on what he's up to (see
// fireside-mood.ts): the advice is the same whatever the weather, but how he
// says hello, what you can do for him, and his asides aren't
type SceneLines = {
  opening: Beat[];
  // the scene line that opens his first answer, while he thinks
  musing: string;
  // the thing you can do for him: throw on a log, bait his hook, pour him
  // a coffee. the scene answers it
  chore: Topic;
  quiet: string;
  // what he says between topics, in turn
  again: string[];
  // once you've asked him everything
  spent: string;
  farewell: Beat[];
  // if you sit back down after saying goodbye
  back: string;
  // what he, and his pug, say when you poke them, in turn
  poked: { man: string[]; pug: string[] };
};

const LOOK = him(
  "you've got that look. somewhere to be, something to prove. i had it too, once.",
);
const SLOPE_BACK = him(
  "come back when you've climbed a bit. tell me the slope, not the number.",
);

const NIGHT: SceneLines = {
  opening: [
    scene(
      "a fire, a log, and an old man poking at the coals like they owe him money.",
    ),
    him("ah. a visitor. sit, sit. the log's dry and the fire's honest."),
    LOOK,
    him("go on then. what's keeping you up?"),
  ],
  musing: "he turns the stick over in the coals before he answers.",
  chore: {
    id: "chore",
    ask: "(throw a log on)",
    stoke: true,
    beats: [
      scene(
        "you drop a log on. the fire takes it, and sparks climb off into the dark.",
      ),
      him("easy. too much at once and it only smokes."),
      him(
        "same with learning. a little every night outlasts a lot all at once.",
      ),
    ],
  },
  quiet: "neither of you says anything. the fire does the talking for a while.",
  again: [
    "hm. what else?",
    "the night's long. ask away.",
    "go on. i'm not going anywhere.",
  ],
  spent:
    "i've talked more tonight than all winter. the fire's low, and so am i.",
  farewell: [
    him("go on, then. the fire'll keep."),
    SLOPE_BACK,
    scene(
      "he turns back to the coals. behind you, the pond keeps catching the moon.",
    ),
  ],
  back: "back already? sit. there's always more wood.",
  poked: {
    man: [
      "hm? i'm awake.",
      "poke the fire, not me.",
      "the hat stays on.",
      "sit closer. it's warmer.",
      "the pug was here first. i just bring the wood.",
      "same moon as last night. still good.",
    ],
    pug: ["snrk.", "*snort*", "...", "(he picks the fire over you.)"],
  },
};

const DAY: SceneLines = {
  opening: [
    scene(
      "an old man on an upturned crate, fishing a pond that may or may not have fish in it. his pug is losing to a butterfly.",
    ),
    him(
      "ah. a visitor. mind the line. the crate's taken, but the grass is free.",
    ),
    LOOK,
    him("go on then. the fish aren't talking. you might as well."),
  ],
  musing: "he reels in a little before he answers.",
  chore: {
    id: "chore",
    ask: "(bait his hook)",
    stoke: true,
    beats: [
      scene(
        "you thread a worm on. he casts, and before long the float goes under.",
      ),
      him("there. most of fishing is waiting, and most of waiting is fishing."),
      him(
        "same with learning. you show up and you cast. you don't get to pick the day it bites.",
      ),
    ],
  },
  quiet:
    "neither of you says anything. the float bobs, and the pug pounces, and misses.",
  again: [
    "hm. what else?",
    "the fish are in no hurry. ask away.",
    "go on. i'm not going anywhere.",
  ],
  spent: "i've talked more today than all season. and the fish still won't.",
  farewell: [
    him("go on, then. the pond'll keep."),
    SLOPE_BACK,
    scene(
      "he settles back on his crate. behind you, the pug is still losing to the butterfly.",
    ),
  ],
  back: "back already? sit. the fish certainly aren't keeping me busy.",
  poked: {
    man: [
      "shh. you'll scare them.",
      "hm? i'm watching the float.",
      "the hat stays on.",
      "it's not about the fish.",
      "the pug's having a better day than me.",
      "same pond as yesterday. still good.",
    ],
    pug: ["boof!", "(he's busy.)", "snrk?", "(the butterfly gets away again.)"],
  },
};

const RAIN: SceneLines = {
  opening: [
    scene(
      "rain on canvas, a lantern, and an old man in the mouth of his tent with both hands round a mug.",
    ),
    him("ah. a visitor. in, in, before you drown. mind the pug."),
    LOOK,
    him("go on then. it's not letting up. what's on your mind?"),
  ],
  musing: "he blows on his coffee before he answers.",
  chore: {
    id: "chore",
    ask: "(pour him more coffee)",
    stoke: true,
    beats: [
      scene("you top up his mug. the steam curls up into the lantern light."),
      him("easy. a little at a time, or you only burn your tongue."),
      him("same with learning. a cup a day outlasts a pot all at once."),
    ],
  },
  quiet: "neither of you says anything. the rain does the talking for a while.",
  again: [
    "hm. what else?",
    "it's raining. we've got time. ask away.",
    "go on. i'm not going anywhere. nobody is.",
  ],
  spent:
    "i've talked more today than all monsoon. the coffee's cold, and so am i.",
  farewell: [
    him("go on, then. it rains the same whether you hurry or not."),
    SLOPE_BACK,
    scene(
      "he pulls the blanket up. behind you, the rain keeps drumming on the pond.",
    ),
  ],
  back: "back already? come in. there's always more coffee.",
  poked: {
    man: [
      "hm? i'm awake.",
      "careful. it's hot.",
      "the hat stays on. even in here.",
      "listen to it. best sound there is.",
      "the pug was here first. i just bring the coffee.",
      "it'll stop when it stops.",
    ],
    pug: ["snrk.", "*snore*", "...", "(he curls up tighter.)"],
  },
};

export const FIRESIDE = {
  night: NIGHT,
  day: DAY,
  rain: RAIN,
  // with thunder in it, the rain's first line
  storm: scene(
    "thunder close by, rain on canvas, and an old man in the mouth of his tent with both hands round a mug.",
  ),
  farewell: "i should get going.",
};

// what you can ask him, in this order: the three he has answers to, the
// thing you can do for him, and sitting quietly
export const firesideTopics = (lines: SceneLines): Topic[] => [
  {
    id: "slope",
    ask: "how do i get good at this?",
    beats: [
      scene(lines.musing),
      him(
        "nobody starts good. where you begin is a small number, and it matters less than you'd think.",
      ),
      him(
        "what matters is how steep you climb. keep the slope, give it a few winters, and the lines always cross.",
      ),
      him(
        "make the thing work before you make it pretty, and pretty before fast. everyone wants to start with fast.",
      ),
    ],
  },
  {
    id: "ahead",
    ask: "everyone seems so far ahead.",
    beats: [
      scene("he laughs, and it turns into a cough."),
      him(
        "ahead on what road? they didn't start where you did, and they're not going where you're going.",
      ),
      him(
        "race the one you were last spring. it's the only race with fair rules.",
      ),
      him(
        "count another man's fire long enough and yours goes out while you're counting.",
      ),
    ],
  },
  {
    id: "finish",
    ask: "i never finish things.",
    beats: [
      him("starting's the easy part. it's all promise and no proof."),
      him(
        "finish small things. one small finished thing teaches more than ten big ones left half built.",
      ),
      him(
        "and let it out the door before you're proud of it. the pride comes with the second one.",
      ),
    ],
  },
  lines.chore,
  {
    id: "quiet",
    ask: "(sit quietly)",
    beats: [
      scene(lines.quiet),
      him("good. most people never learn that one."),
      him(
        "you don't have to fill every silence. the best thinking happens in them.",
      ),
    ],
  },
];
