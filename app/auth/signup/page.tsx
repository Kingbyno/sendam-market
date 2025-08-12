"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { signUp } from "@/lib/auth/actions"
import { signIn } from "next-auth/react"
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag } from "lucide-react"
import { FaGoogle, FaFacebook, FaTwitter, FaGithub } from "react-icons/fa"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleEmailSignup(formData: FormData) {
    setIsLoading(true)
    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string
      const fullName = formData.get("fullName") as string

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }
      if (!acceptTerms) {
        throw new Error("Please accept the terms and conditions")
      }

      // Call the server action and handle result
      const result = await signUp(email, password, fullName)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to Sendam! Redirecting to your confirmation page...",
        variant: "default",
      })
      router.push("/auth/signup-success")
    } catch (error: any) {
      let errorMsg = error?.message || "Failed to create account. Please try again."
      
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
      // Use NextAuth signIn for social providers
      await signIn(provider)

      toast({
        title: "Success!",
        description: `Signed up with ${provider === "google" ? "Google" : "Facebook"}.`,
      })

      // Note: Success handling and redirect is done in the callback route
      // New OAuth users will be redirected to signup-success page
    } catch (error: any) {
      console.error(`${provider} auth error:`, error)
      toast({
        title: "Authentication Error",
        description:
          error.message || `Failed to sign up with ${provider === "google" ? "Google" : "Facebook"}. Please try again.`,
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
            <span className="text-2xl font-bold text-gray-900">Sendam</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join Nigeria's most trusted marketplace</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">Choose your preferred sign up method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 py-6"
                onClick={() => handleSocialAuth("google")}
                disabled={isLoading}
              >
                <FaGoogle className="h-4 w-4 text-red-500" />
                Google
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 py-6"
                onClick={() => handleSocialAuth("facebook")}
                disabled={isLoading}
              >
                <FaFacebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
            </div>

            {/* Additional Social Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center justify-center gap-2 py-6" disabled={true}>
                <FaTwitter className="h-4 w-4 text-blue-400" />
                Twitter
                <span className="text-xs text-gray-400">(Soon)</span>
              </Button>

              <Button variant="outline" className="flex items-center justify-center gap-2 py-6" disabled={true}>
                <FaGithub className="h-4 w-4 text-gray-700" />
                GitHub
                <span className="text-xs text-gray-400">(Soon)</span>
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
            <form action={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="fullName" name="fullName" placeholder="Enter your full name" className="pl-10" required />
                </div>
              </div>

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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full py-6" disabled={isLoading || !acceptTerms}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
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
