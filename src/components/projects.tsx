"use client";

import React from "react";
import { useTheme } from "next-themes";
import { SectionHeading } from "./section-heading";
import { LeakyCode } from "./leaky-code";
import { Project, projects as defaultProjects } from "@/constants/projects";
import { ProjectCard } from "./project-card";

export const Projects = ({
  projects = defaultProjects,
}: {
  projects?: Project[];
}) => {
  const { theme } = useTheme();

  return (
    <div className="relative  pb-2 px-12 -mx-12">
      <div className="w-full h-4 bg-[image:repeating-linear-gradient(-315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />
      <div className="w-full border-t border-neutral-100 dark:border-neutral-800/50 ">
        <LeakyCode
          text={`relative text-sm font-normal ${
            theme === "dark" ? "dark:text-neutral-300" : "text-neutral-700"
          }`}
          className="px-4"
        />

        <SectionHeading delay={0.2} className="my-0 px-4">
          <span className="text-pink-300 dark:text-pink-700">*</span>I love
          building things
        </SectionHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 px-8">
        {projects.map((project, idx) => (
          <React.Fragment key={project.title}>
            <ProjectCard project={project} idx={idx} />

            {(idx % 3 === 2 || idx === projects.length - 1) && (
              <div
                aria-hidden
                className="col-span-full  -mx-4"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
