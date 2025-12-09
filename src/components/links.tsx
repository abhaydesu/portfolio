"use client";

import { Link } from "next-view-transitions";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import React, { useState } from "react";

const LINKS = [
  { label: "resume", href: "https://drive.google.com/file/d/1FPs5PQFCjltpJZ91QE5FtF89yyl-fiV1/view?usp=sharing" },
  { label: "linkedin", href: "https://www.linkedin.com/in/abhaydesu/" },
  { label: "github", href: "https://github.com/abhaydesu/" },
  { label: "x", href: "https://www.x.com/abhaydesu/" },
];

export const Links = () => {

  const itemVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 6,
      filter: "blur(5px)",
      transition: { duration: 0.18, delay: i * 0.06, ease: easeInOut },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.22, delay: i * 0.06, ease: easeInOut },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: 6,
      filter: "blur(5px)",
      transition: {
        duration: 0.16,
        delay: (LINKS.length - 1 - i) * 0.04,
        ease: easeInOut,
      },
    }),
  };

  return (
    <div className="mx-4 my-4">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.2, delay: 0.35, ease: easeInOut }}
        viewport={{ once: true }}
        className="relative flex items-start gap-2 text-sm text-pink-300 dark:text-neutral-700"
      >
          
        <div className="flex items-center gap-2">
          <div className="flex gap-2 md:gap-4">
            <AnimatePresence>
              { LINKS.map((lnk, idx) => (
                  <motion.div
                    key={lnk.label}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                    className="flex items-center text-neutral-500 dark:text-neutral-400"
                  >
                    <Link
                      className="hover:text-neutral-700 dark:hover:text-neutral-300"
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lnk.label}
                    </Link>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
