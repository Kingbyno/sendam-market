"use client"

import { cn } from "@/lib/utils"

interface ModernCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gradient" | "glass"
  size?: "sm" | "default" | "lg"
  hover?: boolean
  onClick?: () => void
}

export function ModernCard({
  children,
  className,
  variant = "default",
  size = "default",
  hover = true,
  onClick
}: ModernCardProps) {
  const variants = {
    default: "bg-card/80 backdrop-blur-sm border border-border/50",
    gradient: "bg-gradient-to-br from-card via-card/90 to-card/80 border border-border/50",
    glass: "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10"
  }

  const sizes = {
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  }

  return (
    <div
      className={cn(
        "rounded-xl shadow-sm",
        variants[variant],
        sizes[size],
        hover && "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}