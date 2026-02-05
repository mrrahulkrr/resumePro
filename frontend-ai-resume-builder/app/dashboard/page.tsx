"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCredits } from "@/lib/credit-context"
import { FileText, BarChart3, Clock, CreditCard, Plus, Download, ExternalLink, Search, TrendingUp, Edit } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { api } from "@/lib/api"
import type { Resume } from "@/types/resume"
import { formatDistanceToNow } from "date-fns"

// Mock data for other charts
const recentATSChecks = [
  { id: 1, role: "Senior Frontend Developer at Google", date: "3 days ago", score: 88 },
  { id: 2, role: "Full Stack Engineer at Vercel", date: "5 days ago", score: 76 },
]

const scoreProgressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 78 },
  { month: "May", score: 82 },
  { month: "Jun", score: 88 },
]

const creditUsageData = [
  { week: "Week 1", used: 15 },
  { week: "Week 2", used: 25 },
  { week: "Week 3", used: 20 },
  { week: "Week 4", used: 30 },
]

const skillsMatchData = [
  { skill: "Technical", match: 92 },
  { skill: "Leadership", match: 78 },
  { skill: "Communication", match: 85 },
  { skill: "Domain", match: 88 },
]

const skillsChartConfig = {
  match: {
    label: "Match",
    color: "hsl(var(--primary))",
  },
  Technical: { label: "Technical" },
  Leadership: { label: "Leadership" },
  Communication: { label: "Communication" },
  Domain: { label: "Domain" },
}

export default function DashboardPage() {
  const { credits, maxCredits } = useCredits()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchResumes() {
      try {
        const data = await api.get<Resume[]>("/api/v1/resumes/")
        // Sort by updated_at desc
        const sorted = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        setResumes(sorted)
      } catch (error) {
        console.error("Failed to fetch resumes", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResumes()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container-center">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Manage your resumes and track your progress.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/ats-tools">
                  <Search className="w-4 h-4 mr-2" />
                  ATS Check
                </Link>
              </Button>
              <Button asChild>
                <Link href="/editor">
                  <Plus className="w-4 h-4 mr-2" />
                  New Resume
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Credits Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {credits} / {maxCredits}
                </div>
                <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(credits / maxCredits) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Credits are used for AI analysis and template exports.
                </p>
              </CardContent>
            </Card>

            {/* Resume Stats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resumes.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  You have created {resumes.length} resumes.
                </p>
              </CardContent>
            </Card>

            {/* ATS Score Avg */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average ATS Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {resumes.length > 0 
                    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.ats_score || 0), 0) / resumes.length)
                    : 0
                  }%
                </div>
                <p className="text-xs text-muted-foreground mt-2">Based on your saved resumes.</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* ATS Score Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  ATS Score Progress
                </CardTitle>
                <CardDescription>Your resume scores over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreProgressData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Credit Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  Credit Usage
                </CardTitle>
                <CardDescription>Credits consumed in the last 4 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    used: {
                      label: "Credits",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="used" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Resumes */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Resumes</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/templates">View All</Link>
                  </Button>
                </div>
                <CardDescription>Your recently edited resume files.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">Loading resumes...</div>
                  ) : resumes.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No resumes found. Create your first one!
                    </div>
                  ) : (
                    resumes.slice(0, 5).map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{resume.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(resume.updated_at))} ago
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right mr-2">
                            <div className="text-xs text-muted-foreground">Score</div>
                            <div className="font-bold text-sm text-primary">{resume.ats_score || 0}%</div>
                          </div>
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/editor?id=${resume.id}`}>
                                <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ATS History */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ATS Analysis History</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/ats-tools">New Analysis</Link>
                  </Button>
                </div>
                <CardDescription>Performance of your resumes against job descriptions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentATSChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded">
                          <BarChart3 className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{check.role}</p>
                          <p className="text-xs text-muted-foreground">{check.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {check.score}% Match
                        </div>
                        <Button size="icon" variant="ghost">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Match Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Skills Match Breakdown
                </CardTitle>
                <CardDescription>How your skills align with recent job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={skillsChartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillsMatchData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} className="text-xs" />
                      <YAxis dataKey="skill" type="category" className="text-xs" width={100} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="match" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
