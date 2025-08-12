"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, Heart, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

export function Features() {
  const { data: session } = useSession()
  const user = session?.user

  const features = user 
    ? [
        {
          icon: TrendingUp,
          title: "Track Your Sales",
          description: "Monitor your listings, track sales performance, and grow your business.",
          gradient: "from-green-500 to-emerald-500"
        },
        {
          icon: Star,
          title: "Build Your Reputation", 
          description: "Earn reviews and ratings to become a trusted seller in our community.",
          gradient: "from-yellow-500 to-orange-500"
        },
        {
          icon: Users,
          title: "Connect with Buyers",
          description: "Engage with potential customers and build lasting relationships.",
          gradient: "from-purple-500 to-pink-500"
        }
      ]
    : [
        {
          icon: Shield,
          title: "Secure Transactions",
          description: "Every purchase is protected with our secure escrow system and buyer protection.",
          gradient: "from-blue-500 to-cyan-500"
        },
        {
          icon: Zap,
          title: "Lightning Fast",
          description: "Find what you need quickly with our advanced search and instant messaging.",
          gradient: "from-violet-500 to-purple-500"
        },
        {
          icon: Heart,
          title: "Community First",
          description: "Join a trusted community of buyers and sellers who value quality and trust.",
          gradient: "from-pink-500 to-rose-500"
        }
      ]

  return (
    <section className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              {user ? "Your Marketplace Dashboard" : "Why Choose Sendam?"}
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {user 
              ? "Manage your listings, track your performance, and grow your business with powerful tools designed for sellers."
              : "Experience the future of online marketplace with features designed for modern buyers and sellers."
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="group relative">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-lg`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-3xl p-12 border border-blue-200/50">
            <h3 className="text-2xl lg:text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-700 bg-clip-text text-transparent">
                {user ? "Ready to boost your sales?" : "Ready to join thousands of satisfied users?"}
              </span>
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {user 
                ? "List your first item today and start earning. It only takes a few minutes to get started."
                : "Join our growing community and discover why Sendam is the trusted choice for online marketplace."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl">
                    <Link href="/sell">Start Selling</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-gray-300 hover:border-blue-300 hover:bg-blue-50">
                    <Link href="/seller/dashboard">View Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl">
                    <Link href="/auth/login">Get Started Today</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-gray-300 hover:border-blue-300 hover:bg-blue-50">
                    <Link href="/marketplace">Explore Marketplace</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
