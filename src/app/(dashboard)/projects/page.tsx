"use client";
import { useState } from "react";
import { Plus, Search, FolderKanban } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/store/api/projectsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { RoleGuard } from "@/components/RoleGuard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const statusFilters = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

const sortOptions = [
  { value: "created_at", label: "Latest Created" },
  { value: "deadline", label: "Nearest Deadline" },
  { value: "updated_at", label: "Recently Updated" },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching } = useGetProjectsQuery({
    search: debouncedSearch || undefined,
    status: status || undefined,
    sort_by: sortBy,
    page,
    page_size: 12,
  });

  const [deleteProject] = useDeleteProjectMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(project: Project) {
    setEditing(project);
    setModalOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteProject(deleting.id).unwrap();
      toast.success("Project deleted");
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to delete project",
      );
    }
  }

  const projects = data?.items ?? [];
  const totalPages = data?.meta?.total_page ?? 1;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects..."
            className="w-full rounded-(--radius-btn) border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <RoleGuard roles={["admin", "project_manager"]}>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </RoleGuard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto w-44">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-10 w-10" />}
          title="No projects found"
          subtitle="Create your first project to get started."
        />
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
            isFetching && "opacity-60",
          )}
        >
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ProjectFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editing}
      />
      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete project"
        message={`Delete "${deleting?.name}"? This removes all its tasks and cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
