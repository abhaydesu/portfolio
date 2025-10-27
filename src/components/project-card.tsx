"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import * as React from "react";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/constants/projects";

type ProjectCardProps = {
  project: Project;
  idx?: number;
};

export function ProjectCard({ project, idx = 0 }: ProjectCardProps) {
  return (
<motion.div
  initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
  transition={{ duration: 0.3, delay: idx * 0.1, ease: "easeInOut" }}
  viewport={{ once: true }}
  className="group relative mb-4 flex flex-col items-center md:items-start rounded-xl border border-neutral-200 transition-all duration-400 dark:border-neutral-800 hover:border-pink-300 hover:dark:border-pink-900 md:py-2 py-8 px-2 "
>
  <Image
    src={project.src}
    alt={project.title}
    height={100}
    width={300}
    className="w-60 h-34 rounded-xl object-cover mx-auto md:px-1 md:pt-1 mb-5 md:grayscale-30 md:group-hover:grayscale-0 transition-all duration-300"
  />

  <div className="border-t border-dashed border-neutral-200 dark:border-neutral-700 w-full" />

  <div className="flex items-center justify-center md:justify-between w-full mt-3 px-1">
    <h2
      className="
        relative font-medium tracking-tight text-neutral-600 dark:text-neutral-300 
        text-center md:text-left inline-block
        group-hover:after:w-full group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition
      "
    >
      {project.title}
    </h2>

    <div className="flex items-center gap-2 ml-2">
      {project.href && (
        <TooltipIcon label="View live">
          <Link
            href={project.href}
            target="_blank"
            aria-label="View live"
            className="p-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60 hover:scale-110 transition group-hover:animate-jiggle"
          >
            <ExternalLink
              size={16}
              className="text-neutral-500 dark:text-neutral-400"
            />
          </Link>
        </TooltipIcon>
      )}

      {project.github && (
        <TooltipIcon label="View github">
          <Link
            href={project.github}
            target="_blank"
            aria-label="View on GitHub"
            className="p-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60 hover:scale-110 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.107-.775.418-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.045.137 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.652.242 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.806 5.624-5.478 5.922.43.372.814 1.103.814 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </TooltipIcon>
      )}
    </div>
  </div>

  <p className="text-sm max-w-xs mt-2 text-neutral-500 dark:text-neutral-400 text-center md:text-left mb-6 md:px-1 px-10">
    {project.description}
  </p>

  <div className="flex flex-wrap justify-center md:justify-start md:my-1.5 md:px-0 px-5">
    {project.tech.map((tech, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
        viewport={{ once: true }}
        className="px-2 py-0.5 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800/70 
          text-neutral-500 dark:text-neutral-300
          border border-neutral-200/70 dark:border-neutral-700/50
          hover:bg-pink-100/50 dark:hover:bg-pink-900/20
          transition-colors mx-1 mt-2"
      >
        {tech}
      </motion.span>
    ))}
  </div>
</motion.div>

  );
}

function TooltipIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative inline-flex group/tt">
      {children}
      <div
        role="presentation"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
          whitespace-nowrap rounded-md bg-neutral-950 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-950 text-xs 
          px-2 py-1 opacity-0 group-hover/tt:opacity-100
          transition-opacity duration-150 shadow-lg"
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 
          border-4 border-transparent border-t-neutral-950 dark:border-t-neutral-100" />
      </div>
    </div>
  );
}
