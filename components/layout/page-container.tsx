"use client"

import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageContainer({ 
  children, 
  className,
  fullWidth = false 
}: PageContainerProps) {
  return (
    <div className={cn(
      "relative w-full px-4 py-8 sm:px-6 lg:px-8",
      "min-h-[calc(100vh-4rem)]",
      "bg-gradient-to-b from-background via-background/95 to-background/90",
      className
    )}>
      <div className={cn(
        "mx-auto h-full",
        fullWidth ? "w-full" : "max-w-7xl"
      )}>
        <div className="relative">
          {/* Ambient background gradient */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(165,180,252,0.1),transparent)]" />
            <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] bg-primary/5 blur-[100px]" />
            <div className="absolute left-0 bottom-0 -z-10 h-[300px] w-[300px] bg-accent-blue/5 blur-[100px]" />
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}