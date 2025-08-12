"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { suggestCategory } from "@/lib/actions/admin-actions"
import type { CategoryWithChildren } from "@/lib/queries/item-queries"

interface CategoryComboboxProps {
  categories: CategoryWithChildren[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

const CATEGORY_META: Record<string, { icon: string; description: string }> = {
  "Electronics & Technology": { icon: "📱", description: "Phones, laptops, gadgets, and more." },
  "Fashion & Apparel": { icon: "👗", description: "Clothing, shoes, bags, and accessories." },
  "Home & Living": { icon: "🏠", description: "Furniture, decor, kitchen, and appliances." },
  "Health & Beauty": { icon: "💄", description: "Skincare, makeup, hair care, and wellness." },
  "Sports & Recreation": { icon: "🏀", description: "Fitness, outdoor, and sports equipment." },
  "Automotive": { icon: "🚗", description: "Car parts, accessories, and care." },
  "Books & Media": { icon: "📚", description: "Books, movies, music, and magazines." },
  "Baby & Kids": { icon: "🧸", description: "Toys, baby gear, and kids' clothing." },
  "Food & Beverages": { icon: "🍔", description: "Snacks, drinks, and specialty foods." },
  "Office & Business": { icon: "💼", description: "Office supplies, furniture, and equipment." },
  "Art & Crafts": { icon: "🎨", description: "Art supplies, crafts, and handmade items." },
  "Pet Supplies": { icon: "🐾", description: "Dog, cat, fish, and other pet products." },
}

type FlatCategory = {
  id: string
  name: string
  level: number
  parentId?: string | null
}

function flattenCategories(categories: CategoryWithChildren[], level = 0): FlatCategory[] {
  let result: FlatCategory[] = []
  for (const cat of categories) {
    result.push({ id: cat.id, name: cat.name, level, parentId: cat.parentId })
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, level + 1))
    }
  }
  return result
}

export function CategoryCombobox({
  categories,
  value,
  onValueChange,
  placeholder = "Select category",
  className,
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [showSuggest, setShowSuggest] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const flatCategories = React.useMemo(() => flattenCategories(categories), [categories])
  const categoryMap = React.useMemo(() => new Map(flatCategories.map((c) => [c.id, c])), [flatCategories])
  const selectedCategory = flatCategories.find((c) => c.id === value)

  const displayCategories = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return flatCategories
    }

    const matchedCategoryIds = new Set<string>()

    for (const category of flatCategories) {
      if (category.name.toLowerCase().includes(query)) {
        // Add the matched category
        matchedCategoryIds.add(category.id)

        // Add all its ancestors
        let currentId = category.parentId
        while (currentId) {
          const parent = categoryMap.get(currentId)
          if (parent) {
            matchedCategoryIds.add(parent.id)
            currentId = parent.parentId
          } else {
            break
          }
        }
      }
    }

    if (matchedCategoryIds.size === 0) {
      return []
    }

    return flatCategories.filter((c) => matchedCategoryIds.has(c.id))
  }, [search, flatCategories, categoryMap])

  async function handleSuggest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await suggestCategory(formData)
      if (result.success) {
        toast({ title: "Suggestion sent!", description: "We'll review and add your category soon." })
        setShowSuggest(false)
        setSearch("")
      } else {
        toast({ title: "Failed", description: result.error || "Could not submit.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed", description: "Could not submit.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId)
    setOpen(false)
    setSearch("")
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between text-left", className)}
          >
            {selectedCategory ? (
              <span className="flex items-center gap-2">
                {CATEGORY_META[selectedCategory.name]?.icon || (selectedCategory.level === 0 ? "📦" : "—")}
                {selectedCategory.name}
              </span>
            ) : (
              <span className="text-muted-foreground truncate max-w-[80%]">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 min-w-[220px] max-w-[350px]" align="start">
          <Command>
            <CommandInput
              placeholder="Search or suggest..."
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList className="max-h-64">
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6">
                  <span className="text-muted-foreground text-sm">No category found.</span>
                  {search && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSuggest(true)
                        setOpen(false)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Suggest "{search}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {displayCategories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.id}
                    onSelect={() => handleSelect(cat.id)}
                    className="flex items-center gap-2 group"
                    style={{ paddingLeft: `${cat.level * 1.5 + 0.5}rem` }}
                  >
                    <div className="flex-grow flex items-center gap-2">
                      <span>{CATEGORY_META[cat.name]?.icon || (cat.level === 0 ? "📦" : "—")}</span>
                      <span>{cat.name}</span>
                    </div>
                    <Check className={cn("h-4 w-4 ml-auto", value === cat.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showSuggest} onOpenChange={setShowSuggest}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSuggest}>
            <DialogHeader>
              <DialogTitle>Suggest a New Category</DialogTitle>
              <DialogDescription>
                Can't find a fit? Suggest a new category and our team will review it for the marketplace.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggest-category-name">Category Name *</Label>
                <Input
                  id="suggest-category-name"
                  name="name"
                  placeholder="e.g., Vintage Collectibles"
                  defaultValue={search}
                  required
                  className="focus-visible:ring-blue-500"
                />
                <p className="text-xs text-muted-foreground">
                  Be specific and clear about what items would belong in this category.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="suggest-parent-category">Parent Category (Optional)</Label>
                <Select name="parentId">
                  <SelectTrigger id="suggest-parent-category">
                    <SelectValue placeholder="Choose where this fits best..." />
                  </SelectTrigger>
                  <SelectContent>
                    {flatCategories
                      .filter((cat) => cat.level === 0)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {CATEGORY_META[cat.name]?.icon || "📦"} {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This helps us organize your suggestion in the right place.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowSuggest(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
