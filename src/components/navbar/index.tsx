"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "next-view-transitions";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation"; // 1. IMPORT
import {
  Home,
  PersonStanding,
  Laptop,
  NotebookPen,
  Mail,
  Moon,
  Sun,
} from "lucide-react";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  const pathname = usePathname();

  const navItems = [
    { title: "home", href: "/", icon: Home },
    { title: "projects", href: "/projects", icon: Laptop },
    { title: "blog", href: "/blog", icon: NotebookPen },
    { title: "about", href: "/about", icon: PersonStanding },
    { title: "contact", href: "/contact", icon: Mail },
  ];

  return (
    <div className="fixed bottom-4 md:bottom-12 inset-x-0 z-50 px-4 md:px-0">
      <div className="mx-auto flex justify-center">
        <motion.div
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className={`
            flex items-center justify-between
            rounded-full
            bg-white/10 dark:bg-neutral-900/40
            backdrop-blur-lg
            border border-white/10 dark:border-neutral-800
            shadow-[0_8px_20px_rgba(0,0,0,0.2)]
            transition-all duration-300
            px-2 py-1
          `}
          style={{
            width: "auto",
            maxWidth: "90%",
          }}
        >
          <div className="flex items-center justify-between w-full">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isHovered = hovered === idx;

              const isActive =
                item.href === "/"
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);

              return (
                <div
                  key={item.title}
                  className="relative flex flex-col items-center justify-center"
                >
                  <Link href={item.href}>
                    <motion.button
                      onMouseEnter={() => setHovered(idx)}
                      onMouseLeave={() => setHovered(null)}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        y: isHovered ? -2 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                      }}
                      className={`
                        flex items-center justify-center gap-2
                        rounded-full
                        transition-all duration-10
                        px-4 py-2 cursor-pointer
                        ${
                          isActive
                            ? " text-pink-700  dark:text-pink-400"
                            : "text-neutral-400 hover:text-pink-400"
                        }
                      `}
                    >
                      {/* ICON — only on mobile */}
                      <span className="md:hidden">
                        <Icon size={18} strokeWidth={1.6} />
                      </span>

                      {/* TEXT — only on desktop */}
                      <AnimatePresence>
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-medium whitespace-nowrap hidden md:inline-block"
                        >
                          {item.title}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                  </Link>

                  {isActive && (
                    <motion.span
                      layoutId="dock-active"
                      className="absolute -bottom-1 w-2.5 h-0.5 rounded-full bg-pink-700 dark:bg-pink-400"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                      }}
                    />
                  )}
                </div>
              );
            })}

            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="
                flex items-center justify-center rounded-lg text-neutral-400 hover:text-pink-400
                transition-all duration-10 cursor-pointer
                px-4 py-2
              "
            >
              {theme === "dark" ? (
                <Sun size={18} strokeWidth={1.6} />
              ) : (
                <Moon size={18} strokeWidth={1.6} />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;