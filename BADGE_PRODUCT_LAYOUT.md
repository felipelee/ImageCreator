# Badge Product Layout - Implementation Complete

**Created:** November 16, 2025  
**Status:** ✅ Fully Integrated

## Overview

The Badge Product layout showcases a main product photo centered on a background image with 4 circular badge callouts positioned around it. Perfect for highlighting product features, certifications, or benefits visually.

## Layout Structure

```
Background Image (full canvas 1080×1080)
├── Main Product Photo (centered)
├── Badge 1 (Top Left) - Feature/Certification
├── Badge 2 (Top Right) - Feature/Certification  
├── Badge 3 (Bottom Left) - Feature/Certification
└── Badge 4 (Bottom Right) - Feature/Certification
```

## Default Positions

All elements use individual absolute positioning (following gold standard):

| Element | Position (x, y) | Size (w × h) | Z-Index |
|---------|----------------|--------------|---------|
| Background | 0, 0 | 1080 × 1080 | 0 |
| Product Image | 340, 240 | 400 × 600 | 10 |
| Badge 1 | 100, 180 | 180 × 180 | 20 |
| Badge 2 | 800, 180 | 180 × 180 | 20 |
| Badge 3 | 100, 720 | 180 × 180 | 20 |
| Badge 4 | 800, 720 | 180 × 180 | 20 |

## Image Fields

### SKU Images
- `badge1` - Badge callout image (top left)
- `badge2` - Badge callout image (top right)
- `badge3` - Badge callout image (bottom left)
- `badge4` - Badge callout image (bottom right)
- `backgroundBadgeProduct` - Background image (can also come from brand)
- `productPrimary` - Main product photo

### Brand Images
- `backgroundBadgeProduct` - Shared background image (optional)

## Files Created

### Component Files
- ✅ `/components/layouts/BadgeProductLayout.tsx` - Non-editable (for preview/export)
- ✅ `/components/layouts/BadgeProductLayoutEditable.tsx` - Editable (for visual editor)

### Configuration Files
- ✅ `/lib/layouts/specs/badge-product-spec.ts` - Position specifications
- ✅ `/lib/layout-element-definitions.ts` - Added `badgeProduct` element definitions

### Type Updates
- ✅ `/types/sku.ts` - Added badge1-4 and backgroundBadgeProduct image fields
- ✅ `/types/brand.ts` - Added backgroundBadgeProduct image field

### Integration
- ✅ `/app/brands/[id]/skus/[skuId]/page.tsx`:
  - Imported components
  - Added to copyFieldsByLayout
  - Created ref (`badgeProductRef`)
  - Added to expandedLayout type
  - Added to getAvailableLayouts()
  - Added to downloadAll layouts
  - Added to drawer preview rendering
  - Added to visual editor rendering
  - Added to hidden render targets
  - Added layoutDefaults for position initialization

## Gold Standard Compliance

✅ **Individual Positioning:** Each badge has its own `resolveElementPosition()` call

✅ **Position Overrides:** All elements support position, size, rotation, and z-index overrides

✅ **Identical Logic:** Editable and non-editable versions use the same positioning code

✅ **Transform Support:** All elements support rotation with `combineTransforms()`

✅ **Custom Elements:** Supports user-added custom elements via `CustomElementRenderer`

✅ **1:1 Matching:** Visual editor modal, drawer preview, and exports all match exactly

## Usage in Visual Editor

1. **Select Layout:** Click "Badge Product" in the SKU editor
2. **Upload Images:**
   - Background image (full canvas)
   - Main product photo
   - 4 badge callout images
3. **Position Elements:**
   - Click any badge or the product image
   - Drag to reposition
   - Resize using handles
   - Rotate as needed
4. **Export:** Download button captures exact layout with all overrides

## Example Use Cases

- **Pet Food:** Product with feature badges (Whole Food, Natural, Vet Approved, etc.)
- **Supplements:** Product with certification badges (GMP, Organic, Tested, etc.)
- **Cosmetics:** Product with benefit badges (Cruelty-Free, Vegan, Natural, etc.)
- **Food Products:** Product with quality badges (Non-GMO, Organic, Gluten-Free, etc.)

## Technical Implementation Highlights

### Spec-Based Positioning
```typescript
const badge1Pos = resolveElementPosition('badgeProduct', 'badge1', {
  top: 180, left: 100, x: 100, y: 180,
  width: 180, height: 180, zIndex: 20
}, sku.positionOverrides)
```

### Individual Rendering
```typescript
{/* Badge 1 - Top Left */}
<div style={{
  position: 'absolute',
  top: badge1Pos.top,
  left: badge1Pos.left,
  width: badge1Pos.width,
  height: badge1Pos.height,
  zIndex: badge1Pos.zIndex ?? 20,
  transform: badge1Pos.rotation ? `rotate(${badge1Pos.rotation}deg)` : undefined
}}>
  <img src={sku.images.badge1} />
</div>
```

### Editable Props
```typescript
{...getEditableProps('badge1')}  // Adds click, outline, cursor, data attributes
```

## Fallback Behavior

- Missing background → Shows placeholder at 30% opacity
- Missing product image → Shows placeholder at 30% opacity
- Missing badge → Shows placeholder at 30% opacity
- All elements still render and are editable even without images

## Layout Key

**Layout Key:** `badgeProduct`

Use this key when:
- Accessing position overrides: `sku.positionOverrides?.badgeProduct`
- Accessing custom elements: `sku.customElements?.badgeProduct`
- Referencing in code: `expandedLayout === 'badgeProduct'`

---

**Implementation Status:** ✅ Complete  
**Testing Required:** Yes - Test in SKU editor with real images  
**Gold Standard:** ✅ Fully Compliant

