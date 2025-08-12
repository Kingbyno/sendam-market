import { Suspense } from "react"
import { ModernHomepage } from "@/components/home/modern-homepage"
import { MarketplaceSkeleton } from "@/components/marketplace/marketplace-skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50">
      <Suspense fallback={<MarketplaceSkeleton />}>
        <ModernHomepage />
      </Suspense>
    </main>
  )
}