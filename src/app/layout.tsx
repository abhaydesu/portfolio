import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { Footer } from "@/components/navbar/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import { JsonLd } from "@/components/json-ld";
import { ErrorBoundary } from "@/components/error-boundary";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080605" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://abhaydesu.dev"),
  title: {
    default: "Abhay Singh — Full Stack Web Developer",
    template: "%s | Abhay Singh",
  },
  description:
    "Abhay Singh is a Full Stack Web Developer and designer building minimal, high-performance web applications with Next.js, React, TypeScript, and smooth micro-interactions.",
  keywords: [
    "Abhay Singh",
    "abhaydesu",
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "Three.js",
    "Portfolio",
    "Software Engineer",
    "India",
  ],
  authors: [{ name: "Abhay Singh", url: "https://abhaydesu.dev" }],
  creator: "Abhay Singh",
  openGraph: {
    title: "Abhay Singh — Full Stack Web Developer",
    description:
      "Full Stack Web Developer crafting minimal and smooth micro-interactions with Next.js, React, and TypeScript.",
    url: "https://abhaydesu.dev",
    siteName: "Abhay Singh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhay Singh — Full Stack Web Developer",
    description:
      "Full Stack Web Developer crafting minimal and smooth micro-interactions with Next.js, React, and TypeScript.",
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
    canonical: "https://abhaydesu.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="2bea1071-2be4-4fe2-9d11-bfbc407c2028"
            strategy="lazyOnload"
          />
          <JsonLd />
        </head>
        <body
          className="antialiased bg-white dark:bg-[#080605] [--pattern-fg:var(--color-neutral-950)]/5 dark:[--pattern-fg:var(--color-neutral-100)]/5 transition-colors duration-500"
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <ErrorBoundary>
              <Navbar />
              {children}
              <Footer />
            </ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
