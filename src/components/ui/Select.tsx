import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "./Typography";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <Typography variant="label" htmlFor={id}>
            {label}
          </Typography>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-(--radius-btn) border bg-white px-3 py-2 pr-9 text-sm text-gray-900 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              "dark:bg-gray-900 dark:text-gray-100",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700",
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {error && (
          <Typography variant="caption" color="danger">
            {error}
          </Typography>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
