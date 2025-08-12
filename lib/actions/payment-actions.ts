"use server"

import { prisma } from "@/lib/prisma/client"
import { getAuth } from "@/lib/auth/get-auth"
import { Paystack } from "@/lib/paystack"
import { revalidatePath } from "next/cache"
import { createEscrowTransaction, markPaymentPaid } from "@/lib/actions/escrow-actions"
import type { Purchase, Item, User } from "@/lib/types"

// Fix types for Purchase and relations
interface PurchaseWithRelations {
  id: string
  amount: number
  status: string
  paymentReference: string
  createdAt: string | Date
  updatedAt: string | Date
  deliveredAt?: string | Date | null
  confirmedAt?: string | Date | null
  releasedAt?: string | Date | null
  itemId: string
  buyerId: string
  sellerId: string
  item: any // Use any for now to avoid type mismatch
  buyer: User
  seller: User
}

interface VerifyPaymentResult {
  success: boolean
  order?: PurchaseWithRelations
  error?: string
  status?: "success" | "failed"
  demo?: boolean
  message?: string
  amount?: number
}

export async function verifyPayment(transactionId: string): Promise<VerifyPaymentResult> {
  const { user } = await getAuth()
  if (!user) {
    return { success: false, error: "Authentication failed." }
  }

  try {
    // Check if a purchase has already been created for this transaction to prevent duplicates
    const existingOrder = await prisma.purchase.findUnique({
      where: { paymentReference: transactionId },
      include: { item: true, buyer: true, seller: true },
    })

    if (existingOrder) {
      // Ensure the user requesting is the buyer
      if (existingOrder.buyerId !== user.id) {
        return { success: false, error: "You are not authorized to view this order." }
      }
      return { success: true, order: existingOrder as any }
    }

    // If no purchase exists, verify the transaction with Paystack
    const paystack = new Paystack()
    const transaction = await paystack.verifyTransaction(transactionId)

    if (transaction.status !== "success") {
      return { success: false, error: "Payment verification failed." }
    }

    const { metadata, amount, customer } = transaction
    const { itemId, userId, deliveryOption, basePrice, serviceFee } = metadata

    // Security check: ensure the user who paid is the same as the logged-in user
    if (userId !== user.id || customer.email !== user.email) {
      return { success: false, error: "Payment was made by a different user." }
    }

    // Get item details to find seller
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { seller: true }
    })

    if (!item) {
      return { success: false, error: "Item not found." }
    }

    // Create escrow transaction
    const escrowResult = await createEscrowTransaction({
      itemId: itemId,
      buyerId: userId,
      sellerId: item.sellerId,
      amount: Number(basePrice) || (amount / 100),
      serviceFee: Number(serviceFee) || 0,
      totalAmount: amount / 100,
      deliveryOption: deliveryOption as "sendam" | "direct" || "direct",
      paymentMethod: "paystack",
      paystackReference: transactionId
    })

    if (!escrowResult.success) {
      return { success: false, error: "Failed to create escrow transaction." }
    }

    // Mark payment as paid in escrow system
    await markPaymentPaid(escrowResult.transactionReference!)

    // Create the purchase record for compatibility
    const newOrder = await prisma.purchase.create({
      data: {
        buyerId: userId,
        itemId: itemId,
        sellerId: item.sellerId,
        paymentReference: transactionId,
        amount: amount / 100,
        status: "PAID",
      },
      include: {
        item: true,
        buyer: true,
        seller: true,
      },
    })

    // Mark the item as sold so it's no longer available in the marketplace
    await prisma.item.update({
      where: { id: itemId },
      data: { status: "SOLD" },
    })

    // Revalidate paths to update UI across the app
    revalidatePath("/marketplace")
    revalidatePath(`/item/${itemId}`)

    return { success: true, order: newOrder as any }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

export async function initializePayment(itemId: string, userEmail: string) {
  try {
    const { user } = await getAuth()
    if (!user) {
      return { success: false, message: "Authentication required" }
    }

    // Get item details
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { seller: true }
    })

    if (!item) {
      return { success: false, message: "Item not found" }
    }

    if (item.status !== "APPROVED") {
      return { success: false, message: "Item is not available for purchase" }
    }

    if (item.sellerId === user.id) {
      return { success: false, message: "You cannot purchase your own item" }
    }

    // Check if in demo mode
    const isDemoMode = process.env.NODE_ENV === "development"

    if (isDemoMode) {
      // Generate a demo reference
      const demoReference = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      return {
        success: true,
        reference: demoReference,
        demo: true,
        amount: item.price
      }
    }

    // Generate payment reference for production
    const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      reference: paymentReference,
      demo: false,
      amount: item.price
    }
  } catch (error) {
    console.error("Error initializing payment:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to initialize payment" 
    }
  }
}
