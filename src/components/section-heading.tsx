"use client";

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils';

export const SectionHeading = ({ children, delay=0, className
} : {
  children: string,
  delay?: number,
  className?: string

}) => {
  return (
    <h2 
    className={cn(
      "relative px-1 mt-4 w-fit text-sm font-normal md:text-sm max-w-lg", className)}>
        <Background />
      {children.split(" ").map((word, idx) => (
        <motion.span
          initial={{
            opacity: 0,
            y: 5,
            filter: 'blur(2px)'
          }}
          whileInView={{
            opacity:1,
            y:0,
            filter: 'blur(0px)'
          }}
          transition={{
            delay: delay + idx * 0.05,
            duration: 0.3,
            ease: 'easeInOut',
          }}
          key={word + idx}
          className='inline-block'
          viewport={{once: true}}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </h2>
  )
}

const Background = () => {
  return (
  <motion.div 
    initial={{
      opacity: 0
    }}
    animate={{
      opacity: 1
    }}
    whileInView={{
      opacity: 1
    }}
    transition={{
      duration: 0.3,
      ease: 'easeInOut',
      delay: 1
    }}
    className="absolute inset-0 h-full scale-[1.04] w-full bg-neutral-100">
      <div className="h-1 w-1 rounded-full bg-neutral-200 absolute animate-pulse -top-px -left-px"></div>
      <div className="h-1 w-1 rounded-full bg-neutral-200 absolute animate-pulse -top-px -right-px"></div>
      <div className="h-1 w-1 rounded-full bg-neutral-200 absolute animate-pulse -bottom-px -left-px"></div>
      <div className="h-1 w-1 rounded-full bg-neutral-200 absolute animate-pulse -bottom-px -right-px"></div>
  </motion.div>
  )
}