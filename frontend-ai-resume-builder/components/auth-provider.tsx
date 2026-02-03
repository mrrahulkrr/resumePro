"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
