"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Compact window of page numbers around the current page
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const btn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none";

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <button
        className={cn(btn, "hover:bg-gray-100 dark:hover:bg-gray-800")}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {start > 1 && <span className="px-1 text-gray-400">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            btn,
            p === currentPage
              ? "bg-primary-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-800",
          )}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="px-1 text-gray-400">…</span>}
      <button
        className={cn(btn, "hover:bg-gray-100 dark:hover:bg-gray-800")}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
