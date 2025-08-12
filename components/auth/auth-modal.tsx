"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { signUp } from "@/lib/auth/actions"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { FaGoogle, FaFacebook } from "react-icons/fa"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [currentMode, setCurrentMode] = useState(mode)
  const { toast } = useToast()

  async function handleEmailAuth(formData: FormData) {
    setIsLoading(true)

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const fullName = formData.get("fullName") as string

      if (currentMode === "login") {
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
      } else {
        const result = await signUp(email, password, fullName)
        if (!result.success) {
          throw new Error(result.error)
        }
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        })
      }

      onClose()
    } catch (error: any) {
      let errorMsg = error?.message || (currentMode === "login"
            ? "Failed to sign in. Please check your credentials."
            : "Failed to create account. Please try again.")
      
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
        description: `Signed in with ${provider === "google" ? "Google" : "Facebook"}.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to sign in with ${provider === "google" ? "Google" : "Facebook"}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {currentMode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {currentMode === "login" 
              ? "Sign in to your account to continue" 
              : "Create a new account to get started"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
          <form action={handleEmailAuth} className="space-y-4">
            {currentMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id="fullName" name="fullName" placeholder="Enter your full name" className="pl-10" required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input id="email" name="email" type="email" placeholder="Enter your email" className="pl-10" required />
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

            <Button type="submit" className="w-full py-6" disabled={isLoading}>
              {isLoading ? "Loading..." : currentMode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setCurrentMode(currentMode === "login" ? "signup" : "login")}
            >
              {currentMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
