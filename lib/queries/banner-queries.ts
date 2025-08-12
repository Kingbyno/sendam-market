import { prisma } from "@/lib/prisma/client"

export async function getActiveBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return banners
  } catch (error) {
    console.error("Failed to fetch active banners:", error)
    return []
  }
}

export async function getAllBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return banners
  } catch (error) {
    console.error("Failed to fetch all banners:", error)
    return []
  }
}
