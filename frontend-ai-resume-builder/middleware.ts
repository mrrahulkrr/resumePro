import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/editor", "/results", "/ats-tools", "/templates"]

export default async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || "development-secret-change-in-production"

  let token = null
  try {
    token = await getToken({ req, secret })
  } catch (error) {
    // If token decryption fails, treat as not logged in
    console.error("Token verification failed:", error)
  }

  const isLoggedIn = !!token
  const { pathname } = req.nextUrl

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !isLoggedIn) {
    // Redirect to sign in with callback URL
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}