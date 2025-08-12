import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl mb-6 flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl">404 - Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-600">
            <p>This might be because:</p>
            <ul className="mt-2 text-sm space-y-1">
              <li>• The URL was typed incorrectly</li>
              <li>• The page has been removed or relocated</li>
              <li>• You don't have permission to access this page</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full">
              <Link href="/marketplace">
                Browse Marketplace
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
