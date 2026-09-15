"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Moon, MoveUpRight, Sun } from "lucide-react";
import { play } from "cuelume";
import { Container } from "../container";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useTransitionRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "h") {
        router.push("/");
      } else if (key === "p") {
        router.push("/projects");
      } else if (key === "a") {
        router.push("/about");
      } else if (key === "b") {
        window.open("https://blog.abhaydesu.dev", "_blank", "noopener,noreferrer");
      } else if (key === "t") {
        setTheme(theme === "dark" ? "light" : "dark");
        play("toggle");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, theme, setTheme]);

  const navItems = [
    { title: "[h]ome", href: "/", new: "_self" },
    { title: "[p]rojects", href: "/projects", new: "_self" },
    { title: "[a]bout", href: "/about", new: "_self" },
    {
      title: "[b]log",
      href: "https://blog.abhaydesu.dev",
      new: "_blank",
      icon: MoveUpRight,
    },
  ];

  return (
    <header
      className={`
        sticky top-0 z-50 max-w-4xl mx-auto
        backdrop-blur supports-[backdrop-filter]:backdrop-blur
        bg-neutral-100/70 dark:bg-black/40
        
        transition-shadow duration-300
        ${scrolled ? "shadow-[0_1px_1px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_1px_rgba(255,255,255,0.1)]" : "border-b border-neutral-100 dark:border-neutral-800/50"}
      `}
    >
      <Container className="px-12 py-1">
        <div className="flex items-center justify-center w-full">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <div
                key={item.title}
                className="relative flex flex-col items-center justify-center"
              >
                <Link
                  href={item.href}
                  target={item.new}
                  rel={
                    item.new === "_blank" ? "noopener noreferrer" : undefined
                  }
                  data-cuelume-hover="tick"
                  className={`flex items-center justify-center gap-2 rounded-full transition-all px-4 py-2 cursor-pointer ${
                    isActive
                      ? "hover:text-neutral-800 hover:font-bold dark:text-neutral-200 font-semibold text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                  }`}
                >
                  <AnimatePresence>
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap inline-flex items-center gap-1"
                    >
                      {item.title}
                      {item.icon && (
                        <span>
                          <item.icon className="inline h-3 w-3" />
                        </span>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </Link>
              </div>
            );
          })}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Theme [t]"
            aria-label={theme === "dark" ? "Switch to light mode (press t)" : "Switch to dark mode (press t)"}
            data-cuelume-toggle
            className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-200 transition-all px-4 py-2 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun size={18} strokeWidth={1.6} />
            ) : (
              <Moon size={18} strokeWidth={1.6} />
            )}
          </button>
        </div>
      </Container>
    </header>
  );
};
