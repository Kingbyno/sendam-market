"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma/client"

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  imageUrl: z.string().url("Invalid URL"),
  link: z.string().url("Invalid URL").optional(),
  isActive: z.boolean().default(true),
})

export async function createBanner(formData: FormData) {
  const validatedFields = bannerSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.banner.create({
      data: validatedFields.data,
    })
    revalidatePath("/admin/banners")
    revalidatePath("/marketplace")
    return { success: true }
  } catch (error) {
    console.error("Failed to create banner:", error)
    return {
      errors: { _form: ["An unexpected error occurred."] },
    }
  }
}

export async function updateBanner(id: string, formData: FormData) {
  const validatedFields = bannerSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.banner.update({
      where: { id },
      data: validatedFields.data,
    })
    revalidatePath("/admin/banners")
    revalidatePath("/marketplace")
    return { success: true }
  } catch (error) {
    console.error("Failed to update banner:", error)
    return {
      errors: { _form: ["An unexpected error occurred."] },
    }
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    })
    revalidatePath("/admin/banners")
    revalidatePath("/marketplace")
  } catch (error) {
    console.error("Failed to delete banner:", error)
    return {
      error: "An unexpected error occurred.",
    }
  }
}

export async function toggleBannerStatus(id: string, isActive: boolean) {
  try {
    await prisma.banner.update({
      where: { id },
      data: { isActive },
    })
    revalidatePath("/admin/banners")
    revalidatePath("/marketplace")
  } catch (error) {
    console.error("Failed to toggle banner status:", error)
    return {
      error: "An unexpected error occurred.",
    }
  }
}
