"use client";

import { Link } from "next-view-transitions";
import { AnimatePresence, easeInOut, motion } from "framer-motion"; // Changed import
import React, { useState } from "react";
import { IconLink } from "./icons";

const LINKS = [
  { label: "linkedin", href: "https://www.linkedin.com/in/abhaydesu/" },
  { label: "github", href: "https://github.com/abhaydesu/" },
  { label: "x", href: "https://www.x.com/abhaydesu/" },
];

export const Links = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((s) => !s);

  const itemVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 6,
      filter: "blur(6px)",
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
      filter: "blur(6px)",
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
        className="flex items-start gap-2 text-sm text-pink-700"
      >
        <button
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? "Hide links" : "Show links"}
        >
          <IconLink
            className={`h-3.5 w-3.5 mt-0.5 hover:text-pink-300 ${open ? "text-pink-300" : ""}`}
          />
        </button>

        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <AnimatePresence>
              {open &&
                LINKS.map((lnk, idx) => (
                  <motion.div
                    key={lnk.label}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    exit="exit" 
                    variants={itemVariants}
                    className="flex items-center text-pink-300"
                  >
                    <Link
                      className="hover:text-pink-700"
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