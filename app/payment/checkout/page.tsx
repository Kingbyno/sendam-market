"use client"

export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import NextDynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"
// Dynamically import checkout form to disable SSR for Paystack (avoids window undefined)
const CheckoutForm = NextDynamic(() => import("@/components/payment/checkout-form").then(m => m.CheckoutForm), {
  ssr: false,
  loading: () => <div className="text-center py-6">Loading payment module...</div>
})

function CheckoutPageInner() {
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const itemId = searchParams?.get("itemId") ?? ""
  const amount = searchParams?.get("amount") ?? ""
  const basePrice = searchParams?.get("basePrice") ?? ""
  const serviceFee = searchParams?.get("serviceFee") ?? ""
  const deliveryOption = searchParams?.get("deliveryOption") ?? "direct"
  const description = searchParams?.get("description") ?? ""

  if (!itemId || !amount || !basePrice || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Invalid checkout session. Please return to the item page and try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const numericAmount = parseFloat(amount)
  const numericBasePrice = parseFloat(basePrice)
  const numericServiceFee = parseFloat(serviceFee || "0")
  const isWithInspection = deliveryOption === "sendam"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto py-8">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
            <CardDescription>Review your order and proceed to payment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium">{description.replace("Purchase ", "").split(" with ")[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Option:</span>
                  <span className="font-medium capitalize">
                    {isWithInspection ? "Sendam Inspection & Delivery" : "Direct Meetup"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Item Price:</span>
                  <span className="font-medium">₦{numericBasePrice.toLocaleString()}</span>
                </div>
                {isWithInspection && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sendam Service Fee (10%):</span>
                    <span className="font-medium">₦{numericServiceFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>₦{numericAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                {isWithInspection ? "Sendam Protection" : "Escrow Protection"}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {isWithInspection ? (
                  <>
                    <li>• Item inspected and verified before delivery</li>
                    <li>• Professional delivery to your location</li>
                    <li>• Full refund if item doesn't match description</li>
                    <li>• Funds held securely until you confirm receipt</li>
                  </>
                ) : (
                  <>
                    <li>• Secure escrow payment protection</li>
                    <li>• Funds held until you confirm receipt</li>
                    <li>• 14-day automatic release if no issues</li>
                    <li>• Direct dispute resolution support</li>
                  </>
                )}
              </ul>
            </div>

            <CheckoutForm
              email={user.email || ""}
              amount={numericAmount * 100} // Paystack expects amount in kobo
              metadata={{
                itemId,
                userId: user.id,
                deliveryOption,
                basePrice: numericBasePrice,
                serviceFee: numericServiceFee,
                description,
              }}
            />

            <Alert className="bg-green-50 border-green-200">
              <Lock className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your payment is securely processed by Paystack and held in escrow until delivery confirmation.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading Checkout...</div>}>
      <CheckoutPageInner />
    </Suspense>
  )
}
