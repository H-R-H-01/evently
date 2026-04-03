import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Encode JSON to base64 for URL search params
export function encodeConfig(data: unknown): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch {
    return '';
  }
}

// Decode base64 to JSON from URL search params
export function decodeConfig(str: string): unknown {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    return null;
  }
}

// Transform Google Drive shareable link to direct image link
export function transformGDriveLink(url: string): string {
  if (!url || typeof url !== 'string') return url;
  
  // More comprehensive Google Drive ID extractor
  const driveIdRegex = /(?:id=|[/\\]d[/\\])([a-zA-Z0-9_-]{25,})/;
  const match = url.match(driveIdRegex);
  const fileId = match ? match[1] : null;

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  return url;
}
