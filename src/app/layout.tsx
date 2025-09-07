import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { ViewTransitions } from 'next-view-transitions'
import "./globals.css";
import { Footer } from "@/components/navbar/footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

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
      <body className={`${inter.className} antialiased bg-neutral-100 dark:bg-black [--pattern-fg:var(--color-neutral-950)]/5  dark:[--pattern-fg:var(--color-neutral-100)]/5 transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Toaster position="top-center"/>
        <Navbar />
        {children}
        <Footer />
        </ThemeProvider>
      </body>
    </html>
    </ViewTransitions>
  );
}
