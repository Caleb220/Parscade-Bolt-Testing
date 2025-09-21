/**
 * Class Name Utility
 * Utility for merging Tailwind CSS classes
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwindcss-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}