"use server"

import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { getAuth } from "@/lib/auth/get-auth"

export interface EscrowTransaction {
  id: string
  transaction_reference: string
  item_id: string
  buyer_id: string
  seller_id: string
  amount: number
  service_fee: number
  total_amount: number
  delivery_option: "sendam" | "direct"
  status: "pending" | "paid" | "delivered" | "confirmed" | "released" | "disputed" | "refunded"
  payment_method?: string
  paystack_reference?: string
  paid_at?: string
  delivered_at?: string
  confirmation_deadline?: string
  auto_release_at?: string
  released_at?: string
  dispute_reason?: string
  disputed_at?: string
  dispute_resolved_at?: string
  dispute_resolution?: string
  admin_notes?: string
  admin_action_by?: string
  admin_action_at?: string
  created_at: string
  updated_at: string
}

export async function createEscrowTransaction(data: {
  itemId: string
  buyerId: string
  sellerId: string
  amount: number
  serviceFee: number
  totalAmount: number
  deliveryOption: "sendam" | "direct"
  paymentMethod?: string
  paystackReference?: string
}) {
  try {
    const transactionReference = `ESC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create a Purchase record which acts as our escrow transaction
    const transaction = await prisma.purchase.create({
      data: {
        amount: data.totalAmount,
        paymentReference: data.paystackReference || transactionReference,
        status: "PENDING",
        itemId: data.itemId,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
      },
    })

    return { success: true, transactionReference, transaction }
  } catch (error) {
    console.error("Error creating escrow transaction:", error)
    return { success: false, error: "Failed to create escrow transaction" }
  }
}

export async function markPaymentPaid(transactionReference: string) {
  try {
    const transaction = await prisma.purchase.update({
      where: {
        paymentReference: transactionReference,
      },
      data: {
        status: "PAID",
      },
    })

    // TODO: Send notification to seller
    // await createPaymentNotification(...)

    return { success: true, transaction }
  } catch (error) {
    console.error("Error marking payment as paid:", error)
    return { success: false, error: "Failed to mark payment as paid" }
  }
}

export async function markItemDelivered(transactionId: string, adminId?: string) {
  try {
    const deliveredAt = new Date()

    const transaction = await prisma.purchase.update({
      where: {
        id: transactionId,
      },
      data: {
        status: "DELIVERED",
        deliveredAt: deliveredAt,
      },
    })

    // TODO: Send notification to buyer
    // await createDeliveryNotification(...)

    return { success: true, transaction }
  } catch (error) {
    console.error("Error marking item as delivered:", error)
    return { success: false, error: "Failed to mark item as delivered" }
  }
}

export async function confirmDelivery(transactionId: string, buyerId: string) {
  try {
    const transaction = await prisma.purchase.update({
      where: {
        id: transactionId,
        buyerId: buyerId, // Security check
      },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    })

    // TODO: Send notification to seller
    // await createConfirmationNotification(...)

    revalidatePath("/admin")
    return { success: true, transaction }
  } catch (error) {
    console.error("Error confirming delivery:", error)
    return { success: false, error: "Failed to confirm delivery" }
  }
}

export async function releaseFunds(transactionId: string, adminId?: string) {
  try {
    const transaction = await prisma.purchase.update({
      where: {
        id: transactionId,
      },
      data: {
        status: "RELEASED",
        releasedAt: new Date(),
      },
    })

    // TODO: Process actual payment to seller
    // await processSellerPayment(transaction)

    revalidatePath("/admin")
    return { success: true, transaction }
  } catch (error) {
    console.error("Error releasing funds:", error)
    return { success: false, error: "Failed to release funds" }
  }
}

export async function raiseDispute(transactionId: string, userId: string, reason: string) {
  try {
    const transaction = await prisma.purchase.update({
      where: {
        id: transactionId,
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      data: {
        status: "DISPUTED",
        // Note: You might want to add a dispute field to the Purchase model
      },
    })

    // TODO: Notify admin about dispute
    // await notifyAdminOfDispute(transaction, reason)

    revalidatePath("/admin")
    return { success: true, transaction }
  } catch (error) {
    console.error("Error raising dispute:", error)
    return { success: false, error: "Failed to raise dispute" }
  }
}

export async function processAutoReleases() {
  try {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const eligiblePurchases = await prisma.purchase.findMany({
      where: {
        status: "DELIVERED",
        deliveredAt: {
          lte: twoWeeksAgo,
        },
      },
    })

    let processedCount = 0
    for (const purchase of eligiblePurchases) {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          status: "RELEASED",
          releasedAt: new Date(),
        },
      })

      // TODO: Process actual payment to seller
      // await processSellerPayment(purchase)

      processedCount++
    }

    if (processedCount > 0) {
      revalidatePath("/admin")
    }

    return { success: true, processedCount }
  } catch (error) {
    console.error("Error processing auto-releases:", error)
    return { success: false, error: "Failed to process auto-releases" }
  }
}

export async function getEscrowTransactions(userId?: string, isAdmin = false) {
  try {
    const where = isAdmin 
      ? {} 
      : userId 
        ? {
            OR: [
              { buyerId: userId },
              { sellerId: userId }
            ]
          }
        : {}

    const transactions = await prisma.purchase.findMany({
      where,
      include: {
        item: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
        buyer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, transactions }
  } catch (error) {
    console.error("Error fetching escrow transactions:", error)
    return { success: false, error: "Failed to fetch transactions" }
  }
}

export async function getEscrowTransaction(transactionReference: string) {
  try {
    const transaction = await prisma.purchase.findUnique({
      where: {
        paymentReference: transactionReference,
      },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
        buyer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!transaction) {
      return { success: false, error: "Transaction not found" }
    }

    return { success: true, transaction }
  } catch (error) {
    console.error("Error fetching escrow transaction:", error)
    return { success: false, error: "Failed to fetch transaction" }
  }
}
