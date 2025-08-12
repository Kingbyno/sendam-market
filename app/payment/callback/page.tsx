"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { verifyPayment } from "@/lib/actions/payment-actions"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const reference = searchParams.get("reference")
  const trxref = searchParams.get("trxref")

  useEffect(() => {
    const paymentReference = reference || trxref

    if (!paymentReference) {
      setStatus("failed")
      setError("No payment reference found")
      return
    }

    verifyPaymentStatus(paymentReference)
  }, [reference, trxref])

  const verifyPaymentStatus = async (paymentReference: string) => {
    try {
      const result = await verifyPayment(paymentReference)

      if (result.success && (result.status === "success" || result.demo)) {
        setStatus("success")
        setPaymentData(result)
      } else {
        setStatus("failed")
        setError(result.message || "Payment verification failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setStatus("failed")
      setError(error instanceof Error ? error.message : "Payment verification failed")
    }
  }

  const handleContinue = () => {
    router.push("/marketplace")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === "failed" && <XCircle className="h-6 w-6 text-red-600" />}

            {status === "loading" && "Verifying Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "failed" && "Payment Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="text-center text-gray-600">
              <p>Please wait while we verify your payment...</p>
            </div>
          )}

          {status === "success" && paymentData && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your payment has been processed successfully!
                  {paymentData.demo && " (Demo Mode)"}
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-medium">₦{paymentData.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reference:</span>
                  <span className="font-mono text-sm">{paymentData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">{paymentData.demo ? "Demo Success" : "Paid"}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 text-center">
                <p>You will receive a confirmation email shortly.</p>
                <p>Our admin will contact you for delivery arrangements.</p>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error || "Payment could not be verified. Please contact support."}</AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600 text-center">
                <p>If you believe this is an error, please contact our support team.</p>
              </div>
            </div>
          )}

          <Button onClick={handleContinue} className="w-full" disabled={status === "loading"}>
            {status === "success" ? "Continue Shopping" : "Back to Marketplace"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
