"use client"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "List Your Item",
      description: "Submit your item for admin review and approval",
      icon: "📝",
      color: "from-blue-500 to-violet-500"
    },
    {
      number: "02", 
      title: "Secure Payment",
      description: "Buyer pays and funds are held safely in escrow",
      icon: "🛡️",
      color: "from-violet-500 to-purple-500"
    },
    {
      number: "03",
      title: "Safe Delivery",
      description: "Choose Sendam inspection (10% fee) or direct meetup",
      icon: "📦",
      color: "from-purple-500 to-blue-500"
    },
    {
      number: "04",
      title: "Funds Released",
      description: "Payment released after confirmation or auto-release after 14 days",
      icon: "💰",
      color: "from-blue-500 to-violet-500"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-violet-50/50 to-blue-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            How Sendam Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the most secure buying and selling process with our escrow protection system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connection Line - Hidden on mobile, shown on larger screens */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-current to-transparent text-blue-200 transform translate-x-4 z-0" />
              )}
              
              <div className="relative z-10 text-center">
                {/* Step Number */}
                <div className="relative mb-6">
                  <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r ${step.color} shadow-lg flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                    <span className="text-3xl text-white">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100/50 to-violet-100/50 rounded-full text-sm text-gray-600 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Trusted by thousands of buyers and sellers</span>
          </div>
          <p className="text-gray-500 text-sm">
            🔒 14-day buyer protection • ⚡ Instant dispute resolution • 🏆 Admin-verified items
          </p>
        </div>
      </div>
    </section>
  )
}
