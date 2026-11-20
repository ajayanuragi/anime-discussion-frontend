import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(1, "Username is required")
    .max(15, "Username must be at most 15 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(15, "Password must be at most 15 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
