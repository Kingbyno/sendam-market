import { searchItems } from "@/lib/queries/item-queries"
import { ItemGrid } from "../marketplace/item-grid"
import { Hero } from "./hero"
import { HowItWorks } from "./how-it-works"
import { Button } from "../ui/button"
import Link from "next/link"

export async function HomepageContent() {
  // Fetch only the most recent items for the "Featured" section
  const featuredItemsResult = await searchItems({ sortBy: "newest", limit: 4 })
  const featuredItems = featuredItemsResult.items

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <HowItWorks />

        {featuredItems.length > 0 && (
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Featured Items
                </h2>
                <Button asChild variant="outline">
                  <Link href="/marketplace">
                    View All
                  </Link>
                </Button>
              </div>
              <ItemGrid items={featuredItems} />
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
