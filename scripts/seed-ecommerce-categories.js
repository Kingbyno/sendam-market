require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ecommerceCategories = [
  // Electronics & Technology
  {
    name: "Electronics & Technology",
    slug: "electronics-technology",
    children: [
      { name: "Smartphones & Accessories", slug: "smartphones-accessories" },
      { name: "Laptops & Computers", slug: "laptops-computers" },
      { name: "Tablets & E-readers", slug: "tablets-ereaders" },
      { name: "Audio & Headphones", slug: "audio-headphones" },
      { name: "Cameras & Photography", slug: "cameras-photography" },
      { name: "Gaming Consoles & Games", slug: "gaming-consoles-games" },
      { name: "TV & Home Entertainment", slug: "tv-home-entertainment" },
      { name: "Smart Home & IoT", slug: "smart-home-iot" },
      { name: "Wearable Technology", slug: "wearable-technology" }
    ]
  },
  
  // Fashion & Apparel
  {
    name: "Fashion & Apparel",
    slug: "fashion-apparel",
    children: [
      { name: "Men's Clothing", slug: "mens-clothing" },
      { name: "Women's Clothing", slug: "womens-clothing" },
      { name: "Children's Clothing", slug: "childrens-clothing" },
      { name: "Shoes & Footwear", slug: "shoes-footwear" },
      { name: "Bags & Accessories", slug: "bags-accessories" },
      { name: "Jewelry & Watches", slug: "jewelry-watches" },
      { name: "Eyewear & Sunglasses", slug: "eyewear-sunglasses" }
    ]
  },
  
  // Home & Living
  {
    name: "Home & Living",
    slug: "home-living",
    children: [
      { name: "Furniture", slug: "furniture" },
      { name: "Home Decor", slug: "home-decor" },
      { name: "Kitchen & Dining", slug: "kitchen-dining" },
      { name: "Bedding & Bath", slug: "bedding-bath" },
      { name: "Garden & Outdoor", slug: "garden-outdoor" },
      { name: "Tools & Hardware", slug: "tools-hardware" },
      { name: "Appliances", slug: "appliances" }
    ]
  },
  
  // Health & Beauty
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    children: [
      { name: "Skincare", slug: "skincare" },
      { name: "Makeup & Cosmetics", slug: "makeup-cosmetics" },
      { name: "Hair Care", slug: "hair-care" },
      { name: "Fragrances", slug: "fragrances" },
      { name: "Health Supplements", slug: "health-supplements" },
      { name: "Personal Care", slug: "personal-care" },
      { name: "Fitness Equipment", slug: "fitness-equipment" }
    ]
  },
  
  // Sports & Recreation
  {
    name: "Sports & Recreation",
    slug: "sports-recreation",
    children: [
      { name: "Exercise & Fitness", slug: "exercise-fitness" },
      { name: "Outdoor Sports", slug: "outdoor-sports" },
      { name: "Team Sports", slug: "team-sports" },
      { name: "Water Sports", slug: "water-sports" },
      { name: "Winter Sports", slug: "winter-sports" },
      { name: "Cycling", slug: "cycling" },
      { name: "Golf", slug: "golf" }
    ]
  },
  
  // Automotive
  {
    name: "Automotive",
    slug: "automotive",
    children: [
      { name: "Car Parts & Accessories", slug: "car-parts-accessories" },
      { name: "Motorcycle Parts", slug: "motorcycle-parts" },
      { name: "Car Electronics", slug: "car-electronics" },
      { name: "Tools & Equipment", slug: "automotive-tools-equipment" },
      { name: "Car Care", slug: "car-care" }
    ]
  },
  
  // Books & Media
  {
    name: "Books & Media",
    slug: "books-media",
    children: [
      { name: "Books", slug: "books" },
      { name: "Movies & TV Shows", slug: "movies-tv-shows" },
      { name: "Music", slug: "music" },
      { name: "Magazines", slug: "magazines" },
      { name: "Educational Materials", slug: "educational-materials" }
    ]
  },
  
  // Baby & Kids
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    children: [
      { name: "Baby Clothing", slug: "baby-clothing" },
      { name: "Baby Gear", slug: "baby-gear" },
      { name: "Toys & Games", slug: "toys-games" },
      { name: "School Supplies", slug: "school-supplies" },
      { name: "Baby Food & Formula", slug: "baby-food-formula" }
    ]
  },
  
  // Food & Beverages
  {
    name: "Food & Beverages",
    slug: "food-beverages",
    children: [
      { name: "Snacks & Confectionery", slug: "snacks-confectionery" },
      { name: "Beverages", slug: "beverages" },
      { name: "Organic & Natural", slug: "organic-natural" },
      { name: "Gourmet & Specialty", slug: "gourmet-specialty" }
    ]
  },
  
  // Office & Business
  {
    name: "Office & Business",
    slug: "office-business",
    children: [
      { name: "Office Supplies", slug: "office-supplies" },
      { name: "Office Furniture", slug: "office-furniture" },
      { name: "Business Equipment", slug: "business-equipment" },
      { name: "Stationery", slug: "stationery" }
    ]
  },
  
  // Art & Crafts
  {
    name: "Art & Crafts",
    slug: "art-crafts",
    children: [
      { name: "Art Supplies", slug: "art-supplies" },
      { name: "Craft Materials", slug: "craft-materials" },
      { name: "Sewing & Fabric", slug: "sewing-fabric" },
      { name: "Paintings & Artwork", slug: "paintings-artwork" },
      { name: "Handmade Items", slug: "handmade-items" }
    ]
  },
  
  // Pet Supplies
  {
    name: "Pet Supplies",
    slug: "pet-supplies",
    children: [
      { name: "Dog Supplies", slug: "dog-supplies" },
      { name: "Cat Supplies", slug: "cat-supplies" },
      { name: "Fish & Aquarium", slug: "fish-aquarium" },
      { name: "Bird Supplies", slug: "bird-supplies" },
      { name: "Small Pet Supplies", slug: "small-pet-supplies" }
    ]
  }
]

async function seedEcommerceCategories() {
  try {
    console.log('🌱 Starting to seed e-commerce categories...')
    
    // Clear existing categories
    await prisma.category.deleteMany({})
    console.log('🗑️ Cleared existing categories')
    
    let order = 1
    
    for (const parentCat of ecommerceCategories) {
      // Create parent category
      const parent = await prisma.category.create({
        data: {
          name: parentCat.name,
          slug: parentCat.slug,
          status: 'APPROVED',
          order: order++
        }
      })
      
      console.log(`✅ Created parent category: ${parent.name}`)
      
      // Create child categories
      if (parentCat.children) {
        for (const childCat of parentCat.children) {
          const child = await prisma.category.create({
            data: {
              name: childCat.name,
              slug: childCat.slug,
              status: 'APPROVED',
              parentId: parent.id,
              order: order++
            }
          })
          
          console.log(`  ↳ Created child category: ${child.name}`)
        }
      }
    }
    
    console.log('🎉 Successfully seeded all e-commerce categories!')
    
    // Display summary
    const totalCategories = await prisma.category.count()
    const parentCategories = await prisma.category.count({ where: { parentId: null } })
    const childCategories = await prisma.category.count({ where: { parentId: { not: null } } })
    
    console.log(`📊 Summary:`)
    console.log(`   Total categories: ${totalCategories}`)
    console.log(`   Parent categories: ${parentCategories}`)
    console.log(`   Child categories: ${childCategories}`)
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedEcommerceCategories()
  .catch((error) => {
    console.error('Failed to seed categories:', error)
    process.exit(1)
  })
