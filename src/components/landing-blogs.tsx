import { getBlogs } from '@/utils/mdx'
import React from 'react'
import { Link } from 'next-view-transitions';
import { SectionHeading } from './section-heading';
import { MotionDiv } from './motion-div';

export const LandingBlogs = async () => {
    const allBlogs = await getBlogs();

    const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
    }
  return (
    <div className='px-4 py-4'>
        <SectionHeading className='my-4' delay={0.4}>
            *i&apos;m fond of writing.
        </SectionHeading>
        <div className='flex flex-col gap-8'>
            {allBlogs.slice(0,3).map((blog,idx) => (
                <MotionDiv
                    key={blog.title}
                    initial={{
                        opacity: 0,
                        y:10,
                        filter: 'blur(10px)'
                    }}
                    animate={{
                        opacity:1,
                        y:0,
                        filter: 'blur(0px)'
                    }}
                    transition={{
                        duration: 0.3,
                        delay: idx * 0.1
                    }}
                >
                <Link href={`/blog/${blog.slug}`}>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[var(--color-primary)] text-base font-bold tracking-tight'>
                            {blog.title}
                        </h2>
                        <p className='text-secondary text-sm md:text-sm'>
                            {new Date(blog.date || "").toLocaleDateString("en-us",{
                                weekday: "long",
                                year: "numeric", 
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <p className='text-secondary max-w-lg pt-2 text-sm md:text-sm'>
                            {truncate(blog.description || "", 120)}
                    </p>
                </Link>
                </MotionDiv>
            ))}
        </div>
    </div>
  )
}
