"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { Session } from "next-auth"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signin")
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    accessToken: (session as any)?.accessToken,
  }
}
