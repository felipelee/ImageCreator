# Setup: Push to Fluid Feature

## Step-by-Step Setup

### 1. Run Both Database Migrations

You need to run **TWO** SQL migrations in your Supabase SQL Editor:

#### Migration 1: Add Fluid DAM Column to Brands Table
```sql
-- File: supabase-add-fluid-dam-column.sql
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS fluid_dam JSONB DEFAULT NULL;

COMMENT ON COLUMN brands.fluid_dam IS 'Brand-specific Fluid DAM credentials: { apiToken, baseUrl, subdomain }';
```

#### Migration 2: Add Fluid Metadata Column to SKUs Table
```sql
-- File: supabase-add-fluid-metadata.sql
ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS fluid_metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_skus_fluid_metadata ON skus USING GIN (fluid_metadata);

COMMENT ON COLUMN skus.fluid_metadata IS 'Stores Fluid DAM product metadata (productId, variantId, productSlug, productTitle) for push-to-Fluid functionality';
```

### 2. Configure Fluid Credentials in Brand Settings

After running the migrations, configure your Fluid DAM credentials via the UI:

1. Go to **All Brands** → Select your brand → Click **"Edit DNA"**
2. Scroll down to **"Fluid DAM Integration"** section
3. Fill in the fields:
   - **API Token:** Your Fluid API token (find in Fluid settings)
   - **Base URL:** `https://yourbrand.fluid.app`
   - **Subdomain:** `yourbrand` (optional)
4. Click **"Save Brand DNA"**

You'll see a green success message when configured correctly:
```
✓ Fluid DAM is configured! You can now:
  • Import products from Fluid on the brand page
  • Browse DAM assets when editing SKU images
  • Push generated images to Fluid product pages
```

### 3. Import a Product from Fluid

1. Go to your brand page
2. Click **"Import from Fluid"** button
3. Select a product
4. This creates a SKU with `fluidMetadata` linked to the Fluid product

### 4. Use the Push to Fluid Feature

Once setup is complete:
1. Edit your SKU
2. You should now see the **"Push to Fluid"** button (blue, next to "Download All")
3. Click it to upload all layouts to Fluid!

## Troubleshooting

### Button Not Showing?

Check the browser console for debug info:
```javascript
[Push to Fluid Debug] {
  hasFluidMetadata: true/false,
  productId: "...",
  hasBrandToken: true/false,
  brandToken: "***exists***" or "missing",
  baseUrl: "...",
  buttonShouldShow: true/false
}
```

**Common Issues:**

1. **`hasBrandToken: false`** → You need to configure Fluid credentials in the brand
2. **`hasFluidMetadata: false`** → SKU wasn't imported from Fluid or migration didn't run
3. **`buttonShouldShow: false`** → One or both conditions above are not met

### Quick Verification

Run this SQL to check your setup:
```sql
-- Check if brands table has fluid_dam column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'brands' 
AND column_name = 'fluid_dam';

-- Check if skus table has fluid_metadata column  
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'skus' 
AND column_name = 'fluid_metadata';

-- Check your brand's Fluid credentials
SELECT id, name, fluid_dam 
FROM brands 
WHERE id = YOUR_BRAND_ID;

-- Check SKU's Fluid metadata
SELECT id, name, fluid_metadata 
FROM skus 
WHERE id = YOUR_SKU_ID;
```

## How to Find Your Fluid API Token

1. Log in to your Fluid account
2. Go to **Settings** → **API** or **Integrations**
3. Generate or copy your API token
4. Paste it into the Brand DNA page

For more information, refer to the [Fluid API Documentation](https://docs.fluid.app).

