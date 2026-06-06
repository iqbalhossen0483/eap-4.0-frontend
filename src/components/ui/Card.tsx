import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "default" | "elevated" | "bordered" | "flat" | "ghost";
type Padding = "none" | "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl",
  elevated: "bg-white dark:bg-gray-900 shadow-md rounded-xl",
  bordered:
    "bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-xl",
  flat: "bg-gray-50 dark:bg-gray-800 rounded-xl",
  ghost: "bg-transparent",
};

const paddingClasses: Record<Padding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

interface CardProps {
  variant?: Variant;
  padding?: Padding;
  className?: string;
  children: ReactNode;
}

function CardRoot({
  variant = "default",
  padding = "md",
  className,
  children,
}: CardProps) {
  return (
    <div className={cn(variantClasses[variant], paddingClasses[padding], className)}>
      {children}
    </div>
  );
}

function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-gray-200 pb-3 dark:border-gray-700",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("py-3", className)}>{children}</div>;
}

function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-gray-200 pt-3 dark:border-gray-700",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
