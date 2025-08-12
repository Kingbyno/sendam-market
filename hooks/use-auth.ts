"use client"

import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user || null
  const loading = status === "loading"

  // Check if the user is an admin
  const adminEmails =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").filter(Boolean)
      : []
  const isAdmin = user?.email ? adminEmails.includes(user.email) : false

  return {
    user,
    loading,
    isAdmin,
  }
}
