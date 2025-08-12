"use client"

import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CreditCard } from "lucide-react"

interface CheckoutFormProps {
  email: string
  amount: number
  metadata: Record<string, any>
}

interface PaystackCustomField {
  display_name: string
  variable_name: string
  value: string
}

interface PaystackConfig {
  reference: string
  email: string
  amount: number
  publicKey: string
  metadata: {
    custom_fields: PaystackCustomField[]
    [key: string]: any
  }
}

export function CheckoutForm({ email, amount, metadata }: CheckoutFormProps) {
  // Ensure custom_fields is always an array for Paystack type safety
  const customFields: PaystackCustomField[] = Array.isArray(metadata.custom_fields)
    ? metadata.custom_fields
    : []

  const paystackConfig: PaystackConfig = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    metadata: {
      ...metadata,
      custom_fields: customFields,
    },
  }

  const initializePayment = usePaystackPayment(paystackConfig)

  const onSuccess = (reference: { transaction: string }) => {
    toast.success("Payment successful! Redirecting...")
    // Redirect to a confirmation page, passing the reference
    window.location.href = `/purchase/${reference.transaction}`
  }

  const onClose = () => {
    toast.info("Payment dialog closed.")
  }

  const handlePayment = () => {
    if (!paystackConfig.publicKey) {
      toast.error("Paystack public key is not configured. Cannot proceed with payment.")
      return
    }
    initializePayment({ onSuccess, onClose })
  }

  return (
    <Button onClick={handlePayment} className="w-full" size="lg">
      <CreditCard className="mr-2 h-5 w-5" />
      Pay with Paystack
    </Button>
  )
}
