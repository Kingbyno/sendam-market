export interface StockHolding {
  id: string
  userId: string
  symbol: string
  name: string
  quantity: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
  lastUpdated: Date
}

export interface StockTransaction {
  id: string
  userId: string
  symbol: string
  type: "buy" | "sell"
  quantity: number
  price: number
  totalAmount: number
  fees: number
  netAmount: number
  status: "pending" | "executed" | "cancelled" | "failed"
  orderType: "market" | "limit"
  limitPrice?: number
  createdAt: Date
  executedAt?: Date
}

export interface Portfolio {
  userId: string
  totalValue: number
  totalCost: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  holdings: StockHolding[]
  lastUpdated: Date
}

// Mock database - in a real app, this would connect to your database
let mockPortfolios: Portfolio[] = []
let mockTransactions: StockTransaction[] = []

// Simulate real-time stock prices
const getRandomPrice = (basePrice: number): number => {
  return basePrice + (Math.random() - 0.5) * basePrice * 0.1
}

const stockPrices: Record<string, number> = {
  "AAPL": 175.50,
  "GOOGL": 2650.00,
  "MSFT": 325.00,
  "TSLA": 220.00,
  "AMZN": 145.00,
  "META": 280.00,
  "NVDA": 420.00,
  "NFLX": 380.00
}

export async function getUserPortfolio(userId: string): Promise<Portfolio | null> {
  // In a real app, this would be a database query
  let portfolio = mockPortfolios.find(p => p.userId === userId)
  
  if (!portfolio) {
    // Create a mock portfolio for the user
    const holdings: StockHolding[] = [
      {
        id: "1",
        userId,
        symbol: "AAPL",
        name: "Apple Inc.",
        quantity: 50,
        averagePrice: 150.00,
        currentPrice: getRandomPrice(stockPrices.AAPL),
        totalValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        lastUpdated: new Date()
      },
      {
        id: "2",
        userId,
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        quantity: 25,
        averagePrice: 2800.00,
        currentPrice: getRandomPrice(stockPrices.GOOGL),
        totalValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        lastUpdated: new Date()
      },
      {
        id: "3",
        userId,
        symbol: "MSFT",
        name: "Microsoft Corporation",
        quantity: 75,
        averagePrice: 300.00,
        currentPrice: getRandomPrice(stockPrices.MSFT),
        totalValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        lastUpdated: new Date()
      },
      {
        id: "4",
        userId,
        symbol: "TSLA",
        name: "Tesla Inc.",
        quantity: 30,
        averagePrice: 250.00,
        currentPrice: getRandomPrice(stockPrices.TSLA),
        totalValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        lastUpdated: new Date()
      }
    ]

    // Calculate derived values
    holdings.forEach(holding => {
      holding.totalValue = holding.quantity * holding.currentPrice
      holding.profitLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity
      holding.profitLossPercent = ((holding.currentPrice - holding.averagePrice) / holding.averagePrice) * 100
    })

    const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0)
    const totalCost = holdings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0)
    const totalProfitLoss = totalValue - totalCost
    const totalProfitLossPercent = (totalProfitLoss / totalCost) * 100

    portfolio = {
      userId,
      totalValue,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercent,
      holdings,
      lastUpdated: new Date()
    }

    mockPortfolios.push(portfolio)
  } else {
    // Update current prices
    portfolio.holdings.forEach(holding => {
      holding.currentPrice = getRandomPrice(stockPrices[holding.symbol] || holding.currentPrice)
      holding.totalValue = holding.quantity * holding.currentPrice
      holding.profitLoss = (holding.currentPrice - holding.averagePrice) * holding.quantity
      holding.profitLossPercent = ((holding.currentPrice - holding.averagePrice) / holding.averagePrice) * 100
      holding.lastUpdated = new Date()
    })

    // Recalculate portfolio totals
    const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0)
    const totalCost = portfolio.holdings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0)
    portfolio.totalValue = totalValue
    portfolio.totalCost = totalCost
    portfolio.totalProfitLoss = totalValue - totalCost
    portfolio.totalProfitLossPercent = totalCost > 0 ? (portfolio.totalProfitLoss / totalCost) * 100 : 0
    portfolio.lastUpdated = new Date()
  }

  return portfolio
}

export async function getStockPrice(symbol: string): Promise<number> {
  // In a real app, this would fetch from a stock API
  await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
  return getRandomPrice(stockPrices[symbol] || 100)
}

export async function sellStock(
  userId: string,
  symbol: string,
  quantity: number,
  orderType: "market" | "limit",
  limitPrice?: number
): Promise<{ success: boolean; transaction?: StockTransaction; error?: string }> {
  try {
    const portfolio = await getUserPortfolio(userId)
    if (!portfolio) {
      return { success: false, error: "Portfolio not found" }
    }

    const holding = portfolio.holdings.find(h => h.symbol === symbol)
    if (!holding) {
      return { success: false, error: "Stock not found in portfolio" }
    }

    if (holding.quantity < quantity) {
      return { success: false, error: "Insufficient shares to sell" }
    }

    const currentPrice = await getStockPrice(symbol)
    const sellPrice = orderType === "market" ? currentPrice : (limitPrice || currentPrice)
    
    // For limit orders, check if the limit price is achievable
    if (orderType === "limit" && limitPrice && limitPrice > currentPrice) {
      return { success: false, error: "Limit price is above current market price" }
    }

    const grossAmount = quantity * sellPrice
    const fees = grossAmount * 0.001 // 0.1% trading fee
    const netAmount = grossAmount - fees

    // Create transaction record
    const transaction: StockTransaction = {
      id: Date.now().toString(),
      userId,
      symbol,
      type: "sell",
      quantity,
      price: sellPrice,
      totalAmount: grossAmount,
      fees,
      netAmount,
      status: "executed", // In a real app, this might be "pending" initially
      orderType,
      limitPrice,
      createdAt: new Date(),
      executedAt: new Date()
    }

    // Update portfolio
    const portfolioIndex = mockPortfolios.findIndex(p => p.userId === userId)
    if (portfolioIndex >= 0) {
      const holdingIndex = mockPortfolios[portfolioIndex].holdings.findIndex(h => h.symbol === symbol)
      if (holdingIndex >= 0) {
        mockPortfolios[portfolioIndex].holdings[holdingIndex].quantity -= quantity
        
        // Remove holding if quantity becomes 0
        if (mockPortfolios[portfolioIndex].holdings[holdingIndex].quantity === 0) {
          mockPortfolios[portfolioIndex].holdings.splice(holdingIndex, 1)
        }
      }
    }

    // Save transaction
    mockTransactions.push(transaction)

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      transaction.status = "failed"
      return { success: false, error: "Order execution failed due to market conditions" }
    }

    return { success: true, transaction }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserTransactions(userId: string, limit: number = 10): Promise<StockTransaction[]> {
  // In a real app, this would be a database query
  return mockTransactions
    .filter(t => t.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export async function getMarketStatus(): Promise<"open" | "closed" | "pre-market" | "after-hours"> {
  // In a real app, this would check actual market hours
  const now = new Date()
  const hour = now.getHours()
  
  if (hour >= 9 && hour < 16) {
    return "open"
  } else if (hour >= 4 && hour < 9) {
    return "pre-market"
  } else if (hour >= 16 && hour < 20) {
    return "after-hours"
  } else {
    return "closed"
  }
}

// Utility function to validate stock symbols
export function isValidStockSymbol(symbol: string): boolean {
  return /^[A-Z]{1,5}$/.test(symbol)
}

// Utility function to calculate profit/loss
export function calculateProfitLoss(
  quantity: number,
  averagePrice: number,
  currentPrice: number
): { profitLoss: number; profitLossPercent: number } {
  const profitLoss = (currentPrice - averagePrice) * quantity
  const profitLossPercent = ((currentPrice - averagePrice) / averagePrice) * 100
  
  return { profitLoss, profitLossPercent }
}

// Utility function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Utility function to format percentage
export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}
