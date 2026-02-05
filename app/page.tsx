"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"

export const dynamic = 'force-dynamic'
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Target, Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, BarChart3, Lock, Rocket } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Premium SaaS Look */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="container-center relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles className="w-4 h-4" />
                <span>The AI Resume Platform Trusted by 50,000+ Professionals</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-tight">
                Beat the ATS. Get the Interview.
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
                ResumePro's neural AI analyzes your resume like ATS systems do. Get optimized instantly, score higher in screenings, and land more interviews. Used by professionals at Google, Microsoft, Amazon, and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full group bg-primary hover:bg-primary/90" asChild>
                  <Link href="/templates">
                    Create Resume
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full group bg-secondary/80 hover:bg-secondary text-secondary-foreground" asChild>
                  <Link href="/ats-tools">
                    <Zap className="mr-2 w-5 h-5" />
                    Check ATS Score
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-full hidden sm:inline-flex" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>

              {/* Social Proof / Stats */}
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/50">
                {[
                  { label: "Active Users", value: "50k+" },
                  { label: "Interviews Won", value: "120k+" },
                  { label: "Avg Score Boost", value: "+34%" },
                  { label: "Companies Reached", value: "10k+" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container-center">
            <div className="mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">AI-Powered Resume Intelligence for Every Career Stage</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                From first-time job seekers to executives, ResumePro helps you optimize every aspect of your professional narrative.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              <div className="md:col-span-2 row-span-1 p-8 rounded-3xl bg-card border flex flex-col justify-between group overflow-hidden relative hover:shadow-xl transition-shadow">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Neural ATS Engine</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Our proprietary AI replicates exactly how enterprise ATS systems parse, score, and rank resumes. Identify gaps before humans see your resume.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-medium cursor-pointer relative z-10 group-hover:translate-x-1 transition-transform">
                  Learn More <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="md:col-span-1 row-span-2 p-8 rounded-3xl bg-primary text-primary-foreground flex flex-col justify-between hover:shadow-xl transition-shadow">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold leading-tight">AI Content Optimization</h3>
                  <p className="text-primary-foreground/80 text-lg">
                    Transform bullet points into compelling achievements. Our AI rewrites your experience using the exact keywords recruiters search for.
                  </p>
                </div>
                <div className="aspect-square bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                  <div className="text-4xl font-black opacity-40">PRO</div>
                </div>
              </div>

              <div className="md:col-span-1 row-span-1 p-8 rounded-3xl bg-card border flex flex-col justify-between group hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Smart Keyword Match</h3>
                  <p className="text-muted-foreground">
                    Analyze any job posting and auto-inject missing keywords intelligently, without sounding generic or forced.
                  </p>
                </div>
              </div>

              <div className="md:col-span-1 row-span-1 p-8 rounded-3xl bg-card border flex flex-col justify-between group hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Bank-Level Security</h3>
                  <p className="text-muted-foreground">
                    End-to-end encryption. Your data never touches third parties. GDPR and SOC 2 compliant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
          <div className="container-center">
            <div className="mb-16 text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Get Results in Three Simple Steps</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands getting hired at FAANG companies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Upload or Build",
                  description: "Import your existing resume or start fresh with our AI-powered templates designed by top recruiters.",
                  icon: <Rocket className="w-6 h-6" />
                },
                {
                  number: "02",
                  title: "AI Analysis",
                  description: "Get instant ATS compatibility score, keyword gaps, and detailed recommendations for improvement.",
                  icon: <BarChart3 className="w-6 h-6" />
                },
                {
                  number: "03",
                  title: "Optimize & Download",
                  description: "Apply AI suggestions, download as PDF, and start getting more interviews within days.",
                  icon: <Zap className="w-6 h-6" />
                }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -top-8 left-0 right-0 text-6xl font-black text-primary/10">{step.number}</div>
                  <div className="relative bg-card border rounded-2xl p-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="container-center text-center space-y-10 relative z-10">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                Stop Losing Out to <span className="text-primary">Better Resumes</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your qualifications are there. ResumePro makes sure ATS systems actually see them.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-16 px-12 text-lg rounded-full" asChild>
                <Link href="/templates">Create Your Resume</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg rounded-full bg-transparent" asChild>
                <Link href="/ats-tools">Quick ATS Check</Link>
              </Button>
            </div>
            <p className="text-muted-foreground">30 free credits to start. No credit card. Trusted by professionals worldwide.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
