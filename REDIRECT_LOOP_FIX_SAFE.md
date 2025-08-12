# 🚨 URGENT: Fix for Redirect Loop Error (ERR_TOO_MANY_REDIRECTS)

## Problem
Your Vercel deployment is showing "ERR_TOO_MANY_REDIRECTS" because the `NEXTAUTH_URL` environment variable is set to `http://localhost:3000` instead of your production URL.

## ✅ Immediate Fix Required

### Step 1: Set Environment Variables in Vercel

Go to your Vercel dashboard and set these environment variables:

**CRITICAL - Set these immediately:**
```bash
NEXTAUTH_URL=https://your-vercel-app-name.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_from_env_local

# Database (Use your production database URL)
DATABASE_URL=postgresql://your_production_db_connection_string

# Google OAuth (Copy from your .env.local file)
GOOGLE_CLIENT_ID=your_google_client_id_from_env_local
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_env_local

# Admin Configuration (Copy from your .env.local file)
ADMIN_EMAILS=your_admin_emails_from_env_local
```

### Step 2: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Add these to **Authorized JavaScript origins**:
   - `https://your-vercel-app-name.vercel.app`
5. Add these to **Authorized redirect URIs**:
   - `https://your-vercel-app-name.vercel.app/api/auth/callback/google`

### Step 3: Deploy the Fix

The code fix has been applied (added `trustHost: true` to NextAuth config). After setting the environment variables above, redeploy your application.

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project (`sendam-market`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable above using the values from your `.env.local` file
5. Click **Save**
6. Redeploy your application

## Database Setup (IMPORTANT)

⚠️ **Your current `DATABASE_URL` points to localhost which won't work in production.**

You need a production PostgreSQL database. Options:

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Copy the connection string to `DATABASE_URL`

### Option 2: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Set it as your `DATABASE_URL`

### Option 3: Railway/PlanetScale
Similar process - create a database and use the connection string.

## Quick Fix Steps:
1. ✅ Copy your actual values from `.env.local` to Vercel environment variables
2. ✅ Set `NEXTAUTH_URL` to your Vercel app URL
3. ✅ Update Google OAuth redirect URIs
4. ✅ Set up production database
5. ✅ Redeploy

After these steps, your redirect loop should be fixed! 🚀
