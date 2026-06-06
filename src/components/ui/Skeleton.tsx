import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  if (count === 1) {
    return (
      <div
        className={cn(
          "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
          className,
        )}
      />
    );
  }
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
            className,
          )}
        />
      ))}
    </>
  );
}
