
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add utility function for vault type color
export function getVaultTypeColor(type: string): string {
  switch (type) {
    case 'nova':
      return 'text-brand-orange-500';
    case 'orion':
      return 'text-blue-500';
    case 'emerald':
      return 'text-emerald';
    default:
      return 'text-white';
  }
}
