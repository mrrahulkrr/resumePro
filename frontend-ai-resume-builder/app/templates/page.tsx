"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText, Sparkles, Loader2 } from "lucide-react"
import { Suspense } from "react"
import { api } from "@/lib/api"
import type { ResumeTemplate } from "@/types/resume"
import { useToast } from "@/components/ui/use-toast"

function TemplatesContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<ResumeTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const data = await api.get<ResumeTemplate[]>("/api/v1/templates")
        setTemplates(data)
      } catch (error) {
        console.error("Failed to fetch templates:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load templates. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchTemplates()
  }, [toast])

  const categories = ["All", ...new Set(templates.map(t => t.category))]

  const handleUseTemplate = async (templateId: string) => {
    setLoadingTemplate(templateId)
    try {
      // Fetch full template with content
      const template = await api.get<ResumeTemplate>(`/api/v1/templates/${templateId}`)
      
      // Create a new resume with this template
      const newResume = await api.post<{ id: number }>("/api/v1/resumes", {
        title: `${template.name} Resume`,
        content: template.content,
      })
      
      // Navigate to editor with the new resume
      router.push(`/editor?id=${newResume.id}`)
    } catch (error) {
      console.error("Failed to use template:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create resume from template. Please try again.",
      })
    } finally {
      setLoadingTemplate(null)
    }
  }

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
              Select from {templates.length} professionally designed LaTeX templates optimized for ATS systems
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading templates...</span>
            </div>
          )}

          {/* Templates Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all overflow-hidden">
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
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => handleUseTemplate(template.id)}
                          disabled={loadingTemplate === template.id}
                        >
                          {loadingTemplate === template.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Use Template
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredTemplates.length === 0 && (
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
