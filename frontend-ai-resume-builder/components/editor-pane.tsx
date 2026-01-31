"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface EditorPaneProps {
  initialValue?: string
  onSuggestionsClick?: () => void
}

export function EditorPane({ initialValue = "", onSuggestionsClick }: EditorPaneProps) {
  const [code, setCode] = useState(initialValue)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col">
        <label className="text-sm font-semibold mb-2">Resume LaTeX</label>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 font-mono text-sm"
          placeholder="\documentclass{article}..."
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-semibold mb-2">Preview</label>
        <div className="flex-1 bg-white border border-border rounded-lg p-6 overflow-auto">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground text-sm italic">LaTeX preview will render here...</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 flex gap-3">
        <Button onClick={onSuggestionsClick} variant="outline" className="flex-1 bg-transparent">
          Apply Suggestions
        </Button>
        <Button className="flex-1">Download PDF</Button>
      </div>
    </div>
  )
}
