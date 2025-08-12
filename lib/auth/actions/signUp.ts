import { prisma } from "@/lib/prisma/client"
import * as bcrypt from "bcryptjs"

export async function signUp(email: string, password: string, fullName?: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error("A user with this email already exists.")
    }
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12)
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: fullName || email.split("@")[0],
      },
    })
    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Failed to create account. Please try again.")
  }
}