import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[A-Za-z\s]+$/, "Name must only contain letters"),
  email: z.string().email("Invalid email format"),
});
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[A-Za-z\s]+$/, "Name must only contain letters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const updateUserSchema = userSchema.partial();

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});