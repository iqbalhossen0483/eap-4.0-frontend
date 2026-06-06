"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { taskWithProjectSchema, type TaskWithProjectInput } from "@/schemas/task";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/store/api/tasksApi";
import { useGetUsersQuery } from "@/store/api/usersApi";
import { useGetProjectsQuery } from "@/store/api/projectsApi";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Task } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string; // fixed project (project detail). Omit on global create.
  task?: Task | null; // present → edit mode
}

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const defaults: TaskWithProjectInput = {
  title: "",
  description: "",
  assigned_to: "",
  due_date: "",
  priority: "medium",
  status: "todo",
  project_id: "",
};

// Normalize empty-string optionals to undefined so the backend receives null,
// and strip the form-only project_id from the request body.
function toTaskBody(data: TaskWithProjectInput) {
  return {
    title: data.title,
    description: data.description || undefined,
    assigned_to: data.assigned_to || undefined,
    due_date: data.due_date,
    priority: data.priority,
    status: data.status,
  };
}

function apiMessage(err: unknown, fallback: string): string {
  return (err as { data?: { message?: string } })?.data?.message ?? fallback;
}

export function TaskFormModal({ isOpen, onClose, projectId, task }: Props) {
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const isEdit = Boolean(task);

  // Project chooser only needed for global create (no fixed projectId, not editing)
  const needProjectSelect = !projectId && !isEdit;
  const { data: projectsData } = useGetProjectsQuery(
    { page_size: 100 },
    { skip: !isOpen || !needProjectSelect },
  );
  const { data: usersData } = useGetUsersQuery(
    { page_size: 100 },
    { skip: !isOpen },
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskWithProjectInput>({
    resolver: zodResolver(taskWithProjectSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        task
          ? {
              title: task.title,
              description: task.description ?? "",
              assigned_to: task.assigned_to ?? "",
              due_date: task.due_date.slice(0, 10),
              priority: task.priority,
              status: task.status,
              project_id: task.project_id,
            }
          : defaults,
      );
    }
  }, [isOpen, task, reset]);

  async function onSubmit(data: TaskWithProjectInput) {
    const body = toTaskBody(data);
    try {
      if (isEdit && task) {
        await updateTask({ id: task.id, body }).unwrap();
        toast.success("Task updated successfully");
      } else {
        const targetProject = projectId ?? data.project_id;
        if (!targetProject) {
          toast.error("Please select a project");
          return;
        }
        await createTask({ projectId: targetProject, body }).unwrap();
        toast.success("Task created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(apiMessage(err, "Failed to save task"));
    }
  }

  const userOptions = (usersData?.items ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  }));
  const projectOptions = (projectsData?.items ?? []).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Task" : "New Task"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {needProjectSelect && (
          <Select
            id="project_id"
            label="Project"
            placeholder="Select a project"
            options={projectOptions}
            error={errors.project_id?.message}
            {...register("project_id")}
          />
        )}
        <Input
          id="title"
          label="Title"
          placeholder="Task title"
          error={errors.title?.message}
          {...register("title")}
        />
        <Textarea
          id="description"
          label="Description"
          placeholder="Describe the task"
          error={errors.description?.message}
          {...register("description")}
        />
        <Select
          id="assigned_to"
          label="Assigned to"
          placeholder="Unassigned"
          options={userOptions}
          error={errors.assigned_to?.message}
          {...register("assigned_to")}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="due_date"
            label="Due date"
            type="date"
            error={errors.due_date?.message}
            {...register("due_date")}
          />
          <Select
            id="priority"
            label="Priority"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register("priority")}
          />
          <Select
            id="status"
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register("status")}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={creating || updating}>
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
