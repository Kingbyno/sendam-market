// Quick category creation script
// Run this in the browser console on localhost:3000

const createTestCategories = async () => {
  console.log("🏗️ Creating test categories...")
  
  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Garden", slug: "home-garden" },
    { name: "Sports", slug: "sports" },
    { name: "Books", slug: "books" }
  ]
  
  try {
    // This would need an API endpoint to work
    console.log("Categories to create:", categories)
    console.log("Note: This needs an API endpoint to actually create categories")
    console.log("Alternative: Create categories through admin panel")
    
    return categories
  } catch (error) {
    console.error("Error creating categories:", error)
  }
}

// Test authentication status
const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/session')
    const session = await response.json()
    console.log("🔐 Authentication status:", session?.user ? "✅ Logged in" : "❌ Not logged in")
    if (session?.user) {
      console.log("👤 User:", session.user.email)
      console.log("🔑 User ID:", session.user.id)
    }
    return session
  } catch (error) {
    console.error("Auth check failed:", error)
  }
}

// Test form submission directly
const testFormSubmission = async () => {
  console.log("🧪 Testing form submission...")
  
  // First check auth
  const session = await checkAuth()
  if (!session?.user) {
    console.log("❌ Must be logged in to test form submission")
    console.log("👉 Go to /auth/login first")
    return
  }
  
  // Create test FormData
  const formData = new FormData()
  formData.append('title', 'Test Item')
  formData.append('description', 'This is a test item description')
  formData.append('price', '1000')
  formData.append('condition', 'NEW')
  formData.append('location', 'Lagos')
  formData.append('phone', '08012345678')
  formData.append('address', '123 Test Street')
  formData.append('bankName', 'Test Bank')
  formData.append('accountName', 'Test User')
  formData.append('accountNumber', '1234567890')
  formData.append('categoryId', 'test-category-id')
  formData.append('negotiable', 'false')
  
  // Create a small test image file
  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 100, 100)
  
  canvas.toBlob((blob) => {
    const file = new File([blob], 'test-image.png', { type: 'image/png' })
    formData.append('images', file)
    
    console.log("📤 Submitting test form data...")
    console.log("Note: This is just a test - actual submission needs proper category ID")
  })
}

// Run tests
console.log("🚀 Sell Form Debug Tools Loaded")
console.log("Available functions:")
console.log("- checkAuth() - Check if user is logged in")
console.log("- createTestCategories() - View test category data")
console.log("- testFormSubmission() - Test form submission (needs login)")

// Auto-run auth check
checkAuth()
