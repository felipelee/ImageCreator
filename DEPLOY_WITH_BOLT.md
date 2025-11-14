# 🚀 Deploy to Bolt.new - Quick Start Guide

This guide will help you deploy your Social Post Generator to Bolt.new with Supabase database in minutes!

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Social Post Generator"
```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it: `social-post-generator` (or whatever you prefer)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/social-post-generator.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Supabase (Takes 2 minutes)

1. **Go to** https://supabase.com
2. **Create a new project**:
   - Click "New Project"
   - Choose a name (e.g., "social-post-generator")
   - Choose a database password (save it!)
   - Select a region (closest to you)
   - Click "Create new project" (takes ~2 minutes)

3. **Run the database schema**:
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy and paste the entire contents of `supabase-schema.sql`
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

4. **Get your API credentials**:
   - Click "Settings" (gear icon) in the left sidebar
   - Click "API" under Project Settings
   - Copy these two values (you'll need them in Bolt):
     - `URL` → Your NEXT_PUBLIC_SUPABASE_URL
     - `anon` `public` key → Your NEXT_PUBLIC_SUPABASE_ANON_KEY

## Step 3: Open in Bolt.new

1. **Go to** https://bolt.new

2. **Import your GitHub repository**:
   - Look for an "Import from GitHub" or similar option
   - Or paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/social-post-generator`

3. **Add Environment Variables**:
   Bolt should prompt you for environment variables. Add these two:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Deploy**:
   - Bolt will automatically detect it's a Next.js app
   - It will install dependencies and deploy
   - In 2-3 minutes, you'll have a live URL! 🎉

## Step 4: Update Your Code to Use Supabase (Optional Migration)

If you want to migrate from Dexie (browser storage) to Supabase, I've created all the files you need:

- `lib/supabase.ts` - Contains all database operations
- `supabase-schema.sql` - Database schema (already ran this)

To use Supabase instead of Dexie, you'll need to replace imports:
- Change `import { db } from '@/lib/db'` 
- To `import { brandService, skuService } from '@/lib/supabase'`

I can help you make these changes if you want!

## Troubleshooting

### "Can't connect to Supabase"
- Make sure your environment variables are set correctly in Bolt
- Check that you ran the SQL schema in Supabase
- Verify your Supabase project is active (not paused)

### "Build failed"
- Check the build logs in Bolt
- Most likely a missing environment variable

### "Works locally but not in production"
- Environment variables: Make sure they're set in Bolt's deployment settings
- Check Supabase is accessible (RLS policies allow access)

## What's Next?

Once deployed, you can:
- Share the live URL with anyone
- Data will persist in Supabase (no more browser-only storage!)
- Scale to multiple users
- Add authentication later if needed

## Need Help?

- Bolt.new docs: https://bolt.new/docs
- Supabase docs: https://supabase.com/docs
- Or ask me for help! 😊

