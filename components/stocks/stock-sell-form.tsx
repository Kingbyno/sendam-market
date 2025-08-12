"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StockHolding {
  id: string
  symbol: string
  name: string
  quantity: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
}

interface Transaction {
  id: string
  symbol: string
  type: "sell"
  quantity: number
  price: number
  totalAmount: number
  fees: number
  netAmount: number
  status: "pending" | "executed" | "cancelled" | "failed"
  timestamp: string
}

export function StockSellForm() {
  const [portfolio, setPortfolio] = useState<StockHolding[]>([])
  const [selectedStock, setSelectedStock] = useState<StockHolding | null>(null)
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [marketStatus, setMarketStatus] = useState<"open" | "closed" | "pre-market" | "after-hours">("open")
  const { toast } = useToast()

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPortfolio: StockHolding[] = [
      {
        id: "1",
        symbol: "AAPL",
        name: "Apple Inc.",
        quantity: 50,
        averagePrice: 150.00,
        currentPrice: 175.50,
        totalValue: 8775.00,
        profitLoss: 1275.00,
        profitLossPercent: 17.00
      },
      {
        id: "2",
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        quantity: 25,
        averagePrice: 2800.00,
        currentPrice: 2650.00,
        totalValue: 66250.00,
        profitLoss: -3750.00,
        profitLossPercent: -5.36
      },
      {
        id: "3",
        symbol: "MSFT",
        name: "Microsoft Corporation",
        quantity: 75,
        averagePrice: 300.00,
        currentPrice: 325.00,
        totalValue: 24375.00,
        profitLoss: 1875.00,
        profitLossPercent: 8.33
      },
      {
        id: "4",
        symbol: "TSLA",
        name: "Tesla Inc.",
        quantity: 30,
        averagePrice: 250.00,
        currentPrice: 220.00,
        totalValue: 6600.00,
        profitLoss: -900.00,
        profitLossPercent: -12.00
      }
    ]
    setPortfolio(mockPortfolio)

    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPortfolio(prev => prev.map(stock => ({
        ...stock,
        currentPrice: stock.currentPrice + (Math.random() - 0.5) * 2,
        totalValue: (stock.currentPrice + (Math.random() - 0.5) * 2) * stock.quantity,
        profitLoss: ((stock.currentPrice + (Math.random() - 0.5) * 2) - stock.averagePrice) * stock.quantity,
        profitLossPercent: (((stock.currentPrice + (Math.random() - 0.5) * 2) - stock.averagePrice) / stock.averagePrice) * 100
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const calculateSellPreview = () => {
    if (!selectedStock || !quantity) return null

    const sellQuantity = parseInt(quantity)
    const sellPrice = orderType === "market" ? selectedStock.currentPrice : parseFloat(limitPrice || "0")
    const grossAmount = sellQuantity * sellPrice
    const fees = grossAmount * 0.001 // 0.1% trading fee
    const netAmount = grossAmount - fees
    const gainLoss = (sellPrice - selectedStock.averagePrice) * sellQuantity
    const gainLossPercent = ((sellPrice - selectedStock.averagePrice) / selectedStock.averagePrice) * 100

    return {
      sellQuantity,
      sellPrice,
      grossAmount,
      fees,
      netAmount,
      gainLoss,
      gainLossPercent
    }
  }

  const preview = calculateSellPreview()

  const handleStockSelect = (stockId: string) => {
    const stock = portfolio.find(s => s.id === stockId)
    setSelectedStock(stock || null)
    setQuantity("")
    setLimitPrice("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStock || !quantity || parseInt(quantity) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select a stock and enter a valid quantity",
        variant: "destructive"
      })
      return
    }

    if (parseInt(quantity) > selectedStock.quantity) {
      toast({
        title: "Insufficient Shares",
        description: `You only own ${selectedStock.quantity} shares of ${selectedStock.symbol}`,
        variant: "destructive"
      })
      return
    }

    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Limit Price",
        description: "Please enter a valid limit price",
        variant: "destructive"
      })
      return
    }

    if (marketStatus === "closed") {
      toast({
        title: "Market Closed",
        description: "The market is currently closed. Your order will be queued for the next trading session.",
        variant: "default"
      })
    }

    setShowConfirmation(true)
  }

  const executeSell = async () => {
    if (!preview) return

    setIsLoading(true)
    setShowConfirmation(false)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const transaction: Transaction = {
        id: Date.now().toString(),
        symbol: selectedStock!.symbol,
        type: "sell",
        quantity: preview.sellQuantity,
        price: preview.sellPrice,
        totalAmount: preview.grossAmount,
        fees: preview.fees,
        netAmount: preview.netAmount,
        status: Math.random() > 0.1 ? "executed" : "failed",
        timestamp: new Date().toISOString()
      }

      setRecentTransactions(prev => [transaction, ...prev.slice(0, 4)])

      if (transaction.status === "executed") {
        // Update portfolio
        setPortfolio(prev => prev.map(stock => {
          if (stock.id === selectedStock!.id) {
            const newQuantity = stock.quantity - preview.sellQuantity
            return {
              ...stock,
              quantity: newQuantity,
              totalValue: newQuantity * stock.currentPrice
            }
          }
          return stock
        }))

        toast({
          title: "Sell Order Executed",
          description: `Successfully sold ${preview.sellQuantity} shares of ${selectedStock!.symbol} for $${preview.netAmount.toFixed(2)}`,
        })

        // Reset form
        setSelectedStock(null)
        setQuantity("")
        setLimitPrice("")
      } else {
        toast({
          title: "Order Failed",
          description: "Your sell order could not be executed. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMarketStatusBadge = () => {
    const statusConfig = {
      open: { color: "bg-green-100 text-green-800", text: "Market Open" },
      closed: { color: "bg-red-100 text-red-800", text: "Market Closed" },
      "pre-market": { color: "bg-blue-100 text-blue-800", text: "Pre-Market" },
      "after-hours": { color: "bg-orange-100 text-orange-800", text: "After Hours" }
    }
    
    const config = statusConfig[marketStatus]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sell Stocks</h1>
          <p className="text-gray-600">Manage your stock portfolio and execute sell orders</p>
        </div>
        <div className="flex items-center gap-4">
          {getMarketStatusBadge()}
          <div className="text-right">
            <p className="text-sm text-gray-500">Portfolio Value</p>
            <p className="text-2xl font-bold">
              ${portfolio.reduce((sum, stock) => sum + stock.totalValue, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sell Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sell Order</CardTitle>
              <CardDescription>Select stocks from your portfolio to sell</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Stock Selection */}
                <div className="space-y-2">
                  <Label htmlFor="stock">Select Stock</Label>
                  <Select onValueChange={handleStockSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a stock from your portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolio.map((stock) => (
                        <SelectItem key={stock.id} value={stock.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{stock.symbol} - {stock.name}</span>
                            <span className="text-sm text-gray-500 ml-4">
                              {stock.quantity} shares @ ${stock.currentPrice.toFixed(2)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedStock && (
                  <>
                    {/* Stock Details */}
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Current Price</p>
                            <p className="font-semibold">${selectedStock.currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Shares Owned</p>
                            <p className="font-semibold">{selectedStock.quantity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Avg. Cost</p>
                            <p className="font-semibold">${selectedStock.averagePrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total P&L</p>
                            <div className="flex items-center gap-1">
                              {selectedStock.profitLoss >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`font-semibold ${selectedStock.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(selectedStock.profitLoss).toFixed(2)} ({selectedStock.profitLossPercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Type */}
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Select value={orderType} onValueChange={(value: "market" | "limit") => setOrderType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order (Execute Immediately)</SelectItem>
                          <SelectItem value="limit">Limit Order (Set Price)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity to Sell</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Enter number of shares"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        max={selectedStock.quantity}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.floor(selectedStock.quantity * 0.25).toString())}
                        >
                          25%
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.floor(selectedStock.quantity * 0.5).toString())}
                        >
                          50%
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.floor(selectedStock.quantity * 0.75).toString())}
                        >
                          75%
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(selectedStock.quantity.toString())}
                        >
                          100%
                        </Button>
                      </div>
                    </div>

                    {/* Limit Price */}
                    {orderType === "limit" && (
                      <div className="space-y-2">
                        <Label htmlFor="limitPrice">Limit Price</Label>
                        <Input
                          id="limitPrice"
                          type="number"
                          placeholder="Enter limit price"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          step="0.01"
                        />
                      </div>
                    )}

                    {/* Order Preview */}
                    {preview && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                          <CardTitle className="text-lg">Order Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Shares to Sell</p>
                              <p className="font-semibold">{preview.sellQuantity}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Price per Share</p>
                              <p className="font-semibold">${preview.sellPrice.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Gross Amount</p>
                              <p className="font-semibold">${preview.grossAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Trading Fees</p>
                              <p className="font-semibold">-${preview.fees.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Net Proceeds</span>
                              <span className="text-lg font-bold">${preview.netAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-600">Gain/Loss</span>
                              <div className="flex items-center gap-1">
                                {preview.gainLoss >= 0 ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className={`font-semibold ${preview.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ${Math.abs(preview.gainLoss).toFixed(2)} ({preview.gainLossPercent.toFixed(2)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Warnings */}
                    {marketStatus === "closed" && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Market is currently closed. Your order will be queued and executed when the market opens.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Processing..." : `Sell ${quantity || 0} Shares`}
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Summary & Recent Transactions */}
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Portfolio Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.quantity} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${stock.totalValue.toFixed(0)}</p>
                      <div className="flex items-center gap-1">
                        {stock.profitLoss >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`text-sm ${stock.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.profitLossPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent transactions</p>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {transaction.status === "executed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-semibold">{transaction.symbol}</p>
                          <p className="text-sm text-gray-600">
                            Sold {transaction.quantity} shares
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${transaction.netAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Sell Order</DialogTitle>
            <DialogDescription>
              Please review your order details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          {preview && selectedStock && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Stock:</span>
                  <span className="font-semibold">{selectedStock.symbol}</span>
                  <span>Quantity:</span>
                  <span className="font-semibold">{preview.sellQuantity} shares</span>
                  <span>Order Type:</span>
                  <span className="font-semibold capitalize">{orderType}</span>
                  <span>Price:</span>
                  <span className="font-semibold">${preview.sellPrice.toFixed(2)}</span>
                  <span>Net Proceeds:</span>
                  <span className="font-semibold">${preview.netAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action cannot be undone. Please ensure all details are correct before proceeding.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={executeSell} disabled={isLoading}>
              {isLoading ? "Executing..." : "Confirm Sell Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
