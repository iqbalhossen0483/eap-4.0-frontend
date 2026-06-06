"use client";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { RoleGuard } from "@/components/RoleGuard";
import { formatDate, humanize } from "@/lib/utils";
import type { Project } from "@/types";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: Props) {
  const router = useRouter();

  return (
    <Card
      variant="default"
      padding="md"
      className="flex cursor-pointer flex-col transition-shadow hover:shadow-md"
    >
      <div
        onClick={() => router.push(`/projects/${project.id}`)}
        className="flex-1"
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <Typography variant="h5" className="line-clamp-1">
            {project.name}
          </Typography>
          <Badge variant={project.status}>{humanize(project.status)}</Badge>
        </div>
        <Typography variant="muted" className="line-clamp-2 min-h-10">
          {project.description || "No description"}
        </Typography>
        <div className="mt-3 flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <CheckSquare className="h-4 w-4" />
            {project.task_count} tasks
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Due {formatDate(project.deadline)}
          </span>
        </div>
      </div>

      <RoleGuard roles={["admin", "project_manager"]}>
        <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 pt-3 dark:border-gray-800">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            aria-label="Edit project"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
            aria-label="Delete project"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </RoleGuard>
    </Card>
  );
}
