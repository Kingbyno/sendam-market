"use client"

import { useState, useEffect } from "react"
import { checkTermsAcceptance } from "@/lib/actions/terms-actions"

export function useTermsChecker(agreementType: "seller_terms" | "buyer_terms" | "privacy_policy") {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAcceptance()
  }, [agreementType])

  const checkAcceptance = async () => {
    try {
      setIsLoading(true)
      const accepted = await checkTermsAcceptance(agreementType)
      setHasAccepted(accepted)
    } catch (error) {
      console.error("Error checking terms acceptance:", error)
      setHasAccepted(false)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsAccepted = () => {
    setHasAccepted(true)
  }

  return {
    hasAccepted,
    isLoading,
    checkAcceptance,
    markAsAccepted,
  }
}
