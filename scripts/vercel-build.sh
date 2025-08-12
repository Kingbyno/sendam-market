#!/bin/bash
set -e

echo "🔧 Starting Vercel build process..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️ DATABASE_URL is not set. This may cause issues."
else
  echo "✅ DATABASE_URL is configured"
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Verify Prisma client generation
if [ -d "node_modules/.prisma/client" ]; then
  echo "✅ Prisma client generated successfully"
else
  echo "❌ Prisma client generation failed"
  exit 1
fi

# Run Next.js build
echo "🏗️ Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"
