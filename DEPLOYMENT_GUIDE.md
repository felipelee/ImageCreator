# 🚀 Complete Deployment Guide: Supabase + Netlify

Your Social Post Generator has been successfully migrated from local storage (Dexie/IndexedDB) to **Supabase** for the database and is ready to deploy on **Netlify**.

## ✅ What's Been Done

### Database Migration
- ✅ All pages updated to use Supabase instead of local IndexedDB
- ✅ Brand and SKU data now stored in PostgreSQL (Supabase)
- ✅ Real-time sync across devices
- ✅ Data persists permanently in the cloud

### Files Updated
- `components/admin/AppSidebar.tsx` - Brand/SKU navigation
- `app/page.tsx` - Home page brand listing
- `app/brands/[id]/page.tsx` - Brand detail page
- `app/brands/[id]/edit/page.tsx` - Brand editor
- `app/brands/[id]/preview/page.tsx` - Brand preview
- `app/brands/[id]/skus/[skuId]/page.tsx` - SKU editor
- `app/brands/[id]/skus/[skuId]/preview/page.tsx` - SKU preview

### New Files Created
- `lib/supabase-storage.ts` - Image upload utilities for Supabase Storage
- `SUPABASE_STORAGE_SETUP.md` - Storage bucket setup instructions
- `netlify.toml` - Netlify deployment configuration
- `NETLIFY_DEPLOYMENT.md` - Detailed Netlify setup guide

---

## 📋 Deployment Checklist

### 1. ✅ Supabase Database (DONE)
- [x] Created Supabase project
- [x] Ran SQL schema (`supabase-schema.sql`)
- [x] Configured `.env` with credentials
- [x] Tested locally

### 2. 🎨 Supabase Storage (Optional but Recommended)

**Why?** Currently images are stored as URLs/base64. With Storage, they'll be in the cloud.

Follow the guide in `SUPABASE_STORAGE_SETUP.md`:

1. Go to Supabase Dashboard → Storage
2. Create 3 public buckets:
   - `brand-images`
   - `sku-images`
   - `generated-assets`
3. Images will automatically upload to cloud storage

**Note:** App works without this, but images won't persist on Netlify without storage.

### 3. 🚀 Deploy to Netlify

#### Option A: Via Netlify Dashboard (Easiest)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Migrate to Supabase and add Netlify config"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect GitHub and select your repo
   - Netlify will auto-detect settings from `netlify.toml`

3. **Add Environment Variables**:
   In Netlify: **Site settings** → **Environment variables** → **Add a variable**
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxqmiktzuvqmvbqqlzde.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key-here
   ```
   
   **Optional (if using AI features):**
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. **Deploy**:
   - Click **"Deploy site"**
   - Wait 2-5 minutes for build
   - Your site will be live!

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxqmiktzuvqmvbqqlzde.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-key-here"

# Deploy
netlify deploy --prod
```

---

## 🔥 Quick Start (Summary)

If you've done steps 1-2 above, here's the fastest way to deploy:

```bash
# 1. Commit your changes
git add .
git commit -m "Ready for deployment"
git push

# 2. Go to Netlify and import your repo
# 3. Add environment variables in Netlify UI
# 4. Click Deploy!
```

That's it! Your app will be live in minutes.

---

## 🎯 Post-Deployment

### Custom Domain (Optional)
1. In Netlify: **Domain settings** → **Add custom domain**
2. Follow DNS instructions
3. Free SSL certificate included!

### Continuous Deployment
- Every push to `main` branch auto-deploys
- Pull requests get preview URLs
- Rollback anytime from Netlify dashboard

### Monitoring
- **Build logs:** Netlify Dashboard
- **Database:** Supabase Dashboard → Logs
- **Storage:** Supabase Dashboard → Storage
- **Performance:** Netlify Analytics (paid add-on)

---

## 🐛 Troubleshooting

### Build Fails on Netlify

**Error: "Supabase credentials not found"**
- ✅ Make sure environment variables are set in Netlify
- ✅ Variables must start with `NEXT_PUBLIC_` for client-side access
- ✅ Redeploy after adding variables

**Error: "Puppeteer/Chrome not found"**
- The app uses Puppeteer for screenshots
- May not work in Netlify build environment
- Screenshots will still work in development
- Consider using Netlify Functions for server-side rendering

### Database Issues

**"PGRST116" or "Not found" errors**
- ✅ Check your Supabase URL and keys are correct
- ✅ Verify the SQL schema ran successfully
- ✅ Check RLS policies in Supabase (should allow all for now)

**Data not persisting**
- ✅ Make sure your Supabase project is not paused (free tier auto-pauses after 7 days inactivity)
- ✅ Check database table in Supabase dashboard

### Local Development

```bash
# Run locally (dev server should still be running)
npm run dev

# Open http://localhost:3000
# Test creating brands and SKUs
# Data should persist in Supabase!
```

---

## 📊 Pricing Summary

### Supabase (Database + Storage)
- **Free Tier:** 500 MB database, 1 GB storage, 2 GB bandwidth/month
- **Pro:** $25/month - 8 GB database, 100 GB storage

### Netlify (Hosting)
- **Free Tier:** 100 GB bandwidth/month, 300 build minutes
- **Pro:** $19/month - Unlimited builds, premium support

**Total Cost for Hobby/Small Projects:** $0/month (free tiers) ✨

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Site loads at your Netlify URL
2. ✅ Can create a new brand
3. ✅ Brand appears in sidebar
4. ✅ Can add SKUs to brands
5. ✅ Can edit brand DNA (colors, fonts)
6. ✅ Data persists after page refresh
7. ✅ Can generate posts with AI (if API keys configured)

---

## 📚 Additional Resources

- **Netlify Docs:** https://docs.netlify.com
- **Supabase Docs:** https://supabase.com/docs
- **Next.js on Netlify:** https://docs.netlify.com/frameworks/next-js/

## 🆘 Need Help?

1. Check the detailed guides:
   - `NETLIFY_DEPLOYMENT.md` - Full Netlify setup
   - `SUPABASE_STORAGE_SETUP.md` - Storage configuration

2. Check Netlify build logs for errors
3. Check Supabase Dashboard → Logs for database issues
4. Test locally first with `npm run dev`

---

**You're all set! 🚀 Your app is ready to deploy to the cloud with Supabase + Netlify!**

