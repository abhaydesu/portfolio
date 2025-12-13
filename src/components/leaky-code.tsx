"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "motion/react";

type LeakyCodeProps = {
  text: string;
  className?: string
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
  }),
};

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
  const words = text.split(" ");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        "mt-8 my-1 text-neutral-200 dark:text-neutral-700 text-xs tracking-tight ",
        className
      )}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          style={{ display: "inline-block", marginRight: "0.25em" }} 
          className="select-none pointer-events-none"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
