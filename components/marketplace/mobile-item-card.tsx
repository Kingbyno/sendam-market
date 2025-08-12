"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock, Zap, Shield, Truck } from "lucide-react"
import type { Item } from "@/lib/types"
import { ConditionBadge } from "@/lib/ui/condition-badge"

interface MobileItemCardProps {
  item: Item & {
    user: {
      name: string
      avatar?: string
    }
    category: {
      name: string
      slug: string
    }
  }
}

export function MobileItemCard({ item }: MobileItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const hasDiscount = !!item.originalPrice && item.originalPrice > item.price
  const discountPercent = hasDiscount && item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0

  // Condition styling map (reuse desktop semantics)
  const conditionColors: Record<string, string> = {
    new: 'bg-emerald-600',
    like_new: 'bg-indigo-600',
    good: 'bg-blue-600',
    fair: 'bg-amber-600',
  }
  const normCondition = (item.condition || 'new').toLowerCase()
  const conditionClass = conditionColors[normCondition] || 'bg-indigo-600'
  const conditionLabel = normCondition.replace(/_/g, ' ')

  return (
    <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-card rounded-xl">
      <div className="relative">
        {/* Image Wrapper */}
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={item.images?.[0] || '/placeholder-product.jpg'}
            alt={item.title}
            width={300}
            height={300}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {/* Persistent gradient overlay for bottom content legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none transition-opacity duration-300" />
        </div>

        {/* Top-left stacked badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {/* Condition badge */}
            <ConditionBadge condition={normCondition} size="sm" asSpan className="!rounded-md" />
          {hasDiscount && (
            <span
              aria-label={`${discountPercent}% discount`}
              className="inline-flex text-[10px] font-bold px-2 py-1 rounded-md bg-red-600 text-white shadow"
            >
              -{discountPercent}%
            </span>
          )}
          {item.urgent ? (
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-1 rounded-md bg-orange-600 text-white shadow">
              <Zap className="w-3 h-3 mr-1" />Urgent
            </span>
          ) : null}
          {item.negotiable ? (
            <span className="inline-flex text-[10px] font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-800 border border-blue-300 backdrop-blur-sm">
              Negotiable
            </span>
          ) : null}
        </div>

        {/* Wishlist button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            aria-label="Add to wishlist"
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Heart className="w-4 h-4 text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        {/* Bottom info bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] z-10">
          <div className="flex items-center gap-1 bg-black/65 text-white px-2 py-1 rounded-md backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(new Date(item.createdAt))}
          </div>
          <div className="flex gap-1">
            {item.warranty ? (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow">
                <Shield className="w-3 h-3 text-white" />
              </div>
            ) : null}
            {item.deliveryAvailable ? (
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow">
                <Truck className="w-3 h-3 text-white" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <CardContent className="p-3 bg-white dark:bg-card">
        <Link href={`/item/${item.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-md">
          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {formatPrice(item.price)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-gray-600 dark:text-gray-400 line-through font-medium">
                  {formatPrice(item.originalPrice!)}
                </span>
              )}
            </div>

          {/* Location & Category (high contrast pills) */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-1 max-w-[55%]">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 text-[11px] font-medium shadow-sm">
                <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-300" />
                <span className="truncate capitalize">{item.location}</span>
              </div>
            </div>
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-500 shadow-sm">
              {item.category.name}
            </span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-xs font-semibold text-primary dark:text-primary-foreground/90">
                {item.user.name?.[0]?.toUpperCase() || 'S'}
              </span>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium max-w-[45%]">
              {item.user.name || 'Anonymous Seller'}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">Online</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
