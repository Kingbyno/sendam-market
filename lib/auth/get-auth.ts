import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"

export async function getAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { user: null, session: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return { user: null, session: null }
  }

  return { user, session }
}

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email

  if (!email) {
    return false
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}
