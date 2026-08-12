"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"


import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Target, Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Premium AI Look */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="container-center relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Sparkles className="w-4 h-4" />
                <span>Next-gen AI Resume Intelligence is here</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-tight">
                Craft the Future of Your Career.
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
                The most advanced AI resume engine ever built. Score 10x higher in ATS systems and land interviews with
                industry leaders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full group" asChild>
                  <Link href="/dashboard">
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-full" asChild>
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>

              {/* Social Proof / Stats */}
              <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/50">
                {[
                  { label: "Active Users", value: "50k+" },
                  { label: "Interviews Booked", value: "120k+" },
                  { label: "Success Rate", value: "94%" },
                  { label: "AI Models", value: "LLM-4.5" },
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Intelligence at every step.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                We've combined deep learning with career expertise to give you an unfair advantage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              <div className="md:col-span-2 row-span-1 p-8 rounded-3xl bg-card border flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Advanced Neural ATS Analysis</h3>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Our proprietary neural network analyzes your resume exactly like modern enterprise ATS systems do,
                    predicting your match probability with 99% accuracy.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-medium cursor-pointer relative z-10">
                  Explore Engine <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="md:col-span-1 row-span-2 p-8 rounded-3xl bg-primary text-primary-foreground flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold leading-tight">Contextual AI Rewriting</h3>
                  <p className="text-primary-foreground/80 text-lg">
                    Don't just fix typos. Our AI understands the context of your achievements and rewrites them using
                    high-impact power words that recruiters look for.
                  </p>
                </div>
                <div className="aspect-square bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                  <div className="text-4xl font-black opacity-40">AI-REV</div>
                </div>
              </div>

              <div className="md:col-span-1 row-span-1 p-8 rounded-3xl bg-card border flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Keyword Extraction</h3>
                  <p className="text-muted-foreground">
                    Automatically extract and inject missing keywords from job descriptions.
                  </p>
                </div>
              </div>

              <div className="md:col-span-1 row-span-1 p-8 rounded-3xl bg-card border flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Enterprise Privacy</h3>
                  <p className="text-muted-foreground">
                    Your data is encrypted and never sold. We prioritize your career security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="container-center text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Ready to skyrocket your <br /> career potential?
            </h2>
            <div className="flex justify-center">
              <Button size="lg" className="h-16 px-12 text-xl rounded-full" asChild>
                <Link href="/templates">Get Started For Free</Link>
              </Button>
            </div>
            <p className="text-muted-foreground">No credit card required. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
