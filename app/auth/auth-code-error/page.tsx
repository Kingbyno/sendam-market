"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ShoppingBag } from "lucide-react"

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const description = searchParams.get("description")

  const getErrorMessage = () => {
    switch (error) {
      case "access_denied":
        return {
          title: "Access Denied",
          message: "You cancelled the authentication process. Please try again if you want to sign in.",
        }
      case "exchange_failed":
        return {
          title: "Authentication Failed",
          message: description || "Failed to complete the sign-in process. Please try again.",
        }
      case "callback_failed":
        return {
          title: "Sign-in Error",
          message: "Something went wrong during sign-in. Please try again.",
        }
      case "no_code":
        return {
          title: "Invalid Request",
          message: "The authentication request was invalid. Please try signing in again.",
        }
      default:
        return {
          title: "Authentication Error",
          message: description || "An unexpected error occurred during sign-in. Please try again.",
        }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Sendam</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">{errorInfo.title}</CardTitle>
            <CardDescription className="text-gray-600">{errorInfo.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full">Try Signing In Again</Button>
              </Link>

              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">
                  Create New Account
                </Button>
              </Link>
            </div>

            {error && (
              <div className="mt-6 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">
                  <strong>Error Code:</strong> {error}
                </p>
                {description && (
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Details:</strong> {description}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
