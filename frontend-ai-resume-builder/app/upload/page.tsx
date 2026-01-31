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
import { Upload, AlertCircle } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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

  const onSubmit = async (data: UploadFormValues) => {
    setIsLoading(true)
    try {
      // Simulate validation and processing
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Navigate to results page with mock data
      router.push("/results")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
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
                        setValue("resume", e.target.files[0])
                      }
                    }}
                    id="resume-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("resume-input")?.click()}
                  >
                    Choose File
                  </Button>
                  {resumeFile && <p className="text-sm text-primary mt-3">✓ {resumeFile.name}</p>}
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
                <Button type="submit" size="lg" disabled={isLoading} className="flex-1">
                  {isLoading ? "Analyzing..." : "Analyze Resume"}
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
