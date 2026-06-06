"use client";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode; // receives menu items; close via the provided context is manual
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
  menuClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-20 mt-1 min-w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  onClick,
  children,
  className,
  danger,
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
        className,
      )}
    >
      {children}
    </button>
  );
}
