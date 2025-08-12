# Pre-deployment script to ensure Prisma client is generated

Write-Host "Generating Prisma client..." -ForegroundColor Green
npx prisma generate
Write-Host "Prisma client generated successfully!" -ForegroundColor Green
