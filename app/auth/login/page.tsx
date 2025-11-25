/// <reference types="node" />

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { signUp } from "@/lib/auth/actions"
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from "lucide-react"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { useSession } from "next-auth/react"

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if already authenticated
    if (status === "authenticated" && session?.user) {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase())
      if (adminEmails.includes(session.user.email?.toLowerCase() || "")) {
        router.replace("/admin")
      } else {
        router.replace("/")
      }
    }
  }, [status, session, router])

  async function handleEmailLogin(formData: FormData) {
    setIsLoading(true)

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      // Check if user is admin and redirect accordingly
      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      let errorMsg = error?.message || "Failed to sign in. Please check your credentials."
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSocialAuth(provider: "google" | "facebook") {
    setIsLoading(true)

    try {
      // For now, we'll use NextAuth providers
      await signIn(provider)
    } catch (error: any) {
      console.error(`${provider} auth error:`, error)
      toast({
        title: "Authentication Error",
        description: `Failed to sign in with ${provider === "google" ? "Google" : "Facebook"}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Xendam</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Choose your preferred sign in method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6"
                onClick={() => handleSocialAuth("google")}
                disabled={isLoading}
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 py-6"
                onClick={() => handleSocialAuth("facebook")}
                disabled={isLoading}
              >
                <FaFacebook className="h-5 w-5 text-blue-600" />
                Continue with Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form action={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
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
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full py-6" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">New to Sendam?</span>
                </div>
              </div>

              <Link href="/auth/signup">
                <Button variant="outline" className="w-full py-6">
                  Create New Account
                </Button>
              </Link>

              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up for free
                </Link>
              </p>
            </div>
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
