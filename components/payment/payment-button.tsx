"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { initializePayment } from "@/lib/actions/payment-actions"
import { paystackClient } from "@/lib/paystack/client"
import { useToast } from "@/hooks/use-toast"
import type { Item, User } from "@/lib/types"

interface PaymentButtonProps {
  item: Item
  user: User
  onPaymentSuccess?: (reference: string) => void
}

export function PaymentButton({ item, user, onPaymentSuccess }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)
    setPaymentStatus("processing")

    try {
      // Initialize payment
      const response = await initializePayment(item.id, user.email || user.id)

      if (!response.success) {
        throw new Error(response.message || "Failed to initialize payment")
      }

      if (response.demo) {
        // Demo mode - simulate payment
        toast({
          title: "Demo Mode",
          description: "Payment simulation - no real money will be charged",
        })

        setTimeout(() => {
          setPaymentStatus("success")
          setIsLoading(false)
          onPaymentSuccess?.(response.reference)
          toast({
            title: "Payment Successful (Demo)",
            description: `Payment of ₦${response.amount.toLocaleString()} completed successfully`,
          })
        }, 2000)
        return
      }

      // Real Paystack payment
      paystackClient.openPaymentModal({
        email: user.email || user.id,
        amount: item.price * 100, // Convert to kobo
        reference: response.reference || `ref_${Date.now()}`,
        metadata: {
          itemId: item.id,
          buyerId: user.id,
          itemTitle: item.title,
        },
        onSuccess: (reference: string) => {
          setPaymentStatus("success")
          setIsLoading(false)
          onPaymentSuccess?.(reference)
          toast({
            title: "Payment Successful",
            description: `Payment of ₦${item.price.toLocaleString()} completed successfully`,
          })
        },
        onClose: () => {
          setIsLoading(false)
          setPaymentStatus("idle")
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by user",
            variant: "destructive",
          })
        },
      })
    } catch (error) {
      console.error("Payment error:", error)
      setError(error instanceof Error ? error.message : "Payment failed")
      setPaymentStatus("error")
      setIsLoading(false)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Payment failed",
        variant: "destructive",
      })
    }
  }

  const getButtonContent = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        )
      case "success":
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Payment Successful
          </>
        )
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            Payment Failed
          </>
        )
      default:
        return (
          <>
            <CreditCard className="h-4 w-4" />
            Pay ₦{item.price.toLocaleString()}
          </>
        )
    }
  }

  const getButtonVariant = () => {
    switch (paymentStatus) {
      case "success":
        return "default" as const
      case "error":
        return "destructive" as const
      default:
        return "default" as const
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handlePayment}
        disabled={isLoading || paymentStatus === "success"}
        className="w-full flex items-center justify-center gap-2 text-lg py-6 bg-blue-600 hover:bg-blue-700"
        variant={getButtonVariant()}
      >
        {getButtonContent()}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {paymentStatus === "success" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Payment completed successfully! You will receive a confirmation email shortly.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500 text-center">
        <p>Secure payment powered by Paystack</p>
        <p>Supports cards, bank transfers, USSD, and mobile money</p>
      </div>
    </div>
  )
}
