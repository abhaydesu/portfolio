"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import { SectionHeading } from "./section-heading";

export default function TechShowcase() {
  const techs: { name: string; logo?: string; url?: string }[] = [
    {
      name: "C++",
      logo: "https://cdn.simpleicons.org/cplusplus/262626",
      url: "https://en.cppreference.com/w/",
    },
    {
      name: "Python",
      logo: "https://cdn.simpleicons.org/python/262626",
      url: "https://docs.python.org/3/",
    },
    {
      name: "JavaScript",
      logo: "https://cdn.simpleicons.org/javascript/262626",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
      name: "TypeScript",
      logo: "https://cdn.simpleicons.org/typescript/262626",
      url: "https://www.typescriptlang.org/docs/",
    },
    {
      name: "Node.js",
      logo: "https://cdn.simpleicons.org/nodedotjs/262626",
      url: "https://nodejs.org/en/docs/",
    },
    {
      name: "Supabase",
      logo: "https://cdn.simpleicons.org/supabase/262626",
      url: "https://supabase.com/docs",
    },
    {
      name: "Svelte",
      logo: "https://cdn.simpleicons.org/svelte/262626",
      url: "https://svelte.dev/docs",
    },
    {
      name: "Express",
      logo: "https://cdn.simpleicons.org/express/262626",
      url: "https://expressjs.com/",
    },
    {
      name: "MongoDB",
      logo: "https://cdn.simpleicons.org/mongodb/262626",
      url: "https://www.mongodb.com/docs/",
    },
    {
      name: "Bash",
      logo: "https://cdn.simpleicons.org/gnubash/262626",
      url: "https://www.gnu.org/software/bash/manual/",
    },
    {
      name: "Postgres",
      logo: "https://cdn.simpleicons.org/postgresql/262626",
      url: "https://www.postgresql.org/docs/",
    },
    {
      name: "React",
      logo: "https://cdn.simpleicons.org/react/262626",
      url: "https://reactjs.org/docs/getting-started.html",
    },
    {
      name: "Next.js",
      logo: "https://cdn.simpleicons.org/nextdotjs/262626",
      url: "https://nextjs.org/docs",
    },
    {
      name: "Tailwind CSS",
      logo: "https://cdn.simpleicons.org/tailwindcss/262626",
      url: "https://tailwindcss.com/docs",
    },
    {
      name: "CSS",
      logo: "https://cdn.simpleicons.org/css/262626",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
      name: "HTML",
      logo: "https://cdn.simpleicons.org/html5/262626",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
      name: "three.js",
      logo: "https://cdn.simpleicons.org/three.js/262626",
      url: "https://threejs.org/docs/",
    },
    {
      name: "Framer Motion",
      logo: "https://cdn.simpleicons.org/framer/262626",
      url: "https://www.framer.com/motion/",
    },
    {
      name: "Git",
      logo: "https://cdn.simpleicons.org/git/262626",
      url: "https://git-scm.com/docs",
    },
    {
      name: "GitHub",
      logo: "https://cdn.simpleicons.org/github/262626",
      url: "https://docs.github.com/",
    },
  ];

  const mid = Math.ceil(techs.length / 2);
  const topTechs = techs.slice(0, mid);
  const bottomTechs = techs.slice(mid);

  return (
    <div className="relative px-8 pb-8 border-t border-neutral-100 dark:border-neutral-800/50 -mx-8">
      <div className="bg-[image:repeating-linear-gradient(-315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed w-full h-4 border-b border-neutral-100 dark:border-neutral-800/50"></div>
      <div className="mx-4">
        <SectionHeading className="mb-4 mt-2" delay={0.1}>
          <span className="text-pink-300 dark:text-pink-700">*</span>what
          i&#39;ve worked with
        </SectionHeading>

        <div
          className="
        [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] 
        [-webkit-mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]
      "
        >
          <div className="flex flex-col gap-3">
            <Marquee speed={18} pauseOnHover gradient={false} className="py-2">
              {topTechs.map((t, idx) => (
                <TechPill key={`top-${idx}-${t.name}`} {...t} />
              ))}
            </Marquee>

            <Marquee
              speed={20}
              pauseOnHover
              gradient={false}
              direction="right"
              className="py-2"
            >
              {bottomTechs.map((t, idx) => (
                <TechPill key={`bottom-${idx}-${t.name}`} {...t} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
}

const TechPill = ({
  name,
  logo,
  url,
}: {
  name: string;
  logo?: string;
  url?: string;
}) => {
  const [imgOk, setImgOk] = React.useState(true);

  const pillContent = (
    <>
      {logo && imgOk ? (
        <img
          src={logo}
          alt={name}
          className="h-6 w-6 rounded-md object-contain p-0.5 dark:invert transition-transform duration-300 group-hover:-rotate-10 group-hover:scale-100"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="h-6 w-6 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-xs">
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div className="flex flex-col text-left">
        <span className="text-sm font-sm text-neutral-600 dark:text-neutral-300 ">
          {name}
        </span>
      </div>
    </>
  );

  const commonClasses =
    "group flex items-center gap-3 px-2 py-1 hover:shadow-md dark:hover:shadow-md dark:hover:shadow-neutral-800 rounded-full border border-neutral-100 dark:border-neutral-800/50 shadow-[var(--shadow-sm)] bg-white dark:bg-neutral-900 min-w-[6rem] mr-3 hover:scale-101 transition-all";

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${name} documentation`}
        className={commonClasses}
        title={`Open ${name} documentation`}
      >
        {pillContent}
      </a>
    );
  }

  return <div className={commonClasses}>{pillContent}</div>;
};
