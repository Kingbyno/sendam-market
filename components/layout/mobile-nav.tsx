"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  links: Array<{ href: string; label: string }>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ links, isOpen, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden rounded-full w-9 h-9 p-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs bg-card/95 backdrop-blur-sm border-border/50">
        <nav className="flex flex-col space-y-4 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center text-base font-medium transition-colors",
                "rounded-lg px-4 py-2",
                "bg-transparent hover:bg-accent",
                "text-foreground/80 hover:text-foreground",
                "group"
              )}
              onClick={() => onOpenChange(false)}
            >
              {link.label}
              <div className="ml-auto opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                →
              </div>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}