"use client"

import { useState, useEffect } from "react"
import { useCredits } from "@/lib/credit-context"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Coins } from "lucide-react"

export function CreditBadge() {
  const [mounted, setMounted] = useState(false)
  const { credits, maxCredits } = useCredits()
  const percentage = (credits / maxCredits) * 100
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">{credits}</span>
            <div className="w-12 h-1.5 bg-background rounded-full overflow-hidden">
              <Progress value={percentage} className="h-full" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{credits} credits remaining</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
