import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";
import { ErrorBoundary } from "@/components/error-boundary";
import Script from "next/script";

export const viewport: Viewport = {
  // the page opens by day whatever the device prefers, so the browser's bar
  // does too; it follows the toggle from there (components/theme-provider)
  themeColor: "#f7f7f5",
  width: "device-width",
  initialScale: 1,
};

const DESCRIPTION =
  "Abhay Singh (abhaydesu) is a full stack engineer in Bangalore, India, building intentional, detail-driven web interfaces with React, Next.js and TypeScript. Previously a frontend developer intern at Seeqlo; open to new roles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s | ${SITE.name}`,
  },
  description: DESCRIPTION,
  applicationName: `${SITE.name} — Portfolio`,
  keywords: [
    "Abhay Singh",
    "abhaydesu",
    "Full Stack Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Web Developer Bangalore",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfolio",
    "Software Engineer",
    "India",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  category: "technology",
  openGraph: {
    title: `${SITE.name} — ${SITE.role}`,
    description: DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "profile",
    firstName: "Abhay",
    lastName: "Singh",
    username: SITE.handle,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description: DESCRIPTION,
    creator: "@abhaydesu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE.url,
    // the same facts in plain text, for language models (llmstxt.org)
    types: { "text/plain": "/llms.txt" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* the page's own type, wanted for the very first words on it */}
        <link
          rel="preload"
          href="/fonts/Satoshi-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="2bea1071-2be4-4fe2-9d11-bfbc407c2028"
          strategy="lazyOnload"
        />
        <JsonLd />
      </head>
      <body className="antialiased bg-[#f7f7f5] dark:bg-[#080605] [--pattern-fg:var(--color-neutral-950)]/5 dark:[--pattern-fg:var(--color-neutral-100)]/5 transition-colors duration-500 overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          // a first visit always opens by day; a switch to night is
          // remembered for the next
          defaultTheme="light"
          enableSystem={false}
        >
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
