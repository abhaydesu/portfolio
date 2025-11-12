"use client";

import React from "react";
import { Link } from "next-view-transitions";
import { IconArrowWaveRightUp } from "./icons";
import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { MotionDiv } from "./motion-div";

export const LandingBlogs = () => {
  const blogs = [
    {
      title: "How I type 120+ wpm",
      href: "https://blog.abhaydesu.dev/blog/improve-typing-speed",
      description: "Learn how to type fast with simple techinques, daily practice routines and the right mindset. ",
      date: "2025-09-20",
    },
  ];

  const truncate = (str: string, length: number) =>
    str.length > length ? str.substring(0, length) + "..." : str;

  return (
    <div>
      <div className="bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed border-b border-neutral-100 dark:border-neutral-800 w-full h-4" />

      <div className="px-4">
        <SectionHeading className="mt-2 mb-2" delay={0.4}>
          <span className="text-pink-300 dark:text-pink-700">*</span>
          I&apos;m fond of writing
        </SectionHeading>

        <div className="flex flex-col gap-8 border-t border-neutral-100 dark:border-neutral-800 pt-4 -mx-4 px-4">
          {blogs.slice(0, 3).map((blog, idx) => (
            <MotionDiv
              key={blog.href}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <a
                href={blog.href}
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 hover:border-neutral-400 hover:dark:border-neutral-600  transition-all duration-400 ">
                <div className="flex items-center justify-between  ">
                  <h2 className="text-[var(--color-primary)] text-base font-bold tracking-tight relative inline-block group-hover:scale-101 transition-all duration-200 dark:after:bg-neutral-700">
                    {blog.title}
                  </h2>

                  <p className="text-secondary text-sm md:text-sm">
                    {blog.date
                      ? new Date(blog.date).toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </div>
                

                <div className="w-full ">
                  <p className="text-secondary max-w-lg pt-2 text-sm md:text-sm">
                    {truncate(blog.description || "", 120)}
                  </p>
                </div>
                </div>
              </a>

            </MotionDiv>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.2,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className="border-t border-neutral-100 dark:border-neutral-800 mt-4 -mx-4 px-4"
        >
          <Link
            href="https://blog.abhaydesu.dev"
            target="_blank"
            className="flex gap-2 text-neutral-400 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm md:text-sm ml-1  transition-all duration-400 py-2 md:py-1 w-fit"
          >
            <IconArrowWaveRightUp />
            more
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
