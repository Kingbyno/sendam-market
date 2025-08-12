"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  children?: React.ReactNode
}

export function SignOutButton({ variant = "outline", size = "default", className = "", children }: SignOutButtonProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false 
      })

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSignOut}>
      {children || (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </>
      )}
    </Button>
  )
}
