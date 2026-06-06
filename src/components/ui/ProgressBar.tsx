import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-primary-600 transition-all", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
