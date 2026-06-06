"use client";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} from "@/store/api/notificationsApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const router = useRouter();
  const { data, isLoading } = useGetNotificationsQuery({ page_size: 50 });
  const [markRead] = useMarkReadMutation();
  const [markAllRead, { isLoading: markingAll }] = useMarkAllReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const items = data?.items ?? [];
  const hasUnread = items.some((n) => !n.is_read);

  async function handleClick(id: string, isRead: boolean, link: string | null) {
    if (!isRead) {
      try {
        await markRead(id).unwrap();
      } catch {
        /* non-blocking */
      }
    }
    if (link) router.push(link);
  }

  async function handleMarkAll() {
    try {
      await markAllRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to mark all as read",
      );
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to delete notification",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleMarkAll}
          loading={markingAll}
          disabled={!hasUnread}
        >
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-10 w-10" />}
          title="No notifications"
          subtitle="You're all caught up."
        />
      ) : (
        <Card variant="default" padding="none">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 transition-colors",
                  !n.is_read &&
                    "border-l-2 border-primary-500 bg-primary-50/50 dark:bg-primary-900/10",
                )}
              >
                <button
                  onClick={() => handleClick(n.id, n.is_read, n.link)}
                  className="min-w-0 flex-1 text-left"
                >
                  <Typography
                    variant="small"
                    className={cn(!n.is_read && "font-medium")}
                  >
                    {n.message}
                  </Typography>
                  <Typography variant="caption" className="block">
                    {formatDateTime(n.created_at)}
                  </Typography>
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                  aria-label="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
