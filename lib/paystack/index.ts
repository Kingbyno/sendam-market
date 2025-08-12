import axios from "axios"

const PAYSTACK_API_URL = "https://api.paystack.co"

interface PaystackTransaction {
  status: string
  reference: string
  amount: number
  customer: {
    email: string
  }
  metadata: any
}

export class Paystack {
  private secretKey: string

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ""
    if (!this.secretKey) {
      throw new Error("Paystack secret key is not configured.")
    }
  }

  async verifyTransaction(reference: string): Promise<PaystackTransaction> {
    try {
      const response = await axios.get(`${PAYSTACK_API_URL}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      })

      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to verify transaction")
      }

      return response.data.data
    } catch (error: any) {
      console.error("Paystack API Error:", error.response?.data || error.message)
      throw new Error("Could not verify payment with Paystack.")
    }
  }
}
