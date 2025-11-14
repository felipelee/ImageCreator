# Deploying to Netlify

This guide will help you deploy your Social Post Generator to Netlify with Supabase as the database.

## Prerequisites

1. A [Netlify](https://netlify.com) account
2. A [Supabase](https://supabase.com) project set up
3. Your code pushed to GitHub/GitLab/Bitbucket

## Step 1: Set Up Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to the SQL Editor and run the schema from `supabase-schema.sql`
4. Get your project credentials:
   - Go to **Settings** → **API**
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public** key

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. **Connect Your Repository**
   - Go to [Netlify](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** `20`
   
   These should be auto-detected from `netlify.toml`, but verify them.

3. **Set Environment Variables**
   - Click **"Show advanced"** → **"New variable"**
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     OPENAI_API_KEY=sk-...
     ANTHROPIC_API_KEY=sk-ant-...
     ```
   - Replace the values with your actual credentials

4. **Deploy**
   - Click **"Deploy site"**
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be live at `https://random-name.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Your Site**
   ```bash
   netlify init
   ```
   - Follow the prompts to connect to your repository
   - Choose "Create & configure a new site"

4. **Set Environment Variables**
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
   netlify env:set OPENAI_API_KEY "sk-..."
   netlify env:set ANTHROPIC_API_KEY "sk-ant-..."
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Domain (Optional)

1. In Netlify Dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow instructions to point your domain to Netlify

## Troubleshooting

### Build Fails with Puppeteer Error

If you see errors related to Puppeteer/Chrome during build:

1. The app uses Puppeteer for screenshot generation, which might not work in Netlify's build environment
2. Consider using a serverless function approach or alternative screenshot service
3. You can remove Puppeteer temporarily if not using the screenshot features

### Environment Variables Not Working

- Make sure all environment variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables
- Check the Netlify build logs for any errors

### Database Connection Issues

- Verify your Supabase URL and keys are correct
- Check that RLS policies are set up correctly in Supabase
- Make sure your Supabase project is not paused (free tier limitation)

### Build Errors

If you get peer dependency errors:
- The `netlify.toml` file includes `NPM_FLAGS = "--legacy-peer-deps"`
- This should handle React 19 peer dependency issues

## Continuous Deployment

Once set up, Netlify will automatically:
- Deploy when you push to your main branch
- Create preview deployments for pull requests
- Run builds and tests before deploying

## Monitoring

- **Build logs:** Available in Netlify Dashboard
- **Function logs:** Check Netlify Functions tab
- **Supabase logs:** Available in Supabase Dashboard → Logs

## Next Steps

1. Set up custom domain
2. Configure Supabase authentication (if needed)
3. Set up Supabase storage for image uploads
4. Monitor usage and adjust Supabase/Netlify plans as needed

## Support

- **Netlify Docs:** https://docs.netlify.com
- **Supabase Docs:** https://supabase.com/docs
- **Next.js on Netlify:** https://docs.netlify.com/frameworks/next-js/

---

## Quick Reference

**Netlify CLI Commands:**
```bash
netlify dev          # Run locally with Netlify functions
netlify deploy       # Deploy to preview
netlify deploy --prod # Deploy to production
netlify open         # Open Netlify dashboard
netlify env:list     # List environment variables
```

**Essential Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - For AI features

