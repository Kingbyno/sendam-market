"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Shield, AlertCircle, CheckCircle, User } from "lucide-react"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Helper function to check if email is admin
  function isAdminEmail(email: string): boolean {
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",")
    return adminEmails.includes(email.toLowerCase())
  }

  async function handleAdminLogin(formData: FormData) {
    setIsLoading(true)
    setLoginAttempted(true)

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      // Check if user is admin first
      if (!isAdminEmail(email)) {
        throw new Error(
          `Access denied. The email "${email}" is not authorized for admin access. Please contact the administrator or use an authorized admin email.`,
        )
      }

      // Try to sign in the user with NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Admin access granted",
        description: "Welcome to the admin dashboard.",
      })

      // Redirect to admin page
      router.push("/admin")
    } catch (error: any) {
      console.error("Admin login error:", error)

      let errorMessage = "Invalid credentials or access denied."

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials."
        setShowCreateUser(true)
      } else if (error.message.includes("Access denied")) {
        errorMessage = error.message
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account before signing in."
      }

      toast({
        title: "Access Denied",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Sendam</span>
          </Link>
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
          <p className="mt-2 text-gray-600">Restricted area - Admin credentials required</p>
        </div>

        {/* Admin Emails Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Authorized Admin Emails:</strong>
            <br />• admin@sendam.com
            <br />• admin@example.com
            <br />• promisetheking@gmail.com
            <br />• kingbyno007@gmail.com ✨
            <br />
            <em className="text-xs">Only these emails can access the admin panel</em>
          </AlertDescription>
        </Alert>

        {/* Demo Credentials */}
        <Alert className="border-green-200 bg-green-50">
          <User className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Your Admin Account:</strong>
            <br />
            Email: kingbyno007@gmail.com
            <br />
            Use your existing password
            <br />
            <em className="text-xs">Your email is now authorized for admin access!</em>
          </AlertDescription>
        </Alert>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Admin Login</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter authorized admin email"
                    className="pl-10"
                    defaultValue="kingbyno007@gmail.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Your email is pre-filled and authorized</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Use your existing account password</p>
              </div>

              <Button type="submit" className="w-full py-6 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Admin Dashboard"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>
                Not an admin?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Regular sign in
                </Link>
              </p>
              <p className="text-xs text-gray-500">Need admin access? Contact the system administrator.</p>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions - Show after failed login attempt */}
        {(loginAttempted || showCreateUser) && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Account Setup:</strong>
              <br />
              If you don't have an account with kingbyno007@gmail.com yet:
              <br />
              1. Go to{" "}
              <Link href="/auth/signup" className="text-blue-600 underline">
                Sign Up
              </Link>
              <br />
              2. Create account with email: kingbyno007@gmail.com
              <br />
              3. Verify your email if required
              <br />
              4. Return here and login with your password
              <br />
              <br />
              <strong>Alternative:</strong> Use the demo account admin@sendam.com
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const emailInput = document.getElementById("email") as HTMLInputElement
              if (emailInput) {
                emailInput.value = "kingbyno007@gmail.com"
              }
            }}
            className="text-sm"
          >
            Use Your Email
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const emailInput = document.getElementById("email") as HTMLInputElement
              const passwordInput = document.getElementById("password") as HTMLInputElement
              if (emailInput && passwordInput) {
                emailInput.value = "admin@sendam.com"
                passwordInput.value = "admin123"
              }
            }}
            className="text-sm"
          >
            Demo Account
          </Button>
        </div>

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
