'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
