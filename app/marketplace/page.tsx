import { Suspense } from "react"
import { searchItems, getCategories } from "@/lib/queries/item-queries"
import { MarketplaceClient } from "@/components/marketplace/marketplace-client"
import { MarketplaceSkeleton } from "@/components/marketplace/marketplace-skeleton"
import { getTopSellers } from "@/lib/queries/user-queries"
import { getActiveBanners } from "@/lib/queries/banner-queries"
import { ItemGrid } from "@/components/marketplace/item-grid"
import { PromotionalBanner } from "@/components/marketplace/promotional-banner"
import { TopSellers } from "@/components/marketplace/top-sellers"
import { CategoryGrid } from "@/components/marketplace/category-grid"
import { FlashSales } from "@/components/marketplace/flash-sales"
import { NoDatabaseFallback } from "@/components/marketplace/no-database-fallback"
import { checkEnvironment } from "@/lib/utils/env-checker"
// import { QuickActions } from "@/components/marketplace/quick-actions"

const ITEMS_PER_PAGE = 12

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Check environment variables for debugging
  if (process.env.NODE_ENV === 'production') {
    checkEnvironment()
  }

  const filters = {
    query: typeof searchParams?.query === "string" ? searchParams.query : "",
    category: typeof searchParams?.category === "string" ? searchParams.category : "",
    condition: typeof searchParams?.condition === "string" ? searchParams.condition : "",
    minPrice: typeof searchParams?.minPrice === "string" ? searchParams.minPrice : "",
    maxPrice: typeof searchParams?.maxPrice === "string" ? searchParams.maxPrice : "",
    location: typeof searchParams?.location === "string" ? searchParams.location : "",
    negotiable: typeof searchParams?.negotiable === "string" ? searchParams.negotiable : "",
    urgent: typeof searchParams?.urgent === "string" ? searchParams.urgent : "",
    warranty: typeof searchParams?.warranty === "string" ? searchParams.warranty : "",
    delivery: typeof searchParams?.delivery === "string" ? searchParams.delivery : "",
    sortBy: typeof searchParams?.sortBy === "string" ? searchParams.sortBy : "newest",
    page: searchParams?.page && typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1,
    limit: ITEMS_PER_PAGE,
  }

  // Fetch all data in parallel with error handling
  let itemsResult = { items: [], totalCount: 0 }
  let categories: any[] = []
  let banners: any[] = []
  let isDatabaseAvailable = true
  
  try {
    const [itemsData, categoriesData, bannersData] = await Promise.all([
      searchItems(filters),
      getCategories(),
      getActiveBanners(),
    ])
    itemsResult = itemsData
    categories = categoriesData
    banners = bannersData
  } catch (error) {
    console.error("Database connection error:", error)
    isDatabaseAvailable = false
  }

  const { items, totalCount: totalItems } = itemsResult

  // Show fallback UI when database is not available
  if (!isDatabaseAvailable) {
    return <NoDatabaseFallback />
  }

  // For MVP, flash sale items are the most recently discounted items
  const flashSaleItems = items
    .filter(item => item.originalPrice && item.originalPrice > item.price)
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Suspense fallback={<MarketplaceSkeleton />}>
        <MarketplaceClient
          initialItems={items}
          categories={categories}
          initialFilters={filters}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        >
          {/* Mobile-optimized layout */}
          <div className="lg:hidden space-y-6">
            {/* Quick Stats for Mobile */}
            <div className="bg-white rounded-xl p-4 mx-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {totalItems} items found
                </span>
                <span className="text-primary font-medium">
                  {flashSaleItems.length > 0 && `${flashSaleItems.length} flash sales`}
                </span>
              </div>
            </div>

            {flashSaleItems.length > 0 && (
              <section className="px-4">
                <FlashSales items={flashSaleItems} />
              </section>
            )}
            
            <section className="px-4">
              <h2 className="text-lg font-bold tracking-tight mb-4">
                Browse Categories
              </h2>
              <CategoryGrid categories={categories.slice(0, 6)} />
            </section>
            
            <section className="px-4">
              <h2 className="text-lg font-bold tracking-tight mb-4">
                All Items
              </h2>
              <ItemGrid items={items} />
            </section>
            
            <section className="px-4">
              <TopSellers />
            </section>
          </div>

          {/* Desktop layout - unchanged */}
          <div className="hidden lg:block space-y-8">
            <PromotionalBanner banners={banners} />
            
            {flashSaleItems.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <FlashSales items={flashSaleItems} />
              </section>
            )}
            
            <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="mobile-padding">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Browse Categories
                </h2>
                <CategoryGrid categories={categories.slice(0, 8)} />
              </div>
            </section>
            
            <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="mobile-padding">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Featured For You
                </h2>
                <ItemGrid items={items} />
              </div>
            </section>
            
            <section className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <TopSellers />
            </section>
          </div>
        </MarketplaceClient>
      </Suspense>
    </div>
  )
}
