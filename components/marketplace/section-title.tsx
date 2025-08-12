"use client"

import { cn } from "@/lib/utils"

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  emoji?: string
  subtitle?: string
}

export function SectionTitle({ children, className, emoji, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center space-y-2 animate-fade-in">
      <h2 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent", className)}>
        {emoji && <span className="mr-3">{emoji}</span>}
        {children}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
