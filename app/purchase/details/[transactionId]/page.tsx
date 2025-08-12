"use client";

import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth/get-auth";
import { getEscrowTransaction, confirmReceipt, raiseDispute } from "@/lib/actions/escrow-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Clock, Package, Shield, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PurchaseDetailsPageProps {
  params: {
    transactionId: string;
  };
}

export default function PurchaseDetailsPage({ params }: PurchaseDetailsPageProps) {
  const [transaction, setTransaction] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadTransactionDetails();
  }, [params.transactionId]);

  const loadTransactionDetails = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const authResult = await getAuth();
      if (!authResult.user) {
        setError("Please log in to view transaction details");
        return;
      }
      setUser(authResult.user);

      // Get escrow transaction
      const result = await getEscrowTransaction(params.transactionId);
      if (result.success) {
        setTransaction(result.transaction);
          // Check if user is authorized to view this transaction
        if (result.transaction && (result.transaction.buyerId !== authResult.user.id && result.transaction.sellerId !== authResult.user.id)) {
          setError("You are not authorized to view this transaction");
          return;
        }
      } else {
        setError(result.error || "Transaction not found");
      }
    } catch (error) {
      setError("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!user || !transaction) return;
    
    setIsProcessing(true);
    try {
      const result = await confirmReceipt(transaction.paymentReference, user.id);
      if (result.success) {
        toast({
          title: "Funds Released",
          description: "Payment has been released to the seller. Thank you for confirming receipt!",
        });
        loadTransactionDetails(); // Refresh transaction details
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to release funds",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!user || !transaction || !disputeReason.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await raiseDispute(transaction.paymentReference, user.id, disputeReason);
      if (result.success) {
        toast({
          title: "Dispute Raised",
          description: "Your dispute has been submitted. Our team will review it shortly.",
        });
        setIsDisputeDialogOpen(false);
        setDisputeReason("");
        loadTransactionDetails();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to raise dispute",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "paid":
        return <Shield className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "confirmed":
      case "released":
        return <CheckCircle className="h-4 w-4" />;
      case "disputed":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "confirmed":
      case "released":
        return "bg-green-100 text-green-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Payment is being processed";
      case "paid":
        return "Payment confirmed. Seller is preparing item for delivery";
      case "delivered":
        return "Item has been delivered. Please confirm receipt to release funds";
      case "confirmed":
        return "Receipt confirmed. Funds are being released to seller";
      case "released":
        return "Funds have been released to seller. Transaction complete";
      case "disputed":
        return "A dispute has been raised. Our team is investigating";
      default:
        return "Status unknown";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertCircle className="mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline">
                <Link href="/marketplace">Return to Marketplace</Link>
              </Button>
              <Button asChild>
                <Link href="/admin">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Transaction not found</p>
            <Button asChild className="mt-4">
              <Link href="/marketplace">Return to Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const isBuyer = user?.id === transaction.buyerId;
  const canConfirmReceipt = isBuyer && transaction.status === "delivered";
  const canRaiseDispute = (isBuyer || user?.id === transaction.sellerId) && 
                         ["paid", "delivered"].includes(transaction.status);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Transaction Details</h1>
          <p className="text-gray-600 mt-2">Track your purchase and manage your transaction</p>
        </div>

        {/* Main Transaction Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction {transaction.paymentReference}</span>
              <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1`}>
                {getStatusIcon(transaction.status)}
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Item Details */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 bg-gray-100 rounded-md overflow-hidden">                  <img 
                    src={transaction.item?.images?.[0] || "/placeholder.jpg"} 
                    alt={transaction.item?.title || "Item"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{transaction.item?.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    Direct Purchase
                  </p>
                  <p className="text-lg font-bold mt-1">{formatCurrency(transaction.amount)}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Current Status</h4>
              <p className="text-sm text-blue-700">{getStatusDescription(transaction.status)}</p>
            </div>

            {/* Payment Breakdown */}            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold">Payment Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span>{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(transaction.amount)}</span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-600">Created:</label>
                <p className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              {transaction.status === "PAID" && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Status:</label>
                  <p className="text-sm">Payment Confirmed</p>
                </div>
              )}
              {transaction.deliveredAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Delivered:</label>
                  <p className="text-sm">{new Date(transaction.deliveredAt).toLocaleString()}</p>
                </div>
              )}
              {transaction.confirmedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Confirmed:</label>
                  <p className="text-sm">{new Date(transaction.confirmedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {(canConfirmReceipt || canRaiseDispute) && (
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold">Available Actions</h4>
                
                {canConfirmReceipt && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 mb-3">
                        Have you received your item and are satisfied with it? Click below to release payment to the seller.
                      </p>
                      <Button
                        onClick={handleConfirmReceipt}
                        disabled={isProcessing}
                        className="w-full"
                        size="lg"
                      >
                        {isProcessing ? "Processing..." : "Confirm Receipt & Release Funds"}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Once funds are released, the transaction cannot be reversed.
                      </p>
                    </div>
                  </div>
                )}

                {canRaiseDispute && (
                  <Dialog open={isDisputeDialogOpen} onOpenChange={setIsDisputeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Raise a Dispute
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Raise a Dispute</DialogTitle>
                        <DialogDescription>
                          Please describe the issue you're experiencing with this transaction.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Describe the issue in detail..."
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsDisputeDialogOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleRaiseDispute}
                            disabled={isProcessing || !disputeReason.trim()}
                            className="flex-1"
                          >
                            {isProcessing ? "Submitting..." : "Submit Dispute"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2 justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/marketplace">Continue Shopping</Link>
              </Button>
              <Button asChild>
                <Link href="/admin">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
