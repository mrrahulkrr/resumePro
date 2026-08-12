import { z } from "zod"

export const uploadFormSchema = z.object({
  resume: z
    .any()
    .refine((file) => typeof window === "undefined" || file instanceof File, "Resume is required")
    .refine((file) => typeof window === "undefined" || (file && file.size > 0), "Resume is required")
    .refine((file) => typeof window === "undefined" || (file && ["application/pdf", "text/plain"].includes(file.type)), "Resume must be a PDF or text file"),
  jobDescription: z.string().min(30, "Job description must be at least 30 characters"),
})

export type UploadFormValues = z.infer<typeof uploadFormSchema>
