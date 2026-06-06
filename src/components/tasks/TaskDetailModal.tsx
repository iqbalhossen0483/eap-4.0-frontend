"use client";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Typography } from "@/components/ui/Typography";
import { CommentsSection } from "./CommentsSection";
import { AttachmentsSection } from "./AttachmentsSection";
import { formatDate, humanize } from "@/lib/utils";
import type { Task } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskDetailModal({ isOpen, onClose, task }: Props) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={task.status}>{humanize(task.status)}</Badge>
          <Badge variant={task.priority}>{humanize(task.priority)} priority</Badge>
          <Typography variant="caption">
            Due {formatDate(task.due_date)}
          </Typography>
        </div>

        {task.description && (
          <Typography
            variant="small"
            className="whitespace-pre-wrap text-gray-700 dark:text-gray-300"
          >
            {task.description}
          </Typography>
        )}

        <div className="flex items-center gap-2">
          <Typography variant="caption">Assigned to:</Typography>
          {task.assigned_user ? (
            <span className="inline-flex items-center gap-1.5">
              <Avatar
                name={task.assigned_user.name}
                src={task.assigned_user.avatar_url}
                size="sm"
              />
              <Typography variant="small">{task.assigned_user.name}</Typography>
            </span>
          ) : (
            <Typography variant="small" color="muted">
              Unassigned
            </Typography>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <AttachmentsSection taskId={task.id} />
        </div>

        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <CommentsSection taskId={task.id} />
        </div>
      </div>
    </Modal>
  );
}
