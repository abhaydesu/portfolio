import { getBlogs } from "@/utils/mdx";
import React from "react";
import { Link } from "next-view-transitions";
import { SectionHeading } from "./section-heading";
import { MotionDiv } from "./motion-div";

export const LandingBlogs = async () => {
  const allBlogs = await getBlogs();

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
  };
  return (
    <div className="">
      <div className="bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed border-b border-neutral-100 dark:border-neutral-800 w-full h-4"></div>
      <div className="px-4">
        <SectionHeading className="mt-2 mb-4" delay={0.4}>
          <span className="text-pink-300 dark:text-pink-700">*</span>I&apos;m
          fond of writing
        </SectionHeading>
        <div className="flex flex-col gap-8 px-2">
          {allBlogs.slice(0, 3).map((blog, idx) => (
            <MotionDiv
              key={blog.title}
              initial={{
                opacity: 0,
                y: 10,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.3,
                delay: idx * 0.1,
              }}
            >
              <Link href={`/blog/${blog.slug}`} className="group">
                <div className="flex items-center justify-between border border-neutral-100 dark:border-neutral-800 px-2 py-1">
                  <h2
                    className='
    text-[var(--color-primary)] text-base font-bold tracking-tight 
    relative inline-block group-hover:scale-101 transition-all duration-200 dark:after:bg-neutral-700
'
                  >
                    {blog.title}
                  </h2>

                  <p className="text-secondary text-sm md:text-sm">
                    {new Date(blog.date || "").toLocaleDateString("en-us", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="border-x border-b border-neutral-100 dark:border-neutral-800 w-full px-2 py-1 bg-[image:radial-gradient(_var(--pattern-fg)_1px,transparent_1px)] bg-[size:10px_10px]
 bg-fixed">
                <p className="text-secondary max-w-lg pt-2 text-sm md:text-sm ">
                  {truncate(blog.description || "", 120)}
                </p>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
};
