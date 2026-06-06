import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

// CSS-only hover tooltip.
export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700"
      >
        {content}
      </span>
    </span>
  );
}
