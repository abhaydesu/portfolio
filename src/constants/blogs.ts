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
    const res = await fetch("https://blog.abhaydesu.dev", { next: { revalidate: 3600 } });
    if (!res.ok) return blogs;
    const html = await res.text();
    
    const regex = /<a [^>]*href="(\/blog\/[^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g;
    const fetchedBlogs: BlogPost[] = [];
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const title = match[2].replace(/<[^>]+>/g, "").trim();
      const date = match[3].replace(/<[^>]+>/g, "").trim();
      const description = match[4].replace(/<[^>]+>/g, "").trim();
      
      fetchedBlogs.push({
        title,
        href: `https://blog.abhaydesu.dev${match[1]}`,
        date,
        description,
      });
    }
    
    return fetchedBlogs.length > 0 ? fetchedBlogs : blogs;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return blogs;
  }
}
