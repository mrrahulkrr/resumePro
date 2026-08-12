"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {  Input } from "@/components/ui/input"
import { uploadFormSchema, type UploadFormValues } from "@/lib/validations/upload"
import { Upload, AlertCircle, FileCheck2, Sparkles, Zap, FileText, ChevronRight } from "lucide-react"
import { useCredits } from "@/lib/credit-context"
import { api } from "@/lib/api"
import type { Resume } from "@/types/resume"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"

export const dynamic = 'force-dynamic'

export default function ATSToolsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { credits, consumeCredits } = useCredits()
  const [savedResumes, setSavedResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState("")

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

  const checkCredits = () => {
    if (credits < 10) {
      alert("You need at least 10 credits to perform an ATS analysis.")
      return false
    }
    return true
  }

  const showError = (message: string) => {
    alert(message)
  }

  // Fetch saved resumes
  useEffect(() => {
    async function fetchResumes() {
      try {
        const data = await api.get<Resume[]>("/api/v1/resumes/")
        const sorted = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        setSavedResumes(sorted)
      } catch (error) {
        console.error("Failed to fetch resumes", error)
      } finally {
        setLoadingResumes(false)
      }
    }
    fetchResumes()
  }, [])

  const onSubmitUpload = async (data: UploadFormValues) => {
    if (!checkCredits()) return

    setIsLoading(true)
    try {
      const parseResult = await api.uploadFile<{ filename: string; text: string }>(
        "/api/v1/resumes/parse-file",
        data.resume
      )

      const latexContent = `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\begin{document}
${parseResult.text.replace(/([&%$#_{}])/g, "\\$1")}
\\end{document}`

      const newResume = await api.post<Resume>("/api/v1/resumes", {
        title: parseResult.filename.replace(/\.(pdf|txt)$/i, ""),
        content: latexContent,
        job_description: data.jobDescription,
      })

      await api.post(`/api/v1/resumes/${newResume.id}/analyze`)
      consumeCredits(10)
      router.push(`/results?id=${newResume.id}`)
    } catch (error: any) {
      console.error("Error:", error)
      showError(error.message || "Failed to analyze resume. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeSaved = async () => {
    if (!selectedResume || !jobDescription) {
      showError("Please select a resume and provide a job description.")
      return
    }
    if (!checkCredits()) return

    setIsLoading(true)
    try {
      await api.put(`/api/v1/resumes/${selectedResume}`, {
        job_description: jobDescription,
      })
      await api.post(`/api/v1/resumes/${selectedResume}/analyze`)
      consumeCredits(10)
      router.push(`/results?id=${selectedResume}`)
    } catch (error: any) {
      console.error("Error:", error)
      showError(error.message || "Failed to analyze resume. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isDragOver = e.type === "dragenter" || e.type === "dragover"
    setDragActive(isDragOver)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      setValue("resume", e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = () => document.getElementById("resume-input")?.click()

  const isSelected = (id: number) => selectedResume === id.toString()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="container-center">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered ATS Analysis</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                Score Your Resume <span className="text-primary">Instantly</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from your saved resumes or upload a new one. Our AI will analyze compatibility, extract missing
                keywords, and provide actionable suggestions in seconds.
              </p>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Cost: 10 Credits per Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    You currently have <span className="font-bold text-foreground">{credits} credits</span> available
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="saved" className="text-base">
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Saved Resume
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-base">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Resume
                </TabsTrigger>
              </TabsList>

              {/* Analyze Saved Resume Tab */}
              <TabsContent value="saved" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Select a Resume to Analyze</h3>
                    
                    {loadingResumes ? (
                      <div className="text-center py-8 text-muted-foreground">Loading your resumes...</div>
                    ) : savedResumes.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                        <p className="text-muted-foreground mb-4">No saved resumes yet</p>
                        <Button asChild>
                          <Link href="/editor">Create Your First Resume</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-3 mb-6">
                        {savedResumes.map((resume) => {
                          const selected = isSelected(resume.id)
                          return (
                          <div
                            key={resume.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedResume(resume.id.toString())}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  selected ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}>
                                  <FileCheck2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{resume.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Last updated {formatDistanceToNow(new Date(resume.updated_at))} ago
                                  </p>
                                </div>
                              </div>
                              {resume.ats_score && (
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">{resume.ats_score}</div>
                                  <div className="text-xs text-muted-foreground">Previous Score</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )})
                        }
                      </div>
                    )}

                    {savedResumes.length > 0 && (
                      <>
                        <div className="mb-6">
                          <label className="block text-sm font-semibold mb-2">
                            Job Description <span className="text-destructive">*</span>
                          </label>
                          <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications for the best analysis..."
                            className="min-h-48 text-base rounded-xl"
                          />
                        </div>

                        <Button
                          onClick={handleAnalyzeSaved}
                          disabled={!selectedResume || !jobDescription || isLoading || credits < 10}
                          size="lg"
                          className="w-full h-14 text-lg rounded-full"
                        >
                          {isLoading ? (
                            <>
                              <Sparkles className="mr-2 w-5 h-5 animate-spin" />
                              Analyzing Your Resume...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 w-5 h-5" />
                              Analyze Resume (10 credits)
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Upload New Resume Tab */}
              <TabsContent value="upload">
                <form onSubmit={handleSubmit(onSubmitUpload)} className="space-y-8">
                  <div className="bg-card border rounded-2xl p-8">
                    <label className="block text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-primary" />
                      Upload Resume <span className="text-destructive">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                        dragActive
                          ? "border-primary bg-primary/5 scale-[1.02]"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      } ${errors.resume ? "border-destructive" : ""}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-semibold text-lg mb-2">Drag and drop your resume here</p>
                      <p className="text-sm text-muted-foreground mb-6">Supports PDF and TXT files up to 5MB</p>
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
                        size="lg"
                        variant="outline"
                        className="rounded-full bg-transparent"
                        onClick={handleFileSelect}
                      >
                        Browse Files
                      </Button>
                      {resumeFile && (
                        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg inline-flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-primary" />
                          <p className="text-sm font-medium text-primary">{resumeFile.name}</p>
                        </div>
                      )}
                    </div>
                    {errors.resume && (
                      <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.resume.message as string}
                      </div>
                    )}
                  </div>

                  <div className="bg-card border rounded-2xl p-8">
                    <label className="block text-lg font-semibold mb-4">
                      Job Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Paste the complete job description here. Include requirements, responsibilities, and qualifications for the best analysis..."
                      className="min-h-64 text-base rounded-xl"
                      {...register("jobDescription")}
                    />
                    {errors.jobDescription && (
                      <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.jobDescription.message}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading || credits < 10}
                      className="flex-1 h-14 text-lg rounded-full"
                    >
                      {isLoading ? (
                        <>
                          <Sparkles className="mr-2 w-5 h-5 animate-spin" />
                          Analyzing Your Resume...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-5 h-5" />
                          Analyze Resume (10 credits)
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-14 rounded-full px-8 bg-transparent"
                      asChild
                    >
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  What You'll Get
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Comprehensive ATS compatibility score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Skills match analysis against job requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Missing keywords and optimization suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Formatting and structure recommendations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-secondary" />
                  How It Works
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 flex-shrink-0 font-semibold">1.</span>
                    <span>Our AI parses your resume content and structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 flex-shrink-0 font-semibold">2.</span>
                    <span>We analyze the job description for key requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 flex-shrink-0 font-semibold">3.</span>
                    <span>Advanced NLP matches skills and keywords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5 flex-shrink-0 font-semibold">4.</span>
                    <span>Get instant feedback and improvement suggestions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
