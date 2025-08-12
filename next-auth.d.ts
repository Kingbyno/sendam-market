import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      avatar?: string
      isAdmin: boolean
    } & DefaultSession["user"]
  }
  interface User {
    id: string
    email: string
    name?: string
    avatar?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    isAdmin: boolean
  }
}
