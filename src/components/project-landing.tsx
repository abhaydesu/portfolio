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
    <div className="border-y border-neutral-100 mt-12 py-4 px-12 dark:border-neutral-800 -mx-8">
      <SectionHeading delay={0.2}>
        <span className="text-pink-300 dark:text-pink-700">*</span> I love building things
      </SectionHeading>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 py-4">
        {projects.slice(0, 3).map((project, idx) => (
          <ProjectCard key={project.title} project={project} idx={idx} />
        ))}
      </div>

      <More />
    </div>
  );
};
