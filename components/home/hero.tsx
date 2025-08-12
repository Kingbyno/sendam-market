import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center space-y-6 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                The Secure Way to Buy & Sell Online
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Sendam is a peer-to-peer marketplace with a built-in escrow service that protects both buyers and sellers from fraud.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button 
                asChild 
                size="lg" 
                className="btn-gradient text-base font-semibold px-8 py-6 hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                <Link href="/marketplace">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="glass border-border/50 hover:border-primary/50 text-base font-semibold px-8 py-6 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Link href="/sell">
                  Sell an Item
                </Link>
              </Button>
            </div>
            
            {/* Stats section */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Items Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Safe Transactions</div>
              </div>
            </div>
          </div>
          
          {/* Hero image with enhanced styling */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative mx-auto aspect-video overflow-hidden rounded-3xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <img
                alt="Sendam Marketplace Hero"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                src="/placeholder.svg"
              />
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg animate-bounce-gentle">
                <div className="text-sm font-semibold text-primary">🔒 Secure</div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg animate-pulse">
                <div className="text-sm font-semibold text-green-600">✓ Trusted</div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
