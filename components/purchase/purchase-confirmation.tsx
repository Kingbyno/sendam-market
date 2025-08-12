"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Shield } from "lucide-react"
import type { OrderWithItem } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

interface PurchaseConfirmationProps {
  order: OrderWithItem
}

export function PurchaseConfirmation({ order }: PurchaseConfirmationProps) {
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Shield className="h-4 w-4" />,
          description: "Your payment is secure. We will notify you when the item is shipped.",
        }
      case "SHIPPED":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <Package className="h-4 w-4" />,
          description: "Your item is on its way to you.",
        }
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4" />,
          description: "Your order is complete. Thank you for your purchase!",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <CheckCircle className="h-4 w-4" />,
          description: "Your order has been successfully placed.",
        }
    }
  }

  const statusInfo = getStatusInfo(order.status)
  const itemPrice = order.amount / 1.15
  const fee = order.amount - itemPrice

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your order. Your purchase is confirmed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={order.item.images?.[0] || "/placeholder.svg"}
                  alt={order.item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{order.item.title}</h3>
                <p className="text-lg font-bold">₦{order.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Price:</span>
                <span className="font-medium">₦{itemPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sendam Verification Fee (15%):</span>
                <span className="font-medium">₦{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total Paid:</span>
                <span>₦{order.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Order Details</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm">{order.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{format(new Date(order.createdAt), "PPP")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Status:</span>
              <Badge className={`${statusInfo.color} gap-1`}>
                {statusInfo.icon}
                {order.status}
              </Badge>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">{statusInfo.description}</p>
            <Button asChild>
              <Link href="/marketplace">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
