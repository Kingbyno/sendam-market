import { prisma } from "@/lib/prisma/client"
import type { Category } from "@/lib/types"

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        featured: true,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Error fetching featured categories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    })

    return category
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    return null
  }
}
