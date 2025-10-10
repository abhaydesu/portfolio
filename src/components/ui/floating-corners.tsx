'use client';

import { motion } from 'framer-motion';
import { Icon } from './Icon';

const cornerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Define the types for your component's props
interface FloatingCornersProps {
  showTop?: boolean;
  showBottom?: boolean;
}

export default function FloatingCorners({
  showTop = true,
  showBottom = true,
}: FloatingCornersProps) {
  return (
    <>
      {/* Conditionally render the top two corners */}
      {showTop && (
        <>
          <motion.span
            className="absolute h-6 w-6 -top-3 left-5 text-neutral-200 dark:text-pink-700"
            variants={cornerVariants}
          >
            <Icon className="h-6 w-6" />
          </motion.span>
          <motion.span
            className="absolute h-6 w-6 -top-3 right-5 text-neutral-200 dark:text-pink-700"
            variants={cornerVariants}
          >
            <Icon className="h-6 w-6" />
          </motion.span>
        </>
      )}

      {/* Conditionally render the bottom two corners */}
      {showBottom && (
        <>
          <motion.span
            className="absolute h-6 w-6 -bottom-3 left-5 text-neutral-200 dark:text-pink-700"
            variants={cornerVariants}
          >
            <Icon className="h-6 w-6" />
          </motion.span>
          <motion.span
            className="absolute h-6 w-6 -bottom-3 right-5 text-neutral-200 dark:text-pink-700"
            variants={cornerVariants}
          >
            <Icon className="h-6 w-6" />
          </motion.span>
        </>
      )}
    </>
  );
}