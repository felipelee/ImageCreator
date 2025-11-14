# 🚀 Quick Deploy - 5 Minutes to Production

## ✅ What's Done
- Database migrated to Supabase ✓
- Netlify config created ✓  
- Local `.env` configured ✓
- SQL schema loaded ✓

## 🎯 Deploy Now (3 Steps)

### Step 1: Push to GitHub (1 min)
```bash
git add .
git commit -m "Migrate to Supabase + Netlify"
git push origin main
```

### Step 2: Deploy on Netlify (2 min)
1. Go to **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repo
4. Click **"Deploy site"** (settings auto-detected from `netlify.toml`)

### Step 3: Add Environment Variables (2 min)
In Netlify: **Site settings** → **Environment variables** → **Add variables**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxqmiktzuvqmvbqqlzde.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-from-.env-file
```

Then: **Deploys** → **Trigger deploy**

---

## 🎉 Done!

Your site will be live in ~3 minutes at:
`https://your-site-name.netlify.app`

---

## 📖 Full Guides

- **Complete Deployment:** `DEPLOYMENT_GUIDE.md`
- **Netlify Details:** `NETLIFY_DEPLOYMENT.md`  
- **Storage Setup:** `SUPABASE_STORAGE_SETUP.md`
- **Migration Info:** `MIGRATION_SUMMARY.md`

---

## ❓ Issues?

**Build fails?**
- Check environment variables are set in Netlify
- Check Netlify build logs for errors

**Database not working?**
- Verify Supabase credentials in Netlify
- Check `.env` file has correct values

**Local testing:**
```bash
npm run dev
# Open http://localhost:3000
```

---

**That's it! Your app is production-ready! 🚀**

Netlify + Supabase >> Bolt 😊

