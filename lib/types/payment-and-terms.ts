// Payment and Terms Types

export interface PaymentTerms {
  id: string
  type: 'seller_terms' | 'buyer_terms' | 'privacy_policy'
  version: string
  content: string
  isActive: boolean
  createdAt: string | Date
}

export interface TermsAgreement {
  id: string
  userId: string
  agreementType: 'seller_terms' | 'buyer_terms' | 'privacy_policy'
  version: string
  agreedAt: string | Date
  ipAddress?: string
  userAgent?: string
}

export interface SellerPaymentInfo {
  id: string
  sellerId: string
  bankName: string
  accountName: string
  accountNumber: string
  isVerified: boolean
  createdBy: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface PaymentTermsCheckState {
  sellerTermsAccepted: boolean
  buyerTermsAccepted: boolean
  privacyPolicyAccepted: boolean
  paymentInfoProvided: boolean
  allRequirementsMet: boolean
}

export type TermsType = 'seller_terms' | 'buyer_terms' | 'privacy_policy'