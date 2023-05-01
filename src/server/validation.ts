import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  name: z.string(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
