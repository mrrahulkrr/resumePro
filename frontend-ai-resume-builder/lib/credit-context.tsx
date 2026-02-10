"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface CreditContextType {
  credits: number
  maxCredits: number
  consumeCredits: (amount: number) => boolean
  consumeAICredits: () => Promise<boolean>
  addCredits: (amount: number) => void
  refreshCredits: () => Promise<void>
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession()
  const maxCredits = 100
  const [credits, setCredits] = useState(10) // Initial fallback

  useEffect(() => {
    if (session?.user?.credits !== undefined) {
      setCredits(session.user.credits)
    }
  }, [session])

  const consumeCredits = (amount: number) => {
    if (credits >= amount) {
      setCredits(prev => prev - amount)
      return true
    }
    return false
  }

  const consumeAICredits = async () => {
    const cost = 10 // AI analysis costs 10 credits
    if (credits >= cost) {
      setCredits(prev => prev - cost)
      // Credits are also deducted on backend, but we refresh session to sync
      return true
    }
    return false
  }

  const addCredits = (amount: number) => {
    setCredits(prev => Math.min(prev + amount, maxCredits))
  }

  const refreshCredits = async () => {
    await update()
  }

  return (
    <CreditContext.Provider value={{ 
      credits, 
      maxCredits, 
      consumeCredits, 
      consumeAICredits,
      addCredits, 
      refreshCredits 
    }}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditProvider")
  }
  return context
}
