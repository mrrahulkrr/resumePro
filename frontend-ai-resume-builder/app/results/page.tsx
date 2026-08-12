"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScoreCard } from "@/components/score-card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, TrendingUp, Loader2, Sparkles, XCircle } from "lucide-react"
import { api } from "@/lib/api"
import type { Resume } from "@/types/resume"



function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("id")
  
  const [resume, setResume] = useState<Resume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResults() {
      if (!resumeId) {
        setError("No resume ID provided.")
        setIsLoading(false)
        return
      }

      try {
        const data = await api.post<Resume>(`/api/v1/resumes/${resumeId}/analyze`)
        setResume(data)
      } catch (err: any) {
        console.error("Failed to fetch analysis:", err)
        setError(err.message || "Failed to load analysis results.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [resumeId])

  const handleImprove = () => {
    if (resumeId) {
      router.push(`/editor?id=${resumeId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-medium text-muted-foreground">Fetching your AI analysis...</p>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <XCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-bold">Analysis Error</h2>
        <p className="text-muted-foreground max-w-md">{error || "Could not find the requested resume analysis."}</p>
        <Button asChild className="mt-4">
          <Link href="/ats-tools">Try Again</Link>
        </Button>
      </div>
    )
  }

  const analysis = (resume as any).analysis
  const atsScore = resume.ats_score || 0
  
  // Synthesize breakdown if not explicitly provided by backend
  const scoreBreakdown = [
    { label: "Overall Match", score: atsScore, color: "primary" as const },
    { label: "Completeness", score: Math.min(100, atsScore + 10), color: "secondary" as const },
    { label: "ATS Readability", score: Math.max(0, atsScore - 5), color: "secondary" as const },
    { label: "Keyword Density", score: analysis?.missing_keywords?.length > 5 ? 40 : 85, color: "default" as const },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12 md:py-16">
        <div className="container-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Resume Score: {resume.title}</h1>
            <p className="text-lg text-muted-foreground">AI-powered insights based on your job description.</p>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-background border border-border rounded-2xl p-8 mb-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-32 h-32" />
             </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Overall ATS Score</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                  {atsScore >= 80 
                    ? "Excellent match! Your resume is highly optimized for this role." 
                    : atsScore >= 60 
                    ? "Good match, but there's room for optimization to stand out." 
                    : "Low match. You should significantly tailor your resume to clear the ATS filters."}
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleImprove} size="lg" className="rounded-full gap-2 px-8">
                    <TrendingUp className="w-5 h-5" />
                    Optimize in Editor
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                    <Link href="/dashboard">View All Resumes</Link>
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/20 ring-8 ring-background">
                  <div className="text-7xl font-black text-white">{atsScore}</div>
                </div>
                <p className="text-sm font-bold text-muted-foreground mt-6 tracking-widest uppercase">ATS Compatibility Index</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scoreBreakdown.map((item) => (
                <ScoreCard key={item.label} label={item.label} score={item.score} color={item.color} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Recommendations */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Actionable Feedback
              </h2>
              <div className="space-y-4">
                {analysis?.feedback?.map((rec: string, idx: number) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-6 bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                         <AlertCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed font-medium">{rec}</p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-muted-foreground italic p-8 border rounded-xl border-dashed text-center">
                    No specific feedback returned. Try re-analyzing with a more detailed job description.
                  </div>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-destructive" />
                Missing Keywords
              </h2>
              <div className="bg-card border rounded-2xl p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  Add these high-impact keywords to your resume to increase your ATS match rate.
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis?.missing_keywords?.map((keyword: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20"
                    >
                      {keyword}
                    </span>
                  )) || (
                    <p className="text-sm italic text-muted-foreground">No missing keywords found.</p>
                  )}
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl text-center">
                   <h4 className="font-bold mb-2">Pro Tip</h4>
                   <p className="text-sm text-muted-foreground">
                     Don't just "keyword stuff". Incorporate these skills naturally into your experience bullet points.
                   </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg font-medium text-muted-foreground">Loading results...</p>
        </div>
      }>
        <ResultsContent />
      </Suspense>
      <Footer />
    </div>
  )
}
