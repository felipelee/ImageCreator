# Layout Spec Architecture

## Overview
Layout specifications are now **code-driven**, not database-driven. The TypeScript spec files in `lib/layouts/specs/` are the single source of truth.

## Architecture

### Source of Truth: TypeScript Spec Files
All layout specs live in:
```
lib/layouts/specs/
  ├── comparison-spec.ts
  ├── before-after-spec.ts
  ├── big-stat-spec.ts
  ├── multi-stats-spec.ts
  ├── testimonial-spec.ts
  ├── social-proof-spec.ts
  ├── promo-product-spec.ts
  ├── bottle-list-spec.ts
  ├── timeline-spec.ts
  ├── feature-grid-spec.ts
  ├── price-comparison-spec.ts
  ├── hero-spec.ts
  └── pack-hero-spec.ts
```

### How It Works

1. **SKU Editor** (`/app/brands/[id]/skus/[skuId]/page.tsx`)
   - Uses `getLayoutElements()` from `lib/layout-element-definitions.ts`
   - Loads spec from TypeScript files (via imports)
   - Stores only **overrides** in `sku.positionOverrides`

2. **Admin Layout Editor** (`/app/admin/layouts/[key]/page.tsx`)
   - Loads specs from `SPEC_MAP` (imported TypeScript files)
   - Allows visual editing via drag-and-drop
   - **Does NOT save to database**
   - Provides "Export Spec" button to copy JSON

3. **Database** (`layout_templates` table)
   - Stores only **metadata**: name, description, category, enabled
   - Does NOT store specs (or spec column is ignored)
   - Keeps URLs, copy templates, etc.

## Workflow for Updating Master Templates

### Old Way (Broken)
❌ Edit in admin → Save to database → Database drifts from code → Bugs

### New Way (Clean)
1. Open `/admin/layouts/{key}` (e.g., `/admin/layouts/comparison`)
2. Click "Open Visual Editor"
3. Drag elements to new positions
4. Click "Export Spec" (copies JSON to clipboard)
5. Paste into `lib/layouts/specs/comparison-spec.ts`
6. Commit to git
7. Deploy
8. All SKUs now inherit new defaults

## Benefits

✅ **Version Control**: All spec changes are tracked in git  
✅ **Code Review**: Spec changes go through PR process  
✅ **No Drift**: Database can't get out of sync with code  
✅ **Environment Parity**: Dev/staging/prod use same specs  
✅ **Type Safety**: TypeScript specs are type-checked  
✅ **Easy Rollback**: Just revert the commit  
✅ **Clear History**: Git log shows all spec changes

## File Structure

```typescript
// lib/layouts/specs/comparison-spec.ts
export const COMPARISON_SPEC = {
  canvas: { width: 1080, height: 1080 },
  elements: {
    background: { type: 'rectangle', top: 0, left: 0, ... },
    headline: { type: 'text', top: 115, left: 56, ... },
    leftColumn: { type: 'rectangle', top: 164, left: 546, ... },
    // ... all elements
  }
}
```

```typescript
// app/admin/layouts/[key]/page.tsx
const SPEC_MAP = {
  comparison: COMPARISON_SPEC,
  beforeAfter: BEFORE_AFTER_SPEC,
  // ... all layouts
}
```

## SKU Customization

SKUs can still override any element positions:

```typescript
// Stored in database: skus.position_overrides
{
  "comparison": {
    "headline": {
      "x": 100,
      "y": 150,
      "width": 500,
      "rotation": 5
    }
  }
}
```

The SKU editor merges:
1. Base spec from code
2. Position overrides from database
3. Custom elements from database

## Migration Notes

- Old database specs are ignored
- Admin editor now loads from code via `SPEC_MAP`
- No data migration needed - just start using new workflow
- Existing SKU overrides continue to work

## Key Files

- **Specs**: `lib/layouts/specs/*-spec.ts`
- **Element Definitions**: `lib/layout-element-definitions.ts`
- **Admin Editor**: `app/admin/layouts/[key]/page.tsx`
- **SKU Editor**: `app/brands/[id]/skus/[skuId]/page.tsx`
- **Layout Components**: `components/layouts/*Layout.tsx` and `*LayoutEditable.tsx`

