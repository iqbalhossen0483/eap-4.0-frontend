import type { ReactNode } from "react";
import { Typography } from "./Typography";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  cta?: ReactNode;
}

export function EmptyState({ icon, title, subtitle, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      <Typography variant="h5">{title}</Typography>
      {subtitle && <Typography variant="muted">{subtitle}</Typography>}
      {cta && <div className="mt-2">{cta}</div>}
    </div>
  );
}
