"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, ShoppingCart, Truck, Users, ShieldCheck } from "lucide-react"
import type { Item } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConditionBadge } from "@/lib/ui/condition-badge"

interface ItemDetailsProps {
  item: Item
}

export function ItemDetails({ item }: ItemDetailsProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(item.images?.[0] || "/placeholder.svg?height=600&width=600")
  const [deliveryOption, setDeliveryOption] = useState("sendam")
  const [showBuyDialog, setShowBuyDialog] = useState(false)

  const handleBuyNow = () => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    setShowBuyDialog(true)
  }

  const handleProceedToPurchase = () => {
    // Calculate total amount and service fee based on delivery option
    const basePrice = item.price
    const serviceFee = deliveryOption === "sendam" ? basePrice * 0.10 : 0
    const totalAmount = basePrice + serviceFee
    
    // Redirect to checkout with delivery option and pricing details
    const params = new URLSearchParams({
      itemId: item.id,
      amount: totalAmount.toString(),
      basePrice: basePrice.toString(),
      serviceFee: serviceFee.toString(),
      deliveryOption: deliveryOption,
      description: `Purchase ${item.title} ${deliveryOption === "sendam" ? "with Sendam inspection" : "with direct meetup"}`
    })
    
    router.push(`/payment/checkout?${params.toString()}`)
    setShowBuyDialog(false)
  }

  const calculateTotal = () => {
    const basePrice = item.price
    const deliveryFee = deliveryOption === "sendam" ? basePrice * 0.10 : 0
    return basePrice + deliveryFee
  }

  // Removed legacy local condition style map in favor of shared <ConditionBadge /> component

  const titleCase = (s?: string) => (s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '')
  const attributes: Array<{ label: string; value?: string; hide?: boolean }> = [
    { label: 'Brand', value: item.brand ? String(item.brand) : undefined, hide: !item.brand },
    { label: 'Model', value: item.model ? String(item.model) : undefined, hide: !item.model },
    { label: 'Color', value: item.color ? String(item.color) : undefined, hide: !item.color },
    { label: 'Warranty', value: item.warranty === null || item.warranty === undefined ? undefined : (item.warranty ? 'Yes' : 'No'), hide: item.warranty === null || item.warranty === undefined },
    { label: 'Delivery', value: item.deliveryAvailable === null || item.deliveryAvailable === undefined ? undefined : (item.deliveryAvailable ? 'Available' : 'Not Available'), hide: item.deliveryAvailable === null || item.deliveryAvailable === undefined },
    { label: 'Negotiable', value: item.negotiable === null || item.negotiable === undefined ? undefined : (item.negotiable ? 'Yes' : 'No'), hide: item.negotiable === null || item.negotiable === undefined },
    { label: 'Urgent', value: item.urgent === null || item.urgent === undefined ? undefined : (item.urgent ? 'Yes' : 'No'), hide: item.urgent === null || item.urgent === undefined },
    { label: 'Brand New', value: item.brandNew === null || item.brandNew === undefined ? undefined : (item.brandNew ? 'Yes' : 'No'), hide: item.brandNew === null || item.brandNew === undefined },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Section */}
        <div className="space-y-4 animate-fade-in">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            <Image
              src={selectedImage}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            {/* Discount badge - solid high contrast (removed gradient & pulse) */}
            {item.originalPrice && item.originalPrice > item.price && (
              <Badge
                variant="destructive"
                className="absolute top-4 right-4 text-xs sm:text-sm font-bold bg-red-600 text-white px-2 py-1 rounded-md shadow-md"
                aria-label={`Discount ${(Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100))}% off`}
              >
                -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {item.images && item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {item.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-md ${
                    selectedImage === img 
                      ? "ring-2 ring-primary shadow-md" 
                      : "ring-1 ring-muted-foreground/20 hover:ring-primary/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${item.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {/* Top Info Panel */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-5 lg:p-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <ConditionBadge condition={item.condition} size="md" className="rounded-full" />
                {item.location && (
                  <Badge variant="outline" className="text-[11px] sm:text-xs px-3 py-1 flex items-center gap-1 rounded-full bg-white dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100">
                    <MapPin className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                    <span className="max-w-[7rem] truncate capitalize">{item.location}</span>
                  </Badge>
                )}
                {item.negotiable && <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30">Negotiable</span>}
                {item.urgent && <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-200 dark:border-red-400/30">Urgent</span>}
                {item.deliveryAvailable && <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30">Delivery</span>}
                {item.warranty && <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-400/30">Warranty</span>}
              </div>

              <h1 className="text-2xl lg:text-3xl xl:text-[2.6rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-white">
                {titleCase(item.title)}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl lg:text-4xl font-bold text-green-700 dark:text-green-400">₦{item.price.toLocaleString()}</p>
                </div>
                {item.originalPrice && item.originalPrice > item.price && (
                  <div className="flex items-center gap-2">
                    <p className="text-base sm:text-lg line-through text-gray-600 dark:text-gray-500">₦{item.originalPrice.toLocaleString()}</p>
                    <span className="text-xs font-semibold bg-red-600 text-white px-2 py-1 rounded-md">-{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description & Attributes */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-5 lg:p-6 space-y-5">
              <div>
                <h3 className="font-semibold text-lg mb-2.5 flex items-center gap-2 text-gray-900 dark:text-white">
                  <span aria-hidden>📋</span>
                  Description
                </h3>
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  {item.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 mb-2 uppercase">Details</h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {attributes.filter(a => !a.hide).map(a => (
                    <div key={a.label} className="flex">
                      <dt className="w-28 text-gray-600 dark:text-gray-400 font-medium">{a.label}:</dt>
                      <dd className="flex-1 font-semibold text-gray-900 dark:text-gray-100">{titleCase(a.value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="pt-1 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={user?.id === item.sellerId}
                  className="h-12 text-base font-semibold border-2 border-blue-700 bg-white text-blue-700 hover:bg-blue-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 shadow-sm hover:shadow transition-colors w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4 lg:p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Seller Information</h3>
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12">
                  <Image
                    src={item.seller?.avatar || "/placeholder-user.jpg"}
                    alt={item.seller?.name || "Seller"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{item.seller?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member since 2024</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4 font-medium text-gray-900 dark:text-white">
                View Seller's Profile
              </Button>
            </CardContent>
          </Card>

          {/* Purchase Protection */}
          <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-blue-700 text-white shadow">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">
                  Sendam Purchase Protection
                </h4>
                <p className="mt-2 text-sm sm:text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed">
                  We keep your money in secure escrow until you confirm the item matches its description after delivery or meetup.
                </p>
              </div>
            </div>
            <ul className="grid gap-2 text-sm sm:text-[13.5px] text-gray-800 dark:text-gray-300">
              <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400"></span><span>Independent inspection (Sendam delivery option)</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400"></span><span>Dispute support & safe escrow release</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-green-400"></span><span>Full refund if item is not as described</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Buy Now Dialog - Mobile Optimized with Reduced Height */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] sm:max-h-[90vh] overflow-hidden flex flex-col z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader className="flex-shrink-0 pb-2 sm:pb-4 bg-white dark:bg-gray-900">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Choose Delivery Option</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Select how you'd like to receive your item</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 px-1 py-2 bg-gray-50 dark:bg-gray-800/40">
            <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-4">
              <div className="space-y-3">
                {/* Sendam Delivery Option - Mobile Optimized */}
                <div className={`relative flex items-start space-x-3 p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  deliveryOption === "sendam" 
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/40 shadow-md" 
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}>
                  <RadioGroupItem value="sendam" id="sendam" className="mt-1 h-5 w-5 border-2 border-blue-500 data-[state=checked]:bg-blue-600" />
                  <div className="flex-1">
                    <Label htmlFor="sendam" className="flex items-center gap-2 font-bold text-sm sm:text-lg cursor-pointer text-gray-900 dark:text-white">
                      <div className={`p-1.5 rounded-full ${deliveryOption === "sendam" ? "bg-blue-600" : "bg-blue-100"}`}>
                        <Truck className={`h-4 w-4 ${deliveryOption === "sendam" ? "text-white" : "text-blue-600"}`} />
                      </div>
                      Sendam Check & Delivery
                    </Label>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                      <strong>Full Protection:</strong> We verify item condition and deliver safely
                    </p>
                    <div className="mt-2 p-2 bg-blue-100 rounded-lg">
                      <p className="text-xs font-semibold text-blue-800">
                        🛡️ Service fee: 10% (₦{(item.price * 0.10).toLocaleString()})
                      </p>
                      <p className="text-xs text-blue-600">Includes inspection & insurance</p>
                    </div>
                  </div>
                </div>

                {/* Direct Meeting Option - Mobile Optimized */}
                <div className={`relative flex items-start space-x-3 p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  deliveryOption === "direct" 
                    ? "border-green-600 bg-green-50 dark:bg-green-900/30 shadow-md" 
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/20"
                }`}>
                  <RadioGroupItem value="direct" id="direct" className="mt-1 h-5 w-5 border-2 border-green-500 data-[state=checked]:bg-green-600" />
                  <div className="flex-1">
                    <Label htmlFor="direct" className="flex items-center gap-2 font-bold text-sm sm:text-lg cursor-pointer text-gray-900 dark:text-white">
                      <div className={`p-1.5 rounded-full ${deliveryOption === "direct" ? "bg-green-600" : "bg-green-100"}`}>
                        <Users className={`h-4 w-4 ${deliveryOption === "direct" ? "text-white" : "text-green-600"}`} />
                      </div>
                      Meet Seller Directly
                    </Label>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                      <strong>Budget Option:</strong> Meet seller at a safe location
                    </p>
                    <div className="mt-2 p-2 bg-green-100 rounded-lg">
                      <p className="text-xs font-semibold text-green-800">
                        💰 Free - No additional charges
                      </p>
                      <p className="text-xs text-green-600">You handle pickup yourself</p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Price Breakdown - Mobile Optimized */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-inner">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                💰 Price Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-800 dark:text-gray-200">Item Price:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₦{item.price.toLocaleString()}</span>
                </div>
                {deliveryOption === "sendam" && (
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-800 dark:text-gray-200">Service Fee (10%):</span>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">₦{(item.price * 0.10).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between">
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-400">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Alert Sections - Mobile Optimized */}
            {deliveryOption === "sendam" && (
              <Alert className="border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 shadow-md">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-blue-600 rounded-full flex-shrink-0">
                    <Truck className="h-3 w-3 text-white" />
                  </div>
                  <AlertDescription className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-300 leading-relaxed">
                    <strong className="text-blue-800">🛡️ Sendam Guarantee:</strong> We inspect items before delivery with complete buyer protection.
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {deliveryOption === "direct" && (
              <Alert className="border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 shadow-md">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-green-600 rounded-full flex-shrink-0">
                    <Users className="h-3 w-3 text-white" />
                  </div>
                  <AlertDescription className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-300 leading-relaxed">
                    <strong className="text-green-800">🤝 Meet Safely:</strong> Choose public location, daytime hours. Check item thoroughly.
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>

          {/* Enhanced Dialog Footer - Mobile Optimized */}
          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            <Button 
              variant="outline" 
              onClick={() => setShowBuyDialog(false)} 
              className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold h-11 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProceedToPurchase} 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 shadow-md hover:shadow-lg transition-all duration-200 h-11 sm:h-12 text-sm sm:text-base"
            >
              💳 Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
