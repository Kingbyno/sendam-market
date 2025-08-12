// Remove broken Prisma type imports and define Item, Category, User manually for compatibility

export interface User {
  id: string
  email: string
  name?: string | null
  avatar?: string | null
  isAdmin?: boolean
  role?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Simplified user type for item queries
export interface ItemSeller {
  id: string
  name: string | null
  email: string
  avatar: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null // Allow both undefined and null
  icon?: string | null
  color?: string | null
  featured: boolean
  order: number
  createdAt: string | Date
  updatedAt: string | Date
  parentId?: string | null
  _count?: {
    items?: number
  }
}

export interface Item {
  id: string
  title: string
  slug: string
  description: string
  price: number
  condition: string
  location?: string | null // Allow both undefined and null
  images: string[]
  isPublished: boolean
  status: string
  originalPrice?: number | null // Allow both undefined and null
  phone: string
  whatsapp?: string | null
  address: string
  tags: string[]
  views: number
  expiresAt?: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
  sellerId: string
  categoryId?: string | null
  seller?: ItemSeller | null
  category?: Category | null
  _count?: {
    chatMessages?: number
    purchases?: number
    reviews?: number
  }
  _id?: string // alias for id for legacy compatibility
  // Feature flags added for marketplace filters & badges
  urgent?: boolean | null
  negotiable?: boolean | null
  warranty?: boolean | null
  deliveryAvailable?: boolean | null
  // Newly added descriptive fields
  brand?: string | null
  model?: string | null
  color?: string | null
  brandNew?: boolean | null
}

export interface ChatMessage {
  id: string
  message: string
  sender: "BUYER" | "ADMIN"
  createdAt: string | Date
  itemId: string
  userId: string
  user?: {
    id: string
    name: string | null
    avatar: string | null
  } | null
  item?: Item | null
}

export interface Purchase {
  id: string
  amount: number
  status: "PENDING" | "PAID" | "DELIVERED" | "COMPLETED"
  createdAt: string | Date
  updatedAt: string | Date
  itemId: string
  userId: string
  item?: Item | null
  user?: User | null
}

export interface Order {
  id: string
  buyerId: string
  itemId: string
  transactionId: string
  amount: number
  status: string
  createdAt: string | Date
  updatedAt: string | Date
  metadata?: any | null
}

export type OrderWithItem = Order & {
  item: Item
}

export interface TopSeller {
  id: string
  name: string | null
  avatar: string | null
  salesCount: number
}

// Helper types for forms
export type ItemCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR"
export type ItemStatus = "PENDING" | "APPROVED" | "REJECTED" | "SOLD"
export type MessageSender = "BUYER" | "ADMIN"
export type PurchaseStatus = "PENDING" | "PAID" | "DELIVERED" | "COMPLETED"
export type TermsType = "SELLER_TERMS" | "BUYER_TERMS" | "PRIVACY_POLICY"

// Payment and Terms types
export interface SellerPaymentInfo {
  id: string
  sellerId: string
  bankName: string
  accountName: string
  accountNumber: string
  isVerified: boolean
  createdBy?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface TermsAgreement {
  id: string
  userId: string
  agreementType: "seller_terms" | "buyer_terms" | "privacy_policy"
  version: string
  agreedAt: string | Date
  ipAddress?: string | null
  userAgent?: string | null
}

export interface TermsVersion {
  id: string
  agreementType: "seller_terms" | "buyer_terms" | "privacy_policy"
  version: string
  title: string
  content: string
  isActive: boolean
  createdAt: string | Date
}

export interface TermsAcceptanceData {
  agreementType: "seller_terms" | "buyer_terms" | "privacy_policy"
  version: string
}
