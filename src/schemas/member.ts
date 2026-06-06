import { z } from "zod";

export const addMemberSchema = z.object({
  user_id: z.string().min(1, "Select a user to add"),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
