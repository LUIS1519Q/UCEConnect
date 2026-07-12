import { z } from "zod";

export const editIncidentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must contain between 5 and 200 characters.")
    .max(200, "Title must contain between 5 and 200 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
});

export type EditIncidentForm = z.infer<typeof editIncidentSchema>;