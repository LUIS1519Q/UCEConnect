import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .refine(
      (email) => email.endsWith("@uce.edu.ec"),
      "Only institutional emails are allowed."
    ),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters."),
});

export type LoginFormData = z.infer<typeof loginSchema>;