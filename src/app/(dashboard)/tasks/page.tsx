"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useGetTasksQuery, useDeleteTaskMutation } from "@/store/api/tasksApi";
import { useGetProjectsQuery } from "@/store/api/projectsApi";
import { useGetUsersQuery } from "@/store/api/usersApi";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { StatusDropdown } from "@/components/tasks/StatusDropdown";
import { RoleGuard } from "@/components/RoleGuard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Table, type ColumnDef } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate, humanize } from "@/lib/utils";
import type { Task } from "@/types";

const statusOpts = [
  { value: "", label: "All Statuses" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];
const priorityOpts = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const deadlineOpts = [
  { value: "", label: "Any Deadline" },
  { value: "overdue", label: "Overdue" },
  { value: "upcoming", label: "Upcoming (7d)" },
];
const sortOpts = [
  { value: "created_at", label: "Latest Created" },
  { value: "due_date", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "updated_at", label: "Recently Updated" },
];

export default function TasksPage() {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assigned_to: "",
    project_id: "",
    deadline_status: "",
    sort_by: "created_at",
  });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetTasksQuery({
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    assigned_to: filters.assigned_to || undefined,
    project_id: filters.project_id || undefined,
    deadline_status: filters.deadline_status || undefined,
    sort_by: filters.sort_by,
    page,
    page_size: 15,
  });
  const { data: projectsData } = useGetProjectsQuery({ page_size: 100 });
  const { data: usersData } = useGetUsersQuery({ page_size: 100 });
  const [deleteTask] = useDeleteTaskMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [detail, setDetail] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  function update(key: keyof typeof filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

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

  const projectOpts = [
    { value: "", label: "All Projects" },
    ...(projectsData?.items ?? []).map((p) => ({ value: p.id, label: p.name })),
  ];
  const userOpts = [
    { value: "", label: "All Assignees" },
    ...(usersData?.items ?? []).map((u) => ({ value: u.id, label: u.name })),
  ];

  const columns: ColumnDef<Task>[] = [
    { key: "title", header: "Title", render: (t) => <span className="font-medium">{t.title}</span> },
    {
      key: "project",
      header: "Project",
      render: (t) => {
        const proj = projectsData?.items?.find((p) => p.id === t.project_id);
        return <span className="text-sm">{proj?.name ?? "—"}</span>;
      },
    },
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div />
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

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Select options={statusOpts} value={filters.status} onChange={(e) => update("status", e.target.value)} />
        <Select options={priorityOpts} value={filters.priority} onChange={(e) => update("priority", e.target.value)} />
        <Select options={userOpts} value={filters.assigned_to} onChange={(e) => update("assigned_to", e.target.value)} />
        <Select options={projectOpts} value={filters.project_id} onChange={(e) => update("project_id", e.target.value)} />
        <Select options={deadlineOpts} value={filters.deadline_status} onChange={(e) => update("deadline_status", e.target.value)} />
        <Select options={sortOpts} value={filters.sort_by} onChange={(e) => update("sort_by", e.target.value)} />
      </div>

      <Card variant="default" padding="none">
        <Card.Body className="py-0 overflow-x-auto">
          <Table
            data={tasks}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No tasks match these filters"
            hoverable
            rowKey={(t) => t.id}
            onRowClick={(t) => setDetail(t)}
          />
        </Card.Body>
      </Card>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <TaskFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} task={editing} />
      <TaskDetailModal isOpen={Boolean(detail)} onClose={() => setDetail(null)} task={detail} />
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
