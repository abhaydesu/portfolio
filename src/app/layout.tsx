import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { ViewTransitions } from 'next-view-transitions'
import "./globals.css";
import { Footer } from "@/components/navbar/footer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"]})

export const metadata: Metadata = {
  title: "Abhay's Portfolio",
  description: "A perfect portfolio that showcases my skills, with minimal and smooth microinteractions.",
};  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-neutral-100 dark:bg-neutral-700 [--pattern-fg:var(--color-neutral-950)]/5`}>
        <Toaster position="top-center"/>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
    </ViewTransitions>
  );
}
