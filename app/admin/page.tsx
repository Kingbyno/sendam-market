export const dynamic = "force-dynamic"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getPendingItems } from "@/lib/actions/admin-actions"
import { redirect } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAllSellersPaymentInfo } from "@/lib/actions/payment-info-actions"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import type { Item } from "@/lib/types"

// Import SellerPaymentInfo type instead of defining locally
import type { SellerPaymentInfo } from "@/lib/types"

// Update PendingItem type to match dashboard expectations
type PendingItem = Item & {
  seller_name: string
  seller_email: string
  created_at: string  // Changed to string only
}

// Helper function to check if user is admin
function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}

export default async function AdminPage() {
  let session: Session | null = null
  let pendingItems: PendingItem[] = []
  let error: string | null = null
  let paymentInfo: (SellerPaymentInfo & { sellerEmail?: string })[] = []

  try {
    session = await getServerSession(authOptions)

    if (!session?.user) {
      console.log("No authenticated user")
      error = "No authenticated user"
    } else if (!isAdmin(session.user.email)) {
      console.log("User is not admin:", session.user.email)
      error = `Access denied - "${session.user.email}" is not authorized for admin access`
    } else {
      console.log("Admin user authenticated:", session.user.email)
    }

    // If we have a valid admin user, get pending items and payment info
    if (session?.user && !error) {
      try {
        const itemsResult = await getPendingItems()
        if (itemsResult.success && itemsResult.items) {
          pendingItems = itemsResult.items.map((item: any) => ({
            ...item,
            seller_name: item.seller?.name ?? "",
            seller_email: item.seller?.email ?? "",
            created_at: item.createdAt instanceof Date 
              ? item.createdAt.toISOString() 
              : item.createdAt?.toString() ?? ""
          })) as PendingItem[]
          console.log("Fetched pending items:", pendingItems.length)
        } else {
          console.error("Error fetching pending items:", itemsResult.error)
          pendingItems = []
        }
      } catch (itemsError) {
        console.error("Error fetching admin data:", itemsError)
        pendingItems = []
      }

      try {
        paymentInfo = await getAllSellersPaymentInfo()
        console.log("Fetched payment info:", paymentInfo.length)
      } catch (paymentError) {
        console.error("Error fetching payment info:", paymentError)
        paymentInfo = []
      }
    }
  } catch (pageError) {
    console.error("Admin page error:", pageError)
    error = "Failed to load admin page"
  }

  // Redirect if authentication error
  if (error && (error.includes("Authentication") || error.includes("No authenticated") || error.includes("Access denied"))) {
    redirect("/admin/login")
  }

  // Show login page if not authenticated
  if (!session?.user || error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access Required</h1>
              <p className="text-gray-600">You need admin privileges to access this page.</p>
            </div>

            <Alert className="border-red-200 bg-red-50 mb-6">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Login to Admin</h2>
              <p className="text-gray-600 mb-4">
                Please sign in with an authorized admin account to continue.
              </p>
              <Link href="/api/auth/signin" passHref>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Key className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboard
      adminId={session.user.id}
      initialPendingItems={pendingItems}
      initialPaymentInfo={paymentInfo}
    />
  )
}