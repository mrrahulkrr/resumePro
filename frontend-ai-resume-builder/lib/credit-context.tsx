"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CreditContextType {
  credits: number
  maxCredits: number
  useCredits: (amount: number) => boolean
  addCredits: (amount: number) => void
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const maxCredits = 100
  const [credits, setCredits] = useState(maxCredits)

  useEffect(() => {
    const savedCredits = localStorage.getItem("resumepro_credits")
    if (savedCredits !== null) {
      setCredits(Number.parseInt(savedCredits, 10))
    }
  }, [])

  const useCredits = (amount: number) => {
    if (credits >= amount) {
      const newBalance = credits - amount
      setCredits(newBalance)
      localStorage.setItem("resumepro_credits", newBalance.toString())
      return true
    }
    return false
  }

  const addCredits = (amount: number) => {
    const newBalance = Math.min(credits + amount, maxCredits)
    setCredits(newBalance)
    localStorage.setItem("resumepro_credits", newBalance.toString())
  }

  return (
    <CreditContext.Provider value={{ credits, maxCredits, useCredits, addCredits }}>{children}</CreditContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditProvider")
  }
  return context
}
