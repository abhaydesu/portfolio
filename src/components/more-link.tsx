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
    >
      <Link
        href="/projects"
        className="flex gap-2 text-pink-300 dark:text-pink-700 hover:text-pink-700 dark:hover:text-pink-300 text-sm md:text-sm ml-1 max-w-lg transition-all duration-400"
      >
        <IconArrowWaveRightUp />
        more
      </Link>
    </motion.div>
  );
};