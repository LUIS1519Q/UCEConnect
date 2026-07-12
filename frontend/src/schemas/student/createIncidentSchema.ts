import { z } from "zod";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const createIncidentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must contain at least 5 characters.")
    .max(200, "Title must not exceed 200 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must contain at least 10 characters.")
    .max(5000, "Description must not exceed 5000 characters."),

  files: z
    .array(z.instanceof(File))
    .max(20, "A maximum of 20 files is allowed.")
    .refine(
      files =>
        files.every(file => file.size <= MAX_FILE_SIZE),
      {
        message:
          "Each file must not exceed 100 MB.",
      }
    )
    .default([]),

});

export type CreateIncidentForm =
  z.infer<typeof createIncidentSchema>;