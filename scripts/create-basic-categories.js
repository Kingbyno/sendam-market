// Simple category seeder for testing
const { PrismaClient } = require('@prisma/client')

// Use the same DATABASE_URL from .env.local
const DATABASE_URL = "postgresql://postgres:Promisetheking007@localhost:5432/mypostgres"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})

async function createBasicCategories() {
  console.log('🏗️ Creating basic categories for testing...')
  
  try {
    // Check if categories already exist
    const existingCount = await prisma.category.count()
    if (existingCount > 0) {
      console.log(`✅ Found ${existingCount} existing categories - skipping creation`)
      return
    }
    
    const categories = [
      { name: "Electronics", slug: "electronics", order: 1 },
      { name: "Fashion & Clothing", slug: "fashion-clothing", order: 2 },
      { name: "Home & Garden", slug: "home-garden", order: 3 },
      { name: "Sports & Recreation", slug: "sports-recreation", order: 4 },
      { name: "Books & Media", slug: "books-media", order: 5 },
      { name: "Automotive", slug: "automotive", order: 6 },
      { name: "Health & Beauty", slug: "health-beauty", order: 7 },
      { name: "Toys & Games", slug: "toys-games", order: 8 },
    ]
    
    for (const category of categories) {
      await prisma.category.create({
        data: {
          ...category,
          status: 'APPROVED'
        }
      })
      console.log(`✅ Created: ${category.name}`)
    }
    
    console.log(`🎉 Successfully created ${categories.length} categories`)
    
  } catch (error) {
    console.error('❌ Error creating categories:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createBasicCategories()
