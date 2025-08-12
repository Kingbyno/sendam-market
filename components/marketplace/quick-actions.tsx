import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Package, Zap, Percent, Truck } from "lucide-react"

const actions = [
  { 
    name: "Awoof Deals", 
    icon: Percent, 
    href: "/marketplace?sortBy=discount",
    color: "from-red-500 to-pink-500",
    emoji: "🔥"
  },
  { 
    name: "Clearance Sales", 
    icon: Zap, 
    href: "/marketplace?condition=used",
    color: "from-yellow-500 to-orange-500",
    emoji: "⚡"
  },
  { 
    name: "Send Packages", 
    icon: Truck, 
    href: "/send",
    color: "from-blue-500 to-cyan-500",
    emoji: "🚚"
  },
  { 
    name: "Buy 2 Pay 1", 
    icon: Package, 
    href: "/marketplace?promo=b2p1",
    color: "from-green-500 to-emerald-500",
    emoji: "🎁"
  },
]

export function QuickActions() {
  return (
    <div className="mobile-padding">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Quick Actions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Fast shortcuts to popular features</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative overflow-hidden"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fade-in-up 0.5s ease-out forwards'
            }}
          >
            <Card className="h-full card-hover border-0 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="p-4 md:p-6 text-center relative z-10">
                {/* Icon with emoji */}
                <div className="relative mb-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                    <action.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 text-lg">{action.emoji}</div>
                </div>
                
                {/* Text */}
                <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-200">
                  {action.name}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
