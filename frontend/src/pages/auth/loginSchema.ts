import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Institutional email is required.")
    .email("Please enter a valid email address.")
    .refine(
      (email) => email.endsWith("@uce.edu.ec"),
      {
        message: "Only institutional emails are allowed (@uce.edu.ec).",
      }
  ),

  password: z
    .string()
    .min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;