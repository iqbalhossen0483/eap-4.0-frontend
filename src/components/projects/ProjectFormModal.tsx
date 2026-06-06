"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { projectSchema, type ProjectInput } from "@/schemas/project";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/store/api/projectsApi";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null; // present → edit mode
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

const defaults: ProjectInput = {
  name: "",
  description: "",
  deadline: "",
  status: "active",
};

function apiMessage(err: unknown, fallback: string): string {
  return (err as { data?: { message?: string } })?.data?.message ?? fallback;
}

export function ProjectFormModal({ isOpen, onClose, project }: Props) {
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
  const isEdit = Boolean(project);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaults,
  });

  // Reset on open — edit pre-fills, create starts empty
  useEffect(() => {
    if (isOpen) {
      reset(
        project
          ? {
              name: project.name,
              description: project.description ?? "",
              deadline: project.deadline.slice(0, 10),
              status: project.status,
            }
          : defaults,
      );
    }
  }, [isOpen, project, reset]);

  async function onSubmit(data: ProjectInput) {
    try {
      if (isEdit && project) {
        await updateProject({ id: project.id, body: data }).unwrap();
        toast.success("Project updated successfully");
      } else {
        await createProject(data).unwrap();
        toast.success("Project created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(apiMessage(err, "Failed to save project"));
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Project" : "New Project"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Name"
          placeholder="Project name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Textarea
          id="description"
          label="Description"
          placeholder="What is this project about?"
          error={errors.description?.message}
          {...register("description")}
        />
        <Input
          id="deadline"
          label="Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register("deadline")}
        />
        <Select
          id="status"
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={creating || updating}>
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
