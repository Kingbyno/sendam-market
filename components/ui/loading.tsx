"use client"

import { cn } from "@/lib/utils"

// Modern Skeleton component
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

// Modern Loading Spinner component
export function LoadingSpinner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="relative h-8 w-8">
        <div className="absolute h-8 w-8 rounded-full border-2 border-primary opacity-20" />
        <div className="absolute h-8 w-8 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    </div>
  )
}

// Modern Loading Card component
export function LoadingCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-20 w-full mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  )
}

// Modern Loading Grid component
export function LoadingGrid({
  count = 6,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  count?: number
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

// Modern Loading State component
export function LoadingState({
  title = "Loading...",
  description,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 p-8 text-center",
        className
      )}
      {...props}
    >
      <LoadingSpinner />
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}