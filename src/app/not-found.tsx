import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <EmptyState
        icon={<SearchX className="h-12 w-12" />}
        title="Page not found"
        subtitle="The page you're looking for doesn't exist or has been moved."
        cta={
          <Link href="/" className="font-medium text-primary-600 underline">
            Go to Dashboard
          </Link>
        }
      />
    </div>
  );
}
