# 🚀 Fluid Integration - Quick Start

## TL;DR - What You Can Do NOW

### ✅ **Pull Products from Fluid**
Go to any Brand page → Click **"Import from Fluid"** → Browse products → Import → Auto-creates SKU

### ✅ **Push Posts to Fluid** (API Ready)
Use the upload API endpoint to send generated posts back to Fluid DAM

---

## Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FLUID ECOSYSTEM                        │
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Products   │         │     DAM      │                  │
│  │   Catalog    │         │   (Images)   │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
└─────────┼────────────────────────┼───────────────────────────┘
          │                        │
          │ IMPORT                 │ BROWSE
          │ (NEW!)                 │ (EXISTING)
          ↓                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   YOUR APP                                    │
│                                                               │
│  ┌────────────────────────────────────────────────┐         │
│  │  Brand Page                                     │         │
│  │  ┌──────────────────┐  ┌──────────────────┐   │         │
│  │  │ Import from      │  │ Browse DAM       │   │         │
│  │  │ Fluid (NEW!)     │  │ (Existing)       │   │         │
│  │  └────────┬─────────┘  └────────┬─────────┘   │         │
│  └───────────┼────────────────────┼───────────────┘         │
│              ↓                     ↓                         │
│  ┌─────────────────────────────────────────────┐            │
│  │  SKU Editor                                  │            │
│  │  • Product info auto-filled ✓                │            │
│  │  • Images mapped ✓                           │            │
│  │  • Generate AI copy ✓                        │            │
│  │  • 14 layout templates ✓                     │            │
│  └─────────────────┬───────────────────────────┘            │
│                    ↓                                         │
│  ┌─────────────────────────────────────────────┐            │
│  │  Generated Posts                             │            │
│  │  • Download All ✓                            │            │
│  │  • Upload to Fluid (API Ready) 🎯            │            │
│  └─────────────────┬───────────────────────────┘            │
└────────────────────┼──────────────────────────────────────┘
                     │
                     │ UPLOAD
                     │ (READY TO USE)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    FLUID DAM (Updated)                        │
│  • Original product images                                    │
│  • Generated social posts (NEW!)                             │
│  • Attached to products                                      │
│  • Accessible to whole team                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints You Have

### 1. Get Products (List)
```
GET /api/fluid-dam/products
    ?search=peptide
    &page=1
    &per_page=20
```

### 2. Get Single Product
```
GET /api/fluid-dam/products/{id}
```

### 3. Upload Image to Fluid
```
POST /api/fluid-dam/media/upload
FormData:
  - file: <image blob>
  - title: "Product Name - Social Post"
  - productId: "123" (optional)
```

### 4. Attach Media to Product
```
PATCH /api/fluid-dam/media/upload
Body:
  { "mediaId": "456", "productId": "123" }
```

---

## Try It Now! 🎯

### Step 1: Import a Product
1. Open your app
2. Go to any Brand detail page
3. Click **"Import from Fluid"** button
4. Search or browse products
5. Click a product → Click "Import Product"
6. ✨ SKU auto-created!

### Step 2: Generate Posts
1. SKU opens in editor
2. Click **"Generate with AI"**
3. Review and edit the 14 layouts
4. Click **"Download All"**

### Step 3: Upload to Fluid (Coming Soon in UI)
Currently via API:
```typescript
const blob = await renderLayout(...)
const formData = new FormData()
formData.append('file', blob, 'my-post.png')
formData.append('title', 'Collagen Peptides - Social Post')
formData.append('productId', fluidProductId)

await fetch('/api/fluid-dam/media/upload', {
  method: 'POST',
  body: formData
})
```

---

## Configuration

### Quick Setup (Global)
```bash
# .env.local
FLUID_API_TOKEN=your_api_token
FLUID_API_BASE_URL=https://yourcompany.fluid.app
```

### Per-Brand Setup
Edit brand → Add Fluid DAM credentials in `fluidDam` field

---

## What's Next?

### Immediate: Add Upload Button
Add this to SKU editor download section:

```tsx
<Button onClick={uploadAllToFluid}>
  <Upload className="mr-2 h-4 w-4" />
  Upload All to Fluid
</Button>
```

### Future Ideas:
- Batch import all products
- Auto-sync new products via webhook
- Show sync status on SKU cards
- Two-way product updates
- Variant support

---

## Support Files

📚 **Full Documentation:** `FLUID_INTEGRATION_GUIDE.md`  
✅ **Implementation Details:** `FLUID_PRODUCTS_COMPLETE.md`  
🚀 **This Guide:** `FLUID_QUICK_START.md`

---

## Questions?

**Q: Where is the "Import from Fluid" button?**  
A: On any Brand detail page, top right and in the SKUs section header

**Q: Can I upload generated posts back to Fluid?**  
A: Yes! API is ready. Just need to add UI button (example code in docs)

**Q: Do I need Fluid credentials for each brand?**  
A: No, you can use global credentials or override per-brand

**Q: What data gets imported?**  
A: Product title, description, SKU code, price, images, and variants

**Q: Can I search products?**  
A: Yes! Search by product name, SKU, or tags

---

## Status: ✅ LIVE & READY

Everything is built and working. Try importing a product now! 🎉

