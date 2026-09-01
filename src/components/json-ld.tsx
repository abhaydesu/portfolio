import React from "react";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://abhaydesu.dev/#person",
        name: "Abhay Singh",
        alternateName: "abhaydesu",
        url: "https://abhaydesu.dev",
        image: "https://abhaydesu.dev/avatar.jpg",
        sameAs: [
          "https://github.com/abhaydesu",
          "https://x.com/abhaydesu",
          "https://linkedin.com/in/abhaydesu",
          "https://blog.abhaydesu.dev",
        ],
        jobTitle: "Full Stack Web Developer",
        description:
          "Full Stack Web Developer crafting minimal and smooth micro-interactions with Next.js, React, and TypeScript.",
      },
      {
        "@type": "WebSite",
        "@id": "https://abhaydesu.dev/#website",
        url: "https://abhaydesu.dev",
        name: "Abhay Singh — Portfolio",
        description:
          "Personal portfolio of Abhay Singh showcasing projects, skills, and writing.",
        publisher: {
          "@id": "https://abhaydesu.dev/#person",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
