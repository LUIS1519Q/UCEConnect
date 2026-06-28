import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .min(2, "First name must contain at least 2 characters.")
      .max(50, "First name must contain at most 50 characters.")
      .regex(
        /^[A-Za-zÀ-ÿ\s]+$/,
        "First name must contain only letters and spaces."
      ),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .min(2, "Last name must contain at least 2 characters.")
      .max(50, "Last name must contain at most 50 characters.")
      .regex(
        /^[A-Za-zÀ-ÿ\s]+$/,
        "Last name must contain only letters and spaces."
      ),

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
      .min(8, "Password must contain at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character."
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),

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