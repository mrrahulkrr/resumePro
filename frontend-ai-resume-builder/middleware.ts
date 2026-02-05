import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/editor", "/results", "/ats-tools", "/templates"]

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if the route is protected or related to auth
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthPage = pathname.startsWith("/auth/")

  // If no secret is configured, skip auth checks entirely (allows page to render)
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    // No auth configured - allow all access
    return NextResponse.next()
  }

  // For public pages, allow access without token check
  if (!isProtected && !isAuthPage) {
    return NextResponse.next()
  }

  // Dynamic import to avoid edge runtime issues
  let token = null
  try {
    const { getToken } = await import("next-auth/jwt")
    token = await getToken({ req, secret })
  } catch (error) {
    // If token check fails, allow access and let the page handle auth
    console.error("Middleware token check failed:", error)
    return NextResponse.next()
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
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
}
