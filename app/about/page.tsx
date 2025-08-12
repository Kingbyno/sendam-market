import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Users, Award, CheckCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Sendam - Secure Marketplace",
  description: "Learn about Sendam's mission to provide a secure, trusted marketplace with escrow protection for all transactions.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50">
      {/* Header Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-6">
              About Sendam
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Nigeria's most trusted marketplace for secure buying and selling. We protect every transaction 
              with our advanced escrow system and admin verification process.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  At Sendam, we believe that buying and selling online should be safe, secure, and straightforward. 
                  Our mission is to create a marketplace where every transaction is protected, every seller is 
                  verified, and every buyer can shop with complete confidence.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  We're building more than just a marketplace – we're creating a community of trusted users 
                  who value security, quality, and peace of mind in their transactions.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  <Link href="/marketplace">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Image/Visual */}
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-100 to-violet-100 rounded-2xl p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Secure Transactions</h3>
                  <p className="text-gray-600">
                    Every transaction is protected by our advanced escrow system with 14-day buyer protection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
                What Makes Us Different
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We've built Sendam with security and trust as our foundation, offering features that protect both buyers and sellers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Escrow Protection */}
              <Card className="bg-white/80 backdrop-blur-sm border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Escrow Protection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your money is held safely until you confirm delivery. Complete buyer protection with 14-day automatic release.
                  </p>
                </CardContent>
              </Card>

              {/* Admin Verification */}
              <Card className="bg-white/80 backdrop-blur-sm border border-violet-100/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Verified</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every item is reviewed and approved by our team before listing. Only quality, legitimate items make it to the marketplace.
                  </p>
                </CardContent>
              </Card>

              {/* Trusted Community */}
              <Card className="bg-white/80 backdrop-blur-sm border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted Community</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Join thousands of verified sellers and satisfied buyers in Nigeria's most secure marketplace community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Sendam Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our streamlined process ensures secure transactions from start to finish.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse & Buy</h3>
                <p className="text-gray-600 text-sm">
                  Explore verified items and make secure purchases with our escrow protection.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrow Hold</h3>
                <p className="text-gray-600 text-sm">
                  Your payment is held securely in escrow until you receive and approve your item.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Choose Sendam verification (10% fee) for inspection or direct meeting at no extra cost.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete</h3>
                <p className="text-gray-600 text-sm">
                  Confirm receipt to release funds to the seller. Auto-release after 14 days for protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <p className="text-gray-600 font-medium">Verified Listings</p>
                <p className="text-gray-500 text-sm mt-1">Every item approved by our team</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  14 Days
                </div>
                <p className="text-gray-600 font-medium">Buyer Protection</p>
                <p className="text-gray-500 text-sm mt-1">Guaranteed escrow protection</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <p className="text-gray-600 font-medium">Support Available</p>
                <p className="text-gray-500 text-sm mt-1">Help when you need it</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Trading Securely?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Sendam for their secure online transactions. 
              Your listings are reviewed, your payments are protected, and your peace of mind is our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/sell">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Have Questions?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our team is here to help you navigate the marketplace and answer any questions about our services.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
