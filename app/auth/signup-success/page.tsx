"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Mail, ShoppingBag, ArrowRight, Sparkles } from "lucide-react"

export default function SignupSuccessPage() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = "/"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Sendam</span>
          </Link>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Account Created Successfully!</CardTitle>
            <CardDescription className="text-gray-600">
              Welcome to Sendam! Your marketplace journey begins now.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            <Alert className="border-green-200 bg-green-50">
              <Sparkles className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Congratulations!</strong> Your account has been created and you're ready to start buying and
                selling on Nigeria's most trusted marketplace.
              </AlertDescription>
            </Alert>

            {/* Email Verification Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Check your email:</strong> We've sent a verification link to confirm your account. Click the
                link to fully activate all features.
              </AlertDescription>
            </Alert>

            {/* What's Next */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What you can do now:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <span className="text-sm text-gray-700">Browse thousands of items in our marketplace</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <span className="text-sm text-gray-700">List your first item for sale</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <span className="text-sm text-gray-700">Chat with sellers and make secure purchases</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Start Exploring Marketplace
                </Button>
              </Link>

              <Link href="/sell">
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  List Your First Item
                </Button>
              </Link>
            </div>

            {/* Auto Redirect Notice */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              <p>Redirecting to homepage in {countdown} seconds...</p>
              <Link href="/" className="text-blue-600 hover:underline">
                Skip waiting
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help getting started?{" "}
            <Link href="/help" className="text-blue-600 hover:underline">
              Visit our help center
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
