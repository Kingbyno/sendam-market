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
        // NextAuth expects `authorize` to return a user object on success
        // or null on failure. Throwing errors causes a 401 response.
        if (!credentials?.email || !credentials?.password) {
          if (process.env.NODE_ENV === 'development') console.debug('Authorize: missing email or password')
          return null
        }

        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user) {
            if (process.env.NODE_ENV === 'development') console.debug('Authorize: no user found for', credentials.email)
            return null
          }

          if (!user.passwordHash) {
            if (process.env.NODE_ENV === 'development') console.debug('Authorize: user has no passwordHash', credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)
            .catch(err => {
              console.error("Password comparison error:", err);
              throw new Error("Password verification failed")
            });

          if (!isPasswordValid) {
            if (process.env.NODE_ENV === 'development') console.debug('Authorize: invalid password for', credentials.email)
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            image: user.avatar ?? undefined,
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
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
