import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  // Pass through all requests - auth is handled by SessionProvider
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"
  ],
}
