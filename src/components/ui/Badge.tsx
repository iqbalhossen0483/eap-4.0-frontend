import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// Variant maps to a semantic color. Covers project statuses, task statuses,
// and priorities so the same component can render any badge in the app.
type Variant =
  | "active"
  | "completed"
  | "on_hold"
  | "todo"
  | "in_progress"
  | "high"
  | "medium"
  | "low"
  | "default"
  | "success"
  | "warning"
  | "danger";

const variantClasses: Record<Variant, string> = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  on_hold:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  todo: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  in_progress:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
