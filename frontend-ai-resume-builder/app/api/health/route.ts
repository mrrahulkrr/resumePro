export async function GET() {
  return Response.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    env: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasBackendUrl: !!process.env.NEXT_PUBLIC_BACKEND_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  })
}
