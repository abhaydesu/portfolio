"use client";

import Image from "next/image";
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Project, projects as defaultProjects } from '@/constants/projects';
import { SectionHeading } from "./section-heading";
import { LeakyCode } from "./leaky-code";
import { useTheme } from "next-themes";

export const Projects = ({projects = defaultProjects}: {
    projects?: Project[]
}) => {
    const {theme} = useTheme();
  return (
      <div className="border-y border-neutral-100 dark:border-neutral-800 mt-12 py-4 px-4">
        <LeakyCode text={`relative text-sm font-normal ${theme === 'dark' ? "dark:text-neutral-300" : "text-neutral-700"}`} className="px-1 " />

      <SectionHeading delay={0.2} className="mt-1">
        <span className="text-pink-300 dark:text-pink-700">*</span>I love building things
      </SectionHeading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 py-4">
      {projects.map((project, idx) => (
        <motion.div 
            initial={{ opacity:0, filter: "blur(10px)", y:10}}
            whileInView={{ opacity:1, filter: "blur(0px)", y:0}}
            transition={{
                duration: 0.3,
                delay: idx * 0.1,
                ease: 'easeInOut'
            }}
            key={project.title}
            className='group relative mb-4  flex justify-center align-center '
            viewport={{once: true}}
        >
            <Link target='_blank' href={project.href}>
            <Image 
                src={project.src} 
                alt={project.title} 
                height={100} 
                width={300} 
                className=" w-60 h-34 rounded-xl ojbect-cover mx-auto transition duration-200 group-hover:scale-[1.02]" 
            />    
            <h2 className='z-20 mt-2 md:mx-2 font-medium tracking-tight text-center md:text-left text-neutral-500 dark:text-neutral-400'>
                {project.title} 
            </h2>
            <p className='text-sm max-w-xs md:mx-2 text-center md:text-left mt-2 text-neutral-500 dark:text-neutral-400'>
                {project.description}
            </p>
            </Link>
        </motion.div>
      ))}
      </div>
      
    </div>
  )
}
