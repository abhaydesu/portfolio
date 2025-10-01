"use client";
import React from 'react'
import Marquee from 'react-fast-marquee'
import { SectionHeading } from './section-heading'

export default function TechShowcase() {
const techs = [
  { name: 'C++', logo: 'https://cdn.simpleicons.org/cplusplus/262626' },
  { name: 'Python', logo: 'https://cdn.simpleicons.org/python/262626' },
  { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/262626' },
  { name: 'TypeScript', logo: 'https://cdn.simpleicons.org/typescript/262626' },
  { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/262626' },
  { name: 'Supabase', logo: 'https://cdn.simpleicons.org/supabase/262626' },
  { name: 'Svelte', logo: 'https://cdn.simpleicons.org/svelte/262626' },
  { name: 'Express', logo: 'https://cdn.simpleicons.org/express/262626' },
  { name: 'MongoDB', logo: 'https://cdn.simpleicons.org/mongodb/262626' },
  { name: 'Bash', logo: 'https://cdn.simpleicons.org/gnubash/262626' },
  { name: 'Postgres', logo: 'https://cdn.simpleicons.org/postgresql/262626' },
  { name: 'React', logo: 'https://cdn.simpleicons.org/react/262626' },
  { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/262626' },
  { name: 'Tailwind CSS', logo: 'https://cdn.simpleicons.org/tailwindcss/262626' },
  { name: 'CSS', logo: 'https://cdn.simpleicons.org/css/262626' },
  { name: 'HTML', logo: 'https://cdn.simpleicons.org/html5/262626' },
  { name: 'three.js', logo: 'https://cdn.simpleicons.org/three.js/262626' },
  { name: 'Framer Motion', logo: 'https://cdn.simpleicons.org/framer/262626' },
  { name: 'Git', logo: 'https://cdn.simpleicons.org/git/262626' },
  { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/262626' },
]


const mid = Math.ceil(techs.length / 2);
const topTechs = techs.slice(0, mid);
const bottomTechs = techs.slice(mid);

return (
    <div className="py-4 my-8 px-12 pb-8 border-t border-neutral-100 dark:border-neutral-800 -mx-8">
      <SectionHeading className="mb-4" delay={0.1}>
        <span className="text-pink-300 dark:text-pink-700">*</span>what i&#39;ve worked with
      </SectionHeading>

      <div 
        className="
        [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] 
        [-webkit-mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]
      ">
        <div className="flex flex-col gap-3">
          <Marquee speed={18} pauseOnHover gradient={false} className="py-2">
            {topTechs.map((t, idx) => (
              <TechPill key={`top-${idx}-${t.name}`} {...t} />
            ))}
          </Marquee>

          <Marquee speed={20} pauseOnHover gradient={false} direction="right" className="py-2">
            {bottomTechs.map((t, idx) => (
              <TechPill key={`bottom-${idx}-${t.name}`} {...t} />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  )

}

const TechPill = ({ name, logo }: { name: string; logo?: string }) => {
  const [imgOk, setImgOk] = React.useState(true)

  return (
    <div className="flex items-center gap-3 px-2 py-1 hover:shadow-[var(--shadow-pink)] rounded-full border border-neutral-100 dark:border-neutral-800 shadow-[var(--shadow-sm)] bg-white dark:bg-neutral-950 min-w-[6rem] mr-3 hover:scale-101">
      {logo && imgOk ? (
        <img
          src={logo}
          alt={name}
          className="h-6 w-6 rounded-md object-contain p-0.5 dark:invert"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="h-6 w-6 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-xs">{name.slice(0, 2).toUpperCase()}</div>
      )}

      <div className="flex flex-col text-left">
        <span className="text-sm font-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100">{name}</span>
      </div>
    </div>
  )
}
