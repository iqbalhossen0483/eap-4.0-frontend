import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() — merge conditional class names and dedupe conflicting Tailwind utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format an ISO date string as a short, readable date (e.g. "Jun 6, 2026")
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format an ISO datetime string as date + time (e.g. "Jun 6, 2026, 10:00 AM")
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Relative deadline status used to color badges
export type DeadlineProximity = "overdue" | "today" | "soon" | "later";

export function deadlineProximity(iso: string): DeadlineProximity {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 7) return "soon";
  return "later";
}

// Initials for avatar fallback (e.g. "John Doe" → "JD")
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Human-readable file size (e.g. 1536 → "1.5 KB")
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

// Convert a snake_case / dotted token into a readable label
export function humanize(value: string): string {
  return value
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
