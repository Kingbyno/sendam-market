"use client"

import { useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import type { Banner } from "@prisma/client"
import { createBanner, updateBanner } from "@/lib/actions/banner-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

interface BannerFormProps {
  banner?: Banner | null
  onClose: () => void
}

interface BannerFormErrors {
  title?: string[]
  subtitle?: string[]
  imageUrl?: string[]
  link?: string[]
  isActive?: string[]
  _form?: string[]
}

interface BannerFormState {
  success?: boolean
  errors?: BannerFormErrors
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Banner" : "Create Banner"}
    </Button>
  )
}

export function BannerForm({ banner, onClose }: BannerFormProps) {
  const action = banner ? updateBanner.bind(null, banner.id) : createBanner

  const formReducer = async (_prevState: BannerFormState, formData: FormData): Promise<BannerFormState> => {
    return await action(formData)
  }

  const [state, formAction] = useFormState(formReducer, { errors: {} })

  useEffect(() => {
    if (state?.success) {
      toast({ title: `Banner ${banner ? "updated" : "created"} successfully!` })
      onClose()
    }
    if (state?.errors && Array.isArray(state.errors._form)) {
      toast({ title: "Error", description: state.errors._form.join(", "), variant: "destructive" })
    }
  }, [state, banner, onClose])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={banner?.title ?? ""} />
        {Array.isArray(state?.errors?.title) && (
          <p className="text-red-500 text-sm mt-1">{state.errors.title.join(", ")}</p>
        )}
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" name="subtitle" defaultValue={banner?.subtitle ?? ""} />
        {Array.isArray(state?.errors?.subtitle) && (
          <p className="text-red-500 text-sm mt-1">{state.errors.subtitle.join(", ")}</p>
        )}
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" type="url" defaultValue={banner?.imageUrl ?? ""} />
        {Array.isArray(state?.errors?.imageUrl) && (
          <p className="text-red-500 text-sm mt-1">{state.errors.imageUrl.join(", ")}</p>
        )}
      </div>
      <div>
        <Label htmlFor="link">Link</Label>
        <Input id="link" name="link" type="url" defaultValue={banner?.link ?? ""} />
        {Array.isArray(state?.errors?.link) && (
          <p className="text-red-500 text-sm mt-1">{state.errors.link.join(", ")}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="isActive" name="isActive" defaultChecked={banner?.isActive ?? true} />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>{"Cancel"}</Button>
        <SubmitButton isEditing={!!banner} />
      </div>
    </form>
  )
}
