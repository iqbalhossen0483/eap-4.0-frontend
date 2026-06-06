import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "./Typography";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type = "text", id, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <Typography variant="label" htmlFor={id}>
            {label}
          </Typography>
        )}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={cn(
              "w-full rounded-(--radius-btn) border bg-white px-3 py-2 text-sm text-gray-900 transition-colors",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500",
              "dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700",
              isPassword && "pr-10",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              tabIndex={-1}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
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

Input.displayName = "Input";
