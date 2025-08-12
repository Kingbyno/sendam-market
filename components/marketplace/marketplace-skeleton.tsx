import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 12

export function MarketplaceSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner skeleton */}
      <div className="mobile-padding">
        <Skeleton className="h-48 md:h-64 lg:h-80 w-full rounded-2xl" />
      </div>

      {/* Section title skeleton */}
      <div className="mobile-padding">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-24 rounded-lg" />
        </div>
      </div>

      {/* Items grid skeleton */}
      <div className="mobile-padding">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div 
              key={i} 
              className="space-y-3 animate-fade-in-up"
              style={{ 
                animationDelay: `${i * 0.05}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="card-modern border-0 overflow-hidden">
                {/* Image skeleton */}
                <Skeleton className="aspect-square w-full rounded-t-xl" />
                
                {/* Content skeleton */}
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4 rounded-lg" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-5 w-16 rounded-lg" />
                    <Skeleton className="h-4 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional sections skeleton */}
      <div className="mobile-padding space-y-6">
        {/* Categories skeleton */}
        <div>
          <Skeleton className="h-6 w-36 mb-4 rounded-xl" />
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-2xl mx-auto" />
                <Skeleton className="h-3 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Top sellers skeleton */}
        <div>
          <Skeleton className="h-6 w-32 mb-4 rounded-xl" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-3 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
