"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { approveCategory, rejectCategory } from "@/lib/actions/admin-actions"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@prisma/client"
import { Check, X, Trash2, Edit, PlusCircle } from "lucide-react"

type PendingCategory = Category & {
  suggestedBy?: { name: string | null; email: string | null } | null
  parent?: { name: string | null } | null
}

import type { CategoryWithChildren } from "@/lib/queries/item-queries"

interface AdminCategoryManagerProps {
  pendingCategories: PendingCategory[]
  allCategories: CategoryWithChildren[]
}

export function AdminCategoryManager({ pendingCategories, allCategories }: AdminCategoryManagerProps) {
  const { toast } = useToast()

  const handleApprove = async (id: string) => {
    const result = await approveCategory(id)
    if (result.success) {
      toast({ title: "Category approved" })
    } else {
      toast({ title: "Error approving category", description: result.error, variant: "destructive" })
    }
  }

  const handleReject = async (id: string) => {
    const result = await rejectCategory(id)
    if (result.success) {
      toast({ title: "Category rejected" })
    } else {
      toast({ title: "Error rejecting category", description: result.error, variant: "destructive" })
    }
  }

  const CategoryRow = ({ category, level = 0 }: { category: CategoryWithChildren; level?: number }) => (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: `${level * 1.5 + 1}rem` }}>{category.name}</TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
      {category.children.map((child) => (
        <CategoryRow key={child.id} category={child} level={level + 1} />
      ))}
    </>
  )

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-2xl font-bold">Category Management</h1>

      {pendingCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Suggestions</CardTitle>
            <CardDescription>Review and approve or reject user-suggested categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Suggested By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.parent?.name || "None"}</TableCell>
                    <TableCell>{cat.suggestedBy?.name || cat.suggestedBy?.email || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleApprove(cat.id)}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleReject(cat.id)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>Manage your existing category hierarchy.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCategories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
