import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),

    lastName: z.string().min(2, "Last name is required"),

    email: z
      .string()
      .email("Invalid email")
      .endsWith("@uce.edu.ec", "Institutional email required"),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type RegisterFormData =
  z.infer<typeof registerSchema>;