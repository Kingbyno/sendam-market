"use server"

import { 
  getUserPortfolio, 
  sellStock, 
  getUserTransactions,
  getMarketStatus,
  getStockPrice,
  type StockTransaction,
  type Portfolio
} from "@/lib/stocks/portfolio-db"
import { getAuth } from "@/lib/auth/get-auth"
import { revalidatePath } from "next/cache"

export interface SellStockRequest {
  symbol: string
  quantity: number
  orderType: "market" | "limit"
  limitPrice?: number
}

export interface SellStockResponse {
  success: boolean
  transaction?: StockTransaction
  error?: string
}

export async function sellStockAction(request: SellStockRequest): Promise<SellStockResponse> {
  try {
    console.log("=== Sell stock action started ===")
    
    // Authenticate user
    const { user } = await getAuth()
    if (!user) {
      console.log("User not authenticated")
      return { success: false, error: "Authentication required" }
    }
    
    console.log(`User authenticated: ${user.email}`)
    
    // Validate input
    if (!request.symbol || request.quantity <= 0) {
      return { success: false, error: "Invalid stock symbol or quantity" }
    }
    
    if (request.orderType === "limit" && (!request.limitPrice || request.limitPrice <= 0)) {
      return { success: false, error: "Valid limit price required for limit orders" }
    }
    
    console.log(`Selling ${request.quantity} shares of ${request.symbol}`)
    
    // Execute sell order
    const result = await sellStock(
      user.id,
      request.symbol,
      request.quantity,
      request.orderType,
      request.limitPrice
    )
    
    if (result.success && result.transaction) {
      console.log(`=== Sell order executed successfully ===`)
      console.log(`Transaction ID: ${result.transaction.id}`)
      console.log(`Net amount: $${result.transaction.netAmount.toFixed(2)}`)
      
      // Revalidate relevant pages
      revalidatePath("/stocks/sell")
      revalidatePath("/stocks/portfolio")
      
      return { success: true, transaction: result.transaction }
    } else {
      console.log(`Sell order failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error in sellStockAction:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getPortfolioAction(): Promise<{ success: boolean; portfolio?: Portfolio; error?: string }> {
  try {
    const { user } = await getAuth()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    const portfolio = await getUserPortfolio(user.id)
    if (!portfolio) {
      return { success: false, error: "Portfolio not found" }
    }
    
    return { success: true, portfolio }
  } catch (error) {
    console.error("Error in getPortfolioAction:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getTransactionsAction(limit: number = 10): Promise<{ success: boolean; transactions?: StockTransaction[]; error?: string }> {
  try {
    const { user } = await getAuth()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    const transactions = await getUserTransactions(user.id, limit)
    return { success: true, transactions }
  } catch (error) {
    console.error("Error in getTransactionsAction:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getMarketStatusAction(): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    const status = await getMarketStatus()
    return { success: true, status }
  } catch (error) {
    console.error("Error in getMarketStatusAction:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getStockPriceAction(symbol: string): Promise<{ success: boolean; price?: number; error?: string }> {
  try {
    if (!symbol || !/^[A-Z]{1,5}$/.test(symbol)) {
      return { success: false, error: "Invalid stock symbol" }
    }
    
    const price = await getStockPrice(symbol)
    return { success: true, price }
  } catch (error) {
    console.error("Error in getStockPriceAction:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
