"use client";
import { title } from 'process';
import Image from "next/image";
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export const Projects = () => {
    const projects = [
        {
            title: "Dip-Dash",
            src: "/dipdash.png",
            href:"https://dipdash.netlify.app",
            description: "An endless, crossy-road type game, built using three.js"
        },
        {
            title: "Coming soon",
            src: "/dipdash.png",
            href:"#",
            description: "An endless, crossy-road type game, built using three.js"
        },
        {
            title: "Portfolio Website",
            src: "/dipdash.png",
            href:"#",
            description: "This website you're on :)"
        },
        {
            title: "3D Art Gallery",
            src: "/art-gallery.png",
            href:"#",
            description: "A basic showcase of paintings in a 3D manner, built using Three.js"
        }
    ]
  return (
    <div className='py-10'>
        <p className="text-secondary text-sm md:text-sm pt-4 max-w-lg">
        I love building web apps and products that can impact lives.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-4">
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
            className='group relative mb-4 h-72'
        >
            <Link href={project.href}>
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
