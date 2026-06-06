import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "lead"
  | "small"
  | "muted"
  | "label"
  | "caption"
  | "code";

type Weight = "normal" | "medium" | "semibold" | "bold";
type Color = "default" | "muted" | "primary" | "danger" | "success";

const variantClasses: Record<Variant, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-medium",
  h6: "text-base font-medium",
  p: "text-base leading-7",
  lead: "text-lg text-gray-600 dark:text-gray-400 leading-7",
  small: "text-sm leading-5",
  muted: "text-sm text-gray-500 dark:text-gray-400",
  label: "text-sm font-medium text-gray-700 dark:text-gray-300",
  caption: "text-xs text-gray-500 dark:text-gray-400",
  code: "text-sm font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded",
};

const defaultTag: Record<Variant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  small: "p",
  muted: "p",
  label: "label",
  caption: "span",
  code: "code",
};

const weightClasses: Record<Weight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorClasses: Record<Color, string> = {
  default: "",
  muted: "text-gray-500 dark:text-gray-400",
  primary: "text-primary-600 dark:text-primary-400",
  danger: "text-red-600 dark:text-red-400",
  success: "text-green-600 dark:text-green-400",
};

interface TypographyProps {
  variant?: Variant;
  as?: ElementType;
  weight?: Weight;
  color?: Color;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function Typography({
  variant = "p",
  as,
  weight,
  color = "default",
  className,
  children,
  htmlFor,
}: TypographyProps) {
  const Tag = as ?? defaultTag[variant];
  return (
    <Tag
      htmlFor={htmlFor}
      className={cn(
        variantClasses[variant],
        weight && weightClasses[weight],
        colorClasses[color],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
