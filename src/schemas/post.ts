import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(1000, "Content can't exceed 1000 characters"),
});

export type IPostSchema = z.infer<typeof postSchema>;
