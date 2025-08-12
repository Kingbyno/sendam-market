"use server"

import { getAuth, isAdmin } from "@/lib/auth/get-auth"
import { prisma } from "@/lib/prisma/client"
import type { SellerPaymentInfo } from "@/lib/types"

export async function createSellerPaymentInfo(data: {
  sellerId: string
  bankName: string
  accountName: string
  accountNumber: string
}) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Admin access required")
    }

    const { user } = await getAuth()
    if (!user) {
      throw new Error("Authentication required")
    }

    // Validate input
    if (!data.sellerId || !data.bankName || !data.accountName || !data.accountNumber) {
      throw new Error("All payment information fields are required")
    }

    // Validate account number (basic validation)
    if (!/^\d{10}$/.test(data.accountNumber)) {
      throw new Error("Account number must be exactly 10 digits")
    }

    try {
      const paymentInfo = await prisma.sellerPaymentInfo.create({
        data: {
          sellerId: data.sellerId,
          bankName: data.bankName,
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          verified: false,
        },
      })

      return { success: true, data: paymentInfo }
    } catch (error: any) {
      if (error.code === "P2002") {
        // Unique constraint violation
        throw new Error("Payment information already exists for this seller")
      }
      throw new Error(`Failed to create payment information: ${error.message}`)
    }
  } catch (error) {
    console.error("Error creating seller payment info:", error)
    throw error
  }
}

export async function updateSellerPaymentInfo(
  id: string,
  data: {
    bankName: string
    accountName: string
    accountNumber: string
    isVerified?: boolean
  },
) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Admin access required")
    }

    // Validate input
    if (!data.bankName || !data.accountName || !data.accountNumber) {
      throw new Error("All payment information fields are required")
    }

    // Validate account number
    if (!/^\d{10}$/.test(data.accountNumber)) {
      throw new Error("Account number must be exactly 10 digits")
    }

    const paymentInfo = await prisma.sellerPaymentInfo.update({
      where: { id },
      data: {
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        verified: data.isVerified ?? false,
        updatedAt: new Date(),
      },
    })

    return { success: true, data: paymentInfo }
  } catch (error) {
    console.error("Error updating seller payment info:", error)
    throw error
  }
}

export async function getSellerPaymentInfo(sellerId: string): Promise<SellerPaymentInfo | null> {
  try {
    if (!(await isAdmin())) {
      throw new Error("Admin access required")
    }

    const paymentInfo = await prisma.sellerPaymentInfo.findUnique({
      where: { sellerId },
    })

    if (!paymentInfo) {
      return null
    }

    return {
      id: paymentInfo.id,
      sellerId: paymentInfo.sellerId,
      bankName: paymentInfo.bankName,
      accountName: paymentInfo.accountName,
      accountNumber: paymentInfo.accountNumber,
      isVerified: paymentInfo.verified,
      createdAt: paymentInfo.createdAt,
      updatedAt: paymentInfo.updatedAt,
    }
  } catch (error) {
    console.error("Error fetching seller payment info:", error)
    throw error
  }
}

export async function getAllSellersPaymentInfo(): Promise<(SellerPaymentInfo & { sellerEmail?: string })[]> {
  try {
    if (!(await isAdmin())) {
      throw new Error("Admin access required")
    }

    const paymentInfos = await prisma.sellerPaymentInfo.findMany({
      include: {
        seller: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return paymentInfos.map((item) => ({
      id: item.id,
      sellerId: item.sellerId,
      bankName: item.bankName,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      isVerified: item.verified,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      sellerEmail: item.seller?.email,
    }))
  } catch (error) {
    console.error("Error fetching all sellers payment info:", error)
    throw error
  }
}

export async function deleteSellerPaymentInfo(id: string) {
  try {
    if (!(await isAdmin())) {
      throw new Error("Admin access required")
    }

    await prisma.sellerPaymentInfo.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting seller payment info:", error)
    throw error
  }
}
