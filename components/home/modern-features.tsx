"use client"

export function ModernFeatures({ isSignedIn }: { isSignedIn: boolean }) {
  if (isSignedIn) {
    return (
      <section className="py-24 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="container mx-auto px-4">        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Seller Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your sales securely with our escrow-protected selling tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl mb-6 flex items-center justify-center">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Sales</h3>
            <p className="text-gray-600">All sales protected by our escrow system with guaranteed payments</p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-violet-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl mb-6 flex items-center justify-center">
              <span className="text-white text-xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Listings</h3>
            <p className="text-gray-600">Submit items for admin approval and reach verified buyers</p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Protected Earnings</h3>
            <p className="text-gray-600">Track earnings with automatic escrow release and dispute protection</p>
          </div>
        </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-violet-50/50">      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Why Choose Sendam?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the most secure way to buy and sell with escrow protection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl mb-6 flex items-center justify-center">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Escrow Protection</h3>
            <p className="text-gray-600">Your money is held safely until you confirm delivery - guaranteed security</p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-violet-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl mb-6 flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Verified</h3>
            <p className="text-gray-600">All items are reviewed and approved by our team before listing</p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
            <p className="text-gray-600">Paystack integration with 14-day auto-release and dispute resolution</p>
          </div>
        </div>
      </div>
    </section>
  )
}