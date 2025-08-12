import { ItemCard } from "./item-card"
import type { Item } from "@/lib/types"

interface ItemGridProps {
  items: Item[]
}

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters or browse our categories</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className="animate-fade-in-up hover-lift"
          style={{ 
            animationDelay: `${Math.min(index * 0.1, 1)}s`,
            animationFillMode: 'both'
          }}
        >
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  )
}
