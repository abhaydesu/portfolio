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
    <h2 className={cn("text-secondary text-sm md:text-sm pt-10 max-w-lg", className)}>
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
