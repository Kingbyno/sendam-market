# How to Find Your Vercel Postgres Connection Strings

## Step-by-Step Guide to Find Database URLs

### Method 1: From Storage Tab
1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Select your `sendam-market` project**
3. **Click the "Storage" tab** (in the top navigation)
4. **Click on your `prisma-postgres-sendam` database**
5. **Look for a section called "Connection Details" or "Environment Variables"**

You should see something like:
```
POSTGRES_URL="postgresql://username:password@host:5432/database"
POSTGRES_PRISMA_URL="postgresql://username:password@host:5432/database?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://username:password@host:5432/database"
```

### Method 2: From Project Settings
1. **Go to your project in Vercel**
2. **Click "Settings" tab**
3. **Click "Environment Variables" in the left sidebar**
4. **Look for variables starting with "POSTGRES_" or "DATABASE_"**

### Method 3: From the Database Page Directly
1. **In Vercel Dashboard, go to Storage**
2. **Click on `prisma-postgres-sendam`**
3. **Look for tabs like "Settings", "Connection", or "Quickstart"**
4. **The connection strings should be visible there**

## What You're Looking For

You need to copy the **POSTGRES_PRISMA_URL** (or similar) value and use it as your `DATABASE_URL` in your environment variables.

## Quick Setup Once You Find the URL

1. **Copy the connection string** (usually the one labeled `POSTGRES_PRISMA_URL`)
2. **Go to your Vercel project Settings → Environment Variables**
3. **Add this variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** `[paste the connection string here]`

## If You Still Can't Find It

Try these alternative locations:
- **Storage → [Your Database] → Overview tab**
- **Storage → [Your Database] → Settings tab**
- **Project Settings → Integrations → Storage**

## Screenshot Areas to Look For

Look for sections labeled:
- ✅ "Connection Details"
- ✅ "Environment Variables"
- ✅ "Connection Strings"
- ✅ "Database URL"
- ✅ "Quickstart"

The connection string will look something like:
```
postgresql://username:password@host.region.postgres.vercel-storage.com:5432/verceldb
```

Let me know what you see in your Storage tab and I can help you locate the exact connection string!
