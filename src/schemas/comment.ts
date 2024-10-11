import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(1000, "Content can't exceed 1000 characters"),
});

export type ICommentSchema = z.infer<typeof commentSchema>;
