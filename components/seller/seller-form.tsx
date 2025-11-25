"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { submitItem } from "@/lib/actions/submit-item"
import { Upload, X, CreditCard } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import type { CategoryWithChildren } from "@/lib/queries/item-queries"
import { CategoryCombobox } from "@/components/ui/category-combobox"

// A more modern, multi-image uploader component
function ImageUploader({
  files,
  onFilesChange,
}: {
  files: File[]
  onFilesChange: (files: File[]) => void
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onFilesChange([...files, ...newFiles].slice(0, 5)) // Limit to 5 images
    }
  }

  const handleRemoveImage = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 rounded-2xl p-6 text-center transition-colors duration-200 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-primary/5 hover:to-primary/10">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <label
          htmlFor="image-upload"
          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary/50 transition-colors"
        >
          <span className="text-lg">📸 Upload up to 5 images</span>
          <input
            id="image-upload"
            name="images"
            type="file"
            className="sr-only"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={files.length >= 5}
          />
        </label>
        <p className="text-sm text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB each.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">First image will be the main display photo</p>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                    Main
                  </div>
                )}
              </div>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SellerForm({ categories, categoriesError }: { categories: CategoryWithChildren[]; categoriesError?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [condition, setCondition] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [suggestedCategory, setSuggestedCategory] = useState("")
  const [negotiable, setNegotiable] = useState(false)
  const [urgent, setUrgent] = useState(false)

  const conditions = [
    { value: "new", label: "New - Never used" },
    { value: "like-new", label: "Like New - Used once or twice" },
    { value: "good", label: "Good - Minor wear and tear" },
    { value: "fair", label: "Fair - Noticeable wear but functional" },
    { value: "poor", label: "Poor - Heavy wear, still works" }
  ]
  const [warranty, setWarranty] = useState(false)
  const [warrantyMonths, setWarrantyMonths] = useState(0)
  const [deliveryAvailable, setDeliveryAvailable] = useState(false)
  const [brandNew, setBrandNew] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // ensure categoryId and suggestedCategory get into the form
    if (categoryId) formData.set("categoryId", categoryId)
    if (suggestedCategory) formData.set("suggestedCategory", suggestedCategory)

    if (imageFiles.length === 0) {
      toast({
        title: "Image Required",
        description: "You must upload at least one image for your item.",
        variant: "destructive",
      })
      return
    }

    if (!categoryId) {
      toast({
        title: "Category Required",
        description: "You must select a category for your item.",
        variant: "destructive",
      })
      return
    }
    formData.append("categoryId", categoryId)
    formData.append("negotiable", String(negotiable))
    formData.append("urgent", String(urgent))
    formData.append("warranty", String(warranty))
    formData.append("warrantyMonths", String(warrantyMonths))
    formData.append("deliveryAvailable", String(deliveryAvailable))
    formData.append("brandNew", String(brandNew))

    if (!termsAccepted) {
      toast({
        title: "⚠️ Terms and Conditions Required",
        description: "Please read and accept the Seller Terms and Conditions before submitting your item.",
        variant: "destructive",
      })
      // Scroll to terms section for better user experience
      const termsElement = document.getElementById('terms')
      if (termsElement) {
        termsElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        termsElement.focus()
      }
      return
    }

    // Append files to formData
    imageFiles.forEach((file) => {
      formData.append("images", file)
    })

    setIsSubmitting(true)
    try {
      console.log("Submitting form data...")
      const result = await submitItem(formData)
      console.log("Submit result:", result)

      if (result.success && result.item) {
        toast({
          title: "Item Submitted Successfully! ✅",
          description: "Your item has been submitted for review and will appear in the marketplace once approved by our admin team.",
        })
        // Redirect to home instead of item page since item is pending approval
        router.push("/")
      } else {
        throw new Error(result.message || "An unknown error occurred.")
      }
    } catch (error: any) {
      console.error("Form submission error:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit your item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>Provide comprehensive details about your item to attract more buyers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Item Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., 'Brand New iPhone 15 Pro Max 256GB - Unlocked'"
              required
            />
            <p className="text-sm text-muted-foreground">Be specific and include key details like brand, model, size, etc.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your item in detail... Include features, condition details, reason for selling, etc."
              rows={6}
              required
            />
            <p className="text-sm text-muted-foreground">The more details you provide, the more likely buyers will be interested.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="e.g., 850000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₦)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                placeholder="e.g., 1200000"
              />
              <p className="text-sm text-muted-foreground">What you originally paid (helps show savings)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <CategoryCombobox
              categories={categories}
              value={categoryId}
              onValueChange={setCategoryId}
              placeholder="Search categories or type to suggest new one..."
            />
            {/* Ensure categoryId is included in form submission */}
            <input type="hidden" name="categoryId" value={categoryId} />

            {((!categories || categories.length === 0) || categoriesError) && (
              <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50">
                <p className="text-sm text-yellow-800 font-medium">Categories are currently unavailable.</p>
                <p className="text-sm text-yellow-700">You can type a category name below and we'll attach it to your listing as a suggested category for review.</p>
                <div className="mt-2">
                  <Input
                    id="suggestedCategory"
                    name="suggestedCategory"
                    placeholder="e.g., Vintage Collectibles"
                    value={suggestedCategory}
                    onChange={(e) => setSuggestedCategory(e.target.value)}
                  />
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Choose the most specific category that fits your item.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select name="condition" onValueChange={setCondition} required>
                <SelectTrigger
                  id="condition"
                  className="w-full bg-white border-input hover:border-primary focus:border-primary h-11 rounded-lg border shadow-sm px-3 py-2 text-sm ring-offset-background transition-colors">
                  <SelectValue placeholder="Select item condition" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[250px] bg-white/95 backdrop-blur-sm shadow-lg rounded-lg border p-2">
                  {conditions.map((cond) => (
                    <SelectItem
                      key={cond.value}
                      value={cond.value}
                      className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                    >
                      {cond.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand/Manufacturer</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="e.g., Apple, Samsung, Nike"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model">Model/Size</Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g., iPhone 15 Pro Max, Size 42"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                placeholder="e.g., Space Black, Red"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Additional Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="negotiable"
                  checked={negotiable}
                  onCheckedChange={(checked: boolean) => setNegotiable(!!checked)}
                />
                <Label htmlFor="negotiable" className="font-medium">Price is Negotiable</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={urgent}
                  onCheckedChange={(checked: boolean) => setUrgent(!!checked)}
                />
                <Label htmlFor="urgent" className="font-medium">Urgent Sale</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brandNew"
                  checked={brandNew}
                  onCheckedChange={(checked: boolean) => setBrandNew(!!checked)}
                />
                <Label htmlFor="brandNew" className="font-medium">Brand New Item</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deliveryAvailable"
                  checked={deliveryAvailable}
                  onCheckedChange={(checked: boolean) => setDeliveryAvailable(!!checked)}
                />
                <Label htmlFor="deliveryAvailable" className="font-medium">Delivery Available</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="warranty"
                checked={warranty}
                onCheckedChange={(checked: boolean) => setWarranty(!!checked)}
              />
              <Label htmlFor="warranty" className="font-medium">Item has Warranty</Label>
            </div>

            {warranty && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="warrantyMonths">Warranty Duration (months)</Label>
                <Select name="warrantyMonths" onValueChange={(value) => setWarrantyMonths(Number(value))}>
                  <SelectTrigger id="warrantyMonths">
                    <SelectValue placeholder="Select warranty duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">1 Year</SelectItem>
                    <SelectItem value="24">2 Years</SelectItem>
                    <SelectItem value="36">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Keywords/Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g., unlocked, gaming, vintage, designer (separate with commas)"
            />
            <p className="text-sm text-muted-foreground">Add relevant keywords to help buyers find your item</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>Add up to 5 photos of your item.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader files={imageFiles} onFilesChange={setImageFiles} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How can buyers reach you?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g., 08012345678" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g., Lagos" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="e.g., 123 Main St, Ikeja" required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2" />
            Bank Details for Payment
          </CardTitle>
          <CardDescription>
            This information is required for us to pay you when your item is sold.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" placeholder="e.g., Guaranty Trust Bank" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input id="accountName" name="accountName" placeholder="e.g., John Doe" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              type="text"
              pattern="\d{10}"
              title="Account number must be 10 digits"
              placeholder="e.g., 0123456789"
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 pt-4">
        {/* Terms and Conditions - Enhanced Visibility with Blue Theme */}
        <Card className="bg-blue-50/50 border-2 border-blue-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Checkbox 
                id="terms" 
                aria-describedby="seller-terms-desc"
                checked={termsAccepted}
                onCheckedChange={(checked: boolean) => setTermsAccepted(!!checked)}
                className="mt-1 h-5 w-5 bg-blue-100 border-2 border-blue-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus:ring-2 focus:ring-blue-300"
              />
              <div className="flex-1">
                <label htmlFor="terms" className="text-base font-semibold text-blue-800 leading-relaxed cursor-pointer block">
                  I agree to the{" "}
                  <Link href="/terms/seller" className="text-blue-600 hover:text-blue-800 underline font-bold">
                    Seller Terms and Conditions
                  </Link>
                </label>
                <p id="seller-terms-desc" className="text-sm text-blue-600 mt-2">
                  Please read and accept our terms before submitting your item for review.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button - Enhanced Visibility */}
        <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${termsAccepted && !isSubmitting
          ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
          : "bg-gray-50 border-gray-200"
          }`}>
          <Button
            type="submit"
            disabled={isSubmitting || !termsAccepted}
            className={`w-full h-14 text-lg font-bold shadow-lg transition-all duration-200 ${termsAccepted && !isSubmitting
              ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-xl transform hover:scale-105"
              : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
              }`}
          >
            <div className="flex items-center justify-center space-x-3">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting for Review...</span>
                </>
              ) : !termsAccepted ? (
                <>
                  <span>⚠️ Accept Terms to Submit</span>
                </>
              ) : (
                <>
                  <span>🚀 Submit for Review</span>
                </>
              )}
            </div>
          </Button>
          <p className={`text-center text-sm mt-3 font-medium ${termsAccepted ? "text-gray-600" : "text-red-600"
            }`}>
            {termsAccepted
              ? "Your item will be reviewed by our admin team before appearing in the marketplace"
              : "Please accept the terms and conditions above to submit your item"
            }
          </p>
        </div>
      </div>
    </form>
  )
}
