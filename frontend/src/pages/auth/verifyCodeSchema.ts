import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(
      6,
      "The verification code must contain 6 digits."
    )
    .regex(
      /^\d+$/,
      "The verification code must contain only numbers."
    ),
});

export type VerifyCodeFormData =
  z.infer<typeof verifyCodeSchema>;