"use client";

import Image from "next/image";
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Project, projects as defaultProjects } from '@/constants/projects';

export const Projects = ({projects = defaultProjects}: {
    projects?: Project[]
}) => {
    
  return (
    <div className='py-10'>
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
            className='group relative mt-10 h-45'
            viewport={{once: true}}
        >
            <Link target='_blank' href={project.href}>
            <Image 
                src={project.src} 
                alt={project.title} 
                height={300} 
                width={300} 
                className="w-full rounded-xl ojbect-cover transition duration-200 group-hover:scale-[1.02]" 
            />    
            <h2 className='z-20 mt-2 font-medium tracking-tight text-neutral-500 dark:text-neutral-400'>
                {project.title} 
            </h2>
            <p className='text-sm max-w-xs mt-2 text-neutral-500 dark:text-neutral-400'>
                {project.description}
            </p>
            </Link>
        </motion.div>
      ))}
      </div>
      
    </div>
  )
}
