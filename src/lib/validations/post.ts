import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(255, "Content must be at most 255 characters"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;