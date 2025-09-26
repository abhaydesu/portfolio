"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0, filter: "blur(10px)", y: 10}}
        whileInView={{ opacity:1, filter: "blur(0px)", y:0}}
        transition={{
            duration:0.3,
            ease: 'easeInOut'
        }}
        viewport={{once: true}}
        className="px-4 flex md:items-center flex-col md:flex-row">
      <motion.span
        layoutId="subtext"
        className="text-[var(--color-primary)] text-2xl font-bold tracking-tighter drop-shadow-md md:text-4xl"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit md:mx-4 my-2 overflow-hidden rounded-md border border-transparent bg-white px-2 py-1 font-sans text-sm text-pink-400 dark:text-pink-600 shadow-sm ring shadow-black/10 ring-black/10 md:text-xs hover:drop-shadow-sm dark:bg-neutral-900 dark:shadow-sm dark:ring-1 dark:shadow-white/10 dark:ring-white/10"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -10, filter: "blur(5px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 10, filter: "blur(5px)", opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
            className={cn("inline-block whitespace-nowrap")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.div>
  );
};
