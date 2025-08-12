import { SellerForm } from "@/components/seller/seller-form"
import { getCategories } from "@/lib/queries/item-queries"

export default async function SellPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Item</h1>
            <p className="text-gray-600">List your item for sale. It will be reviewed before going live.</p>
          </div>
          <SellerForm categories={categories} />
        </div>
      </main>
    </div>
  )
}
