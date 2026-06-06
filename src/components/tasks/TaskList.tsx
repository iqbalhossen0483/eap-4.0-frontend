"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProjectTasksQuery,
  useDeleteTaskMutation,
} from "@/store/api/tasksApi";
import { TaskFormModal } from "./TaskFormModal";
import { TaskDetailModal } from "./TaskDetailModal";
import { StatusDropdown } from "./StatusDropdown";
import { RoleGuard } from "@/components/RoleGuard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Table, type ColumnDef } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate, humanize } from "@/lib/utils";
import type { Task } from "@/types";

export function TaskList({ projectId }: { projectId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProjectTasksQuery({
    id: projectId,
    filters: { page, page_size: 15 },
  });
  const [deleteTask] = useDeleteTaskMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [detail, setDetail] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteTask(deleting.id).unwrap();
      toast.success("Task deleted");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to delete task",
      );
    }
  }

  const columns: ColumnDef<Task>[] = [
    { key: "title", header: "Title", render: (t) => <span className="font-medium">{t.title}</span> },
    {
      key: "assignee",
      header: "Assignee",
      render: (t) =>
        t.assigned_user ? (
          <span className="inline-flex items-center gap-1.5">
            <Avatar name={t.assigned_user.name} src={t.assigned_user.avatar_url} size="sm" />
            <span className="text-sm">{t.assigned_user.name}</span>
          </span>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        ),
    },
    { key: "due_date", header: "Due", render: (t) => formatDate(t.due_date) },
    {
      key: "priority",
      header: "Priority",
      render: (t) => <Badge variant={t.priority}>{humanize(t.priority)}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (t) => (
        <div onClick={(e) => e.stopPropagation()}>
          <StatusDropdown task={t} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-20",
      render: (t) => (
        <RoleGuard roles={["admin", "project_manager"]}>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setEditing(t);
                setFormOpen(true);
              }}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleting(t)}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </RoleGuard>
      ),
    },
  ];

  const tasks = data?.items ?? [];
  const totalPages = data?.meta?.total_page ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RoleGuard roles={["admin", "project_manager"]}>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </RoleGuard>
      </div>

      <Card variant="default" padding="none">
        <Card.Body className="py-0">
          <Table
            data={tasks}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No tasks in this project yet"
            hoverable
            rowKey={(t) => t.id}
            onRowClick={(t) => setDetail(t)}
          />
        </Card.Body>
      </Card>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <TaskFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        projectId={projectId}
        task={editing}
      />
      <TaskDetailModal
        isOpen={Boolean(detail)}
        onClose={() => setDetail(null)}
        task={detail}
      />
      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete task"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
