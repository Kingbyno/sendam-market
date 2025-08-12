import { AdminCategoryManager } from "@/components/admin/category-manager"
import { getPendingCategories } from "@/lib/actions/admin-actions"
import { getCategories, type CategoryWithChildren } from "@/lib/queries/item-queries"
import { getAuth } from "@/lib/auth/get-auth"
import { redirect } from "next/navigation"

export default async function AdminCategoriesPage() {
  const { user } = await getAuth()

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)
  const isAdmin = user?.email ? adminEmails.includes(user.email) : false

  if (!isAdmin) {
    redirect("/auth/login")
  }

  const pendingCategoriesResult = await getPendingCategories()
  const allCategories = await getCategories()

  if (!pendingCategoriesResult.success) {
    // Handle error case, maybe show a toast or an error message
    console.error(pendingCategoriesResult.error)
    // Fallback to an empty array
    return <AdminCategoryManager pendingCategories={[]} allCategories={allCategories} />
  }

  return (
    <AdminCategoryManager
      pendingCategories={pendingCategoriesResult.categories || []}
      allCategories={allCategories}
    />
  )
}
