# Push to Fluid - Quick Start Guide

Get up and running in 3 easy steps!

## Step 1: Run Database Migrations ⚡

Run these two SQL scripts in your Supabase SQL Editor:

### Script 1: Brands Table
```sql
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS fluid_dam JSONB DEFAULT NULL;
```

### Script 2: SKUs Table
```sql
ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS fluid_metadata JSONB DEFAULT '{}'::jsonb;
```

## Step 2: Configure Fluid in Brand Settings 🔧

1. **Navigate:** All Brands → Your Brand → "Edit DNA" button
2. **Scroll down** to "Fluid DAM Integration" section
3. **Fill in:**
   - API Token: `your-fluid-api-token`
   - Base URL: `https://yourbrand.fluid.app`
4. **Save** the changes

✅ You'll see a green confirmation when it's working!

## Step 3: Import a Product & Push Images 🚀

### Import from Fluid
1. Go to your brand page
2. Click **"Import from Fluid"** button
3. Browse/search and select a product
4. Product creates a new SKU with Fluid metadata

### Generate & Push
1. Edit the SKU, create your layouts
2. Click the blue **"Push to Fluid"** button
3. All 14 layouts upload automatically!

---

## Troubleshooting 🔍

### "Push to Fluid" button not showing?

Open browser console and check the debug output:

```javascript
[Push to Fluid Debug] {
  hasFluidMetadata: true,  // ← Should be true
  productId: "12345",
  hasBrandToken: true,     // ← Should be true
  buttonShouldShow: true   // ← Should be true
}
```

**If `hasBrandToken: false`:**
- Go back to Step 2 and configure credentials in Brand DNA

**If `hasFluidMetadata: false`:**
- This SKU wasn't imported from Fluid
- Create a new SKU by importing from Fluid (Step 3)

**If `buttonShouldShow: false`:**
- Check both conditions above

### Still not working?

1. Check the Supabase SQL Editor:
   ```sql
   -- Verify brand has credentials
   SELECT id, name, fluid_dam FROM brands WHERE name = 'Your Brand Name';
   
   -- Verify SKU has metadata
   SELECT id, name, fluid_metadata FROM skus WHERE id = YOUR_SKU_ID;
   ```

2. Make sure both migrations ran successfully
3. Refresh the page after saving brand credentials

---

## What Happens When You Push?

1. ✨ All 14 layouts render at high quality (2x PNG)
2. 📤 Each image uploads to Fluid
3. 🏷️ Images are titled: `{SKU Name} - {Layout Name}`
4. 📊 Images are positioned in order (1-14)
5. ✅ Success notification shows count

---

## Features You Get

- 🎯 **Import Products:** Pull product data from Fluid
- 🖼️ **DAM Assets:** Use Fluid images in your layouts
- ⬆️ **Push Images:** Send all layouts to Fluid with 1 click
- 🔄 **Complete Loop:** Pull → Generate → Push workflow

---

## Need Help?

Check these files:
- Full documentation: `FLUID_PUSH_TO_PRODUCT_IMAGES.md`
- Detailed setup: `SETUP_PUSH_TO_FLUID.md`
- Fluid API docs: https://docs.fluid.app/docs/apis/swagger/productimages

---

**That's it!** You're ready to push your beautiful marketing images to Fluid! 🎉

