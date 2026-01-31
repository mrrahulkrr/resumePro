"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

const templates = [
  {
    id: 1,
    name: "Modern Professional",
    category: "Professional",
    description: "Clean and modern layout perfect for tech roles",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Executive",
    category: "Professional",
    description: "Bold design for senior leadership positions",
    color: "bg-slate-700",
  },
  {
    id: 3,
    name: "Creative Portfolio",
    category: "Creative",
    description: "Showcase your creative work with style",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Minimalist",
    category: "Simple",
    description: "Clean and straightforward design",
    color: "bg-gray-600",
  },
  {
    id: 5,
    name: "Tech Startup",
    category: "Modern",
    description: "Perfect for startup and tech company roles",
    color: "bg-green-500",
  },
  {
    id: 6,
    name: "Academic",
    category: "Professional",
    description: "Ideal for research and academic positions",
    color: "bg-indigo-600",
  },
  {
    id: 7,
    name: "Two Column",
    category: "Modern",
    description: "Maximize space with a dual-column layout",
    color: "bg-teal-500",
  },
  {
    id: 8,
    name: "Sales & Marketing",
    category: "Professional",
    description: "Results-focused design for sales roles",
    color: "bg-orange-500",
  },
  {
    id: 9,
    name: "Designer Pro",
    category: "Creative",
    description: "Show your design skills with this template",
    color: "bg-pink-500",
  },
  {
    id: 10,
    name: "Classic",
    category: "Simple",
    description: "Traditional resume format that never goes out of style",
    color: "bg-amber-600",
  },
]

function TemplatesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Professional", "Creative", "Modern", "Simple"]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-balance">Choose Your Resume Template</h1>
            <p className="text-lg text-muted-foreground">
              Select from 10 professionally designed templates optimized for ATS systems
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className={`${template.color} h-48 relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                    <FileText className="w-16 h-16 text-white/90" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link href="/editor">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Use Template
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={null}>
      <TemplatesContent />
    </Suspense>
  )
}
