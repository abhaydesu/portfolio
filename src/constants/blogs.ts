export type BlogPost = {
  title: string;
  href: string;
  description: string;
  date: string;
};

export const blogs: BlogPost[] = [
  {
    title: "How I type 120+ wpm",
    href: "https://blog.abhaydesu.dev/blog/improve-typing-speed",
    description:
      "Learn how to type fast with simple techniques, daily practice routines and the right mindset.",
    date: "2025-09-20",
  },
];

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch("https://blog.abhaydesu.dev/api/posts", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return blogs;

    const data: BlogPost[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return blogs;

    const formattedBlogs = data.map((post) => ({
      ...post,
      href: post.href.startsWith("http")
        ? post.href
        : `https://blog.abhaydesu.dev${post.href}`,
    }));

    return formattedBlogs;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return blogs;
  }
}
