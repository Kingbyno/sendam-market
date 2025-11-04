"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Package2, User } from "lucide-react"
import { useMemo, useState } from "react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

export function Header() {
  const { data: session, status } = useSession()
  const user = session?.user

  // Check if user is admin based on email
  const isAdmin = useMemo(() => {
    if (!user?.email) return false
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "admin@sendam.com,admin@example.com,promisetheking@gmail.com,kingbyno007@gmail.com")
      .split(",")
      .map(e => e.trim().toLowerCase())
    return adminEmails.includes(user.email.toLowerCase())
  }, [user?.email])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/sell", label: "Sell" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Package2 className="h-7 w-7 text-primary transition-transform duration-200 group-hover:scale-110" />
              <div className="absolute inset-0 h-7 w-7 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent hover:from-accent-blue hover:to-accent-pink transition-all duration-300">
              Sendam
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-violet-50/50 group"
              >
                {link.label}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-9 w-9 rounded-full bg-gradient-to-br from-blue-100/50 to-violet-100/50 hover:from-blue-200/50 hover:to-violet-200/50 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-blue-200/50">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200/20 to-violet-200/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 bg-card/95 backdrop-blur-sm border border-border/50 shadow-lg rounded-xl animate-scale-in"
              >
                <DropdownMenuLabel className="font-semibold text-foreground">
                  <div className="flex flex-col space-y-1">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard" className="flex items-center space-x-2 text-sm">
                    <span>📊</span>
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild className="cursor-pointer bg-gradient-to-r from-blue-50 to-violet-50 hover:from-blue-100 hover:to-violet-100 dark:from-blue-900/20 dark:to-violet-900/20 dark:hover:from-blue-900/30 dark:hover:to-violet-900/30 border border-blue-200/30 dark:border-blue-600/30 rounded-md">
                    <Link href="/admin" className="flex items-center space-x-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                      <span className="text-blue-600 dark:text-blue-400">🛡️</span>
                      <span>Admin Dashboard</span>
                      <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <span className="mr-2">🚪</span>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="hidden md:flex bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-sm font-medium"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden h-9 w-9 border-blue-200/60 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-300/70 transition-all duration-200 shadow-sm"
              >
                <Menu className="h-5 w-5 text-blue-700" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 bg-white/95 backdrop-blur-sm border-blue-100/50"
            >
              <VisuallyHidden.Root>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Main navigation menu for mobile devices</SheetDescription>
              </VisuallyHidden.Root>
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 pb-6 border-b border-blue-100/50">
                  <Package2 className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Sendam</span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2 py-6 flex-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-violet-50/50 rounded-lg transition-all duration-200"
                    >
                      <span>{link.label}</span>
                    </Link>
                  ))}

                  {!user && (
                    <div className="pt-4 border-t border-blue-100/50">
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
