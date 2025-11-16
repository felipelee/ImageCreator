# Layout Rendering Gold Standard

**Last Updated:** November 16, 2025

This document establishes the gold standard implementation pattern for layout components to ensure 1:1 matching between the visual editor, live preview, and exported images.

---

## Core Principle: One Render Path, One Truth

**All rendering uses dom-to-image-more on React components. We do NOT use Satori.**

### Why Not Satori?

- Satori requires separate implementations that duplicate layout logic
- Maintaining two codebases (React + Satori) leads to drift and mismatches
- Satori doesn't support:
  - Position overrides from visual editor
  - Custom elements
  - Advanced color override system
  - Complex layout features (lucide-react icons, etc.)

### The Single Source of Truth

```
Visual Editor Modal → Uses React Component (Editable version)
         ↓
Drawer Preview → Uses React Component (Non-editable version)
         ↓
Export/Download → Uses dom-to-image-more on React Component (Non-editable version)
```

All three must render the **same component** with the **same data** to ensure 1:1 matching.

---

## The Problem: Container vs. Individual Positioning

### ❌ WRONG Implementation (Container Pattern)

**Symptoms:**
- Elements positioned in visual editor don't match preview/export
- Moving elements in editor has no effect on final output
- Position overrides are ignored

**Code Pattern:**
```tsx
// ❌ DON'T DO THIS - Uses container with flex/grid
<div style={{
  position: 'absolute',
  top: spec.elements.container.top,  // Fixed container position
  left: spec.elements.container.left,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
}}>
  {items.map((item, index) => (
    <div style={{
      display: 'flex',              // ❌ No position!
      flexDirection: 'row'           // ❌ No top/left!
    }}>
      {/* item content */}
    </div>
  ))}
</div>
```

**Why This Breaks:**
- Items are positioned by flex/grid layout, not absolute positioning
- `resolveElementPosition()` is never called for individual items
- User's position overrides from visual editor are completely ignored
- Visual editor shows `top: 442px, left: 487px` but export shows flex positioning

---

### ✅ CORRECT Implementation (Individual Positioning)

**Code Pattern:**
```tsx
// ✅ DO THIS - Resolve positions for each element
const item1Pos = resolveElementPosition('layoutKey', 'item1', {
  top: 392,
  left: 487,
  x: 487,
  y: 392,
  width: 500,
  height: 150,
  zIndex: 30
}, sku.positionOverrides)

const item2Pos = resolveElementPosition('layoutKey', 'item2', {
  top: 592,
  left: 487,
  x: 487,
  y: 592,
  width: 500,
  height: 150,
  zIndex: 30
}, sku.positionOverrides)

// Render each individually with absolute positioning
{renderItem(items[0], item1Pos)}
{renderItem(items[1], item2Pos)}

// Helper function
const renderItem = (item: ItemType, pos: any) => {
  return (
    <div style={{
      position: 'absolute',           // ✅ Absolute positioning
      top: pos.top,                   // ✅ Uses resolved position
      left: pos.left,
      width: pos.width,
      height: pos.height,
      zIndex: pos.zIndex ?? 30,
      transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined,
      display: 'flex',
      flexDirection: 'row',
      // ... other styles
    }}>
      {/* item content */}
    </div>
  )
}
```

**Why This Works:**
- Each element gets its own absolute position
- `resolveElementPosition()` applies user's overrides from visual editor
- Position, rotation, z-index all respected
- Visual editor, preview, and export all use the same resolved positions

---

## Gold Standard Checklist

### For Every Repeated Element in a Layout

- [ ] Each element has its own `resolveElementPosition()` call
- [ ] Default positions include: `top`, `left`, `x`, `y`, `width`, `height`, `zIndex`
- [ ] Elements rendered individually (not in a `.map()` container)
- [ ] Each element uses `position: 'absolute'`
- [ ] Position properties use resolved values: `pos.top`, `pos.left`, etc.
- [ ] Rotation applied: `transform: pos.rotation ? 'rotate(...)' : undefined`
- [ ] Z-index uses fallback: `zIndex: pos.zIndex ?? defaultZIndex`

### Layout Pairs Must Match

Every layout has TWO components:
1. **Non-Editable** (e.g., `BottleListLayout.tsx`) - Used for preview and export
2. **Editable** (e.g., `BottleListLayoutEditable.tsx`) - Used for visual editor

**Critical Rule:** The positioning logic must be IDENTICAL in both versions.

**Editable Version:**
```tsx
const benefit1Pos = resolveElementPosition('bottleList', 'benefit1', defaults, sku.positionOverrides)
// ... uses benefit1Pos for positioning
```

**Non-Editable Version (Preview/Export):**
```tsx
const benefit1Pos = resolveElementPosition('bottleList', 'benefit1', defaults, sku.positionOverrides)
// ... uses benefit1Pos for positioning (SAME AS EDITABLE)
```

---

## Examples: Fixed Layouts

### ✅ BottleListLayout.tsx

**Before (Broken):**
```tsx
<div style={{ position: 'absolute', top: 392, left: 487 }}>
  {benefits.map((benefit, index) => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* ❌ No individual positioning */}
    </div>
  ))}
</div>
```

**After (Fixed):**
```tsx
// Resolve positions
const benefit1Pos = resolveElementPosition('bottleList', 'benefit1', { 
  top: 392, left: 487, x: 487, y: 392, width: 500, height: 150, zIndex: 30 
}, sku.positionOverrides)
const benefit2Pos = resolveElementPosition('bottleList', 'benefit2', { 
  top: 592, left: 487, x: 487, y: 592, width: 500, height: 150, zIndex: 30 
}, sku.positionOverrides)
const benefit3Pos = resolveElementPosition('bottleList', 'benefit3', { 
  top: 792, left: 487, x: 487, y: 792, width: 500, height: 150, zIndex: 30 
}, sku.positionOverrides)

// Render individually
{renderBenefit(benefits[0], benefit1Pos)}
{renderBenefit(benefits[1], benefit2Pos)}
{renderBenefit(benefits[2], benefit3Pos)}
```

### ✅ MultiStatsLayout.tsx

**Before (Broken):**
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
  {stats.map(stat => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* ❌ No individual positioning */}
    </div>
  ))}
</div>
```

**After (Fixed):**
```tsx
const stat1Pos = resolveElementPosition('multiStats', 'stat1', { 
  top: 285, left: 657, x: 657, y: 285, width: 393, zIndex: 20 
}, sku.positionOverrides)
const stat2Pos = resolveElementPosition('multiStats', 'stat2', { 
  top: 549, left: 652, x: 652, y: 549, width: 351, zIndex: 20 
}, sku.positionOverrides)
const stat3Pos = resolveElementPosition('multiStats', 'stat3', { 
  top: 796, left: 650, x: 650, y: 796, width: 420, zIndex: 20 
}, sku.positionOverrides)

{renderStat(stats[0], stat1Pos)}
{renderStat(stats[1], stat2Pos)}
{renderStat(stats[2], stat3Pos)}
```

### ✅ ComparisonLayout.tsx

**Before (Broken):**
```tsx
<div style={{ position: 'absolute', top: 340, left: 75 }}>
  {rows.map((row, index) => (
    <div style={{ position: 'relative', marginTop: index > 0 ? '16px' : 0 }}>
      {/* ❌ Relative positioning with margins */}
    </div>
  ))}
</div>
```

**After (Fixed):**
```tsx
const row1Pos = resolveElementPosition('compare', 'row1', spec.elements.row1, sku.positionOverrides)
const row2Pos = resolveElementPosition('compare', 'row2', spec.elements.row2, sku.positionOverrides)
const row3Pos = resolveElementPosition('compare', 'row3', spec.elements.row3, sku.positionOverrides)
const row4Pos = resolveElementPosition('compare', 'row4', spec.elements.row4, sku.positionOverrides)

{[
  { row: rows[0], pos: row1Pos },
  { row: rows[1], pos: row2Pos },
  { row: rows[2], pos: row3Pos },
  { row: rows[3], pos: row4Pos }
].map(({ row, pos }, index) => (
  <div style={{
    position: 'absolute',     // ✅ Absolute positioning
    top: pos.top,             // ✅ Individual position
    left: pos.left,
    transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined,
    zIndex: pos.zIndex ?? 20
  }}>
    {/* row content */}
  </div>
))}
```

---

## When Containers Are OK

Some layouts intentionally use containers for repeated elements that don't need individual positioning:

### ✅ Intentional Container Use

**SocialProofLayout.tsx** - Review cards
```tsx
{/* Reviews - Static (don't need individual editing) */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
  {reviews.map(review => (
    <div>{/* Review card */}</div>
  ))}
</div>
```

**FeatureGridLayout.tsx** - Feature grid
```tsx
{/* Feature Grid - Static (cards don't need individual editing) */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
  {features.map(feature => (
    <div>{/* Feature card */}</div>
  ))}
</div>
```

**When to use containers:**
- Elements are decorative/content-only (not layout critical)
- Users don't need to move individual items
- The editable version also uses a container (intentional design)
- Both editable and non-editable versions match exactly

**Rule:** If the editable version has comments like "Static (don't need individual editing)", containers are OK. Otherwise, use individual positioning.

---

## Testing Procedure

After implementing or modifying a layout, test the following to ensure 1:1 matching:

### 1. Visual Editor Modal Test
1. Open the layout in visual editor
2. Select an element (e.g., "benefit3")
3. Note its position in the browser inspector
4. Example: `top: 442px; left: 487px; width: 500px; height: 150px`

### 2. Drawer Preview Test
1. With the modal open, inspect the drawer preview
2. Find the same element in the preview
3. Verify it has THE SAME position values
4. Should see: `top: 442px; left: 487px; width: 500px; height: 150px`

### 3. Position Override Test
1. Move the element in visual editor (drag it to new position)
2. Drawer preview should update immediately
3. Modal shows new position: `top: 500px; left: 600px`
4. Drawer shows same position: `top: 500px; left: 600px`

### 4. Export Test
1. Download the layout
2. The exported image should match the drawer preview exactly
3. Element should be at the overridden position, not default position

### 5. Rotation Test
1. Rotate an element in visual editor
2. Modal shows: `transform: rotate(15deg)`
3. Drawer shows: `transform: rotate(15deg)`
4. Export shows rotated element

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to Import
```tsx
// ❌ Missing import
import { getFieldColorValue } from '@/lib/color-utils'
// Layout won't compile or won't resolve positions
```

```tsx
// ✅ Correct imports
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
```

### ❌ Pitfall 2: Using Spec Defaults Directly
```tsx
// ❌ Using spec directly (ignores overrides)
<div style={{
  position: 'absolute',
  top: spec.elements.benefit1.top,    // ❌ Always uses default
  left: spec.elements.benefit1.left
}}>
```

```tsx
// ✅ Using resolved position (respects overrides)
const benefit1Pos = resolveElementPosition('layout', 'benefit1', spec.elements.benefit1, sku.positionOverrides)
<div style={{
  position: 'absolute',
  top: benefit1Pos.top,    // ✅ Uses override if available
  left: benefit1Pos.left
}}>
```

### ❌ Pitfall 3: Forgetting Z-Index
```tsx
// ❌ No z-index (elements may stack incorrectly)
<div style={{
  position: 'absolute',
  top: pos.top,
  left: pos.left
}}>
```

```tsx
// ✅ Z-index with fallback
<div style={{
  position: 'absolute',
  top: pos.top,
  left: pos.left,
  zIndex: pos.zIndex ?? 30    // ✅ Uses override or default
}}>
```

### ❌ Pitfall 4: Forgetting Rotation
```tsx
// ❌ No rotation support
<div style={{
  position: 'absolute',
  top: pos.top,
  left: pos.left
}}>
```

```tsx
// ✅ Rotation support
<div style={{
  position: 'absolute',
  top: pos.top,
  left: pos.left,
  transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined
}}>
```

### ❌ Pitfall 5: Inconsistent Element Keys
```tsx
// ❌ Different keys in editable vs non-editable
// Editable: 'benefit1'
// Non-editable: 'benefitOne'
// Overrides won't match!
```

```tsx
// ✅ Identical keys in both versions
// Editable: resolveElementPosition('bottleList', 'benefit1', ...)
// Non-editable: resolveElementPosition('bottleList', 'benefit1', ...)
```

---

## Implementation Workflow

### When Creating a New Layout

1. **Create Spec File** (`/lib/layouts/specs/layout-name-spec.ts`)
   - Define all element positions with individual keys
   - Include repeated elements as separate entries (`benefit1`, `benefit2`, `benefit3`)

2. **Create Non-Editable Component** (`/components/layouts/LayoutName.tsx`)
   - Import `resolveElementPosition`
   - Resolve position for every element that can be moved
   - Use absolute positioning with resolved positions
   - Apply rotation and z-index

3. **Create Editable Component** (`/components/layouts/LayoutNameEditable.tsx`)
   - Copy positioning logic from non-editable version
   - Add editable props wrapper
   - Use IDENTICAL element keys and position resolution

4. **Test 1:1 Matching**
   - Follow testing procedure above
   - Verify modal, drawer, and export all match

### When Fixing an Existing Layout

1. **Identify the Issue**
   - Check if editable version has individual positioning
   - Check if non-editable version uses container pattern
   - Look for missing `resolveElementPosition` calls

2. **Add Position Resolution**
   - Copy position resolution from editable version
   - Add `resolveElementPosition` for each repeated element

3. **Replace Container Pattern**
   - Remove `.map()` container
   - Create helper render function
   - Render each element individually with absolute positioning

4. **Test and Verify**
   - Position an element in editor
   - Check drawer preview matches
   - Export and verify matches preview

---

## File Structure Reference

```
/components/layouts/
├── LayoutName.tsx              ← Non-editable (for preview/export)
├── LayoutNameEditable.tsx      ← Editable (for visual editor)

/lib/layouts/specs/
├── layout-name-spec.ts         ← Position definitions

Key Functions:
- resolveElementPosition()      ← Merges spec defaults with overrides
- getFieldColorValue()          ← Resolves color overrides
- combineTransforms()           ← Combines rotation transforms
```

---

## Key Learnings Summary

### ✅ DO
- Use dom-to-image-more for all rendering
- Resolve positions individually for repeated elements
- Use absolute positioning with resolved positions
- Match element keys exactly between editable/non-editable
- Apply rotation and z-index from resolved positions
- Test modal → drawer → export for 1:1 matching

### ❌ DON'T
- Use Satori (creates separate implementations that drift)
- Use containers with `.map()` for positionable elements
- Use spec defaults directly (bypasses overrides)
- Forget to import `resolveElementPosition`
- Use different element keys in editable vs non-editable
- Skip testing 1:1 matching

---

## Conclusion

**The Golden Rule:** If users can move it in the visual editor, the layout component must use `resolveElementPosition()` and absolute positioning for that element.

**The Test:** Visual editor modal styles should match drawer preview styles which should match exported image. If they don't match, the implementation is wrong.

**The Fix:** Replace container patterns with individual position resolution and absolute positioning.

---

**Document Status:** ✅ Current as of November 16, 2025
**Fixed Layouts:** BottleListLayout, MultiStatsLayout, ComparisonLayout
**Verified Correct:** BigStatLayout, SocialProofLayout (intentional), FeatureGridLayout (intentional)

