'use client'
 
import { useEffect } from 'react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])
 
  return (
    <html>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Something went wrong!</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
