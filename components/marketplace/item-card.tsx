"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin } from "lucide-react"
import type { Item } from "@/lib/types"
import { formatPrice } from "@/lib/utils"
import { ConditionBadge } from "@/lib/ui/condition-badge"

interface ItemCardProps {
  item: Item & { originalPrice?: number | null }
}

export function ItemCard({ item }: ItemCardProps) {
  const hasValidOriginal =
    item.originalPrice && item.price && Number(item.originalPrice) > 0 && Number(item.originalPrice) > Number(item.price)
  const discount = hasValidOriginal
    ? Math.round(((Number(item.originalPrice) - Number(item.price)) / Number(item.originalPrice)) * 100)
    : null

  // Map condition to semantic badge styles (can expand later)
  const normalizedCondition = item.condition

  return (
    <Link
      href={`/item/${item.id}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
    >
      <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm hover:shadow-lg h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-300 dark:group-hover:border-primary/50">
        <div className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={item.images?.[0] || '/placeholder.jpg'}
            alt={item.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Persistent overlay for contrast (intensifies on hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent group-hover:from-black/55 group-hover:via-black/30 transition-colors duration-300" />

          {/* Discount badge */}
          {discount && (
            <Badge
              variant="destructive"
              aria-label={`${discount}% discount`}
              role="status"
              className="absolute top-3 right-3 text-[11px] font-bold shadow-lg bg-red-600 text-white border-0 px-2 py-1 tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-red-600 rounded-md"
            >
              -{discount}%
            </Badge>
          )}

          {/* Wishlist button */}
          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-black/60 hover:scale-110 active:scale-95 shadow-md text-gray-600 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <CardContent className="p-3 md:p-4 flex-grow flex flex-col justify-between bg-white dark:bg-card">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-primary transition-colors duration-200">
              {item.title}
            </h3>

            <div className="flex items-center justify-between text-[11px] md:text-xs">
              <ConditionBadge condition={normalizedCondition} size="sm" />
              {item.location && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm"
                >
                  <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-300" />
                  <span className="truncate max-w-24 font-medium capitalize tracking-tight">
                    {item.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-baseline justify-between">
              <div className="space-y-1">
                <p className="font-bold text-lg md:text-xl text-gray-900 dark:text-white tracking-tight">
                  {formatPrice(item.price)}
                </p>
                {discount && (
                  <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-400 line-through font-medium">
                    {formatPrice(item.originalPrice!)}
                  </p>
                )}
              </div>

              {/* Seller info */}
              <div className="text-right">
                <div className="text-[11px] md:text-xs text-gray-600 dark:text-gray-300 font-medium">
                  by {item.seller?.name || 'Anonymous'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
