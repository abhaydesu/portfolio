"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "motion/react";

type LeakyCodeProps = {
  text: string;
  className?: string
};

// This will orchestrate the children's animations.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
  }),
};

// 2. Define variants for each word
// This is the animation that will be applied to each word.
const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export const LeakyCode = ({ text, className }: LeakyCodeProps) => {
  // 3. Split the text into an array of words
  const words = text.split(" ");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        "mt-8 my-1 text-neutral-200 dark:text-neutral-700 text-xs tracking-tight",
        className
      )}
    >
      {/* 4. Map over the words and animate each one */}
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          style={{ display: "inline-block", marginRight: "0.25em" }} // Keep words separate
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
