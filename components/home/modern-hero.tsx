"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ModernHero({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-violet-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-violet-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">            {isSignedIn ? (
              <>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Welcome to Sendam
                  <br />
                  Secure Marketplace
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  A secure marketplace for serious sellers. Your listings are reviewed, your payments are protected, and your peace of mind is our priority.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-6 text-lg"
                  >
                    <Link href="/marketplace">
                      Browse Marketplace
                      <ArrowRight className="ml-2 h-5 w-5" />                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg"
                    className="border-2 border-violet-200 text-violet-600 hover:bg-violet-100 hover:text-violet-700 hover:border-violet-300 px-8 py-6 text-lg transition-colors duration-200"
                  >
                    <Link href="/sell">
                      Start Selling
                    </Link>
                  </Button>
                </div>
              </>
            ): (
              <>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Sendam
                  <br />
                  Secure Marketplace
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Buy and sell with confidence using our escrow-protected system. Every transaction is secure, verified, and protected until delivery confirmation.
                </p>                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-6 text-lg"
                  >
                    <Link href="/marketplace">
                      Browse Marketplace
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg"
                    className="border-2 border-violet-200 text-violet-600 hover:bg-violet-50 px-8 py-6 text-lg"
                  >
                    <Link href="/sell">
                      Start Selling
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Content - Send AM Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Background Gradient Circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-violet-200/40 to-purple-200/40 rounded-full blur-3xl scale-110" />
              
              {/* Send AM Image */}
              <div className="relative z-10 aspect-square w-full">
                <Image
                  src="/send am.png"
                  alt="Send AM Platform"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-violet-400 rounded-xl blur-sm opacity-70 animate-bounce" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-sm opacity-70 animate-bounce delay-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}