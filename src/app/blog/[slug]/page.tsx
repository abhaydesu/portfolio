import { Container } from "@/components/container";
import { Metadata } from "next";
import { getSingleBlog, getBlogFrontMatterBySlug } from "@/utils/mdx";
import { redirect } from "next/navigation";
import { Scales } from "@/components/scales";

export async function generateMetadata({
    params,
}: {
    params: { slug: string};
}) {
    const frontmatter = await getBlogFrontMatterBySlug(params.slug);

    if (!frontmatter) {
        return {
            title: "Blog not found",
        };
    }

    return {
        title: frontmatter.title + " by Abhay Singh",
        description: frontmatter.description
    }
}


export default async function SingleBlogPage({
    params,
}: {
    params: {
        slug: string;
    };
}) {
    const slug = params.slug;
    const blog = await getSingleBlog(slug);

    if (!blog) {
        redirect('/blog')
    }

    const { content, frontmatter } = blog;
    console.log(frontmatter);

  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen px-8 md:pt-20 md:pb-10">
        <Scales />
        <img
        src={frontmatter.image} 
        alt={frontmatter.title}
        className="rounded-2xl object-cover mx-auto mb-20 max-h-96 max-w-2xl w-full shadow-2xl"
        />
        <div className="prose mx-auto">
            {content}
        </div>
    </Container>
   </div>
  );
}
