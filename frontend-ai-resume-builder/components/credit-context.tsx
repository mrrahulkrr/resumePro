"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface CreditContextType {
  credits: number
  useCredit: () => void
  addCredits: (amount: number) => void
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(50) // Starting credits

  const useCredit = () => setCredits((prev) => Math.max(0, prev - 1))
  const addCredits = (amount: number) => setCredits((prev) => prev + amount)

  return <CreditContext.Provider value={{ credits, useCredit, addCredits }}>{children}</CreditContext.Provider>
}

export const useCredits = () => {
  const context = useContext(CreditContext)
  if (!context) throw new Error("useCredits must be used within a CreditProvider")
  return context
}
