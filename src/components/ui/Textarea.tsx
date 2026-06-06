import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "./Typography";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, rows = 3, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <Typography variant="label" htmlFor={id}>
            {label}
          </Typography>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-(--radius-btn) border bg-white px-3 py-2 text-sm text-gray-900 transition-colors",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500",
            "dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700",
            className,
          )}
          {...props}
        />
        {error && (
          <Typography variant="caption" color="danger">
            {error}
          </Typography>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
