import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "../globals.css";
import { Container } from "@/components/container";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"]})

export const metadata: Metadata = {
  title: "Portfolio website",
  description: "A perfect portfolio that showcases your skills, minimal and smooth microinteractions, perfect for developers.",
};  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className="min-h-screen prose">
        {children}
    </Container>
  );
}
 