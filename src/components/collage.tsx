"use client";

import React, { useEffect, useState,useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {useInView} from 'motion/react';
import { SectionHeading } from "./section-heading";
import { LeakyCode } from "./leaky-code";
import { useTheme } from "next-themes";


const sketches = [
  { src: "/sketch-1.jpg", alt: "Sketch 1" },
  { src: "/sketch4.jpg", alt: "Sketch 2" },
  { src: "/sketch-2.jpg", alt: "Sketch 3" },
  { src: "/sketch-3.jpg", alt: "Sketch 4" },
];

const photos = [
  { src: "/photo-3.jpg", alt: "Photo 1" },
  { src: "/photo-5.jpg", alt: "Photo 2" },
  { src: "/photo-2.jpg", alt: "Photo 3" },
  { src: "/photo-4.jpg", alt: "Photo 4" },
];

export const Collage = () => {
  const ref = useRef<HTMLDivElement>(null);
   const isInView = useInView(ref, { once: true, amount: 0.6});

  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { theme } = useTheme();

  return (
    <section className="px-12 py-4 mt-12 border-y border-neutral-100 dark:border-neutral-800 -mx-8">
        <LeakyCode text={`relative text-sm font-normal ${theme === 'dark' ? "dark:text-neutral-300" : "text-neutral-700"}`} className="px-1 " />
      
      <SectionHeading className="max-w-lg pt-0 text-sm md:text-sm mb-6 mt-1">
        <span className="text-pink-300 dark:text-pink-700">*</span>a creative outlet
      </SectionHeading>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <motion.h2
          initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                }}
                animate={{
                    filter: isInView ? 'blur(0px)' : 'blur(10px)',
                    opacity: isInView ? 1 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    delay: 0.1
                }} 
            className="text-[var(--color-primary)] pb-2 text-base font-bold tracking-tight">
              sketches
            </motion.h2>
          <div className="grid grid-cols-2 gap-4">
            {sketches.map((img, i) => (
              <motion.div
                initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 10
                }}
                animate={{
                    filter: isInView ? 'blur(0px)' : 'blur(10px)',
                    opacity: isInView ? 1 : 0,
                    y: 0
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    delay: (i>2) ? 0.4 : 0.2
                }}
                viewport={{once: true}}
                key={i}
                className="relative w-full aspect-square overflow-hidden rounded-xl hover:border border-pink-300 dark:border-pink-700 transition ease-in"
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover grayscale-60 md:grayscale hover:grayscale-0 transition duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <motion.h2
          initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                }}
                animate={{
                    filter: isInView ? 'blur(0px)' : 'blur(10px)',
                    opacity: isInView ? 1 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    delay: 0.1
                }} 
            className="text-[var(--color-primary)] pb-2 text-base font-bold tracking-tight">
              photos
            </motion.h2>
          <div className="grid grid-cols-2 gap-4">
            {photos.map((img, i) => (
              <motion.div
                initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 10
                }}
                animate={{
                    filter: isInView ? 'blur(0px)' : 'blur(10px)',
                    opacity: isInView ? 1 : 0,
                    y: 0
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    delay: 0.2 * (i%2)
                }}
                key={i}
                className="relative w-full aspect-square overflow-hidden rounded-xl hover:border border-pink-300 dark:border-pink-700 transition ease-in"
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover grayscale-60 md:grayscale hover:grayscale-0 transition duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              key="content"
              className="relative max-w-3xl w-full p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute top-4 right-4 z-60 text-pink-300 dark:text-pink-700 text-3xl font-bold leading-none hover:text-pink-700 dark:hover:text-pink-300 cursor-pointer"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <div className="relative w-full h-[80vh]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
