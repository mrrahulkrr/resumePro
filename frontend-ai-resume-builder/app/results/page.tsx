"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

import { Footer } from "@/components/footer"
import { ScoreCard } from "@/components/score-card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()

  const atsScore = 78
  const scoreBreakdown = [
    { label: "Skills Match", score: 85, color: "secondary" as const },
    { label: "Experience Match", score: 72, color: "primary" as const },
    { label: "Formatting Score", score: 81, color: "secondary" as const },
    { label: "Keyword Density", score: 68, color: "default" as const },
  ]

  const recommendations = [
    {
      title: "Add more technical keywords",
      description:
        "Include specific technologies mentioned in the job description like React, Node.js, and TypeScript.",
      priority: "high",
    },
    {
      title: "Improve formatting consistency",
      description: "Ensure consistent bullet point formatting and spacing throughout the document.",
      priority: "medium",
    },
    {
      title: "Quantify achievements",
      description: 'Add metrics and numbers to your accomplishments (e.g., "Increased performance by 40%").',
      priority: "high",
    },
    {
      title: "Reorder experience sections",
      description: "Move your most relevant experiences to the top to improve initial impression.",
      priority: "medium",
    },
  ]

  const handleImprove = () => {
    router.push("/editor")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Your ATS Analysis</h1>
            <p className="text-lg text-muted-foreground">Here's how your resume scores against the job description.</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white border border-border rounded-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Overall ATS Score</h2>
                <p className="text-muted-foreground mb-6">Your resume has a strong match with the job requirements.</p>
                <Button onClick={handleImprove} className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Improve Resume in Editor
                </Button>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <div className="text-5xl font-bold text-white">{atsScore}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">out of 100</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scoreBreakdown.map((item) => (
                <ScoreCard key={item.label} label={item.label} score={item.score} color={item.color} />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-5 ${
                    rec.priority === "high" ? "border-orange-200 bg-orange-50" : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        rec.priority === "high" ? "text-orange-600" : "text-yellow-600"
                      }`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ${
                        rec.priority === "high" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rec.priority === "high" ? "High" : "Medium"} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2 text-green-900">Ready to improve your resume?</h3>
                <p className="text-green-800 text-sm mb-4">
                  Our editor makes it easy to implement these suggestions and export your improved resume.
                </p>
                <Button onClick={handleImprove} className="bg-green-600 hover:bg-green-700 text-white">
                  Go to Editor
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/upload">Analyze Another Resume</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
