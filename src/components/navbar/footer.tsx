import React from "react";
import Link from "next/link";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "../icons";
import { Container } from "../container";

export const Footer = () => {
  return (
    <Container className="flex justify-between py-3 px-4 border-t border-x border-neutral-100 dark:border-neutral-800/50">
      <p className="text-sm text-neutral-500">built with love by Abhay Singh</p>
      <div className="flex items-center justify-center gap-4">
        <Link target="_blank" href="https://github.com/abhaydesu">
          <IconBrandGithub className="size-4 dark:text-pink-700 text-pink-300 hover:text-pink-700 dark:hover:text-pink-300" />
        </Link>
        <Link target="_blank" href="https://www.linkedin.com/in/abhaydesu/">
          <IconBrandLinkedin className="size-4 dark:text-pink-700 text-pink-300 hover:text-pink-700 dark:hover:text-pink-300" />
        </Link>
        <Link target="_blank" href="https://x.com/abhaydesu">
          <IconBrandX className="size-4 dark:text-pink-700 text-pink-300 hover:text-pink-700 dark:hover:text-pink-300" />
        </Link>
      </div>
    </Container>
  );
};
