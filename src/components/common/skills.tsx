import { Link } from 'next-view-transitions';
import React from 'react';

interface SkillProps {
  name: string;
  href: string;
  children: React.ReactNode;
}

export default function Skill({ name, href, children }: SkillProps) {
  return (
    <Link
      href={href ?? ''}
      target="_blank"
      className="inline-flex items-center text-sm py-1 px-2 border border-neutral-100 dark:border-neutral-800/50 rounded-full skill-inner-shadow self-end text-black dark:text-white"
    >
      <div className="size-4 flex-shrink-0">{children}</div>
      <p className="ml-1 text-sm ">{name}</p>
    </Link>
  );
}