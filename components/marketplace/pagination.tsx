"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Basic pagination numbers (e.g., 1, 2, 3, ..., 10)
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push("...")
      }
      if (currentPage > 2) {
        pages.push(currentPage - 1)
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage)
      }
      if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1)
      }
      if (currentPage < totalPages - 2) {
        pages.push("...")
      }
      pages.push(totalPages)
    }
    return [...new Set(pages)] // Remove duplicates
  }
  return (
    <div className="flex items-center justify-center space-x-2 py-8 animate-fade-in-up">
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="h-9 w-9 border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1 mx-2">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                  ⋯
                </span>
              )
            }
            
            const isActive = page === currentPage
            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page as number)}
                className={`h-9 w-9 font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                    : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {page}
              </Button>
            )
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="h-9 w-9 border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Page info */}
      <div className="hidden sm:flex items-center text-sm text-muted-foreground ml-4">
        <span className="px-3 py-1 bg-muted/50 rounded-full border border-muted-foreground/20">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  )
}
