import { Category } from "@/lib/types"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { getCategoryIcon } from "@/lib/utils"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
      {categories.map((category, index) => (
        <Link 
          href={`/marketplace?category=${category.slug}`} 
          key={category.id}
          className="group"
        >
          <Card className="card-modern group-hover:shadow-lg group-hover:shadow-primary/10 p-3 sm:p-4 flex flex-col items-center justify-center aspect-square group-hover:-translate-y-1 transition-all duration-300 animate-scale-in" 
                style={{ 
                  animationDelay: `${Math.min(index * 0.05, 0.4)}s`,
                  animationFillMode: 'both'
                }}>
            <div className="text-2xl sm:text-3xl md:text-4xl mb-2 transition-transform duration-200 group-hover:scale-110">
              {getCategoryIcon(category.name)}
            </div>
            <p className="text-2xs sm:text-xs font-medium text-center line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {category.name}
            </p>
            {category._count?.items && category._count.items > 0 && (
              <span className="text-2xs text-muted-foreground mt-1">
                {category._count.items}
              </span>
            )}
          </Card>
        </Link>
      ))}
    </div>
  )
}
