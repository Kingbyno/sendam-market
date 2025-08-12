"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useMemo, useEffect } from "react"
import { FiltersSidebar, FiltersProps } from "./filters-sidebar"
import { MobileMarketplaceHeader } from "./mobile-marketplace-header"
import { Pagination } from "./pagination"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Item } from "@/lib/types"
import type { CategoryWithChildren } from "@/lib/queries/item-queries"

interface MarketplaceClientProps {
  initialItems: Item[]
  categories: CategoryWithChildren[]
  initialFilters: any
  totalItems: number
  itemsPerPage: number
  children: React.ReactNode
}

export function MarketplaceClient({
  initialItems,
  categories,
  initialFilters,
  totalItems,
  itemsPerPage,
  children,
}: MarketplaceClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [items, setItems] = useState<Item[]>(initialItems)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters.query || '')

  const currentPage = useMemo<number>(() => {
    return Number(searchParams.get("page")) || 1
  }, [searchParams])

  const totalPages = useMemo<number>(() => {
    return Math.ceil(totalItems / itemsPerPage)
  }, [totalItems, itemsPerPage])

  // Check if any filters are active (excluding search and pagination)
  const hasActiveFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('query')
    params.delete('page')
    params.delete('sortBy')
    return params.toString().length > 0
  }, [searchParams])

  // Effect to update items when initialItems prop changes (e.g., from server-side fetch)
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleFilterChange = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    params.set("page", "1") // Reset to first page on filter change
    router.push(`/marketplace?${params.toString()}`)
    setIsFilterOpen(false) // Close sidebar on mobile after applying filters
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleSearchSubmit = () => {
    handleFilterChange({ query: searchQuery })
  }

  const filtersProps: FiltersProps = {
    categories,
    initialFilters,
    onFilterChange: handleFilterChange,
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Mobile Header */}
      <MobileMarketplaceHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onFilterToggle={() => setIsFilterOpen(true)}
        hasActiveFilters={hasActiveFilters}
        categories={categories}
        currentCategory={initialFilters.category}
        onCategoryChange={(category) => handleFilterChange({ category })}
      />

      {/* Desktop Search Bar */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search items, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit()
                }
              }}
              className="pl-12 h-14 text-lg rounded-2xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Mobile Filter Sheet */}
        <div className="lg:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent side="left" className="w-full max-w-sm p-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <h2 className="text-lg font-semibold">🔍 Filters</h2>
                  <p className="text-sm text-muted-foreground">Refine your search results</p>
                </div>
                <div className="flex-1 overflow-auto">
                  <FiltersSidebar {...filtersProps} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <FiltersSidebar {...filtersProps} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
