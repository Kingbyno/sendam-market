"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { uploadFiles } from "@/lib/utils/file-upload"
import type { ItemCondition } from "@prisma/client"

export async function submitItem(formData: FormData) {
  console.log("=== Submit item action started ===")
  try {
    console.log("Attempting to get server session...")
    const session = await getServerSession(authOptions)
    console.log("Session retrieved:", !!session?.user)

    if (!session?.user?.id) {
      console.log("User not authenticated. Missing session or user ID.")
      return {
        success: false,
        message: "Authentication required. Please log in and try again."
      }
    }

    const user = session.user
    console.log(`User authenticated: ${user.email} (ID: ${user.id})`)

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const originalPrice = formData.get("originalPrice") ? Number.parseFloat(formData.get("originalPrice") as string) : null
    const condition = formData.get("condition") as ItemCondition
    const location = formData.get("location") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const bankName = formData.get("bankName") as string
    const accountName = formData.get("accountName") as string
    const accountNumber = formData.get("accountNumber") as string
    const imageFiles = formData.getAll("images") as File[]
    const categoryId = formData.get("categoryId") as string
    const negotiable = formData.get("negotiable") === "true"
    const urgent = formData.get("urgent") === "true"
    const warranty = formData.get("warranty") === "true"
    const warrantyMonths = formData.get("warrantyMonths") ? Number(formData.get("warrantyMonths")) : 0
    const deliveryAvailable = formData.get("deliveryAvailable") === "true"
    const brandNew = formData.get("brandNew") === "true"
    const brand = formData.get("brand") as string || ""
    const model = formData.get("model") as string || ""
    const color = formData.get("color") as string || ""
    const tagsString = formData.get("tags") as string || ""
    const tags = tagsString ? tagsString.split(",").map(tag => tag.trim()).filter(Boolean) : []

    // Validate required fields
    console.log("Validating form data...")
    console.log("Form data values:", {
      title: !!title,
      description: !!description,
      price: !!price,
      condition: !!condition,
      location: !!location,
      phone: !!phone,
      address: !!address,
      categoryId: !!categoryId,
      imageFiles: imageFiles.length
    })

    if (!title || !description || !price || !condition || !location || !phone || !address) {
      const missingFields = []
      if (!title) missingFields.push("title")
      if (!description) missingFields.push("description")
      if (!price) missingFields.push("price")
      if (!condition) missingFields.push("condition")
      if (!location) missingFields.push("location")
      if (!phone) missingFields.push("phone")
      if (!address) missingFields.push("address")

      console.log("Missing required fields:", missingFields)
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`
      }
    }

    const suggestedCategory = formData.get("suggestedCategory") as string | null
    if (!categoryId && !suggestedCategory) {
      console.log("Missing category selection or suggestion.")
      return {
        success: false,
        message: "Category is required. Select a category or provide a suggestion."
      }
    }

    console.log("Required fields validated ✅")

    // Validate payment information
    if (!bankName || !accountName || !accountNumber) {
      console.log("Missing payment information:", { bankName: !!bankName, accountName: !!accountName, accountNumber: !!accountNumber })
      return {
        success: false,
        message: "Payment information (bank name, account name, and account number) is required"
      }
    }
    console.log("Payment information validated ✅")

    // Validate account number format
    if (!/^\d{10}$/.test(accountNumber)) {
      console.log("Invalid account number format:", accountNumber)
      return {
        success: false,
        message: "Account number must be exactly 10 digits"
      }
    }
    console.log("Account number format validated ✅")

    // Handle image upload
    if (imageFiles.length === 0) {
      console.log("No image files provided.")
      return {
        success: false,
        message: "At least one image is required"
      }
    }

    console.log(`Processing ${imageFiles.length} image file(s)...`)
    const imageUrls = await uploadFiles(imageFiles)
    console.log(`Successfully uploaded ${imageUrls.length} image(s) ✅`)

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    console.log(`Slug created: "${slug}"`)

    // Ensure user exists in our database
    console.log(`Upserting user: ${user.email}`)
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email || "" },
      update: {
        name: user.name || user.email?.split("@")[0] || "Anonymous",
        avatar: user.image,
      },
      create: {
        id: user.id,
        email: user.email || "",
        name: user.name || user.email?.split("@")[0] || "Anonymous",
        avatar: user.image,
      },
    })
    console.log("User upserted successfully.")

    // Use the upserted user's ID for payment info
    const userId = upsertedUser.id

    // Upsert seller payment information separately
    console.log(`Upserting payment info for user: ${userId}`)
    await prisma.sellerPaymentInfo.upsert({
      where: { sellerId: userId },
      update: {
        bankName,
        accountName,
        accountNumber,
      },
      create: {
        seller: { connect: { id: userId } },
        bankName,
        accountName,
        accountNumber,
      },
    })
    console.log("Payment info upserted successfully.")

    // Create enhanced description with additional details
    let enhancedDescription = description
    if (brand) enhancedDescription += `\n\nBrand: ${brand}`
    if (model) enhancedDescription += `\nModel: ${model}`
    if (color) enhancedDescription += `\nColor: ${color}`
    if (warranty) enhancedDescription += `\nWarranty: ${warrantyMonths} months`
    if (deliveryAvailable) enhancedDescription += `\nDelivery: Available`
    if (brandNew) enhancedDescription += `\nCondition: Brand New Item`
    if (urgent) enhancedDescription += `\n⚡ URGENT SALE`

    // If user provided a suggested category name (useful when categories couldn't load), append to description
    if (suggestedCategory) {
      enhancedDescription += `\n\nSuggested Category: ${suggestedCategory}`
      console.log("Appended suggested category to description:", suggestedCategory)
    }

    // Create the item
    console.log("Creating item in database...")
    const createData: any = {
      title,
      slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
      description: enhancedDescription,
      price,
      originalPrice,
      condition,
      location,
      phone,
      address,
      images: imageUrls,
      status: "PENDING", // Items must be approved by an admin
      tags: tags,
      views: 0,
      negotiable,
      urgent,
      seller: {
        connect: { id: userId },
      },
    }

    if (categoryId) {
      createData.category = { connect: { id: categoryId } }
    }

    const item = await prisma.item.create({ data: createData })
    console.log(`Item created successfully with ID: ${item.id}`)

    revalidatePath("/marketplace")
    revalidatePath("/admin")
    console.log(`=== Item created successfully with ID: ${item.id} ===`)
    return { success: true, item }
  } catch (error: any) {
    console.error("=== Failed to submit item ===")
    console.error("Error details:", error)
    return {
      success: false,
      message: error.message || "An unexpected error occurred. Please try again.",
    }
  }
}
