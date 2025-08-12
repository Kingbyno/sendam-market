interface PaystackConfig {
  publicKey: string
  secretKey?: string
}

interface PaystackPaymentData {
  email: string
  amount: number // in kobo (multiply by 100)
  reference: string
  callback_url?: string
  metadata?: Record<string, any>
  channels?: string[]
}

interface PaystackResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

class PaystackClient {
  private publicKey: string
  private secretKey?: string
  private baseUrl = "https://api.paystack.co"

  constructor(config: PaystackConfig) {
    this.publicKey = config.publicKey
    this.secretKey = config.secretKey
  }

  async initializePayment(data: PaystackPaymentData): Promise<PaystackResponse> {
    if (!this.secretKey) {
      throw new Error("Paystack secret key is required for server-side operations")
    }

    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`)
    }

    return response.json()
  }

  async verifyPayment(reference: string): Promise<any> {
    if (!this.secretKey) {
      throw new Error("Paystack secret key is required for server-side operations")
    }

    const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Paystack verification error: ${response.statusText}`)
    }

    return response.json()
  }

  // Client-side payment popup
  openPaymentModal(data: PaystackPaymentData & { onSuccess: (reference: string) => void; onClose: () => void }) {
    if (typeof window === "undefined") {
      throw new Error("Payment modal can only be opened in browser environment")
    }

    // Load Paystack inline script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement("script")
      script.src = "https://js.paystack.co/v1/inline.js"
      script.onload = () => this.initializeModal(data)
      document.head.appendChild(script)
    } else {
      this.initializeModal(data)
    }
  }

  private initializeModal(data: PaystackPaymentData & { onSuccess: (reference: string) => void; onClose: () => void }) {
    const handler = window.PaystackPop.setup({
      key: this.publicKey,
      email: data.email,
      amount: data.amount,
      ref: data.reference,
      metadata: data.metadata,
      channels: data.channels || ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      callback: (response: any) => {
        data.onSuccess(response.reference)
      },
      onClose: () => {
        data.onClose()
      },
    })
    handler.openIframe()
  }
}

// Environment-based configuration
const getPaystackConfig = (): PaystackConfig => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!publicKey) {
    console.warn("Paystack public key not configured")
    return {
      publicKey: "pk_test_demo_key", // Demo key for development
      secretKey: undefined,
    }
  }

  return {
    publicKey,
    secretKey,
  }
}

export const paystackClient = new PaystackClient(getPaystackConfig())

// Type declarations for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void
      }
    }
  }
}
