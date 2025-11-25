"use client"

import { useState } from "react"
import Image from "next/image"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2, PlusCircle, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateItem, deleteItem } from "@/lib/actions/admin-actions"
import type { Item } from "@/lib/types"

interface MarketplaceItemsClientProps {
  items: Item[]
}

export function MarketplaceItemsClient({ items }: MarketplaceItemsClientProps) {
  const [isPending, setIsPending] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const { toast } = useToast()

  const handleEdit = (item: Item) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }
  const handleDelete = async (id: string) => {
    // Implement delete functionality
    try {
      setIsPending(true)
      const result = await deleteItem(id)
      if (result.success) {
        toast({
          title: "Success",
          description: "Item deleted successfully",
        })
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete item",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }
  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      setIsPending(true)
      const newStatus = currentStatus === "APPROVED" ? "PENDING" : "APPROVED"
      const result = await updateItem(id, { status: newStatus })
      if (result.success) {
        toast({
          title: "Success",
          description: `Item status updated to ${newStatus.toLowerCase()}.`,
        })
        // Optimistically update the UI or refetch data
        // For now, we'll just reload the page for simplicity
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update item status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketplace Items</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Edit Item" : "Add New Item"}
              </DialogTitle>
              <DialogDescription>
                {selectedItem
                  ? "Update the details of your item."
                  : "Fill out the form to add a new item to the marketplace."}
              </DialogDescription>            </DialogHeader>
            <div className="p-4 text-center text-gray-500">
              <p>Item form component needs to be implemented.</p>
              <p>This feature is coming soon.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.images?.[0] && (
                    <div className="relative h-12 w-12">
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.status === "APPROVED"}
                      onCheckedChange={() =>
                        toggleStatus(item.id, item.status)
                      }
                      disabled={isPending}
                    />
                    <span>
                      {item.status === "APPROVED" ? "Published" : "Unpublished"}
                    </span>
                  </div>
                </TableCell>                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={item.isPublished}
                      onCheckedChange={() => 
                        // Toggle featured status (using isPublished since featured doesn't exist)
                        console.log('Toggle featured', item.id)
                      }
                      disabled={isPending}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit item"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete item"
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={`/item/${item.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View item">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
