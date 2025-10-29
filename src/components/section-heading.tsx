"use client";

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils';

export const SectionHeading = ({ children, delay=0, className
} : {
  children: React.ReactNode,
  delay?: number,
  className?: string

}) => {

   const parts = React.Children.toArray(children);

  let idxCounter = 0;

  return (
    <h2
      className={cn(
        "relative px-1 mt-4 w-fit text-sm font-normal dark:text-neutral-300 text-neutral-700 md:text-sm max-w-lg",
        className
      )}
    >

      {parts.flatMap((part) => {
        if (typeof part === "string") {
          const words = part.trim().split(/\s+/).filter(Boolean);
          return words.map((word) => {
            const k = `w-${word}-${idxCounter++}`;
            return (
              
              <motion.span
                key={k}
                initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: delay + idxCounter * 0.05,
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="inline-block"
                viewport={{ once: true }}
              >
                {word}&nbsp;
              </motion.span>
            );
          });
        }

        const k = `node-${idxCounter++}`;
        return (
          <motion.span
            key={k}
            initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: delay + idxCounter * 0.05,
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="inline-block"
            viewport={{ once: true }}
          >
            {part}&nbsp;
          </motion.span>
        );
      })}
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
    className="absolute inset-0 h-full scale-[1.04] w-full bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300">
      <div className="h-1 w-1 rounded-full absolute bg-pink-100 dark:bg-pink-300 animate-pulse -top-px -left-px"></div>
      <div className="h-1 w-1 rounded-full absolute bg-pink-100 dark:bg-pink-300 animate-pulse -top-px -right-px"></div>
      <div className="h-1 w-1 rounded-full absolute bg-pink-100 dark:bg-pink-300 animate-pulse -bottom-px -left-px"></div>
      <div className="h-1 w-1 rounded-full absolute bg-pink-100 dark:bg-pink-300 animate-pulse -bottom-px -right-px"></div>
  </motion.div>
  )
}