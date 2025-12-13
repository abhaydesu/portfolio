"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Globe, ChevronDown } from "lucide-react";

import { type Experience } from "@/config/experience";
import { cn } from "@/lib/utils";

import Skill from "../common/skills";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "../icons";

interface ExperienceCardProps {
  experience: Experience;
}

type IconLinkProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

const IconLink = ({ href, label, children }: IconLinkProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="inline-flex size-6 items-center justify-center rounded-full border border-transparent text-neutral-400 hover:text-neutral-700 transition-all duration-200 dark:text-neutral-400 dark:hover:text-neutral-200 "
      >
        {children}
      </Link>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        side="top"
        align="center"
        sideOffset={0}
        className="rounded-md bg-neutral-900 px-2 py-1 text-xs text-neutral-100  dark:bg-neutral-100 dark:text-neutral-900"
      >
        {label}
        <Tooltip.Arrow className="fill-neutral-900 dark:fill-neutral-100" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
);

const formatDescription = (text: string) => {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith("*") && segment.endsWith("*")) {
        return (
          <span
            key={`${segment}-${index}`}
            className="font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {segment.slice(1, -1)}
          </span>
        );
      }

      return <span key={`${segment}-${index}`}>{segment}</span>;
    });
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const timeline = `${experience.startDate} — ${
    experience.isCurrent ? "Present" : experience.endDate
  }`;

  const socialLinks = [
    experience.website && {
      href: experience.website,
      label: "Visit website",
      icon: <Globe size={15}  />,
    },
    experience.x && {
      href: experience.x,
      label: "View on X",
      icon: <IconBrandX className="size-4" />,
    },
    experience.linkedin && {
      href: experience.linkedin,
      label: "View on LinkedIn",
      icon: <IconBrandLinkedin className="size-4" />,
    },
    experience.github && {
      href: experience.github,
      label: "View on GitHub",
      icon: <IconBrandGithub className="size-4" />,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
  }>;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.35 }}
      className="group relative overflow-hidden mx-4 px-6 py-4 rounded-xl border border-neutral-100 dark:border-neutral-800/50 hover:border-neutral-400 hover:border-dashed dark:hover:border-neutral-700 transition-all duration-300"
    >
      <div className="relative flex flex-col gap-2">
        <header
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex cursor-pointer flex-col gap-0 md:flex-row md:items-start md:justify-between"
        >
          <div className="flex items-start gap-4">
              <Image
                src={experience.image}
                alt={experience.company}
                width={64}
                height={64}
                className="relative size-8 rounded-full"
              />
            <div className="flex flex-col ">
              <div className="flex flex-row flex-wrap items-center ">
                <h3
                  className={cn(
                    "tracking-tight text-neutral-900 dark:text-neutral-200 group-hover:tracking-normal transition-all duration-300 ease-out",
                    experience.isBlur && "blur-[5px]"
                  )}
                >
                  {experience.company}
                </h3>
                {socialLinks.length > 0 && (
                <Tooltip.Provider delayDuration={120}>
                  <div className="flex items-center ml-1">
                    {socialLinks.map(({ href, label, icon }) => (
                      <IconLink key={href} href={href} label={label}>
                        {icon}
                      </IconLink>
                    ))}
                  </div>
                </Tooltip.Provider>
              )}
              <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              <ChevronDown size={18} className="text-neutral-400" />
            </motion.div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {experience.position}
              </p>
             
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-xs  uppercase tracking-[0.2em] text-neutral-500/90 dark:text-neutral-500 md:items-end">
            <span>{timeline}</span>
            <span className="text-[11px] normal-case tracking-normal text-neutral-500/80 dark:text-neutral-400">
              {experience.location}
            </span>
            
          </div>
        </header>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-4 overflow-hidden"
            >
          <div className="space-y-2">
            <span className="text-xs  text-neutral-500/70 dark:text-neutral-500">
              Technologies
            </span>
            <div className="flex flex-wrap gap-2 grayscale-35">
              {experience.technologies.map((technology, techIndex) => (
                <Skill
                  key={`${technology.name}-${techIndex}`}
                  name={technology.name}
                  href={technology.href}
                >
                  {technology.icon}
                </Skill>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs  tracking-wide text-neutral-500/70 dark:text-neutral-500">
              Highlights
            </span>
            <ul className="space-y-2">
              {experience.description.map((description, index) => (
                <motion.li
                  key={`desc-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative pl-5 text-sm leading-relaxed text-neutral-600 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-neutral-400/70 before:content-[''] dark:text-neutral-300 dark:before:bg-neutral-500/60"
                >
                  {formatDescription(description)}
                </motion.li>
              ))}
            </ul>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
