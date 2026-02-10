import NextAuth, { getServerSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { z } from "zod"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

// Extend types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      email?: string
      name?: string
      image?: string | null
      credits?: number
    }
  }
  interface User {
    accessToken?: string
    refreshToken?: string
    credits?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    credits?: number
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedCredentials = loginSchema.parse(credentials)

          const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: validatedCredentials.email,
              password: validatedCredentials.password,
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Login failed")
          }

          const data = await response.json()

          // Fetch user data
          const userResponse = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          })

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data")
          }

          const user = await userResponse.json()

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.full_name || user.username,
            image: user.profile_picture,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            credits: user.credits,
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.credits = user.credits
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub
        session.accessToken = token.accessToken
        session.user.credits = token.credits
      }
      return session
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 60, // 30 minutes
    updateAge: 5 * 60, // Refresh every 5 minutes
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
}
const handler = NextAuth(authConfig)
export const auth = () => getServerSession(authConfig)
export { handler }
