"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Purchase, Item, User, PurchaseStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { confirmAndReleaseFunds } from "@/lib/actions/release-actions"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

type PurchaseWithDetails = Purchase & {
  item: Pick<Item, "title" | "images">
  seller: Pick<User, "name" | "email">
}

interface PurchaseDetailsClientProps {
  purchase: PurchaseWithDetails
  userId: string
}

const getStatusInfo = (
  status: PurchaseStatus
): { text: string; color: string; description: string } => {
  switch (status) {
    case "PENDING":
      return {
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        description: "Payment has not been confirmed yet.",
      }
    case "PAID":
      return {
        text: "Paid",
        color: "bg-blue-100 text-blue-800",
        description:
          "Payment confirmed. The seller is preparing the item for delivery.",
      }
    case "DELIVERED":
      return {
        text: "Delivered",
        color: "bg-purple-100 text-purple-800",
        description:
          "The item is marked as delivered. Please confirm you have received it.",
      }
    case "CONFIRMED":
      return {
        text: "Confirmed",
        color: "bg-green-100 text-green-800",
        description:
          "You have confirmed receipt. Funds are being released to the seller.",
      }
    case "RELEASED":
      return {
        text: "Funds Released",
        color: "bg-green-100 text-green-800",
        description: "Payment has been sent to the seller. Thank you!",
      }
    case "DISPUTED":
      return {
        text: "Disputed",
        color: "bg-red-100 text-red-800",
        description:
          "A dispute has been raised for this transaction. Admin will investigate.",
      }
    case "REFUNDED":
      return {
        text: "Refunded",
        color: "bg-gray-100 text-gray-800",
        description: "The payment for this transaction has been refunded.",
      }
    default:
      return {
        text: "Unknown",
        color: "bg-gray-100 text-gray-800",
        description: "The transaction is in an unknown state.",
      }
  }
}

export function PurchaseDetailsClient({
  purchase,
  userId,
}: PurchaseDetailsClientProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleReleaseFunds = async () => {
    setIsProcessing(true)
    try {
      const result = await confirmAndReleaseFunds(purchase.id, userId)
      if (result.success) {
        toast({
          title: "Funds Released",
          description: "The payment has been released to the seller.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to release funds.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const canReleaseFunds = purchase.status === "DELIVERED" && purchase.buyerId === userId
  const statusInfo = getStatusInfo(purchase.status)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Purchase Details</CardTitle>
        <CardDescription>
          Transaction Ref: {purchase.paymentReference}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Image
            src={purchase.item.images[0] || "/placeholder.jpg"}
            alt={purchase.item.title}
            width={100}
            height={100}
            className="rounded-lg object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">{purchase.item.title}</h3>
            <p className="text-gray-500">
              Sold by: {purchase.seller.name || purchase.seller.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Amount Paid</p>
            <p className="font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(purchase.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
          </div>
        </div>

        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Transaction Status</AlertTitle>
          <AlertDescription>{statusInfo.description}</AlertDescription>
        </Alert>

        {canReleaseFunds && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Action Required</h4>
            <p className="text-sm text-gray-600 mb-4">
              If you have received your item and are satisfied with it, please
              click the button below to release the payment to the seller.
            </p>
            <Button
              onClick={handleReleaseFunds}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing
                ? "Processing..."
                : "Confirm Receipt & Release Funds"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Note: Once funds are released, the transaction is considered
              complete and cannot be reversed. If you have any issues, please
              contact support immediately.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
