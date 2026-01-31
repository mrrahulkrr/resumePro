import { z } from "zod"

export const uploadFormSchema = z.object({
  resume: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Resume is required")
    .refine((file) => ["application/pdf", "text/plain"].includes(file.type), "Resume must be a PDF or text file"),
  jobDescription: z.string().min(30, "Job description must be at least 30 characters"),
})

export type UploadFormValues = z.infer<typeof uploadFormSchema>
