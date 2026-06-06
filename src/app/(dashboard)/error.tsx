"use client";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <Typography variant="h4">Something went wrong</Typography>
      <Typography variant="muted">{error.message}</Typography>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
