import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Temporarily simplified middleware - no auth checks
// This helps identify if the issue is with next-auth/jwt in Edge Runtime

export default function middleware(req: NextRequest) {
  // Just pass through all requests for now
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match specific paths if needed
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"
  ],
}
