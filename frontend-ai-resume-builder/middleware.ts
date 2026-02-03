import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/editor", "/results", "/ats-tools", "/templates"]

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the route is protected or related to auth
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthPage = pathname.startsWith("/auth/")

  // Optimization: If the route is public and not an auth page, allow access without invoking token check
  // This avoids potential Edge Runtime errors with getToken() on public pages
  if (!isProtected && !isAuthPage) {
    return NextResponse.next()
  }

  // Use a fallback secret to prevent runtime crashes if env var is missing
  const secret = process.env.NEXTAUTH_SECRET || "development-secret-change-in-production"

  let token = null
  try {
    // Only call getToken if we really need it
    token = await getToken({ req, secret })
  } catch (error) {
    // Log error but don't crash middleware if possible
    console.error("Token verification failed:", error)
  }

  const isLoggedIn = !!token

  if (isProtected && !isLoggedIn) {
    // Redirect to sign in with callback URL
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  // Exclude static files, generic api routes (unless we specifically want to protect them), and next internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
}
