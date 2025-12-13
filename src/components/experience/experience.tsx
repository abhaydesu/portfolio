import { type Experience, experiences } from "@/config/experience";
import React from "react";
import { ExperienceCard } from "./experience-card";
import { SectionHeading } from "../section-heading";

export default function Experience() {
  return (
    <div className="border-b border-neutral-100 dark:border-neutral-800/50 ">
      <div className="bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed border-b border-neutral-100 dark:border-neutral-800/50  w-full h-4" />
      <div className="-mx-4 px-4 py-4">
        <SectionHeading className=" mt-2 mb-2" delay={0.4}>
          <span className="text-pink-300 dark:text-pink-700">*</span>
          work experience
        </SectionHeading>
        <div className="mt-4 flex flex-col gap-8">
          {experiences.slice(0, 2).map((experience: Experience) => (
            <ExperienceCard key={experience.company} experience={experience} />
          ))}
        </div>
        {/* <div className="mt-8 flex justify-center">
        <button >
          <Link href="/work-experience">Show all work experiences</Link>
        </button>
      </div> */}
      </div>
    </div>
  );
}
