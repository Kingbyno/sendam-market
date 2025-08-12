import { Suspense } from "react"
import { getAllBanners } from "@/lib/queries/banner-queries"
import { BannerClient } from "@/components/admin/banner-client"
import { Skeleton } from "@/components/ui/skeleton"

export default async function BannersPage() {
  const banners = await getAllBanners()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Banners</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <BannerClient banners={banners} />
      </Suspense>
    </div>
  )
}
