import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[A-Za-z\s]+$/, "Name must only contain letters"),
  email: z.string().email("Invalid email format"),
});

export const updateUserSchema = userSchema.partial();