"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "next-view-transitions";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Scales } from "../scales";
import { Moon, MoveUpRight, Sun } from "lucide-react";
import { Container } from "../container";

export const NavbarNew = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "home", href: "/", new: "_self" },
    { title: "projects", href: "/projects", new: "_self" },
    { title: "about", href: "/about", new: "_self" },
    {
      title: "blog",
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
        ${scrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(255,255,255,0.1)]" : "border-b border-neutral-100 dark:border-neutral-800"}
      `}
    >
      <Container className="px-8 py-1">
        <Scales />
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
                >
                  <motion.button
                    className={`flex items-center justify-center gap-2 rounded-full transition-all px-4 py-2 cursor-pointer ${
                      isActive
                        ? "hover:text-neutral-800 hover:font-bold dark:text-neutral-200"
                        : "text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
                    }`}
                  >
                    <AnimatePresence>
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap inline-block"
                      >
                        {item.title}
                        {item.icon && (
                          <span>
                            <item.icon className="inline h-3 w-3" />
                          </span>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </Link>
              </div>
            );
          })}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-200 transition-all px-4 py-2"
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
