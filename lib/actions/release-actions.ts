"use server"

import { prisma } from "@/lib/prisma/client"
import { PurchaseStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

/**
 * Confirms receipt of an item and releases the funds to the seller.
 * This action should be triggered by the buyer.
 *
 * @param transactionId - The ID of the purchase transaction.
 * @param buyerId - The ID of the user confirming the purchase.
 */
export async function confirmAndReleaseFunds(
  transactionId: string,
  buyerId: string
) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: transactionId },
    })

    if (!purchase) {
      return { success: false, error: "Transaction not found." }
    }

    if (purchase.buyerId !== buyerId) {
      return { success: false, error: "Unauthorized." }
    }

    if (purchase.status !== PurchaseStatus.DELIVERED) {
      return {
        success: false,
        error: `Cannot release funds for a transaction with status: ${purchase.status}.`,
      }
    }

    const updatedPurchase = await prisma.purchase.update({
      where: { id: transactionId },
      data: {
        status: PurchaseStatus.RELEASED,
        confirmedAt: new Date(),
        releasedAt: new Date(),
      },
    })

    // TODO: Here you would trigger the actual payment to the seller's bank account
    // using your payment provider's API.

    revalidatePath(`/purchase/${transactionId}`)
    revalidatePath("/admin")

    return { success: true, purchase: updatedPurchase }
  } catch (error) {
    console.error("Error releasing funds:", error)
    return { success: false, error: "Failed to release funds." }
  }
}

/**
 * Processes automatic fund releases for transactions that were delivered
 * more than 14 days ago and have not been disputed.
 */
export async function processAutoReleases() {
  try {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    const eligiblePurchases = await prisma.purchase.findMany({
      where: {
        status: PurchaseStatus.DELIVERED,
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
          status: PurchaseStatus.RELEASED,
          releasedAt: new Date(),
        },
      })

      // TODO: Trigger payment to seller for each auto-released transaction.

      processedCount++
    }

    if (processedCount > 0) {
      revalidatePath("/admin")
    }

    return { success: true, processedCount }
  } catch (error) {
    console.error("Error in auto-release process:", error)
    return { success: false, error: "Auto-release process failed." }
  }
}
