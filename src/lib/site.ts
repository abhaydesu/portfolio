import { projects } from "@/constants/projects";
import { LINKS } from "@/components/v2/data";
import { STACK } from "@/components/v2/stack";

/*
 * The plain facts about the site and its author, in one place, for whatever
 * describes the site to machines rather than people: the page's metadata,
 * its structured data (components/json-ld.tsx), and /llms.txt. Taken from
 * the same data the page itself shows, so they can't drift apart.
 */

export const SITE = {
  url: "https://abhaydesu.me",
  name: "Abhay Singh",
  handle: "abhaydesu",
  role: "Full Stack Engineer",
  // the photo at the top of the page
  image: "/about/avatar-2.jpeg",
  city: "Bangalore",
  region: "Karnataka",
  country: "India",
  // one line that answers "who is this?" on its own
  summary:
    "Abhay Singh (abhaydesu) is a full stack engineer based in Bangalore, India, who builds intentional, detail-driven web interfaces with React, Next.js and TypeScript.",
  about: [
    "Final-year Information Science and Engineering student at Dayananda Sagar College of Engineering (DSCE), Bangalore.",
    "Previously a frontend developer intern at Seeqlo (remote, Canada), where he led the end-to-end UI/UX redesign of a presentation platform, built presentation history, a credit-based usage system and PPT export, and fixed critical state and persistence issues.",
    "Open to new roles.",
  ],
  college: {
    name: "Dayananda Sagar College of Engineering",
    alt: "DSCE",
    url: "https://www.dsce.edu.in",
  },
  internship: {
    company: "Seeqlo",
    url: "https://seeqlo.com",
    role: "Frontend Developer Intern",
    start: "2025-12",
    end: "2026-03",
  },
  stack: STACK.map((t) => t.name),
  // profiles elsewhere that are him (not the résumé, which is a document)
  profiles: LINKS.filter((l) => l.label !== "resume").map((l) => l.href),
  resume: LINKS.find((l) => l.label === "resume")?.href,
  projects: projects
    // (the site's own entry links to "#")
    .filter((p) => p.href.startsWith("http"))
    .map((p) => ({
      name: p.title.trim(),
      url: p.href,
      source: p.github,
      description: p.description.trim(),
    })),
};

export const abs = (path: string) => new URL(path, SITE.url).toString();
