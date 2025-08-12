// Add minimal placeholder page to prevent unsupported server component error
export const dynamic = "force-dynamic"

export default function StocksSellPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Stocks Sell Coming Soon</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">This section is under development. Please check back later.</p>
      </div>
    </div>
  )
}
