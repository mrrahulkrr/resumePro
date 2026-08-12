"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette, Type } from "lucide-react"

interface TemplateSettingsProps {
  latex: string
  onUpdate: (newLatex: string) => void
}

const COLORS = [
  { name: "Blue", hex: "0066CC" },
  { name: "Dark Blue", hex: "003366" },
  { name: "Purple", hex: "9333EA" },
  { name: "Emerald", hex: "10B981" },
  { name: "Teal", hex: "14B8A6" },
  { name: "Orange", hex: "EA580C" },
  { name: "Pink", hex: "EC4899" },
  { name: "Black", hex: "000000" },
  { name: "Slate", hex: "334155" },
]

const FONTS = [
  { name: "Default (Computer Modern)", command: "" },
  { name: "Helvetica (Sans)", command: "\\usepackage[scaled]{helvet}\n\\renewcommand\\familydefault{\\sfdefault}" },
  { name: "Times New Roman (Serif)", command: "\\usepackage{mathptmx}" },
  { name: "Palatino (Serif)", command: "\\usepackage{palatino}" },
  { name: "Charter (Serif)", command: "\\usepackage{charter}" },
  { name: "Fira Sans", command: "\\usepackage[sfdefault]{FiraSans}" },
]

export function TemplateSettings({ latex, onUpdate }: TemplateSettingsProps) {
  const [customHex, setCustomHex] = useState("")

  const handleColorChange = (hex: string) => {
    const cleanHex = hex.replace("#", "").toUpperCase()
    // Regex to find \definecolor{primary}{HTML}{...}
    const regex = /\\definecolor\{primary\}\{HTML\}\{[A-Fa-f0-9]{6}\}/g
    
    // Check if the template has the primary color defined
    if (regex.test(latex)) {
      const newLatex = latex.replace(regex, `\\definecolor{primary}{HTML}{${cleanHex}}`)
      onUpdate(newLatex)
    } else {
      // If it doesn't have it, we could inject it, but standardized templates should have it.
      // For templates that don't use colors initially, we could inject it before \begin{document}
      if (!latex.includes("\\definecolor{primary}")) {
        const injectColor = `\\usepackage{xcolor}\n\\definecolor{primary}{HTML}{${cleanHex}}\n\\begin{document}`
        const newLatex = latex.replace("\\begin{document}", injectColor)
        onUpdate(newLatex)
      }
    }
  }

  const handleCustomColorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (/^[0-9A-F]{6}$/i.test(customHex.replace("#", ""))) {
      handleColorChange(customHex)
    }
  }

  const handleFontChange = (fontCommand: string) => {
    // Replace everything between % FONT_PLACEHOLDER and \begin{document}
    const regex = /(% FONT_PLACEHOLDER)[\s\S]*?(?=\\begin\{document\})/
    if (regex.test(latex)) {
      const newLatex = latex.replace(regex, `$1\n${fontCommand}\n`)
      onUpdate(newLatex)
    } else {
      // Fallback if FONT_PLACEHOLDER is missing
      const newLatex = latex.replace("\\begin{document}", `% FONT_PLACEHOLDER\n${fontCommand}\n\\begin{document}`)
      onUpdate(newLatex)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10">
          <Palette className="w-4 h-4 mr-2" />
          Customize
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <DropdownMenuLabel className="px-0 pt-0">Theme Color</DropdownMenuLabel>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {COLORS.map((color) => (
            <button
              key={color.hex}
              title={color.name}
              className="w-8 h-8 rounded-full border border-border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ backgroundColor: `#${color.hex}` }}
              onClick={() => handleColorChange(color.hex)}
            />
          ))}
        </div>
        
        <form onSubmit={handleCustomColorSubmit} className="flex gap-2 mb-2">
          <div className="flex-1 flex items-center border rounded-md px-2 focus-within:ring-1 focus-within:ring-primary">
            <span className="text-muted-foreground text-sm">#</span>
            <input
              type="text"
              className="w-full bg-transparent border-none focus:outline-none text-sm px-1 py-1 uppercase"
              placeholder="HEX"
              maxLength={6}
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" variant="secondary" className="px-2">Apply</Button>
        </form>

        <DropdownMenuSeparator className="my-4" />

        <DropdownMenuLabel className="px-0 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Font Style
        </DropdownMenuLabel>
        <div className="flex flex-col gap-1 mt-2">
          {FONTS.map((font) => (
            <Button
              key={font.name}
              variant="ghost"
              size="sm"
              className="justify-start font-normal"
              onClick={() => handleFontChange(font.command)}
            >
              {font.name}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
