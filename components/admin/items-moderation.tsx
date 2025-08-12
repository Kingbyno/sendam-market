"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { approveItem, rejectItem, getPendingItems } from "@/lib/actions/admin-actions"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export function ItemsModeration() {
  const queryClient = useQueryClient()
  const [rejectionDialog, setRejectionDialog] = useState({
    open: false,
    itemId: "",
    reason: "",
  })

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pendingItems"],
    queryFn: () => getPendingItems(),
    select: (data) => {
      if (data.success) {
        return data.items
      }
      throw new Error(data.error || "Failed to fetch pending items.")
    },
  })

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingItems"] })
      toast.success("Action completed successfully.")
    },
    onError: (error: Error) => {
      toast.error(`An error occurred: ${error.message}`)
    },
  }

  const approveMutation = useMutation({
    mutationFn: approveItem,
    ...mutationOptions,
  })

  const rejectMutation = useMutation({
    mutationFn: (data: { itemId: string; reason: string }) =>
      rejectItem(data.itemId, data.reason),
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess()
      setRejectionDialog({ open: false, itemId: "", reason: "" })
    },
  })

  const handleRejectSubmit = () => {
    if (!rejectionDialog.reason) {
      toast.error("Rejection reason cannot be empty.")
      return
    }
    rejectMutation.mutate(rejectionDialog)
  }

  if (isLoading) return <div>Loading pending items...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">Item Moderation Queue</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items && items.length > 0 ? (
              items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.images[0] || "/placeholder.jpg"}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.category?.name || "No Category"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.seller.name || "N/A"}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(item.id)}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setRejectionDialog({ open: true, itemId: item.id, reason: "" })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No pending items to moderate.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectionDialog.open}
        onOpenChange={open => setRejectionDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this item. This will be sent to the seller.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="rejection-reason"
              value={rejectionDialog.reason}
              onChange={e =>
                setRejectionDialog(prev => ({ ...prev, reason: e.target.value }))
              }
              placeholder="e.g., Prohibited item, blurry photos, etc."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialog({ open: false, itemId: "", reason: "" })}
            >
              Cancel
            </Button>
            <Button onClick={handleRejectSubmit} disabled={rejectMutation.isPending}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
