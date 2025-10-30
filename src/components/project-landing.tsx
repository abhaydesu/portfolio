"use client";

import React from "react";
import { Project, projects as defaultProjects } from "@/constants/projects";
import { SectionHeading } from "./section-heading";
import { More } from "./more-link";
import { ProjectCard } from "./project-card";

export const ProjectLanding = ({
  projects = defaultProjects,
}: {
  projects?: Project[];
}) => {
  return (
    <div className="relative border-y border-neutral-100 mt-2 px-8 dark:border-neutral-800 -mx-8">
      <div className="border-b border-neutral-100 dark:border-neutral-800 h-4 bg-[image:repeating-linear-gradient(-315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
      <div className="w-full border-b border-neutral-100 dark:border-neutral-800 px-4 pb-2">
      <SectionHeading delay={0.2} className="mt-2 ">
        <span className="text-pink-300 dark:text-pink-700">*</span> proof of work
      </SectionHeading>
</div>
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-3 border-neutral-100 dark:border-neutral-800 -mx-4 px-8 ">
        {projects.slice(0, 3).map((project, idx) => (
          <ProjectCard key={project.title} project={project} idx={idx} />
        ))}
      </div>

      <More />
    </div>
  );
};
