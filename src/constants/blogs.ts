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
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) return blogs;
    
    const fetchedBlogs: BlogPost[] = await res.json();
    
    // Ensure all hrefs are absolute since they link out from the portfolio
    const formattedBlogs = fetchedBlogs.map(blog => ({
      ...blog,
      href: blog.href.startsWith("http") 
        ? blog.href 
        : `https://blog.abhaydesu.dev${blog.href.startsWith("/") ? "" : "/"}${blog.href}`
    }));
    
    return formattedBlogs.length > 0 ? formattedBlogs : blogs;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return blogs;
  }
}
