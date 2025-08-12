import { getTopSellers } from "@/lib/queries/user-queries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown } from "lucide-react"
import Link from "next/link"

export async function TopSellers() {
  const topSellers = await getTopSellers(5)

  if (!topSellers || topSellers.length === 0) {
    return null
  }

  return (
    <div className="mobile-padding">
      <Card className="card-modern overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
            <div className="relative">
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 animate-bounce-gentle" />
              <div className="absolute inset-0 h-5 w-5 md:h-6 md:w-6 bg-yellow-500/20 rounded-full blur-sm animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
              Top Sellers This Month
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topSellers.map((seller, index) => (
            <Link
              href={`/seller/${seller.id}`}
              key={seller.id}
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-muted/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-border/50"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fade-in 0.5s ease-out forwards'
              }}
            >
              {/* Rank badge */}
              <div className="flex-shrink-0 relative">
                {index < 3 && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                )}
                <Avatar className="h-12 w-12 border-2 border-background shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <AvatarImage
                    src={seller.avatar || "/placeholder-user.jpg"}
                    alt={seller.name || "Seller"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                    {seller.name?.charAt(0).toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Seller info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                  {seller.name || 'Anonymous Seller'}
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <span>🏆 {seller.salesCount} sales</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-green-600 font-medium">⭐ Top rated</span>
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-muted-foreground group-hover:text-primary transition-colors duration-200">→</span>
              </div>
            </Link>
          ))}
          
          {/* View all link */}
          <div className="pt-3 border-t border-border/50">
            <Link
              href="/sellers"
              className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
            >
              <span>View all sellers</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
