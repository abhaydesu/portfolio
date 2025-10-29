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
        className=" flex flex-col items-start justify-start">
      <motion.span
        layoutId="subtext"
        className="text-[var(--color-primary)] text-3xl font-bold tracking-tighter drop-shadow-md md:text-4xl px-4"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className=" w-full mt-2 py-1 overflow-hidden font-sans text-sm text-neutral-400 md:text-xs border-t border-neutral-100 dark:border-neutral-800 px-4"
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
