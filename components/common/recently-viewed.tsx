"use client"

import { useState, useEffect } from 'react'
import { ItemCard } from '../marketplace/item-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import type { Item } from '@/lib/types'

interface RecentlyViewedProps {
  currentItemId?: string
}

export function RecentlyViewed({ currentItemId }: RecentlyViewedProps) {
  const [recentItems, setRecentItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecentItems = async () => {
      try {
        const recent = getRecentlyViewedItems()
        const filteredRecent = currentItemId 
          ? recent.filter(item => item.id !== currentItemId)
          : recent
        
        setRecentItems(filteredRecent.slice(0, 4)) // Show max 4 items
      } catch (error) {
        console.error('Error loading recently viewed items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentItems()
  }, [currentItemId])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-muted rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (recentItems.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentItems.map((item) => (
            <div key={item.id} className="hover:shadow-lg transition-shadow">
              <ItemCard item={item} compact />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Utility functions for managing recently viewed items
export function addToRecentlyViewed(item: Item) {
  if (typeof window === 'undefined') return
  
  try {
    const recent = getRecentlyViewedItems()
    
    // Remove item if it already exists
    const filtered = recent.filter(recentItem => recentItem.id !== item.id)
    
    // Add to beginning of array
    const updated = [item, ...filtered].slice(0, 10) // Keep max 10 items
    
    localStorage.setItem('recentlyViewed', JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving recently viewed item:', error)
  }
}

export function getRecentlyViewedItems(): Item[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('recentlyViewed')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading recently viewed items:', error)
    return []
  }
}

export function clearRecentlyViewed() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('recentlyViewed')
  } catch (error) {
    console.error('Error clearing recently viewed items:', error)
  }
}
