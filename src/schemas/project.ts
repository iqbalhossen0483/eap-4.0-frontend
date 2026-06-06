import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"), // YYYY-MM-DD
  status: z.enum(["active", "completed", "on_hold"]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
