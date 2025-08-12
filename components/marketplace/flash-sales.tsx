import { Item } from "@/lib/types"
import { ItemCard } from "./item-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, Zap } from "lucide-react"

interface FlashSalesProps {
  items: Item[]
}

export function FlashSales({ items }: FlashSalesProps) {
  if (items.length === 0) return null

  return (
    <div className="mobile-padding">
      <Card className="card-modern border-gradient-to-r from-orange-500/50 to-red-500/50 bg-gradient-to-br from-orange-50/50 via-background to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-orange-600 animate-bounce-gentle" />
                <div className="absolute inset-0 h-5 w-5 md:h-6 md:w-6 bg-orange-600/20 rounded-full blur-sm animate-pulse" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Flash Sales
              </span>
              <div className="hidden sm:flex items-center gap-1 text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                <Timer className="h-3 w-3" />
                Limited Time
              </div>
            </div>
            <div className="text-xs md:text-sm font-mono bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              Ends in: 01h:29m:54s
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {items.slice(0, 6).map((item, index) => (
              <div 
                key={item.id}
                className="animate-slide-in-right hover-glow"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
          {items.length > 6 && (
            <div className="text-center mt-4">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors">
                View all {items.length} flash deals →
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
