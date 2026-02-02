"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { uploadFormSchema, type UploadFormValues } from "@/lib/validations/upload"
import { Upload, AlertCircle, Loader2, FileText, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { Resume } from "@/types/resume"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedText, setParsedText] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
  })

  const resumeFile = watch("resume")

  // Handle file parsing when a file is selected
  const parseFile = async (file: File) => {
    setIsParsing(true)
    setParsedText(null)
    try {
      const result = await api.uploadFile<{ filename: string; text: string; char_count: number }>(
        "/api/v1/resumes/parse-file",
        file
      )
      setParsedText(result.text)
      toast({
        title: "File Parsed",
        description: `Extracted ${result.char_count.toLocaleString()} characters from ${result.filename}`,
      })
    } catch (error: any) {
      console.error("Failed to parse file:", error)
      toast({
        variant: "destructive",
        title: "Parse Failed",
        description: error.message || "Could not extract text from file.",
      })
    } finally {
      setIsParsing(false)
    }
  }

  const onSubmit = async (data: UploadFormValues) => {
    if (!parsedText) {
      toast({
        variant: "destructive",
        title: "No Resume Content",
        description: "Please upload a resume file first.",
      })
      return
    }

    setIsLoading(true)
    try {
      // Create a basic LaTeX document from the parsed text
      const latexContent = generateLatexFromText(parsedText)
      
      // Create a new resume
      const newResume = await api.post<Resume>("/api/v1/resumes", {
        title: data.resume.name.replace(/\.(pdf|txt)$/i, "") || "Uploaded Resume",
        content: latexContent,
        job_description: data.jobDescription,
      })

      if (newResume && newResume.id) {
        // Analyze the resume
        try {
          await api.post<Resume>(`/api/v1/resumes/${newResume.id}/analyze`)
        } catch (e) {
          console.log("Analysis skipped - continuing to editor")
        }
        
        // Navigate to editor
        router.push(`/editor?id=${newResume.id}`)
      }
    } catch (error: any) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Could not process your resume.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate a basic LaTeX document from plain text
  const generateLatexFromText = (text: string): string => {
    // Escape LaTeX special characters
    const escaped = text
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/[&%$#_{}]/g, (match) => `\\${match}`)
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/\n\n+/g, "\n\n\\vspace{8pt}\n\n")
    
    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\pagestyle{empty}

\\begin{document}

% Imported from: ${resumeFile?.name || "uploaded file"}
% Please edit the LaTeX below to improve formatting

${escaped}

\\end{document}`
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      setValue("resume", files[0])
      parseFile(files[0])
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Analyze Your Resume</h1>
              <p className="text-lg text-muted-foreground">
                Upload your resume and paste a job description to get AI-powered insights.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-blue-50" : "border-border"
                  } ${errors.resume ? "border-destructive" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold mb-1">Drag and drop your resume here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <Input
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    {...register("resume")}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0]
                        setValue("resume", file)
                        parseFile(file)
                      }
                    }}
                    id="resume-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("resume-input")?.click()}
                    disabled={isParsing}
                  >
                    {isParsing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      "Choose File"
                    )}
                  </Button>
                  {resumeFile && (
                    <div className="mt-3">
                      <p className="text-sm text-primary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {resumeFile.name}
                      </p>
                      {parsedText && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {parsedText.length.toLocaleString()} characters extracted
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {errors.resume && (
                  <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.resume.message}
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-48"
                  {...register("jobDescription")}
                />
                {errors.jobDescription && (
                  <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.jobDescription.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button type="submit" size="lg" disabled={isLoading || isParsing || !parsedText} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Analyze & Open in Editor"
                  )}
                </Button>
                <Button type="button" variant="outline" size="lg" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>

            {/* Info Section */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ We analyze your resume for ATS compatibility</li>
                <li>✓ Compare your skills against the job description</li>
                <li>✓ Provide actionable suggestions for improvement</li>
                <li>✓ Generate an optimized version in our editor</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
