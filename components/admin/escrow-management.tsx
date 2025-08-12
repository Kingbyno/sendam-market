"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, Clock, Package, Shield, Eye } from "lucide-react"
import {
  getEscrowTransactions,
  markItemDelivered,
  processAutoReleases,
} from "@/lib/actions/escrow-actions"
import { useToast } from "@/hooks/use-toast"

interface EscrowTransaction {
  id: string
  paymentReference: string
  status: string
  amount: number
  createdAt: string | Date
  item: {
    title: string
    price: number
  }
  buyer: {
    email: string
    name: string | null
  }
  seller: {
    email: string
    name: string | null
  }
}

export function EscrowManagement() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [disputeResolution, setDisputeResolution] = useState("")
  const [disputeAction, setDisputeAction] = useState<"release_to_seller" | "refund_to_buyer">("release_to_seller")
  const { toast } = useToast()

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const result = await getEscrowTransactions(undefined, true)
      if (result.success) {
        setTransactions(result.transactions || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkDelivered = async (transactionId: string) => {
    setIsProcessing(true)
    try {
      const result = await markItemDelivered(transactionId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Item marked as delivered",
        })
        loadTransactions()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark as delivered",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error marking item as delivered",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResolveDispute = async () => {
    if (!selectedTransaction || !disputeResolution.trim()) {
      toast({
        title: "Error",
        description: "Please provide a resolution",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // TODO: Implement resolveDispute function
      toast({
        title: "Info",
        description: "Dispute resolution feature is not yet implemented",
        variant: "default",
      })
      setSelectedTransaction(null)
      setDisputeResolution("")
      // loadTransactions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error resolving dispute",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRunAutoRelease = async () => {
    setIsProcessing(true)
    try {
      const result = await processAutoReleases()
      if (result.success) {
        toast({
          title: "Auto-Release Complete",
          description: `Processed ${result.processedCount} transactions`,
        })
        loadTransactions()
      } else {
        toast({
          title: "Error",
          description: "Failed to run auto-release",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error running auto-release",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "released":
        return "bg-green-100 text-green-800"
      case "disputed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "paid":
        return <Shield className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "released":
        return <CheckCircle className="h-4 w-4" />
      case "disputed":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.status === filter
    const matchesSearch =
      transaction.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.email.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    paid: transactions.filter((t) => t.status === "paid").length,
    delivered: transactions.filter((t) => t.status === "delivered").length,
    disputed: transactions.filter((t) => t.status === "disputed").length,
    completed: transactions.filter((t) => ["confirmed", "released"].includes(t.status)).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Escrow Management</h2>
        <div className="flex gap-2">
          <Button onClick={handleRunAutoRelease} variant="outline" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Run Auto-Release"}
          </Button>
          <Button onClick={loadTransactions} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.disputed}</div>
            <div className="text-sm text-gray-600">Disputed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="released">Released</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Manage escrow transactions and resolve disputes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.paymentReference}</TableCell>
                  <TableCell>
                    <div className="max-w-48 truncate">{transaction.item.title}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(transaction.status)}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{transaction.buyer.name || transaction.buyer.email}</TableCell>
                  <TableCell className="text-sm">{transaction.seller.name || transaction.seller.email}</TableCell>
                  <TableCell className="text-sm">{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <DialogDescription>{selectedTransaction?.paymentReference}</DialogDescription>
                          </DialogHeader>
                          {selectedTransaction && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Item</label>
                                  <p>{selectedTransaction.item.title}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Amount</label>
                                  <p>{formatCurrency(selectedTransaction.amount)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Buyer</label>
                                  <p>{selectedTransaction.buyer.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Seller</label>
                                  <p>{selectedTransaction.seller.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Badge className={getStatusColor(selectedTransaction.status)}>
                                    {selectedTransaction.status}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Delivery</label>
                                  <p className="capitalize">Standard</p>
                                </div>
                              </div>

                              {/* TODO: Add dispute reason field to interface */}

                              <div className="flex gap-2 pt-4 border-t">
                                {selectedTransaction.status === "paid" && (
                                  <Button
                                    onClick={() => handleMarkDelivered(selectedTransaction.id)}
                                    disabled={isProcessing}
                                  >
                                    Mark as Delivered
                                  </Button>
                                )}

                                {selectedTransaction.status === "disputed" && (
                                  <div className="space-y-4 w-full">
                                    <div>
                                      <label className="text-sm font-medium">Resolution</label>
                                      <Textarea
                                        value={disputeResolution}
                                        onChange={(e) => setDisputeResolution(e.target.value)}
                                        placeholder="Describe how this dispute was resolved..."
                                        rows={3}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Action</label>
                                      <Select
                                        value={disputeAction}
                                        onValueChange={(value: any) => setDisputeAction(value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="release_to_seller">Release to Seller</SelectItem>
                                          <SelectItem value="refund_to_buyer">Refund to Buyer</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      onClick={handleResolveDispute}
                                      disabled={isProcessing || !disputeResolution.trim()}
                                    >
                                      {isProcessing ? "Resolving..." : "Resolve Dispute"}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">No transactions found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
