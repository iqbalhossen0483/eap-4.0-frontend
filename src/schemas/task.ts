import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  assigned_to: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  due_date: z.string().min(1, "Due date is required"), // YYYY-MM-DD
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["todo", "in_progress", "completed"]),
});

export type TaskInput = z.infer<typeof taskSchema>;
