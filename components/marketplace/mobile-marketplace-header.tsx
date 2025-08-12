"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CategoryWithChildren } from "@/lib/queries/item-queries"

interface MobileMarketplaceHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchSubmit: () => void
  onFilterToggle: () => void
  hasActiveFilters: boolean
  categories: CategoryWithChildren[]
  currentCategory?: string
  onCategoryChange: (category: string) => void
}

const quickCategories = [
  { name: 'Electronics', value: 'electronics', emoji: '📱' },
  { name: 'Fashion', value: 'fashion', emoji: '👕' },
  { name: 'Home', value: 'home-garden', emoji: '🏠' },
  { name: 'Sports', value: 'sports', emoji: '⚽' },
  { name: 'Beauty', value: 'beauty', emoji: '💄' },
  { name: 'Books', value: 'books', emoji: '📚' },
]

export function MobileMarketplaceHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onFilterToggle,
  hasActiveFilters,
  categories,
  currentCategory,
  onCategoryChange,
}: MobileMarketplaceHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
      <div className="px-4 py-3 space-y-3">
        {/* Enhanced Search Bar */}
        <div className={`relative transition-all duration-200 ${searchFocused ? 'transform scale-[1.02]' : ''}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />          <Input
            placeholder="Search items, brands, categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearchSubmit()
              }
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="pl-10 h-12 text-base rounded-xl border-muted-foreground/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        
        {/* Quick Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button
            variant={!currentCategory ? "default" : "outline"}
            size="sm"
            className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap min-w-fit"
            onClick={() => onCategoryChange('')}
          >
            🌟 All
          </Button>
          {quickCategories.map((cat) => (
            <Button
              key={cat.value}
              variant={currentCategory === cat.value ? "default" : "outline"}
              size="sm"
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap min-w-fit"
              onClick={() => onCategoryChange(cat.value)}
            >
              {cat.emoji} {cat.name}
            </Button>
          ))}
        </div>
        
        {/* Compact Filter Button */}
        <Button
          variant="outline"
          onClick={onFilterToggle}
          className="w-full h-10 text-sm rounded-xl border-dashed hover:border-solid transition-all duration-200"
        >
          <Filter className="mr-2 h-3 w-3" />
          More Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              Active
            </span>
          )}
        </Button>
        
        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              🏷️ Filters active - tap button above to modify
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
