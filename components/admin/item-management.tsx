"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, Trash, PlusCircle } from "lucide-react"
import { getAllItems, updateItem, deleteItem, createItem } from "@/lib/actions/admin-actions"
import { toast } from "sonner"
import type { Item, Category } from "@/lib/types"

interface ManagedItem extends Item {
  seller_name: string
  seller_email: string
  created_at: string
  category_name: string
}

export function ItemManagement() {
  const [items, setItems] = useState<ManagedItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ManagedItem | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const loadItems = async () => {
    setLoading(true)
    const result = await getAllItems()
    if (result.success && result.items) {
      setItems(result.items as ManagedItem[])
    } else {
      toast.error(result.error || "Failed to fetch items.")
    }
    setLoading(false)
  }

  // Fetch categories for the edit/create forms
  const loadCategories = async () => {
    // In a real app, you'd fetch this from your backend
    // For now, we'll assume they might be passed in or fetched separately
    // This is a placeholder for fetching categories
  }

  useEffect(() => {
    loadItems()
    loadCategories()
  }, [])

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item permanently?")) return
    setIsProcessing(true)
    const result = await deleteItem(itemId)
    if (result.success) {
      toast.success("Item deleted successfully.")
      loadItems()
    } else {
      toast.error(result.error || "Failed to delete item.")
    }
    setIsProcessing(false)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedItem) return

    setIsProcessing(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateItem(selectedItem.id, formData)

    if (result.success) {
      toast.success("Item updated successfully.")
      setSelectedItem(null)
      loadItems()
    } else {
      toast.error(result.error || "Failed to update item.")
    }
    setIsProcessing(false)
  }
  
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    const formData = new FormData(e.currentTarget)
    const result = await createItem(formData)

    if (result.success) {
      toast.success("Item created successfully.")
      setIsCreateDialogOpen(false)
      loadItems()
    } else {
      toast.error(result.error || "Failed to create item.")
    }
    setIsProcessing(false)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REJECTED":
        return "destructive"
      case "SOLD":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage All Items</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Create New Item</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">Fill in the details to create a new item. It will be approved by default.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Form fields for creating an item */}
              <Input name="title" placeholder="Title" required />
              <Textarea name="description" placeholder="Description" required />
              <Input name="price" type="number" placeholder="Price" required />
              <Input name="location" placeholder="Location" required />
              <Input name="phone" placeholder="Phone Number" required />
              <Input name="address" placeholder="Full Address" required />
              <Select name="condition" required>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <DialogClose asChild><Button variant="ghost" className="text-gray-700 dark:text-gray-300">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Item</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Price</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Status</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Seller</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300 font-medium">Category</TableHead>
              <TableHead className="text-right text-gray-700 dark:text-gray-300 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Loading items...</p>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-gray-700 dark:text-gray-300">No items found</p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{item.title}</TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">${item.price}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">{item.seller_name}</TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">{item.category_name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                          <DialogDescription>
                            Update the details of this item. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                          {/* Form fields for editing an item */}
                          <Input name="title" defaultValue={selectedItem?.title} />
                          <Textarea name="description" defaultValue={selectedItem?.description} />
                          <Input name="price" type="number" defaultValue={selectedItem?.price} />
                          <Input name="location" defaultValue={selectedItem?.location || ""} />
                          <Select name="condition" defaultValue={selectedItem?.condition}>
                            <SelectTrigger>
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEW">New</SelectItem>
                              <SelectItem value="USED">Used</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select name="status" defaultValue={selectedItem?.status}>
                             <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="APPROVED">Approved</SelectItem>
                              <SelectItem value="REJECTED">Rejected</SelectItem>
                              <SelectItem value="SOLD">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* Category select would go here */}
                          <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isProcessing}>
                              {isProcessing ? <Loader2 className="animate-spin" /> : "Save Changes"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={isProcessing}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
