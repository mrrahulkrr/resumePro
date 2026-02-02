"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { editorFormSchema, type EditorFormValues } from "@/lib/validations/editor"
import { Download, Wand2, AlertCircle, Save, Sparkles, CheckCircle2, Eye, Loader2, X } from "lucide-react"
import { api } from "@/lib/api"
import type { Resume, ResumeAnalysisResult } from "@/types/resume"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}

\\begin{document}

\\noindent
\\textbf{\\Large John Doe}\\\\
Email: john@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

\\section*{Professional Summary}
Experienced Full-Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. 
Proven track record of delivering scalable applications that improve user engagement by 40%.

\\section*{Experience}

\\noindent
\\textbf{Senior Software Engineer} | Tech Company | 2021 - Present
\\begin{itemize}
  \\item Led development of microservices architecture serving 2M+ users
  \\item Reduced API response time by 60% through optimization
  \\item Mentored team of 4 junior developers
\\end{itemize}

\\section*{Skills}
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL

\\section*{Education}
\\textbf{Bachelor of Science in Computer Science} | University Name | 2019

\\end{document}`

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("id")
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditorFormValues>({
    resolver: zodResolver(editorFormSchema),
    defaultValues: {
      resumeCode: DEFAULT_LATEX,
    },
  })

  // Fetch resume if ID is present
  useEffect(() => {
    async function loadResume() {
      if (!resumeId) return
      
      try {
        const resume = await api.get<Resume>(`/api/v1/resumes/${resumeId}`)
        if (resume) {
          if (resume.content) setValue("resumeCode", resume.content)
          if (resume.title) setValue("title", resume.title)
          if (resume.job_description) setValue("jobDescription", resume.job_description)
          
          if (resume.analysis) {
              setAnalysisResult(resume.analysis)
          }
        }
      } catch (error) {
        console.error("Failed to load resume:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load resume content",
        })
      }
    }
    loadResume()
  }, [resumeId, setValue, toast])

  const resumeCode = watch("resumeCode")
  const title = watch("title")
  const jobDescription = watch("jobDescription")

  const onSubmit = async (data: EditorFormValues) => {
    setIsSaving(true)
    try {
      const payload = {
        title: data.title || "Untitled Resume",
        content: data.resumeCode,
        job_description: data.jobDescription,
      }

      if (resumeId) {
        // Update existing
        await api.put<Resume>(`/api/v1/resumes/${resumeId}`, payload)
      } else {
        // Create new
        const newResume = await api.post<Resume>("/api/v1/resumes", payload)
        // Redirect to edit mode with new ID
        if (newResume && newResume.id) {
            router.replace(`/editor?id=${newResume.id}`)
        }
      }

      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (error) {
       console.error("Failed to save:", error)
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save your changes. Please try again.",
        })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeId) {
        toast({
            title: "Save First",
            description: "Please save your resume before analyzing.",
        })
        return
    }

    setIsAnalyzing(true)
    try {
        // First save current changes
        await onSubmit({ resumeCode })
        
        // Then analyze
        const result = await api.post<Resume>(`/api/v1/resumes/${resumeId}/analyze`)
        if (result && result.analysis) {
            setAnalysisResult(result.analysis)
            toast({
                title: "Analysis Complete",
                description: `ATS Score: ${result.analysis.ats_score}/100`,
            })
        }
    } catch (error) {
        console.error("Analysis failed:", error)
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "Could not analyze resume. Please try again."
        })
    } finally {
        setIsAnalyzing(false)
    }
  }

  const handleDownload = async () => {
    if (!resumeId) {
        toast({
            title: "Save First",
            description: "Please save your resume before downloading.",
        })
        return
    }

    setIsDownloading(true)
    try {
        await api.download(`/api/v1/resumes/${resumeId}/download`, `resume_${resumeId}.pdf`)
        toast({
            title: "Success",
            description: "Your PDF has been generated and download has started.",
        })
    } catch (error) {
        console.error("Download failed:", error)
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not generate PDF. Please ensure your LaTeX is valid."
        })
    } finally {
        setIsDownloading(false)
    }
  }

  const handlePreview = async () => {
    if (!resumeId) {
        toast({
            title: "Save First",
            description: "Please save your resume before previewing.",
        })
        return
    }

    setIsPreviewing(true)
    try {
        // Clean up previous preview URL
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl)
        }
        
        const url = await api.getPreviewUrl(`/api/v1/resumes/${resumeId}/preview`)
        setPreviewUrl(url)
    } catch (error) {
        console.error("Preview failed:", error)
        toast({
            variant: "destructive",
            title: "Preview Failed",
            description: "Could not generate preview. Please ensure your LaTeX is valid."
        })
    } finally {
        setIsPreviewing(false)
    }
  }

  const closePreview = () => {
    if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="border-b border-border sticky top-16 z-40 bg-background">
          <div className="container-center py-4 flex items-center justify-between">
            <div className="flex-1 max-w-md mr-4">
              <input
                 {...register("title")}
                 className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 w-full"
                 placeholder="Resume Title"
              />
              <p className="text-sm text-muted-foreground">Powered by LaTeX - Professional formatting guaranteed</p>
            </div>
            <div className="hidden md:flex gap-2">
               <Button 
                variant="secondary" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || isSaving}
                className="gap-2 bg-purple-100 text-purple-900 hover:bg-purple-200 border-purple-200"
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
              </Button>
              <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSaving} className="gap-2">
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handlePreview} disabled={isPreviewing || !resumeId}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewing ? "Loading..." : "Preview PDF"}
              </Button>
              <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>

        {showNotification && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="container-center py-3 flex items-center gap-2 text-green-800 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Changes saved successfully</span>
            </div>
          </div>
        )}

        <div className="py-6">
          <div className="container-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
              {/* Main Editor Area */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                             <span>Target Job Description</span>
                             <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">AI Target</span>
                         </label>
                         <Textarea
                             {...register("jobDescription")}
                             className="mb-4 text-xs h-32 border-2"
                             placeholder="Paste the job description here for AI analysis..."
                         />
                         
                        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <span>LaTeX Code</span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Editable</span>
                        </label>
                        <Textarea
                            {...register("resumeCode")}
                            className="flex-1 font-mono text-xs leading-relaxed border-2"
                            placeholder="Enter LaTeX resume code..."
                            style={{ minHeight: "600px" }}
                        />
                        {errors.resumeCode && (
                            <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.resumeCode.message}
                            </div>
                        )}
                        </div>
                    </div>
                </form>
              </div>

              {/* Sidebar / Analysis / Preview Area */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                 
                 {/* Analysis Result Card */}
                 {analysisResult && (
                    <Card className="border-purple-200 bg-purple-50/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                                <Sparkles className="w-5 h-5" />
                                AI Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">ATS Score</span>
                                        <span className="font-bold">{analysisResult.ats_score}/100</span>
                                    </div>
                                    <Progress value={analysisResult.ats_score} className="h-2" />
                                </div>
                                
                                {analysisResult.missing_keywords.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1 text-red-700">Missing Keywords</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {analysisResult.missing_keywords.map((kw, i) => (
                                                <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysisResult.feedback.length > 0 && (
                                     <div>
                                        <h4 className="text-sm font-semibold mb-1 text-purple-900">Feedback</h4>
                                        <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                            {analysisResult.feedback.map((fb, i) => (
                                                <li key={i}>{fb}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysisResult.tailored_content && (
                                    <div className="pt-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="w-full text-xs gap-2 border-purple-200 text-purple-700 hover:bg-purple-100"
                                            onClick={() => {
                                                setValue("resumeCode", analysisResult.tailored_content!);
                                                toast({
                                                    title: "Applied",
                                                    description: "AI-tailored version has been applied to the editor.",
                                                });
                                            }}
                                        >
                                            <Wand2 className="w-3 h-3" />
                                            Apply AI Optimizations
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                 )}

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>Preview</span>
                    {previewUrl && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={closePreview}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Close
                      </Button>
                    )}
                  </label>
                  <div className="flex-1 bg-white border-2 border-border rounded-lg overflow-hidden shadow-sm" style={{ height: "600px" }}>
                    {previewUrl ? (
                      <iframe 
                        src={previewUrl}
                        className="w-full h-full"
                        title="Resume Preview"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        {isPreviewing ? (
                          <>
                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                            <p className="text-sm text-muted-foreground">Compiling LaTeX...</p>
                          </>
                        ) : (
                          <>
                            <Eye className="w-12 h-12 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground text-sm mb-4">
                              Click &quot;Preview PDF&quot; to see your resume
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handlePreview}
                              disabled={!resumeId}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Generate Preview
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden flex-col gap-3 mt-6">
                <Button 
                    variant="secondary" 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing || isSaving}
                    className="gap-2 bg-purple-100 text-purple-900 border-purple-200"
                >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
              </Button>
                <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSaving} className="gap-2">
                <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isDownloading}
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
              <Button type="button" variant="outline" asChild className="bg-transparent">
                <Link href="/results">Back to Results</Link>
              </Button>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Tips for using the editor</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Edit the LaTeX code directly to customize your resume formatting</li>
                <li>• Use the "Analyze with AI" button to get instant feedback and ATS scoring</li>
                <li>• Download your resume as a PDF for submission</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
