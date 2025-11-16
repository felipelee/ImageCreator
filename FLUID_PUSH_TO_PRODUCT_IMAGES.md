# Push to Fluid Product Images

## Overview

This feature enables a powerful workflow loop with Fluid DAM:
1. **Pull** product data and images from Fluid
2. **Generate** beautiful marketing layouts in your app
3. **Push** generated images back to Fluid as product imagery

This saves time by eliminating the need to download images and manually upload them to Fluid.

## How It Works

### 1. Import a Product from Fluid

When you create a new SKU by importing from Fluid:
- The app saves the Fluid product ID, variant ID, product slug, and title
- This metadata is stored in the SKU's `fluidMetadata` field
- This links your SKU to the specific product in Fluid

### 2. Generate Your Marketing Images

Create and customize your marketing layouts as usual:
- Edit copy and images
- Apply color variations
- Use the visual editor
- Preview all layouts

### 3. Push to Fluid

When you're ready, click the **"Push to Fluid"** button:
- The button appears in the SKU editor header (only when SKU is linked to a Fluid product)
- All 14 layouts are rendered at high quality (2x scale, PNG format)
- Each image is uploaded to Fluid and attached to your product
- Images are titled with the format: `{SKU Name} - {Layout Name}`
- Images are positioned in order (1-14) in the product gallery

### Button Visibility

The "Push to Fluid" button only appears when:
- ✅ The SKU was imported from a Fluid product (has `fluidMetadata.productId`)
- ✅ Brand has Fluid DAM credentials configured (`fluidDam.apiToken` and `fluidDam.baseUrl`)

## API Integration

### Fluid ProductImages API

We use Fluid's **ProductImages API** ([docs](https://docs.fluid.app/docs/apis/swagger/productimages)) to upload images:

**Endpoint:**
```
POST /api/company/v1/products/{product_id}/images
```

**Or for variants:**
```
POST /api/company/v1/variants/{variant_id}/images
```

**Request Body:**
```json
{
  "image_url": "data:image/png;base64,...",
  "position": 1,
  "alt_text": "Product Name - Layout Name"
}
```

### Our Implementation

**Backend Route:** `/app/api/fluid-dam/upload/route.ts`
- Accepts image file, product ID, variant ID
- Converts image to base64 data URL
- Sends to appropriate Fluid API endpoint
- Handles both product and variant images

**Frontend Function:** `uploadToFluid()` in SKU editor
- Iterates through all 14 layouts
- Renders each to PNG blob at 2x scale
- Uploads to Fluid via our API route
- Shows progress toast notifications

## Database Schema

### SKU Table Addition

Run this migration to add the `fluid_metadata` field:

```sql
-- File: supabase-add-fluid-metadata.sql
ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS fluid_metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_skus_fluid_metadata ON skus USING GIN (fluid_metadata);
```

### Fluid Metadata Structure

```typescript
fluidMetadata?: {
  productId?: string | number      // Fluid product ID
  variantId?: string | number      // Fluid variant ID (if specific variant)
  productSlug?: string             // Fluid product slug
  productTitle?: string            // Fluid product title for reference
}
```

## User Experience

### Import Flow

1. Go to brand page
2. Click "Import from Fluid"
3. Browse/search Fluid products
4. Select product → Creates SKU with `fluidMetadata` saved

### Push Flow

1. Edit SKU and create layouts
2. Click "Push to Fluid" button (blue, highlighted)
3. Progress notification: "Uploading to Fluid... Processing 14 layouts"
4. Success notification: "Uploaded 14 images to Fluid! Images added to {Product Name}"

### Error Handling

**No Fluid Credentials:**
```
Error: Fluid not configured
Please configure Fluid DAM credentials in brand settings first.
```

**No Linked Product:**
```
Error: No Fluid product linked
This SKU was not imported from Fluid. Please link it to a Fluid product first.
```

**Upload Failures:**
```
Success: Uploaded 12 images to Fluid!
2 uploads failed. Check console for details.
```

## Benefits

### For Users
- ✅ **Time Savings:** No manual download/upload needed
- ✅ **Automation:** Push all layouts with one click
- ✅ **Organization:** Images automatically titled and positioned
- ✅ **Integration:** Seamless Fluid DAM workflow

### For Products
- ✅ **Rich Media:** All marketing layouts available in Fluid
- ✅ **Consistency:** Branded, professional imagery
- ✅ **Accessibility:** Product images available across Fluid ecosystem
- ✅ **Version Control:** Updates can be easily re-pushed

## Future Enhancements

Possible improvements:
- [ ] Select specific layouts to push (instead of all)
- [ ] Push to different Fluid collections/folders
- [ ] Update existing images vs. creating new ones
- [ ] Push to multiple products at once
- [ ] Custom image naming patterns
- [ ] Link existing SKUs to Fluid products (manual linking)

## Technical Details

### Files Modified

1. **Types:**
   - `types/sku.ts` - Added `fluidMetadata` field

2. **API Routes:**
   - `app/api/fluid-dam/upload/route.ts` - New upload endpoint

3. **Frontend:**
   - `app/brands/[id]/page.tsx` - Save metadata on import
   - `app/brands/[id]/skus/[skuId]/page.tsx` - Upload functionality & UI

4. **Database:**
   - `supabase-add-fluid-metadata.sql` - Schema migration

### Dependencies

- Existing: `lucide-react` (Upload icon)
- Existing: `sonner` (Toast notifications)
- Existing: `@/lib/render-engine` (Layout rendering)
- New endpoint: Fluid ProductImages API

## Testing

### Manual Testing Checklist

1. **Import Product:**
   - [ ] Import product from Fluid
   - [ ] Verify `fluidMetadata` is saved
   - [ ] Check console for product ID

2. **Push Images:**
   - [ ] See "Push to Fluid" button
   - [ ] Click and see upload progress
   - [ ] Verify success notification
   - [ ] Check Fluid DAM for uploaded images

3. **Error Cases:**
   - [ ] Remove Fluid credentials → See error
   - [ ] Create manual SKU → No button shown
   - [ ] Test with invalid product ID

## Support

For issues or questions:
- Check browser console for detailed error logs
- Verify Fluid API credentials in brand settings
- Ensure SKU was imported from Fluid (has `fluidMetadata`)
- Check Fluid API documentation for authentication issues

---

**Reference:**
- [Fluid ProductImages API Documentation](https://docs.fluid.app/docs/apis/swagger/productimages)
- Fluid Commerce APIs (v1.0)

