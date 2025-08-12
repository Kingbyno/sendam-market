"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, TrendingUp, Package, Users } from "lucide-react"
import { useState } from "react"
import type { User } from "@/lib/types"

interface AuthenticatedHeroProps {
  user: User
}

export function AuthenticatedHeroSection({ user }: AuthenticatedHeroProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {user.email?.split("@")[0]}
              </span>
              !
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Ready to buy or sell? Your marketplace dashboard is here to help.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/sell">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Sell an Item</h3>
                    <p className="text-gray-600 text-sm">List your items for sale quickly</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/marketplace">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Browse Items</h3>
                    <p className="text-gray-600 text-sm">Find what you're looking for</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for items, categories, or brands..."
                className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg">Search</Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trending Items</h3>
              <p className="text-gray-600 text-sm">Discover what's popular right now</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">New Arrivals</h3>
              <p className="text-gray-600 text-sm">Fresh items added daily</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Sellers</h3>
              <p className="text-gray-600 text-sm">Verified and reliable sellers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
