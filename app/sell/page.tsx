import { SellerForm } from "@/components/seller/seller-form"
import { CategoryWithChildren, getCategories } from "@/lib/queries/item-queries"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sell | Xendam",
  description: "List your item for sale with secure escrow and a mobile-first experience.",
}

export default async function SellPage() {
  let categories: CategoryWithChildren[] = []
  let categoriesError = false

  try {
    categories = await getCategories()
  } catch (err) {
    // getCategories already catches errors, but in case something throws upstream,
    // mark an error so the UI can show a friendly message and allow a manual category.
    console.error("Failed to load categories for sell page:", err)
    categories = []
    categoriesError = true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Item</h1>
            <p className="text-gray-600">List your item for sale. It will be reviewed before going live.</p>
          </div>
          <SellerForm categories={categories} categoriesError={categoriesError} />
        </div>
      </main>
    </div>
  )
}
