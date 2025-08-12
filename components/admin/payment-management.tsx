"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Shield, CheckCircle, XCircle, CreditCard } from "lucide-react"
import {
  createSellerPaymentInfo,
  updateSellerPaymentInfo,
  getAllSellersPaymentInfo,
  deleteSellerPaymentInfo,
} from "@/lib/actions/payment-info-actions"
import type { SellerPaymentInfo } from "@/lib/types"

// Extended type to handle date flexibility and optional seller email
type PaymentInfo = SellerPaymentInfo & {
  sellerEmail?: string
  createdAt: string | Date
  updatedAt: string | Date
}

interface PaymentManagementProps {
  initialPaymentInfo?: PaymentInfo[]
}

export function PaymentManagement({ initialPaymentInfo = [] }: PaymentManagementProps) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo[]>(initialPaymentInfo)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [editingPayment, setEditingPayment] = useState<PaymentInfo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  // Load payment info if not provided initially
  useEffect(() => {
    if (initialPaymentInfo.length === 0) {
      setIsLoading(true)
      getAllSellersPaymentInfo()
        .then((data) => {
          // Convert data to match our PaymentInfo type
          const convertedData: PaymentInfo[] = data.map(item => ({
            ...item,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            sellerEmail: item.sellerEmail
          }))
          setPaymentInfo(convertedData)
        })
        .catch(error => {
          console.error('Error loading payment info:', error)
          toast({
            title: "Error",
            description: "Failed to load payment information",
            variant: "destructive",
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [initialPaymentInfo.length, toast])

  // Helper function to convert database results to PaymentInfo type
  const convertToPaymentInfo = (data: any[]): PaymentInfo[] => {
    return data.map(item => ({
      ...item,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      sellerEmail: item.sellerEmail
    }))
  }

  const [formData, setFormData] = useState<{
    sellerId: string
    bankName: string
    accountName: string
    accountNumber: string
    isVerified: boolean
  }>({
    sellerId: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    isVerified: false,
  })

  const resetForm = () => {
    setFormData({
      sellerId: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      isVerified: false,
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createSellerPaymentInfo({
        sellerId: formData.sellerId,
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
      })

      if (result.success) {
        toast({
          title: "Payment information created",
          description: "Seller payment information has been successfully created.",
        })

        // Refresh the list
        const updatedList = await getAllSellersPaymentInfo()
        setPaymentInfo(convertToPaymentInfo(updatedList))

        setIsCreateDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create payment information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPayment) return

    setIsSubmitting(true)

    try {
      const result = await updateSellerPaymentInfo(editingPayment.id, {
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        isVerified: formData.isVerified,
      })

      if (result.success) {
        toast({
          title: "Payment information updated",
          description: "Seller payment information has been successfully updated.",
        })

        // Refresh the list
        const updatedList = await getAllSellersPaymentInfo()
        setPaymentInfo(convertToPaymentInfo(updatedList))

        setIsEditDialogOpen(false)
        setEditingPayment(null)
        resetForm()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update payment information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSellerPaymentInfo(id)

      toast({
        title: "Payment information deleted",
        description: "Seller payment information has been successfully deleted.",
      })

      // Refresh the list
      const updatedList = await getAllSellersPaymentInfo()
      setPaymentInfo(convertToPaymentInfo(updatedList))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete payment information",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (payment: SellerPaymentInfo & { sellerEmail?: string }) => {
    setEditingPayment(payment)
    setFormData({
      sellerId: payment.sellerId,
      bankName: payment.bankName,
      accountName: payment.accountName,
      accountNumber: payment.accountNumber,
      isVerified: payment.isVerified,
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Payment Information Management
          </h2>
          <p className="text-gray-600 mt-1">Securely manage seller payment details (Admin Only)</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Payment Info
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Add Seller Payment Information
              </DialogTitle>
              <DialogDescription>
                Add payment information for a seller to enable fund transfers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="sellerId">Seller ID *</Label>
                <Input
                  id="sellerId"
                  value={formData.sellerId}
                  onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                  placeholder="Enter seller UUID"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name *</Label>
                <Select
                  value={formData.bankName}
                  onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Access Bank">Access Bank</SelectItem>
                    <SelectItem value="GTBank">GTBank</SelectItem>
                    <SelectItem value="First Bank">First Bank</SelectItem>
                    <SelectItem value="UBA">UBA</SelectItem>
                    <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                    <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
                    <SelectItem value="Union Bank">Union Bank</SelectItem>
                    <SelectItem value="Sterling Bank">Sterling Bank</SelectItem>
                    <SelectItem value="Stanbic IBTC">Stanbic IBTC</SelectItem>
                    <SelectItem value="Ecobank">Ecobank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "") })}
                  placeholder="Enter 10-digit account number"
                  maxLength={10}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading payment information...</p>
          </CardContent>
        </Card>
      ) : !paymentInfo || paymentInfo.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Information</h3>
            <p className="text-gray-500 mb-4">No seller payment information has been added yet.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Add First Payment Info</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {(paymentInfo || []).map((payment) => (
            <Card key={payment.id} className="border-l-4 border-l-blue-400">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {payment.accountName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {payment.isVerified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Seller Email</Label>
                      <p className="text-sm">{payment.sellerEmail || "Unknown"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                      <p className="text-sm">{payment.bankName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                      <p className="text-sm font-mono">****{payment.accountNumber.slice(-4)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Created</Label>
                      <p className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                      <p className="text-sm">{new Date(payment.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(payment)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Payment Information</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the payment information for {payment.accountName}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(payment.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Payment Information
            </DialogTitle>
            <DialogDescription>
              Update the payment information for this seller.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="editBankName">Bank Name *</Label>
              <Select
                value={formData.bankName}
                onValueChange={(value) => setFormData({ ...formData, bankName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Access Bank">Access Bank</SelectItem>
                  <SelectItem value="GTBank">GTBank</SelectItem>
                  <SelectItem value="First Bank">First Bank</SelectItem>
                  <SelectItem value="UBA">UBA</SelectItem>
                  <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                  <SelectItem value="Fidelity Bank">Fidelity Bank</SelectItem>
                  <SelectItem value="Union Bank">Union Bank</SelectItem>
                  <SelectItem value="Sterling Bank">Sterling Bank</SelectItem>
                  <SelectItem value="Stanbic IBTC">Stanbic IBTC</SelectItem>
                  <SelectItem value="Ecobank">Ecobank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="editAccountName">Account Name *</Label>
              <Input
                id="editAccountName"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Enter account holder name"
                required
              />
            </div>

            <div>
              <Label htmlFor="editAccountNumber">Account Number *</Label>
              <Input
                id="editAccountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "") })}
                placeholder="Enter 10-digit account number"
                maxLength={10}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsVerified"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="editIsVerified" className="text-sm">
                Mark as verified
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
