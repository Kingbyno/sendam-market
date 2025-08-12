"use client";

import { verifyPayment } from "@/lib/actions/payment-actions";
import { getEscrowTransaction } from "@/lib/actions/escrow-actions";
import { PurchaseConfirmation } from "@/components/purchase/purchase-confirmation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type { OrderWithItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PurchasePageProps {
  params: {
    transactionId: string;
  };
}

export default function PurchasePage({ params }: PurchasePageProps) {
  const [order, setOrder] = useState<OrderWithItem | null>(null);
  const [escrowTransaction, setEscrowTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleVerification = async () => {
      setIsLoading(true);
      try {
        // First try to verify payment and get order
        const result = await verifyPayment(params.transactionId);
        if (result.success && result.order) {
          // Type cast to handle the mismatch between PurchaseWithRelations and OrderWithItem
          const orderData = result.order as any;
          setOrder({
            id: orderData.id,
            buyerId: orderData.buyerId,
            itemId: orderData.itemId,
            transactionId: orderData.paymentReference || params.transactionId,
            amount: orderData.amount,
            status: orderData.status,
            createdAt: orderData.createdAt,
            updatedAt: orderData.updatedAt,
            metadata: null,
            item: orderData.item
          });
          
          // Also try to get escrow transaction details
          try {
            const escrowResult = await getEscrowTransaction(params.transactionId);
            if (escrowResult.success) {
              setEscrowTransaction(escrowResult.transaction);
            }
          } catch (escrowError) {
            console.log("No escrow transaction found, using basic order info");
          }
        } else {
          setError(result.error || "Failed to verify your payment.");
        }
      } catch (e) {
        setError("An unexpected error occurred during payment verification.");
      } finally {
        setIsLoading(false);
      }
    };

    handleVerification();
  }, [params.transactionId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg text-gray-600">
          Verifying your payment, please wait...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-lg bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertCircle className="mr-2" />
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <p className="mt-4 text-sm text-gray-600">
              If you believe this is an error, please contact support with your
              transaction reference:{" "}
              <strong className="font-mono">{params.transactionId}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order && !error) {
    notFound();
  }

  // If we have an escrow transaction, show escrow confirmation
  if (escrowTransaction) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl mt-4">Payment Successful!</CardTitle>
            <CardDescription>Your purchase is confirmed and funds are securely held in escrow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={escrowTransaction.item?.images?.[0] || "/placeholder.jpg"} 
                    alt={escrowTransaction.item?.title || "Item"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{escrowTransaction.item?.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    Direct Purchase
                  </p>
                  <p className="text-lg font-bold">₦{escrowTransaction.amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Seller will be notified of your payment</li>
                <li>• Arrange delivery details via chat/phone</li>
                <li>• Inspect item upon delivery</li>
                <li>• Confirm receipt to release funds to seller</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <h3 className="font-semibold">Transaction Details</h3>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm">{escrowTransaction.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="capitalize font-medium text-blue-600">{escrowTransaction.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(escrowTransaction.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                You can track your purchase progress in your account or contact our support team.
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild variant="outline">
                  <Link href="/marketplace">Continue Shopping</Link>
                </Button>
                <Button asChild>
                  <Link href="/admin">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (order) {
    return <PurchaseConfirmation order={order} />;
  }
}
