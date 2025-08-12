"use client"
export const dynamic = "force-dynamic"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ShoppingBag } from "lucide-react"

function AuthErrorInner() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = () => {
    switch (error) {
      case "Configuration":
        return {
          title: "Configuration Error",
          message: "There is a problem with the server configuration. Please contact support.",
        }
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You do not have permission to sign in with this account.",
        }
      case "Verification":
        return {
          title: "Verification Error",
          message: "The verification token has expired or has already been used.",
        }
      case "Default":
      default:
        return {
          title: "Authentication Error",
          message: "An error occurred during authentication. Please try again.",
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

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorInner />
    </Suspense>
  )
}
