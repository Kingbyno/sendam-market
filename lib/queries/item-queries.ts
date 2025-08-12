import { prisma } from "@/lib/prisma/client"
import type { Item, Category } from "@/lib/types"

export async function getApprovedItems(limit?: number): Promise<Item[]> {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        _count: {
          select: {
            reviews: true,
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return items
  } catch (error) {
    console.error("Error fetching approved items:", error)
    return []
  }
}

export async function getFeaturedItems(limit?: number): Promise<Item[]> {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: "APPROVED",
        isPublished: true, // Use isPublished instead of featured
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        _count: {
          select: {
            reviews: true,
            purchases: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return items
  } catch (error) {
    console.error("Error fetching featured items:", error)
    return []
  }
}

export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[]
}

export async function getCategories(): Promise<CategoryWithChildren[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        order: "asc",
      },
    })

    const categoryMap: Record<string, CategoryWithChildren> = {}
    const rootCategories: CategoryWithChildren[] = []

    interface CategoryNode extends Category {
      children: CategoryNode[]
    }

    categories.forEach((category: Category) => {
      const categoryNode: CategoryNode = { ...category, children: [] }
      categoryMap[category.id] = categoryNode
    })

    categories.forEach((category: Category) => {
      if (category.parentId && categoryMap[category.parentId]) {
      (categoryMap[category.parentId] as CategoryWithChildren).children.push(categoryMap[category.id] as CategoryWithChildren)
      } else {
      rootCategories.push(categoryMap[category.id] as CategoryWithChildren)
      }
    })

    return rootCategories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function searchItems(filters: {
  query?: string
  category?: string
  condition?: string
  minPrice?: string
  maxPrice?: string
  location?: string
  negotiable?: string
  urgent?: string
  warranty?: string
  delivery?: string
  page?: number
  limit?: number
  sortBy?: string
}): Promise<{ items: Item[]; totalCount: number }> {
  try {
    const {
      query,
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      negotiable,
      urgent,
      warranty,
      delivery,
      page = 1,
      limit = 12,
      sortBy = "newest",
    } = filters

    const whereClause: any = {
      status: "APPROVED",
    }

    // Search query
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ]
    }

    // Category filter - support both slug and ID, and include child categories
    if (category) {
      // First, try to find the category by slug
      const categoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: category },
            { id: category }
          ]
        },
        include: {
          children: true
        }
      })
      
      if (categoryRecord) {
        // If it's a parent category, include all its children
        const categoryIds = [categoryRecord.id]
        if (categoryRecord.children && categoryRecord.children.length > 0) {
          categoryIds.push(...categoryRecord.children.map(child => child.id))
        }
        
        whereClause.categoryId = { in: categoryIds }
      }
    }

    // Condition filter
    if (condition) {
      const conditionMap: Record<string, string> = {
        "new": "NEW",
        "like-new": "LIKE_NEW", 
        "used-like-new": "LIKE_NEW",
        "good": "GOOD",
        "used-good": "GOOD",
        "fair": "FAIR",
        "used-fair": "FAIR"
      }
      
      const conditions = condition.split(",")
        .map(c => c.trim().toLowerCase())
        .map(c => conditionMap[c] || c.toUpperCase())
        .filter(c => c !== "")
        
      if (conditions.length > 0) {
        whereClause.condition = { in: conditions }
      }
    }

    // Price range filter
    const min = minPrice ? parseFloat(minPrice) : undefined
    const max = maxPrice ? parseFloat(maxPrice) : undefined

    if (min !== undefined && !isNaN(min)) {
      whereClause.price = { ...whereClause.price, gte: min }
    }
    if (max !== undefined && !isNaN(max)) {
      whereClause.price = { ...whereClause.price, lte: max }
    }

    // Location filter
    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" }
    }

    // Enhanced feature filters matching seller form
    if (negotiable === "true") {
      whereClause.negotiable = true
    }

    if (urgent === "true") {
      whereClause.urgent = true
    }

    if (warranty === "true") {
      // Filter for items with warranty
      whereClause.warranty = true
    }

    if (delivery === "true") {
      whereClause.deliveryAvailable = true
    }

    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "price_asc") {
      orderBy = { price: "asc" }
    } else if (sortBy === "price_desc") {
      orderBy = { price: "desc" }
    }

    const totalItems = await prisma.item.count({ where: whereClause })

    const items = await prisma.item.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    return { items, totalCount: totalItems }
  } catch (error) {
    console.error("Error searching items:", error)
    return { items: [], totalCount: 0 }
  }
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        _count: {
          select: {
            reviews: true,
            purchases: true,
          },
        },
      },
    })

    if (item) {
      // Increment view count
      await prisma.item.update({
        where: { id },
        data: { views: { increment: 1 } },
      })
    }

    return item
  } catch (error) {
    console.error("Error fetching item by ID:", error)
    return null
  }
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  try {
    const item = await prisma.item.findUnique({
      where: { slug },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
        _count: {
          select: {
            reviews: true,
            purchases: true,
          },
        },
      },
    })

    if (item) {
      // Increment view count
      await prisma.item.update({
        where: { slug },
        data: { views: { increment: 1 } },
      })
    }

    return item
  } catch (error) {
    console.error("Error fetching item by slug:", error)
    return null
  }
}

export async function getPendingItems(): Promise<Item[]> {
  try {
    const items = await prisma.item.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return items
  } catch (error) {
    console.error("Error fetching pending items:", error)
    return []
  }
}
