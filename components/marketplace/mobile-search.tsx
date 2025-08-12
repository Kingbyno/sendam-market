"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

export function MobileSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize search query from URL params
  useEffect(() => {
    const currentQuery = searchParams.get('query') || ''
    setQuery(currentQuery)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set('query', query.trim())
    } else {
      params.delete('query')
    }
    
    // Reset to first page on new search
    params.set('page', '1')
    
    router.push(`/marketplace?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('query')
    params.set('page', '1')
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-full px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="pl-10 pr-20 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
          {query && (
            <Button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full"
              size="sm"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="submit"
            className="absolute right-2 h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
            size="sm"
          >
            Go
          </Button>
        </div>
      </form>
      
      {/* Quick search suggestions for mobile */}
      {!query && (
        <div className="flex flex-wrap gap-2 mt-3">
          {['iPhone', 'MacBook', 'Nike', 'Samsung'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion)
                const params = new URLSearchParams(searchParams.toString())
                params.set('query', suggestion)
                params.set('page', '1')
                router.push(`/marketplace?${params.toString()}`)
              }}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}