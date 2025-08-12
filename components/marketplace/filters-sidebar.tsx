"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Category } from "@prisma/client"
import type { CategoryWithChildren } from "@/lib/queries/item-queries"

export interface FiltersProps {
  categories: CategoryWithChildren[]
  initialFilters: Record<string, any>
  onFilterChange: (filters: Record<string, string>) => void
}

export function FiltersSidebar({ categories, initialFilters, onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    // If the "All" option is selected, treat it as an empty string for the filter
    const filterValue = value === "all" ? "" : value
    setFilters((prev: any) => ({ ...prev, [name]: filterValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(filters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      query: "",
      category: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      sortBy: "newest",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="p-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          🔍 Filter & Search
        </h3>
        <p className="text-sm text-muted-foreground">Find exactly what you're looking for</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="query" className="text-sm font-medium flex items-center gap-2">
            <span>🔎</span>
            Search Keywords
          </Label>
          <Input
            id="query"
            name="query"
            placeholder="e.g. iPhone 14 Pro, Vintage Watch..."
            value={filters.query || ""}
            onChange={handleInputChange}
            className="h-10 border-muted-foreground/20 focus:border-primary/50 transition-colors"
          />
        </div>

        <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
          <AccordionItem value="category" className="border-muted-foreground/20">
            <AccordionTrigger className="text-base font-semibold hover:text-primary transition-colors">
              <span className="flex items-center gap-2">
                <span>🏷️</span>
                Category
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <Select
                name="category"
                onValueChange={value => handleSelectChange("category", value)}
                value={filters.category || "all"}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">🌟 All Categories</SelectItem>
                  {categories.map(parentCat => (
                    <div key={parentCat.id}>
                      <SelectItem value={parentCat.slug} className="font-semibold">
                        📦 {parentCat.name}
                      </SelectItem>
                      {parentCat.children?.map(childCat => (
                        <SelectItem key={childCat.id} value={childCat.slug} className="pl-6">
                          → {childCat.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-muted-foreground/20">
            <AccordionTrigger className="text-base font-semibold hover:text-primary transition-colors">
              <span className="flex items-center gap-2">
                <span>💰</span>
                Price Range
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="minPrice" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    placeholder="₦0"
                    value={filters.minPrice || ""}
                    onChange={handleInputChange}
                    aria-label="Minimum Price"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    placeholder="₦∞"
                    value={filters.maxPrice || ""}
                    onChange={handleInputChange}
                    aria-label="Maximum Price"
                    className="h-9"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="condition" className="border-muted-foreground/20">
            <AccordionTrigger className="text-base font-semibold hover:text-primary transition-colors">
              <span className="flex items-center gap-2">
                <span>⭐</span>
                Condition
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <Select
                name="condition"
                onValueChange={value => handleSelectChange("condition", value)}
                value={filters.condition || "all"}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">✨ Any Condition</SelectItem>
                  <SelectItem value="NEW">🆕 Brand New</SelectItem>
                  <SelectItem value="LIKE_NEW">💎 Like New</SelectItem>
                  <SelectItem value="GOOD">👍 Good</SelectItem>
                  <SelectItem value="FAIR">👌 Fair</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Additional Filters to match Seller Form */}
          <AccordionItem value="features" className="border-muted-foreground/20">
            <AccordionTrigger className="text-base font-semibold hover:text-primary transition-colors">
              <span className="flex items-center gap-2">
                <span>🏷️</span>
                Features
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  name="negotiable"
                  checked={filters.negotiable === "true"}
                  onChange={(e) => handleSelectChange("negotiable", e.target.checked ? "true" : "")}
                  className="rounded"
                />
                <label htmlFor="negotiable" className="text-sm">💰 Negotiable Price</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgent"
                  name="urgent"
                  checked={filters.urgent === "true"}
                  onChange={(e) => handleSelectChange("urgent", e.target.checked ? "true" : "")}
                  className="rounded"
                />
                <label htmlFor="urgent" className="text-sm">⚡ Urgent Sale</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="warranty"
                  name="warranty" 
                  checked={filters.warranty === "true"}
                  onChange={(e) => handleSelectChange("warranty", e.target.checked ? "true" : "")}
                  className="rounded"
                />
                <label htmlFor="warranty" className="text-sm">🛡️ Has Warranty</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="delivery"
                  name="delivery"
                  checked={filters.delivery === "true"}
                  onChange={(e) => handleSelectChange("delivery", e.target.checked ? "true" : "")}
                  className="rounded"
                />
                <label htmlFor="delivery" className="text-sm">🚚 Delivery Available</label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location Filter */}
          <AccordionItem value="location" className="border-muted-foreground/20">
            <AccordionTrigger className="text-base font-semibold hover:text-primary transition-colors">
              <span className="flex items-center gap-2">
                <span>📍</span>
                Location
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <Input
                name="location"
                placeholder="e.g., Lagos, Abuja, Kano..."
                value={filters.location || ""}
                onChange={handleInputChange}
                className="h-10"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
            <span>📍</span>
            Location
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Lagos, Abuja, Port Harcourt..."
            value={filters.location || ""}
            onChange={handleInputChange}
            className="h-10 border-muted-foreground/20 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-muted-foreground/20">
          <Button 
            type="submit" 
            className="w-full h-11 btn-gradient font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            🚀 Apply Filters
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClearFilters} 
            className="w-full h-10 border-muted-foreground/30 hover:bg-muted/50 hover:border-primary/50 transition-all"
          >
            🔄 Clear All
          </Button>
        </div>
      </form>
    </div>
  )
}
