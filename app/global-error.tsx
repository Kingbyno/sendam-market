'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mb-6 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Application Error</CardTitle>
              <CardDescription className="text-base">
                A critical error occurred in the application. We apologize for the inconvenience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-sm text-gray-600">
                <p>This error has been logged for investigation.</p>
                {error.digest && (
                  <p className="mt-2 font-mono bg-gray-100 p-2 rounded">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                <Button onClick={reset} size="lg" className="w-full">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try again
                </Button>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <a href="/">
                    <Home className="mr-2 h-5 w-5" />
                    Go to Homepage
                  </a>
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>If this problem persists, please contact support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
