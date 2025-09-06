"use client";

import React from "react";
import { motion } from "framer-motion";

export const MotionDiv = (
  props: React.ComponentProps<typeof motion.div>
) => {
  return <motion.div {...props} />;
};
