# Database Setup Guide for Production

## Your Current Issue

Your current database URL:
```
DATABASE_URL=postgresql://postgres:Promisetheking007@localhost:5432/mypostgres
```

This points to `localhost` (your local machine), which won't work in production because Vercel's servers can't access your local database.

## Production Database Options

### Option 1: Vercel Postgres (Recommended)
✅ **Easiest setup**
✅ **Automatically integrates with your Vercel project**
✅ **Built-in environment variable setup**

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `sendam-market` project
3. Click **Storage** tab
4. Click **Create Database** → **Postgres**
5. Follow the setup wizard
6. Vercel will automatically set your `DATABASE_URL` environment variable

### Option 2: Supabase (Free Tier Available)
✅ **Free tier with 2 databases**
✅ **Great for MVP/small projects**
✅ **Built-in authentication (though you're already using NextAuth)**

**Steps:**
1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Go to Settings → Database
4. Copy the connection string
5. Add it to Vercel as `DATABASE_URL` environment variable

**Connection string format:**
```
postgresql://postgres.projectref:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### Option 3: Railway
✅ **$5/month for unlimited usage**
✅ **Easy PostgreSQL setup**

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Create project and add PostgreSQL service
3. Copy the connection string
4. Add it to Vercel environment variables

## Migration Steps

### Step 1: Set up your production database (choose one option above)

### Step 2: Migrate your schema
Once you have your production `DATABASE_URL`:

```bash
# Update your schema in production
npx prisma db push
```

### Step 3: (Optional) Migrate existing data
If you have important data locally, you can export/import it:

```bash
# Export local data
pg_dump postgresql://postgres:Promisetheking007@localhost:5432/mypostgres > local_backup.sql

# Import to production (replace with your production URL)
psql "your_production_database_url_here" < local_backup.sql
```

## Environment Variables Setup

After getting your production database URL, set these in Vercel:

```bash
# Production values for Vercel
DATABASE_URL=your_actual_production_database_url_here
NEXTAUTH_URL=https://your-deployment.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAILS=your_admin_emails
```

## Quick Recommendation

**Start with Vercel Postgres** - it's the easiest option and integrates seamlessly with your deployment. You can always migrate to another database later if needed.

The free tier should be sufficient for your marketplace MVP!
