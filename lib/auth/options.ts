import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma/client"
import * as bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider for email/password authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.")
        }
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
          if (!user) {
            throw new Error("No account found with this email.")
          }
          if (!user.passwordHash) {
            throw new Error("This account does not have a password set. Please use social login or reset your password.")
          }
          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!isPasswordValid) {
            throw new Error("Incorrect password. Please try again.")
          }
          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            avatar: user.avatar ?? undefined,
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error("Authentication failed. Please try again.")
        }
      }
    }),
    
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (account && user) {
        token.userId = user.id
      }
      
      // Always check admin status on token refresh and initial sign in
      if (user?.email) {
        token.isAdmin = isAdminEmail(user.email)
      } else if (token.email) {
        token.isAdmin = isAdminEmail(token.email)
      }
      
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // For OAuth providers, create user if they don't exist
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split("@")[0],
                avatar: user.image,
              }
            })
          }
        } catch (error) {
          console.error("Error creating user:", error)
          return false
        }
      }

      return true
    }
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
}

// Helper function to check if email is admin
function isAdminEmail(email: string): boolean {
  if (!email) return false
  
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
    
  return adminEmails.includes(email.toLowerCase())
}
