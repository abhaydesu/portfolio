import { Container } from "@/components/container";
import { Metadata } from "next";
import { getBlogs } from "@/utils/mdx";
import { Link } from "next-view-transitions";
import { Heading } from "@/components/heading";
import { Scales } from "@/components/scales";
import { SectionHeading } from "@/components/section-heading";
import { LeakyCode } from "@/components/leaky-code";

export const metadata: Metadata = {
    title: "Blog | Abhay Singh",
    description: "All my wisdom and shenanigans documented."
};

export default async function BlogsPage() {
    const allBlogs = await getBlogs();

    const truncate = (str: string, length: number) => {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }

    return (
    <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-8 px-8  md:pb-10">
        <Scales />
      <Heading >
        All blogs
      </Heading>
      <SectionHeading className="text-neutral-500 font-normal mx-3">
        my space to document ideas, share experiences, and put learning into words.
      </SectionHeading>
      <LeakyCode text="flex flex-col gap-8 py-10 px-12 border-y" className="pt-10 px-4"/>
      <div className="relative flex flex-col gap-8 pb-10 px-12 border-y border-neutral-100 dark:border-neutral-800 -mx-8">
            {allBlogs.map((blog) => (
                <Link className="no-underline group " key={blog.title} href={`/blog/${blog.slug}`}>
                    <div className="flex items-center justify-between">
                        <h2 className='
                                    text-[var(--color-primary)] text-base font-bold tracking-tight 
                                    relative inline-block 
                                    after:content-[""] after:absolute after:bottom-[-2px] after:left-1/2 after:h-px after:w-0 
                                    after:-translate-x-1/2 after:bg-neutral-300 after:transition-all after:duration-300 
                                    group-hover:after:w-full dark:after:bg-neutral-700
                                '
                            >
                            {blog.title}
                            </h2>
                        <p className="dark:text-neutral-300 text-neutral-700 text-sm md:text-sm">
                            {new Date(blog.date!).toLocaleDateString('en-us', {
                                weekday:"long", year:"numeric", month:"short", day:"numeric"
                            })}
                        </p>
                    </div>
                    <p className="text-[var(--color-secondary)] max-w-lg text-sm md:text-sm">
                        { truncate(blog.description || "", 150) }
                    </p>
                    <div className="pt-0">
                        <div className="flex flex-wrap gap-1.5">
                            {(blog.tags || []).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs font-medium
                                        bg-neutral-100 dark:bg-neutral-800 text-[var(--color-primary)]
                                        hover:scale-105 transition"
                            >
                                {tag}
                            </span>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
      </div>
    </Container>
   </div>
  );
}
