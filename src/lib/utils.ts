import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Encode JSON to base64 for URL search params
export function encodeConfig(data: any): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    return '';
  }
}

// Decode base64 to JSON from URL search params
export function decodeConfig(str: string): any {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch (e) {
    return null;
  }
}
