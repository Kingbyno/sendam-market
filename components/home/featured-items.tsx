import { ItemCard } from "@/components/marketplace/item-card"
import Link from "next/link"
import type { Item } from "@/lib/types"

interface FeaturedItemsProps {
  items: Item[]
}

export function FeaturedItems({ items }: FeaturedItemsProps) {
  return (
    <section id="featured" className="py-16 md:py-24 bg-gradient-to-br from-muted/20 via-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Featured Items
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover amazing deals on quality items from trusted sellers across Nigeria
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto border border-border/50 hover:shadow-xl transition-shadow duration-300">
              <div className="text-muted-foreground mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">No Items Available Yet</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Be the first to list an item on our marketplace and start earning!
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center px-6 py-3 btn-gradient text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>List Your First Item</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {items.map((item, index) => (
                <div 
                  key={item._id}
                  className="animate-fade-in-up hover-lift"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <ItemCard item={item} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Link
                href="/marketplace"
                className="group inline-flex items-center gap-3 px-8 py-4 glass border border-border/50 hover:border-primary/50 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span className="text-base">View All Items</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
