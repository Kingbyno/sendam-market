"use client"

import { cn } from "@/lib/utils"
import { Button as BaseButton, ButtonProps as BaseButtonProps } from "./button"
import { Loader2 } from "lucide-react"

interface ButtonProps extends BaseButtonProps {
  isLoading?: boolean
  gradient?: boolean
  glassEffect?: boolean
}

export function ModernButton({
  children,
  className,
  isLoading,
  gradient,
  glassEffect,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        gradient && "bg-gradient-to-r from-primary to-accent-purple hover:from-accent-blue hover:to-accent-pink",
        glassEffect && "backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20",
        isLoading && "cursor-wait",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-accent-purple/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
    </BaseButton>
  )
}