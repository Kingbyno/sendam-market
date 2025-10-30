"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Modern Section component with gradient background
export function Section({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "relative py-16 lg:py-24",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent)]" />
        <div className="absolute left-0 top-1/4 -z-10 h-96 w-96 opacity-20 blur-[100px] bg-gradient-to-br from-primary/40 to-accent-purple/40" />
        <div className="absolute right-0 bottom-1/4 -z-10 h-96 w-96 opacity-20 blur-[100px] bg-gradient-to-br from-accent-blue/40 to-accent-pink/40" />
      </div>
      {children}
    </section>
  )
}

// Modern Container component
export function Container({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Modern Heading component with gradient text
export function GradientHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-3xl sm:text-4xl lg:text-5xl font-bold",
        "bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent",
        "dark:from-gray-100 dark:to-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

// Modern subheading component
export function SubHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-lg text-muted-foreground leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

// Modern Grid component
export function Grid({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Modern Badge component
export function Badge({
  children,
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "secondary" | "success" | "warning" | "danger"
}) {
  const variants = {
    default: "bg-primary/10 text-primary hover:bg-primary/20",
    outline: "border border-border hover:bg-accent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "bg-success/10 text-success hover:bg-success/20",
    warning: "bg-warning/10 text-warning hover:bg-warning/20",
    danger: "bg-danger/10 text-danger hover:bg-danger/20",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}