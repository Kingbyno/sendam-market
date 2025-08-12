import { ItemDetails } from "@/components/item/item-details"
import { getItemById } from "@/lib/queries/item-queries"
import { notFound } from "next/navigation"
import { RecentItemsSection } from "@/components/marketplace/recent-items-section"

interface ItemPageProps {
  params: {
    id: string
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const item = await getItemById(params.id)

  if (!item || item.status !== "APPROVED") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <ItemDetails item={item} />
      </main>
      <RecentItemsSection />
    </div>
  )
}
