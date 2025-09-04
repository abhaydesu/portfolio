// utils/cn.ts

import { twMerge } from 'tailwind-merge'; // Optional but highly recommended for Tailwind CSS
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}