"use server"

import { getAuth } from "@/lib/auth/get-auth"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import type { TermsAgreement, TermsVersion, TermsAcceptanceData } from "@/lib/types"

export async function acceptTerms(data: TermsAcceptanceData) {
  try {
    const { user } = await getAuth()
    if (!user) {
      throw new Error("Authentication required")
    }

    // Get client IP and user agent
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    try {
      const agreement = await prisma.termsAgreement.create({
        data: {
          userId: user.id,
          type: data.agreementType.toUpperCase() as any, // Convert to enum value
          version: data.version,
          ipAddress,
          userAgent,
        },
      })

      return { success: true, data: agreement }
    } catch (error: any) {
      if (error.code === "P2002") {
        // Unique constraint violation
        // User already accepted this version, update the timestamp
        const updatedAgreement = await prisma.termsAgreement.update({
          where: {
            // Note: Need to check if this composite unique key exists in schema
            id: `${user.id}_${data.agreementType}_${data.version}`,
          },
          data: {
            createdAt: new Date(),
            ipAddress,
            userAgent,
          },
        })

        return { success: true, data: updatedAgreement }
      }
      throw new Error(`Failed to accept terms: ${error.message}`)
    }
  } catch (error) {
    console.error("Error accepting terms:", error)
    throw error
  }
}

export async function checkTermsAcceptance(
  agreementType: "seller_terms" | "buyer_terms" | "privacy_policy",
): Promise<boolean> {
  try {
    const { user } = await getAuth()
    if (!user) {
      return false
    }

    // Since we don't have TermsVersion model, we'll use a hardcoded current version
    const currentVersion = "1.0"

    // Check if user has accepted the current version
    const agreement = await prisma.termsAgreement.findFirst({
      where: {
        userId: user.id,
        type: agreementType.toUpperCase() as any,
        version: currentVersion,
      },
    })

    return !!agreement
  } catch (error) {
    console.error("Error checking terms acceptance:", error)
    return false
  }
}

export async function getActiveTermsVersion(
  agreementType: "seller_terms" | "buyer_terms" | "privacy_policy",
): Promise<TermsVersion | null> {
  try {
    // Since TermsVersion model doesn't exist, return a mock version
    return {
      id: "1",
      agreementType,
      version: "1.0",
      title: `${agreementType.replace('_', ' ')} Agreement`,
      content: "Terms and conditions content...",
      isActive: true,
      createdAt: new Date(),
    }
  } catch (error) {
    console.error("Error fetching active terms version:", error)
    return null
  }
}

export async function getUserTermsAgreements(userId?: string): Promise<TermsAgreement[]> {
  try {
    const { user } = await getAuth()
    if (!user) {
      throw new Error("Authentication required")
    }

    // If userId is provided, check if current user is admin
    const targetUserId = userId || user.id
    if (userId && userId !== user.id) {
      const adminEmails = ["admin@sendam.com", "admin@example.com", "promisetheking@gmail.com", "kingbyno007@gmail.com"]
      if (!adminEmails.includes(user.email?.toLowerCase() || "")) {
        throw new Error("Admin access required to view other users' agreements")
      }
    }

    const agreements = await prisma.termsAgreement.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' },
    })

    return agreements.map((item) => ({
      id: item.id,
      userId: item.userId,
      agreementType: item.type.toLowerCase() as any,
      version: item.version,
      agreedAt: item.createdAt,
      ipAddress: item.ipAddress,
      userAgent: item.userAgent,
    }))
  } catch (error) {
    console.error("Error fetching user terms agreements:", error)
    throw error
  }
}
