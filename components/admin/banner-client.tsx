"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
// import type { Banner } from "@prisma/client"
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
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Pencil, Trash2, PlusCircle } from "lucide-react"
import { BannerForm } from "./banner-form"
import { deleteBanner, toggleBannerStatus } from "@/lib/actions/banner-actions"
import { toast } from "@/hooks/use-toast"
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

interface Banner {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  link: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface BannerClientProps {
  banners: Banner[]
}

export function BannerClient({ banners: initialBanners }: BannerClientProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [isPending, startTransition] = useTransition()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedBanner(null)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteBanner(id)
      if (result?.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      } else {
        setBanners((prev) => prev.filter((b) => b.id !== id))
        toast({ title: "Success", description: "Banner deleted successfully." })
      }
    })
  }

  const handleToggle = (id: string, isActive: boolean) => {
    startTransition(async () => {
      const result = await toggleBannerStatus(id, isActive)
      if (result?.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      } else {
        setBanners((prev) =>
          prev.map((b) => (b.id === id ? { ...b, isActive } : b))
        )
        toast({ title: "Success", description: `Banner ${isActive ? "activated" : "deactivated"}.` })
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedBanner ? "Edit Banner" : "Create New Banner"}</DialogTitle>
              <DialogDescription>
                {selectedBanner
                  ? "Update the details of your banner."
                  : "Fill out the form to create a new banner."}
              </DialogDescription>
            </DialogHeader>
            <BannerForm banner={selectedBanner} onClose={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    width={100}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell>
                  <Switch
                    checked={banner.isActive}
                    onCheckedChange={(checked: boolean) => handleToggle(banner.id, checked)}
                    disabled={isPending}
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(banner)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the banner.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(banner.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
