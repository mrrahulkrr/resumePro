"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Download, Check } from "lucide-react"

interface EditorPaneProps {
  initialValue?: string
  onSuggestionsClick?: () => void
  onDownloadPDF?: () => void
}

export function EditorPane({ initialValue = "", onSuggestionsClick, onDownloadPDF }: EditorPaneProps) {
  const [code, setCode] = useState(initialValue)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load MathJax library for LaTeX rendering
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6'
      document.head.appendChild(script)

      const mathJaxScript = document.createElement('script')
      mathJaxScript.id = 'MathJax-script'
      mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
      mathJaxScript.async = true
      document.head.appendChild(mathJaxScript)

      mathJaxScript.onload = () => {
        renderPreview()
      }
    }
  }, [])

  useEffect(() => {
    renderPreview()
  }, [code])

  const renderPreview = async () => {
    if (!previewRef.current) return
    
    try {
      setError(null)
      setIsProcessing(true)

      // Convert basic LaTeX resume structure to HTML preview
      const htmlContent = convertLatexToHtml(code)
      previewRef.current.innerHTML = htmlContent

      // Trigger MathJax rendering if available
      if (typeof window !== 'undefined' && (window as any).MathJax) {
        await (window as any).MathJax.typesetPromise([previewRef.current])
      }
    } catch (err) {
      console.error("[v0] LaTeX render error:", err)
      setError("Error rendering LaTeX preview")
      previewRef.current.innerHTML = `<div class="text-destructive text-sm p-4"><strong>Render Error:</strong> ${err instanceof Error ? err.message : 'Unknown error'}</div>`
    } finally {
      setIsProcessing(false)
    }
  }

  const convertLatexToHtml = (latexCode: string): string => {
    let html = '<div class="prose prose-sm max-w-none dark:prose-invert">'

    // Handle document class and main structure
    if (!latexCode.trim()) {
      return '<div class="text-muted-foreground text-sm italic p-4">Enter LaTeX code to preview...</div>'
    }

    // Extract content between \begin{document} and \end{document}
    const docMatch = latexCode.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
    const content = docMatch ? docMatch[1] : latexCode;

    // Process sections
    let processedContent = content
      .replace(/\\section\{([^}]+)\}/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/\\subsection\{([^}]+)\}/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
      .replace(/\\texttt\{([^}]+)\}/g, '<code class="bg-muted px-1 rounded">$1</code>')
      .replace(/\\item\s+/g, '<li class="ml-4">') // Convert items
      .replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
      .replace(/\\\\/g, '<br />')
      .replace(/\\newline/g, '<br />')
      .replace(/~{2,}/g, ' ')
      .replace(/\n\n/g, '</p><p class="my-2">')
      .replace(/\n/g, ' ');

    // Wrap text paragraphs
    if (!processedContent.includes('<p>')) {
      processedContent = `<p class="my-2">${processedContent}</p>`
    }

    html += processedContent
    html += '</div>'

    return html
  }

  const handleDownload = async () => {
    if (onDownloadPDF) {
      try {
        setIsProcessing(true)
        await onDownloadPDF()
      } catch (err) {
        setError("Failed to download PDF")
        console.error("[v0] PDF download error:", err)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-2 flex items-center gap-2">
            <span>Resume LaTeX</span>
            <span className="text-xs text-muted-foreground">(auto-saves)</span>
          </label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 font-mono text-xs md:text-sm resize-none"
            placeholder={`\\documentclass{article}
\\usepackage[margin=0.5in]{geometry}
\\begin{document}
\\section{John Doe}
Your resume content here...
\\end{document}`}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-2">Preview</label>
          <div 
            ref={previewRef}
            className="flex-1 bg-white text-black border border-border rounded-lg p-6 overflow-auto dark:bg-slate-900 dark:text-white"
          >
            <div className="text-muted-foreground text-sm italic">Enter LaTeX code to preview...</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 flex-col sm:flex-row">
        <Button 
          onClick={onSuggestionsClick} 
          variant="outline" 
          className="flex-1 bg-transparent"
          disabled={isProcessing}
        >
          Apply AI Suggestions
        </Button>
        <Button 
          className="flex-1"
          onClick={handleDownload}
          disabled={isProcessing || !code.trim()}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Processing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
