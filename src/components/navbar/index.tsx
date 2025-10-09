"use client";
import React, { useState } from "react";
import { Container } from "../container";
import Image from "next/image";
import { Link } from "next-view-transitions";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ThemeToggle } from "../theme-toggle";
import { useTheme } from "next-themes";
import { Home, User, FolderGit2, FileText, Mail, NotebookPen, Laptop, PersonStanding } from "lucide-react";

export const Navbar = () => {
  const { theme } = useTheme();

  const navItems = [
    { title: "home", href: "/", icon: Home },
    { title: "about", href: "/about", icon: PersonStanding },
    { title: "projects", href: "/projects", icon: Laptop },
    { title: "blog", href: "/blog", icon: NotebookPen },
    { title: "contact", href: "/contact", icon: Mail },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const y = useTransform(scrollY, [0, 100], [0, 10]);
  const width = useTransform(scrollY, [0, 100], ["43.15%", "38%"]);
  const opacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navStyles = isDesktop
    ? {
        boxShadow: scrolled ? "var(--shadow-aceternity)" : "none",
        width,
        y,
        opacity,
      }
    : {
        boxShadow: scrolled ? "none" : "none",
      };

  return (
    <>
      <Container>
        <motion.nav
          style={navStyles}
          transition={{ duration: 0.28, ease: "linear" }}
          className={`
                      fixed 
                      left-45 right-10 top-0 z-50 
                      flex flex-row-reverse md:flex-row 
                      items-center justify-between 
                      md:bg-white/30 md:dark:bg-neutral-900/20 
                      md:backdrop-blur-md
                      px-0 py-3 
                      md:inset-x-0 md:mx-auto md:max-w-4xl 
                      md:rounded-full md:px-3 md:py-2 
                      transition-colors duration-500
                    `}
        >
          <Link href="/" className="hidden md:block">
            <Image
              className="h-10 w-10 rounded-full hover:scale-102"
              src="/avatar.jpg"
              height={100}
              width={100}
              alt="Avatar"
            />
          </Link>

          <div className="hidden items-center md:flex">
            {navItems.slice(1).map((item, idx) => (
              <React.Fragment key={idx}>
                {item.title === "about" && (
                  <div className="mr-2">
                    <ThemeToggle />
                  </div>
                )}
                <Link
                  className="relative px-2 py-1 text-sm"
                  href={item.href}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === idx && (
                    <motion.span
                      layoutId="hovered-span"
                      className="absolute inset-0 -z-10 h-full w-full rounded-md bg-pink-100 dark:bg-pink-950 transition-colors duration-500"
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                </Link>
              </React.Fragment>
            ))}
          </div>

          <div className="md:hidden">
            <nav className="fixed bottom-13 left-1/2 z-50 w-[75%] -translate-x-1/2 rounded-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md px-2 py-1.5 shadow-[var(--shadow-aceternity)]">
              <div className="flex items-center justify-around">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      onMouseEnter={() => setHovered(idx)}
                      onMouseLeave={() => setHovered(null)}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex flex-col items-center justify-center px-2 py-1"
                    >
                      <Link
                        href={item.href}
                        className="text-neutral-700 dark:text-neutral-200"
                      >
                        <Icon size={20} strokeWidth={1.5} />
                      </Link>
                      {hovered === idx && (
                        <motion.span
                          layoutId="dock-hover"
                          className="absolute inset-0 rounded-xl bg-pink-100/60 dark:bg-pink-950/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
                <div className="flex items-center justify-center px-2 py-1">
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </div>
        </motion.nav>
      </Container>
    </>
  );
};

export default Navbar;
