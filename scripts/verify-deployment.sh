#!/bin/bash
# Deployment verification script

echo "🔍 Verifying Sendam Market Deployment..."

DOMAIN="https://sendam-market-of3r.vercel.app"

echo "Testing main routes..."

# Test homepage
echo "📄 Testing homepage..."
curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/" && echo " ✅ Homepage responding"

# Test auth routes
echo "🔐 Testing auth routes..."
curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/auth/login" && echo " ✅ Login page responding"

# Test API health
echo "🔧 Testing API..."
curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/test-sanity" && echo " ✅ API responding"

# Test marketplace
echo "🛍️ Testing marketplace..."
curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/marketplace" && echo " ✅ Marketplace responding"

echo ""
echo "✅ If all tests show 200 or 3xx codes, your deployment is working!"
echo ""
echo "🔗 Visit your site: $DOMAIN"
