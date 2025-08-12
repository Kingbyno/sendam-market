"use server"

import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { isAdmin, getAuth } from "@/lib/auth/get-auth"
import type { Item, ItemCondition } from "@/lib/types"

export async function getPendingItems() {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    const items = await prisma.item.findMany({
      where: { status: "PENDING" },
      include: {
        seller: true,
        category: true, // Include category data
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // No need to manually format, Prisma's include does the work
    const pendingItems = items.map((item) => ({
      ...item,
      seller_name: item.seller?.name ?? "N/A",
      seller_email: item.seller?.email ?? "N/A",
      created_at: item.createdAt.toISOString(),
    }))

    return { success: true, items: pendingItems }
  } catch (error) {
    console.error("Error fetching pending items:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return { success: false, error: `Failed to fetch pending items: ${errorMessage}` }
  }
}

export async function getItemStats() {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    const total = await prisma.item.count()
    const pending = await prisma.item.count({ where: { status: "PENDING" } })
    const approved = await prisma.item.count({ where: { status: "APPROVED" } })
    const rejected = await prisma.item.count({ where: { status: "REJECTED" } })

    return {
      success: true,
      stats: { total, pending, approved, rejected },
    }
  } catch (error) {
    console.error("Error fetching item stats:", error)
    return { success: false, error: "Failed to fetch item stats" }
  }
}

export async function getUncategorizedItems() {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }
    const items = await prisma.item.findMany({
      where: {
        categoryId: null,
      },
      include: {
        seller: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, items }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getPendingCategories() {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }
    const categories = await prisma.category.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        suggestedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        parent: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, categories }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function approveCategory(categoryId: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }
    await prisma.category.update({
      where: { id: categoryId },
      data: { status: "APPROVED" },
    })
    revalidatePath("/admin/categories")
    revalidatePath("/sell")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function rejectCategory(categoryId: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }
    await prisma.category.delete({
      where: { id: categoryId },
    })
    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function suggestCategory(formData: FormData) {
  try {
    const { user } = await getAuth()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const parentId = formData.get("parentId") as string | null

    if (!name) {
      return { success: false, error: "Category name is required." }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    await prisma.category.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        status: "PENDING",
        suggestedById: user.id,
        parentId: parentId || undefined,
      },
    })

    revalidatePath("/sell")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function approveItem(itemId: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.item.update({
      where: { id: itemId },
      data: {
        status: "APPROVED",
        // approvedAt: new Date(), // You might want to add this field to your schema
      },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error approving item:", error)
    return { success: false, error: "Failed to approve item" }
  }
}

export async function rejectItem(itemId: string, reason: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.item.update({
      where: { id: itemId },
      data: {
        status: "REJECTED",
        // rejectionReason: reason, // You might want to add this field
        // rejectedAt: new Date(),
      },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting item:", error)
    return { success: false, error: "Failed to reject item" }
  }
}

export async function deleteItem(itemId: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.item.delete({
      where: { id: itemId },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting item:", error)
    return { success: false, error: "Failed to delete item" }
  }
}

export async function getAllItems() {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    const items = await prisma.item.findMany({
      include: {
        seller: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formattedItems = items.map((item) => ({
      ...item,
      seller_name: item.seller?.name ?? "N/A",
      seller_email: item.seller?.email ?? "N/A",
      created_at: item.createdAt.toISOString(),
      category_name: item.category?.name ?? "N/A",
    }))

    return { success: true, items: formattedItems }
  } catch (error) {
    console.error("Error fetching all items:", error)
    return { success: false, error: "Failed to fetch all items" }
  }
}

export async function updateItem(itemId: string, data: any) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.item.update({
      where: { id: itemId },
      data,
    })

    revalidatePath("/admin")
    revalidatePath(`/item/${itemId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating item:", error)
    return { success: false, error: "Failed to update item" }
  }
}

export async function createItem(formData: FormData) {
    try {
        const { user } = await getAuth();
        if (!user || !(await isAdmin())) {
          return { success: false, error: "Unauthorized" };
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const categoryId = formData.get("categoryId") as string;
        const condition = formData.get("condition") as ItemCondition;
        const location = formData.get("location") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;

        if (!title || !description || !price || !categoryId || !condition || !location || !phone || !address) {
          return { success: false, error: "All fields are required." };
        }
        if (isNaN(price)) {
          return { success: false, error: "Invalid price." };
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const newItem = await prisma.item.create({
          data: {
            title,
            slug: `${slug}-${Date.now()}`,
            description,
            price,
            categoryId,
            condition,
            location,
            phone,
            address,
            status: "APPROVED",
            sellerId: user.id,
          }
        });

        revalidatePath("/admin");
        revalidatePath(`/item/${newItem.id}`);
        return { success: true, item: newItem };

    } catch (error) {
        console.error("Error creating item:", error);
        return { success: false, error: "Failed to create item" };
    }
}

export async function updateItemCategory(itemId: string, categoryId: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" }
    }
    await prisma.item.update({
      where: { id: itemId },
      data: { categoryId: categoryId },
    })
    revalidatePath("/admin/items")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
