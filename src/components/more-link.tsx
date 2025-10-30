import React from "react";
import { Link } from "next-view-transitions"; 
import { IconArrowWaveRightUp } from "./icons";
import { motion } from "framer-motion";

export const More = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
        ease: "easeInOut",
      }}
      viewport={{ once: true }}
      className="border-t border-neutral-100 dark:border-neutral-800 px-4"
    >
      <Link
        href="/projects"
        className="flex gap-2 text-neutral-400 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm md:text-sm ml-1  transition-all duration-400 py-2 md:py-1 w-fit"
      >
        <IconArrowWaveRightUp />
        more
      </Link>
    </motion.div>
  );
};