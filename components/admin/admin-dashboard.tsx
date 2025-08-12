"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Users,
  TrendingUp,
  Eye,
  Check,
  X,
  MessageSquare,
  Shield,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import {
  getPendingItems,
  approveItem,
  rejectItem,
  deleteItem,
  getItemStats,
} from "@/lib/actions/admin-actions"
import { PaymentManagement } from "./payment-management"
import { EscrowManagement } from "./escrow-management"
import { ItemManagement } from "./item-management" // Import the new component
import { toast } from "sonner"
import type { Item, Category } from "@/lib/types"

// This interface now correctly reflects the data from `getPendingItems`
export interface PendingItem extends Item {
  seller_name: string
  seller_email: string
  created_at: string
}

interface ItemStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface AdminDashboardProps {
  adminId: string
  initialPendingItems: PendingItem[]
  initialPaymentInfo: any[]
}

export function AdminDashboard({
  adminId,
  initialPendingItems,
  initialPaymentInfo,
}: AdminDashboardProps) {
  const [pendingItems, setPendingItems] =
    useState<PendingItem[]>(initialPendingItems)
  const [stats, setStats] = useState<ItemStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("pending-items")

  const loadData = async () => {
    setLoading(true)
    try {
      const [itemsResult, statsResult] = await Promise.all([
        getPendingItems(),
        getItemStats(),
      ])

      if (itemsResult.success && itemsResult.items) {
        // Ensure all required properties are present with defaults
        const itemsWithDefaults = itemsResult.items.map((item: any) => ({
          ...item,
          featured: item.featured || false,
          urgent: item.urgent || false,
          negotiable: item.negotiable || false,
          seller_name: item.seller?.name ?? "",
          seller_email: item.seller?.email ?? "",
          created_at: item.createdAt instanceof Date 
            ? item.createdAt.toISOString() 
            : item.createdAt?.toString() ?? ""
        }))
        setPendingItems(itemsWithDefaults as PendingItem[])
      } else {
        toast.error(itemsResult.error || "Failed to fetch pending items.")
      }

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats)
      }
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Set initial items from props, then fetch fresh stats
    setPendingItems(initialPendingItems)
    getItemStats().then((statsResult) => {
      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats)
      }
    })
  }, [initialPendingItems])

  const handleApprove = async (itemId: string) => {
    setIsProcessing(true)
    try {
      await approveItem(itemId)
      toast.success("Item approved successfully")
      setSelectedItem(null)
      await loadData()
    } catch (error) {
      console.error("Error approving item:", error)
      toast.error("Failed to approve item")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (itemId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsProcessing(true)
    try {
      await rejectItem(itemId, reason)
      toast.success("Item rejected")
      setSelectedItem(null)
      setRejectionReason("")
      await loadData()
    } catch (error) {
      console.error("Error rejecting item:", error)
      toast.error("Failed to reject item")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (
      !confirm("Are you sure you want to delete this item? This action cannot be undone.")
    ) {
      return
    }

    setIsProcessing(true)
    try {
      await deleteItem(itemId)
      toast.success("Item deleted successfully")
      setSelectedItem(null)
      await loadData()
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedItem(null)}>
      <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your marketplace with ease.
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            className="mt-4 sm:mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Items</CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All items in the system
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pending Review
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved</CardTitle>
              <Check className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.approved}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Live on marketplace
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Rejected</CardTitle>
              <X className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats.rejected}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Did not meet guidelines
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="pending-items" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-300">
              <TrendingUp className="mr-2 h-4 w-4" />
              Pending Items
            </TabsTrigger>
            <TabsTrigger value="all-items" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-300">
              <Package className="mr-2 h-4 w-4" />
              All Items
            </TabsTrigger>
            <TabsTrigger value="escrow" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-300">
              <Shield className="mr-2 h-4 w-4" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-300">
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 text-gray-600 dark:text-gray-300">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending-items">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Pending Items for Review</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Review and approve items submitted by sellers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      Loading items...
                    </h3>
                  </div>
                ) : pendingItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      No pending items
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      All items have been reviewed. Check back later!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200 dark:border-gray-700">
                          <TableHead className="w-[350px] text-gray-700 dark:text-gray-300 font-medium">Item</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Price</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Seller</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Submitted</TableHead>
                          <TableHead className="text-right text-gray-700 dark:text-gray-300 font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-700">
                            <TableCell>
                              <div className="flex items-center space-x-4">
                                <img
                                  src={item.images?.[0] || "/placeholder.svg"}
                                  alt={item.title}
                                  className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                />
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.category?.name || "No Category"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {item.seller_name || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.seller_email || "N/A"}
                              </p>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-300">{formatDate(item.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedItem(item)}
                                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </DialogTrigger>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all-items">
            <ItemManagement />
          </TabsContent>
          <TabsContent value="escrow">
            <EscrowManagement />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentManagement initialPaymentInfo={initialPaymentInfo} />
          </TabsContent>
          <TabsContent value="users">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">User Management</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  View and manage marketplace users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">User management interface coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {selectedItem && (
          <>
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">{selectedItem.title}</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Review and manage the details of this item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Item image ${index + 1}`}
                      className="rounded-lg object-cover w-full h-32 border border-gray-200"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Details</h3>
                <div className="text-sm space-y-2">
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Price:</strong> {formatCurrency(selectedItem.price)}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Category:</strong>{" "}
                    {selectedItem.category?.name || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Condition:</strong> {selectedItem.condition}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Location:</strong> {selectedItem.location}
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Submitted:</strong>{" "}
                    {formatDate(selectedItem.created_at)}
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-md text-gray-700 border border-gray-200">
                  {selectedItem.description}
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={isProcessing}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Confirm Rejection</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Please provide a reason for rejecting this item. This will
                      be sent to the seller.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="e.g., Images are not clear, description is incomplete..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="my-4 border-gray-300"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost" className="text-gray-600 hover:bg-gray-50">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleReject(selectedItem.id, rejectionReason)
                      }
                      disabled={isProcessing || !rejectionReason.trim()}
                    >
                      {isProcessing ? "Rejecting..." : "Confirm Reject"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="secondary"
                onClick={() => handleDelete(selectedItem.id)}
                disabled={isProcessing}
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                Delete Permanently
              </Button>
              <Button
                onClick={() => handleApprove(selectedItem.id)}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                {isProcessing ? "Approving..." : "Approve"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
