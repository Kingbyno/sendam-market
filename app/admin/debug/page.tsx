import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  return (
    <div className="p-4">
      <h1>Admin Dashboard</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}