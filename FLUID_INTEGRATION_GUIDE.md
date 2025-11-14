# Fluid Integration Guide

## Overview

Your social post generator is now fully integrated with **Fluid's ecosystem**, giving you access to:

1. **Digital Asset Management (DAM)** - Pull product images
2. **Products API** - Import SKUs and product details
3. **Media Upload API** - Push generated posts back to Fluid

---

## 🎯 What You Can Do

### 1. Pull Images from Fluid DAM

**Already Implemented!** ✅

- Browse and select images from Fluid's DAM
- Used throughout the app for:
  - Product images
  - Lifestyle photos
  - Background images
  - Testimonial photos

**How to Use:**
- In any SKU editor, click "Browse DAM" next to image fields
- Search and select images from your Fluid media library

---

### 2. Import Products/SKUs from Fluid

**Just Added!** 🆕

Pull complete product information including:
- Product titles and descriptions
- SKU codes
- Pricing information
- Product images
- Variants (sizes, colors, etc.)
- Metadata and tags

**API Endpoints:**

```typescript
// Get all products
GET /api/fluid-dam/products
  ?page=1
  &per_page=50
  &search=peptide
  &apiToken=<brand_token>
  &baseUrl=<brand_url>

// Get single product
GET /api/fluid-dam/products/{id or slug}
  ?apiToken=<brand_token>
  &baseUrl=<brand_url>
```

**Response Format:**

```json
{
  "products": [
    {
      "id": "123",
      "slug": "collagen-peptides",
      "title": "Collagen Peptides",
      "sku": "COL-001",
      "description": "Premium collagen supplement...",
      "price": 39.99,
      "currency": "USD",
      "images": [
        { "url": "https://...", "alt": "Product image" }
      ],
      "mainImage": "https://...",
      "variants": [
        {
          "id": "456",
          "sku": "COL-001-VANILLA",
          "title": "Vanilla Flavor",
          "price": 39.99
        }
      ],
      "collections": [
        { "id": "789", "name": "Supplements" }
      ],
      "tags": ["bestseller", "peptides"]
    }
  ],
  "total": 42,
  "page": 1,
  "per_page": 50
}
```

**How to Use in Your App:**

```typescript
import { FluidProductBrowser } from '@/components/FluidProductBrowser'

// In your component:
const [productBrowserOpen, setProductBrowserOpen] = useState(false)

function handleProductImport(product: FluidProduct) {
  // Create SKU with product data
  const newSKU = {
    brandId: currentBrand.id,
    name: product.title,
    productInformation: product.description,
    images: {
      productPrimary: product.mainImage,
      // Map additional images...
    },
    copy: {
      // Pre-populate with product info
    }
  }
  
  skuService.create(newSKU)
}

// In JSX:
<Button onClick={() => setProductBrowserOpen(true)}>
  Import from Fluid
</Button>

<FluidProductBrowser
  open={productBrowserOpen}
  onClose={() => setProductBrowserOpen(false)}
  onSelect={handleProductImport}
  brandFluidDam={brand.fluidDam}
/>
```

---

### 3. Push Generated Posts Back to Fluid

**Just Added!** 🆕

Upload your generated social posts back to Fluid's DAM and optionally attach them to products.

**API Endpoint:**

```typescript
// Upload image to Fluid DAM
POST /api/fluid-dam/media/upload
Content-Type: multipart/form-data

FormData:
  - file: Blob (the image)
  - title: string (optional)
  - productId: string (optional - auto-attach to product)
  - apiToken: string (optional - brand-specific)
  - baseUrl: string (optional - brand-specific)

// Attach existing media to product
PATCH /api/fluid-dam/media/upload
Content-Type: application/json

Body:
{
  "mediaId": "123",
  "productId": "456",
  "apiToken": "...",
  "baseUrl": "..."
}
```

**Example Usage:**

```typescript
// After generating and rendering a post:
async function uploadToFluid(blob: Blob, skuName: string, productId?: string) {
  const formData = new FormData()
  formData.append('file', blob, `${skuName}_social_post.png`)
  formData.append('title', `${skuName} - Social Media Post`)
  
  if (productId) {
    formData.append('productId', productId)
  }
  
  if (brand.fluidDam?.apiToken) {
    formData.append('apiToken', brand.fluidDam.apiToken)
  }
  if (brand.fluidDam?.baseUrl) {
    formData.append('baseUrl', brand.fluidDam.baseUrl)
  }
  
  const response = await fetch('/api/fluid-dam/media/upload', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  console.log('Uploaded to Fluid:', result.media.url)
}

// Use after rendering:
const blob = await renderLayoutFromElement(layoutRef.current, { format: 'png' })
await uploadToFluid(blob, sku.name, fluidProductId)
```

---

## 🔧 Configuration

### Brand-Specific Setup

Each brand can have its own Fluid credentials:

```typescript
// In Brand type (types/brand.ts)
interface Brand {
  // ... other fields
  fluidDam?: {
    apiToken?: string
    baseUrl?: string    // e.g., "https://makewellness.fluid.app"
  }
}
```

### Global Fallback

If brand-specific credentials aren't provided, the app falls back to global environment variables:

```bash
# .env.local
FLUID_API_TOKEN=your_api_token_here
FLUID_API_BASE_URL=https://myco.fluid.app
```

---

## 📋 Typical Workflow

### Scenario 1: Creating New SKU from Fluid Product

1. Go to Brand detail page
2. Click "Import from Fluid" button
3. Search for product in Fluid catalog
4. Select product → imports as new SKU
5. Product info, images, and details auto-populate
6. Generate copy with AI using imported product info
7. Create social posts with all layouts
8. (Optional) Push generated posts back to Fluid DAM

### Scenario 2: Pushing Posts to Fluid

1. Edit SKU and generate layouts
2. Click "Download All" to render all layouts
3. (New) Add "Upload to Fluid" option
4. Uploads all generated posts to Fluid DAM
5. Optionally attaches them to the source product
6. Marketing team can now access posts in Fluid

---

## 🚀 Next Steps: Recommended Enhancements

### 1. Add "Import from Fluid" Button to Brand Page

```typescript
// In app/brands/[id]/page.tsx
<Button onClick={() => setProductBrowserOpen(true)}>
  <Download className="mr-2 h-4 w-4" />
  Import from Fluid
</Button>
```

### 2. Add "Upload to Fluid" in SKU Editor

```typescript
// In downloadAll() function, add after rendering:
async function downloadAndUploadToFluid() {
  // Render layouts as usual
  const blob = await renderLayoutFromElement(ref.current, options)
  
  // Also upload to Fluid
  await uploadToFluid(blob, layoutName, fluidProductId)
}
```

### 3. Sync Products Automatically

Create a background sync that:
- Periodically checks Fluid for new products
- Auto-creates SKUs for new products
- Updates existing SKUs if product details change

### 4. Two-Way Sync for Images

- When uploading to Fluid, store the Fluid media ID
- Allow selecting "generated posts" from Fluid DAM
- Keep track of which posts were generated vs. original assets

---

## 🔑 Key Benefits

✅ **Single Source of Truth** - Product data lives in Fluid  
✅ **No Manual Data Entry** - Import products with one click  
✅ **Centralized Assets** - All images (original + generated) in Fluid DAM  
✅ **Team Collaboration** - Generated posts accessible to whole team  
✅ **Version Control** - Track generated posts in Fluid's media library  
✅ **Cross-Platform** - Use generated posts across all marketing channels  

---

## 📚 API Documentation

For more details, refer to:
- [Fluid Products API Docs](https://docs.fluid.app/docs/apis/fluid.api/products)
- [Fluid Media API Docs](https://docs.fluid.app/docs/apis/public)
- Fluid API: `https://<your-brand>.fluid.app/api`

---

## 🐛 Troubleshooting

### "Fluid API token not configured"
- Check brand-specific settings: Brand → Edit → Fluid DAM Configuration
- Or set global env vars: `FLUID_API_TOKEN` and `FLUID_API_BASE_URL`

### "No products found"
- Verify API token has correct permissions
- Check baseUrl format: `https://brand.fluid.app` (no trailing slash)
- Try the Fluid API directly to test credentials

### Upload fails
- File size limits may apply (check Fluid docs)
- Ensure image format is supported (PNG, JPG, WebP)
- Verify product ID is valid when attaching to products

---

## 💡 Pro Tips

1. **Store Fluid Product IDs**: When importing products, save the Fluid product ID in your SKU metadata. This allows easy re-syncing and attachment of generated posts.

2. **Naming Convention**: Use consistent naming for uploaded posts:
   ```
   {brand_name}_{sku_name}_{layout_type}_{date}.png
   ```

3. **Batch Operations**: When uploading multiple posts, do it in parallel:
   ```typescript
   await Promise.all(
     layouts.map(layout => uploadToFluid(layout.blob, layout.name))
   )
   ```

4. **Error Handling**: Always wrap Fluid API calls in try-catch and show user-friendly messages.

---

Happy generating! 🎨✨

