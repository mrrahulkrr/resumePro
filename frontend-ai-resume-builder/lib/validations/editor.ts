import { z } from "zod"

export const editorFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  resumeCode: z.string().min(10, "Resume code must be at least 10 characters"),
  jobDescription: z.string().optional(),
})

export type EditorFormValues = z.infer<typeof editorFormSchema>
