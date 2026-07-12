import { z } from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(7).max(15).optional().or(z.literal("")),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;