# Vercel build script for Windows/PowerShell
$ErrorActionPreference = "Stop"

Write-Host "🔧 Starting Vercel build process..." -ForegroundColor Green

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️ DATABASE_URL is not set. This may cause issues." -ForegroundColor Yellow
} else {
    Write-Host "✅ DATABASE_URL is configured" -ForegroundColor Green
}

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

# Verify Prisma client generation
if (Test-Path "node_modules\.prisma\client") {
    Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma client generation failed" -ForegroundColor Red
    exit 1
}

# Run Next.js build
Write-Host "🏗️ Building Next.js application..." -ForegroundColor Blue
npx next build

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
