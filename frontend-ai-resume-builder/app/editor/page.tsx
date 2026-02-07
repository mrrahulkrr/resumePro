"use client"

import { Suspense, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"

export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { editorFormSchema, type EditorFormValues } from "@/lib/validations/editor"
import { 
  Download, 
  AlertCircle, 
  Save, 
  CheckCircle2, 
  Eye, 
  Loader2, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Code2, 
  FileText,
  Settings,
  Palette,
  Copy
} from "lucide-react"
import { api } from "@/lib/api"
import type { Resume } from "@/types/resume"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\begin{document}

\\noindent
\\textbf{\\Large YOUR NAME}\\\\
Email: your.email@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/yourname

\\section*{Professional Summary}
Experienced professional with X+ years of expertise in your field. 
Proven track record of delivering results and achieving goals.

\\section*{Experience}

\\noindent
\\textbf{Job Title} | Company Name | Start Year - End Year
\\begin{itemize}[leftmargin=*]
  \\item Achievement or responsibility with quantifiable results
  \\item Another key accomplishment demonstrating impact
  \\item Leadership or technical contribution
\\end{itemize}

\\noindent
\\textbf{Previous Job Title} | Previous Company | Start Year - End Year
\\begin{itemize}[leftmargin=*]
  \\item Key project or initiative you led
  \\item Measurable improvement or contribution
  \\item Cross-functional collaboration example
\\end{itemize}

\\section*{Skills}
Technical Skills, Tools, Languages, Frameworks, Certifications

\\section*{Education}
\\textbf{Degree} | University Name | Graduation Year

\\end{document}`

type EditorTheme = "light" |"dark" | "monokai" | "github" | "dracula"

const THEMES = {
  light: {
    name: "Light",
    bg: "bg-white",
    text: "text-gray-900",
    border: "border-gray-200",
  },
  dark: {
    name: "Dark",
    bg: "bg-gray-900",
    text: "text-gray-100",
    border: "border-gray-700",
  },
  monokai: {
    name: "Monokai",
    bg: "bg-[#272822]",
    text: "text-[#F8F8F2]",
    border: "border-[#3E3D32]",
  },
  github: {
    name: "GitHub",
    bg: "bg-[#f6f8fa]",
    text: "text-[#24292f]",
    border: "border-[#d0d7de]",
  },
  dracula: {
    name: "Dracula",
    bg: "bg-[#282a36]",
    text: "text-[#f8f8f2]",
    border: "border-[#44475a]",
  },
}

function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("id")
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editorTheme, setEditorTheme] = useState<EditorTheme>("github")
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)

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

  // Auto-save functionality
  useEffect(() => {
    if (!resumeId || !resumeCode || resumeCode === DEFAULT_LATEX) return
    
    const autoSave = setTimeout(() => {
      api.put(`/api/v1/resumes/${resumeId}`, {
        title: title || "Untitled Resume",
        content: resumeCode,
      }).catch(() => {})
    }, 5000)

    return () => clearTimeout(autoSave)
  }, [resumeCode, title, resumeId])

  const onSubmit = async (data: EditorFormValues) => {
    setIsSaving(true)
    try {
      const payload = {
        title: data.title || "Untitled Resume",
        content: data.resumeCode,
      }

      if (resumeId) {
        await api.put<Resume>(`/api/v1/resumes/${resumeId}`, payload)
      } else {
        const newResume = await api.post<Resume>("/api/v1/resumes", payload)
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

  const showSaveFirstToast = () => {
    toast({
      title: "Save First",
      description: "Please save your resume before previewing.",
    })
  }

  const handleDownload = async () => {
    if (!resumeId) return showSaveFirstToast()

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
    if (!resumeId) return showSaveFirstToast()

    setIsPreviewing(true)
    try {
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
    if (previewUrl) window.URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  const getLineNumbers = (code: string) => 
    code.split('\n').map((_, i) => i + 1).join('\n')

  const theme = THEMES[editorTheme]
  const editorStyle = { fontSize: `${fontSize}px`, lineHeight: "1.6" }
  const textareaStyle = { ...editorStyle, padding: "1rem" }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      {/* Top Toolbar */}
      <div className="border-b border-border bg-background z-40 flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <FileText className="w-5 h-5 text-primary" />
            <input
              {...register("title")}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 max-w-md"
              placeholder="Untitled Resume"
            />
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              LaTeX Editor
            </span>
            {resumeId && (
              <span className="text-xs text-muted-foreground">
                ● Auto-saving
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(THEMES).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setEditorTheme(key as EditorTheme)}
                    className={cn(editorTheme === key && "bg-accent")}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {value.name} {editorTheme === key && "✓"}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Font Size: {fontSize}px</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFontSize(prev => Math.max(10, prev - 2))}>
                  Decrease (A-)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize(prev => Math.min(24, prev + 2))}>
                  Increase (A+)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLineNumbers(!showLineNumbers)}>
                  {showLineNumbers ? "✓ " : ""}Line Numbers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreview} 
              disabled={isPreviewing || !resumeId}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewing ? "Loading..." : "Preview"}
            </Button>
            
            <Button 
              type="submit" 
              onClick={handleSubmit(onSubmit)} 
              disabled={isSaving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload} 
              disabled={isDownloading || !resumeId}
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "..." : "Download"}
            </Button>
          </div>
        </div>

        {showNotification && (
          <div className="bg-green-50 border-b border-green-200 px-4 py-2">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Changes saved successfully</span>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 bg-background overflow-hidden flex">
          {/* Editor Panel */}
          <div className={cn(
            "flex-1 border-r border-border flex flex-col",
            isFullscreen && "hidden"
          )}>
            <div className="px-4 py-2 bg-muted border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">LaTeX Source</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(resumeCode || "")
                    toast({ title: "Copied!" })
                  }}
                  title="Copy to clipboard"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className={cn("flex-1 overflow-auto", theme.bg)}>
              <div className="flex h-full">
                {showLineNumbers && (
                  <div className={cn(
                    "px-4 py-4 select-none border-r",
                    theme.border,
                    "bg-opacity-50"
                  )}>
                    <pre 
                      className={cn("font-mono text-right opacity-50", theme.text)}
                      style={editorStyle}
                    >
                      {getLineNumbers(resumeCode || DEFAULT_LATEX)}
                    </pre>
                  </div>
                )}
                
                <div className="flex-1">
                  <Textarea
                    {...register("resumeCode")}
                    className={cn(
                      "w-full h-full border-0 resize-none font-mono focus-visible:ring-0 focus-visible:ring-offset-0",
                      theme.bg,
                      theme.text
                    )}
                    style={textareaStyle}
                    placeholder="Enter LaTeX code..."
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {errors.resumeCode && (
              <div className="px-4 py-2 bg-destructive/10 border-t border-destructive flex items-center gap-2 text-destructive text-sm flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
                {errors.resumeCode.message}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className={cn(
            "w-1/2 flex flex-col bg-gray-100",
            isFullscreen && "w-full"
          )}>
            <div className="px-4 py-2 bg-background border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">PDF Preview</span>
                {previewUrl && (
                  <span className="text-xs text-muted-foreground">
                    {previewZoom}%
                  </span>
                )}
              </div>
              
              {previewUrl && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))}
                  >
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setPreviewZoom(Math.min(200, previewZoom + 10))}
                  >
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen preview"}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={closePreview}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto bg-gray-200 p-4">
              {previewUrl ? (
                <div 
                  className="mx-auto bg-white shadow-2xl"
                  style={{ 
                    width: `${previewZoom}%`,
                    minHeight: "100%"
                  }}
                >
                  <iframe 
                    src={previewUrl}
                    className="w-full h-full"
                    style={{ minHeight: "1000px" }}
                    title="Resume Preview"
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-sm">
                  {isPreviewing ? (
                    <>
                      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                      <p className="text-lg font-medium mb-2">Compiling LaTeX...</p>
                      <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Eye className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Preview your resume</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        Click the Preview button to compile your LaTeX code and see the formatted PDF
                      </p>
                      <Button 
                        onClick={handlePreview}
                        disabled={!resumeId}
                        size="lg"
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
      </main>

      {/* Bottom Action Bar */}
      <div className="border-t border-border bg-background px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Professional LaTeX Editor</span>
            <span>•</span>
            <Link href="/ats-tools" className="text-primary hover:underline flex items-center gap-1">
              Run ATS Analysis →
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}
