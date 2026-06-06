"use client";
import { useState } from "react";
import {
  FolderPlus,
  Plus,
  CheckCheck,
  UserPlus,
  MessageSquare,
  Pencil,
  Activity as ActivityIcon,
  type LucideIcon,
} from "lucide-react";
import { useGetActivityQuery } from "@/store/api/activityApi";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime, humanize } from "@/lib/utils";

// Map an action token to a representative icon.
function actionIcon(action: string): LucideIcon {
  if (action.includes("project.created")) return FolderPlus;
  if (action.includes("task.created")) return Plus;
  if (action.includes("status") || action.includes("completed")) return CheckCheck;
  if (action.includes("member")) return UserPlus;
  if (action.includes("comment")) return MessageSquare;
  if (action.includes("updated")) return Pencil;
  return ActivityIcon;
}

export default function ActivityPage() {
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isFetching } = useGetActivityQuery({ limit, page: 1 });

  const items = data?.items ?? [];
  const total = data?.meta?.total ?? 0;
  // Backend caps `limit` at 50, so stop offering "load more" past that.
  const canLoadMore = items.length < total && limit < 50;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ActivityIcon className="h-10 w-10" />}
        title="No activity yet"
        subtitle="Actions across your projects will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="default" padding="md">
        <ol className="relative space-y-5 border-l border-gray-200 pl-6 dark:border-gray-700">
          {items.map((a) => {
            const Icon = actionIcon(a.action);
            return (
              <li key={a.id} className="relative">
                <span className="absolute -left-7.75 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex items-start gap-2">
                  <Avatar name={a.actor.name} src={a.actor.avatar_url} size="sm" />
                  <div>
                    <Typography variant="small">
                      <span className="font-medium">{a.actor.name}</span>{" "}
                      {humanize(a.action).toLowerCase()}
                    </Typography>
                    <Typography variant="caption" className="block">
                      {formatDateTime(a.created_at)}
                    </Typography>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      {canLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            loading={isFetching}
            onClick={() => setLimit((l) => l + 10)}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
