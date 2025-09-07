import { Container } from "@/components/container";
import { Metadata } from "next";
import { getBlogs } from "@/utils/mdx";
import { Link } from "next-view-transitions";
import { Heading } from "@/components/heading";
import { Scales } from "@/components/scales";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
    title: "All blogs - Abhay Singh",
    description: "All my wisdom and shenanigans documented."
};

export default async function BlogsPage() {
    const allBlogs = await getBlogs();

    const truncate = (str: string, length: number) => {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }

    console.log(allBlogs);
    return (
    <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-16 px-8 md:pt-20 md:pb-10">
        <Scales />
      <Heading >
        All blogs
      </Heading>
      <SectionHeading className="text-neutral-500 font-normal mx-5 ">
        My space to document ideas, share experiences, and put learning into words.
      </SectionHeading>
      <div className="flex flex-col gap-8 py-10 px-4">
            {allBlogs.map((blog) => (
                <Link className="no-underline" key={blog.title} href={`/blog/${blog.slug}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="hover:underline hover:decoration-pink-300 dark:hover:decoration-pink-800 text-[var(--color-primary)] text-base font-bold tracking-tight">
                            {blog.title}
                        </h2> 
                        <p className="text-pink-300 text-sm md:text-sm">
                            {new Date(blog.date!).toLocaleDateString('en-us', {
                                weekday:"long", year:"numeric", month:"short", day:"numeric"
                            })}
                        </p>
                    </div>
                    <p className="text-[var(--color-secondary)] max-w-lg pt-1 text-sm md:text-sm">
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
