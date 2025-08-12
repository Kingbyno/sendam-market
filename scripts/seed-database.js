const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create categories
  const categories = [
    {
      name: "Electronics",
      slug: "electronics",
      description: "Phones, laptops, gadgets and electronic devices",
      icon: "📱",
      color: "#3B82F6",
      featured: true,
      order: 1,
    },
    {
      name: "Fashion",
      slug: "fashion",
      description: "Clothing, shoes, accessories and fashion items",
      icon: "👕",
      color: "#EC4899",
      featured: true,
      order: 2,
    },
    {
      name: "Home & Garden",
      slug: "home-garden",
      description: "Furniture, appliances, home decor and garden items",
      icon: "🏠",
      color: "#10B981",
      featured: true,
      order: 3,
    },
    {
      name: "Sports & Fitness",
      slug: "sports-fitness",
      description: "Sports equipment, fitness gear and outdoor activities",
      icon: "⚽",
      color: "#F59E0B",
      featured: true,
      order: 4,
    },
    {
      name: "Books & Education",
      slug: "books-education",
      description: "Books, educational materials and learning resources",
      icon: "📚",
      color: "#8B5CF6",
      featured: false,
      order: 5,
    },
    {
      name: "Automotive",
      slug: "automotive",
      description: "Cars, motorcycles, parts and automotive accessories",
      icon: "🚗",
      color: "#EF4444",
      featured: false,
      order: 6,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }

  console.log("✅ Categories seeded successfully")

  // Create sample users (optional - users are created via Supabase auth)
  console.log("✅ Database seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
