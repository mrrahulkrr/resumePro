import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/editor", "/results", "/ats-tools", "/templates"]

export default auth((req: any) => {
  const isLoggedIn = !!req.auth
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
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
