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
  AnimatePresence,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

export const Navbar = () => {
  const navItems = [
    { title: "home", href: "/" },
    { title: "about", href: "/about" },
    { title: "projects", href: "/projects" },
    { title: "contact", href: "/contact" },
    { title: "blog", href: "/blog" },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <Container>
      <motion.nav
        style={navStyles}
        transition={{
          duration: 0.28,
          ease: "linear",
        }}
        className="fixed left-45 right-10 top-0 z-50 flex flex-row-reverse md:flex-row items-center justify-between bg-transparent dark:bg-transparent md:bg-white px-0 py-3 dark:bg-neutral-900 md:inset-x-0 md:mx-auto md:max-w-4xl md:rounded-full md:px-3 md:py-2"

      >
        <Link href="/" className="hidden md:block">
          <Image
            className="h-10 w-10 rounded-full hover:shadow-[0_4px_6px_-1px_rgba(249,168,212,0.5),0_2px_4px_-1px_rgba(249,168,212,0.3)]"
            src="/avatar.jpg"
            height={100}
            width={100}
            alt="Avatar"
          />
        </Link>

        <div className="hidden items-center md:flex">
          {navItems.slice(1).map((item, idx) => (
            <Link
              className="relative px-2 py-1 text-sm"
              href={item.href}
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === idx && (
                <motion.span
                  layoutId="hovered-span"
                  className="absolute inset-0 -z-10 h-full w-full rounded-md bg-pink-100 dark:bg-pink-950"
                />
              )}
              <span className="relative z-10">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 rounded-full shadow-[var(--shadow-aceternity)] p-2 bg-white dark:bg-neutral-800"
            aria-label="Toggle menu"
          >
            <div className="space-y-0.75">
              <span className="block h-0.5 w-3.5 rounded-full bg-neutral-500 dark:bg-white"></span>
              <span className="block h-0.5 w-3.5 rounded-full bg-neutral-500 dark:bg-white"></span>
              <span className="block h-0.5 w-3.5 rounded-full bg-neutral-500 dark:bg-white"></span>
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex h-screen w-full flex-col items-center justify-center pt-16 backdrop-blur-lg [background-image:var(--bg-mobile-menu)]"
          >
            <div className="flex flex-col items-center gap-y-6">
              {navItems.map((item, idx) => (
                <Link
                  href={item.href}
                  key={idx}
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-lg font-medium text-neutral-800 dark:text-neutral-200"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};
