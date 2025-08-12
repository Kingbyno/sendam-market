"use server"

import { prisma } from "@/lib/prisma/client"
import * as bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string, fullName?: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: fullName || email.split("@")[0],
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error("SignUp error:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to create account. Please try again." }
  }
}


