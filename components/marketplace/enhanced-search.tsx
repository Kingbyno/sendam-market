"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Clock, TrendingUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SearchSuggestionsProps {
  categories: any[]
  placeholder?: string
  className?: string
}

interface SearchHistory {
  query: string
  timestamp: number
  category?: string
}

interface PopularSearch {
  query: string
  count: number
  category?: string
}

export function EnhancedSearch({ categories, placeholder = "Search for items...", className }: SearchSuggestionsProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Popular searches (in a real app, this would come from analytics)
  const popularSearches: PopularSearch[] = useMemo(() => [
    { query: 'iPhone', count: 1250, category: 'Electronics' },
    { query: 'MacBook', count: 890, category: 'Electronics' },
    { query: 'Wedding Gown', count: 675, category: 'Fashion' },
    { query: 'Gaming Chair', count: 445, category: 'Furniture' },
    { query: 'Nike Shoes', count: 334, category: 'Fashion' },
    { query: 'Samsung TV', count: 287, category: 'Electronics' },
  ], [])

  // Load search history on mount
  useEffect(() => {
    const loadSearchHistory = () => {
      try {
        const stored = localStorage.getItem('searchHistory')
        if (stored) {
          const history: SearchHistory[] = JSON.parse(stored)
          // Keep only recent searches (last 30 days)
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
          const recentHistory = history.filter(item => item.timestamp > thirtyDaysAgo)
          setSearchHistory(recentHistory.slice(0, 5)) // Keep max 5 recent searches
        }
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }

    loadSearchHistory()
  }, [])

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([])
      return
    }

    const generateSuggestions = () => {
      const suggestions: any[] = []
      const lowerQuery = query.toLowerCase()

      // Category suggestions
      const matchingCategories = categories
        .filter(cat => 
          cat.name.toLowerCase().includes(lowerQuery) ||
          cat.children?.some((child: any) => child.name.toLowerCase().includes(lowerQuery))
        )
        .slice(0, 3)

      matchingCategories.forEach(cat => {
        suggestions.push({
          type: 'category',
          text: cat.name,
          category: cat.name,
          icon: '🏷️',
          action: () => router.push(`/marketplace?category=${cat.slug}`)
        })
      })

      // Popular search suggestions
      const matchingPopular = popularSearches
        .filter(search => search.query.toLowerCase().includes(lowerQuery))
        .slice(0, 3)

      matchingPopular.forEach(search => {
        suggestions.push({
          type: 'popular',
          text: search.query,
          subtitle: `${search.count}+ items • ${search.category}`,
          icon: '🔥',
          action: () => handleSearch(search.query)
        })
      })

      // Search suggestions based on common patterns
      const searchSuggestions = [
        `${query} for sale`,
        `${query} in Lagos`,
        `${query} new condition`,
        `best ${query} deals`
      ]

      if (query.length >= 2) {
        searchSuggestions.slice(0, 2).forEach(suggestion => {
          suggestions.push({
            type: 'suggestion',
            text: suggestion,
            icon: '🔍',
            action: () => handleSearch(suggestion)
          })
        })
      }

      setSuggestions(suggestions.slice(0, 6))
    }

    const timeoutId = setTimeout(generateSuggestions, 150)
    return () => clearTimeout(timeoutId)
  }, [query, categories, router])

  // Handle search
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    // Add to search history
    const newHistoryItem: SearchHistory = {
      query: searchQuery,
      timestamp: Date.now()
    }

    const updatedHistory = [newHistoryItem, ...searchHistory.filter(item => item.query !== searchQuery)]
      .slice(0, 10)

    setSearchHistory(updatedHistory)
    
    try {
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }

    // Navigate to search results
    router.push(`/marketplace?query=${encodeURIComponent(searchQuery)}`)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearSearchHistory = () => {
    setSearchHistory([])
    try {
      localStorage.removeItem('searchHistory')
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
            if (e.key === 'Escape') {
              setIsOpen(false)
              inputRef.current?.blur()
            }
          }}
          className="pl-12 pr-24 h-12 text-base border-2 border-muted focus:border-primary transition-colors"
        />
        
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="button"
            onClick={() => handleSearch()}
            className="h-8 px-3 bg-primary hover:bg-primary/90"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 border-2 shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {query.length === 0 ? (
              // Show history and popular when no query
              <div className="space-y-4">
                {searchHistory.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Searches
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearchHistory}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(item.query)}
                          className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">{item.query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground px-3 py-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Searches
                  </h4>
                  <div className="space-y-1">
                    {popularSearches.slice(0, 4).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search.query)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{search.query}</div>
                          <div className="text-xs text-muted-foreground">
                            {search.count}+ items • {search.category}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Show suggestions when typing
              <div className="space-y-1">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={suggestion.action}
                      className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                    >
                      <span className="text-base flex-shrink-0">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {suggestion.text}
                        </div>
                        {suggestion.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {suggestion.subtitle}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                    Press Enter to search for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
