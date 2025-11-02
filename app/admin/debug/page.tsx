import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Return JSON response for easier machine inspection during debugging
  return new Response(JSON.stringify(session ?? null, null, 2), {
    headers: { "Content-Type": "application/json" },
  })
}