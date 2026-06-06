import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"), // YYYY-MM-DD
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["todo", "in_progress", "completed"]),
});

// Used by the global "New Task" form, which also picks a project.
export const taskWithProjectSchema = taskSchema.extend({
  project_id: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskWithProjectInput = z.infer<typeof taskWithProjectSchema>;
