"use client";

import React from "react";
import { useTheme } from "next-themes";
import { SectionHeading } from "./section-heading";
import { LeakyCode } from "./leaky-code";
import { Project, projects as defaultProjects } from "@/constants/projects";
import { ProjectCard } from "./project-card";
import FloatingCorners from "./ui/floating-corners";

export const Projects = ({
  projects = defaultProjects,
}: {
  projects?: Project[];
}) => {
  const { theme } = useTheme();

  return (
    <div className="relative border-t border-neutral-100 dark:border-neutral-800 mt-12 py-4 px-12 -mx-8">
      <FloatingCorners showBottom={false} />
      <LeakyCode
        text={`relative text-sm font-normal ${
          theme === "dark" ? "dark:text-neutral-300" : "text-neutral-700"
        }`}
        className="px-1"
      />

      <SectionHeading delay={0.2} className="my-1">
        <span className="text-pink-300 dark:text-pink-700">*</span>
        I love building things
      </SectionHeading>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 py-4">
        {projects.map((project, idx) => (
          <ProjectCard key={project.title} project={project} idx={idx} />
        ))}
      </div>
    </div>
  );
};
