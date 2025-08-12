"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { SignOutButton } from "@/components/auth/signout-button"
import { Menu, Plus, Home, MessageSquare } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MarketplaceHeader() {
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: MessageSquare },
    { name: "Sell Item", href: "/sell", icon: Plus },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-border/50 sticky top-0 z-50 transition-all duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <span className="font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block group-hover:text-primary transition-colors duration-200">
              Sendam
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-primary/5 flex items-center gap-2 group"
              >
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                  <AvatarImage src={user.image || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 hover:text-primary transition-colors cursor-pointer">
                  {user.name || user.email?.split("@")[0]}
                </span>
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="hover:bg-primary/5 hover:text-primary">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="btn-gradient px-6 hover:scale-105 active:scale-95 transition-transform">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden p-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 shadow-sm"
              >
                <Menu className="h-5 w-5 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-gradient-to-b from-background to-muted/20">
              <SheetHeader className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
                <SheetTitle className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-2 rounded-xl shadow-md">
                    <span className="font-bold">S</span>
                  </div>
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold">
                    Sendam
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="p-6 space-y-6">
                {/* User Info */}
                {user && (
                  <div className="flex items-center space-x-3 pb-4 border-b border-border/50">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={user.image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Auth Buttons */}
                <div className="pt-4 border-t border-border/50">
                  {user ? (
                    <SignOutButton className="w-full" />
                  ) : (
                    <div className="space-y-3">
                      <Button asChild className="w-full btn-gradient h-11 font-semibold">
                        <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          🚀 Sign Up
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full h-10 border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                        <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
