# Visual Layout Editor - Master Plan

## Overview
Build a professional visual editor that allows precise positioning, sizing, and rotation of layout elements while preserving the perfect existing designs and keeping brand colors/text centralized.

## Architecture Strategy

### Hybrid Data Model
- **TypeScript spec files** = Immutable source of truth (your perfect designs)
- **Database overrides** = User customizations via visual editor
- **Precedence chain**: SKU override → Master override → Spec default

### Key Principles
1. Never modify spec files programmatically
2. All edits are non-destructive (can reset to spec defaults)
3. Brand colors/fonts stay centralized - only position/size/rotation editable
4. Live preview matches exact export output
5. Pixel-perfect precision (snap to grid, measurement tools)

---

## Phase 1: Data Foundation

### Database Schema Updates

#### New Table: `layout_master_overrides`
```sql
- id
- layout_key (string: 'bigStat', 'testimonial', etc.)
- element_key (string: 'headline', 'productImage', etc.)
- position_x (number, nullable)
- position_y (number, nullable)
- width (number, nullable)
- height (number, nullable)
- rotation (number, nullable)
- created_at
- updated_at
```

#### Update SKUs Table
```sql
ADD COLUMN position_overrides JSONB
-- Structure: { layoutKey: { elementKey: { x, y, width, height, rotation } } }
```

### TypeScript Types

#### New Types (`types/layout-editor.ts`)
```typescript
interface ElementOverride {
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
}

interface LayoutOverrides {
  [elementKey: string]: ElementOverride
}

interface SKUPositionOverrides {
  [layoutKey: string]: LayoutOverrides
}
```

---

## Phase 2: Per-SKU Visual Editor

### 2.1 Visual Edit Mode Toggle

**Location**: SKU Editor Drawer (right side of current editor)

**Features**:
- Toggle button "Edit Layout" / "Edit Content"
- When active:
  - Preview becomes interactive
  - Elements get selection borders
  - Toolbar appears with controls

### 2.2 Element Selection System

**Interaction Pattern**:
1. Click element to select (highlight with blue border)
2. Show position/size in toolbar
3. Enable drag and resize handles
4. Show rotation handle

**Visual Feedback**:
- Selected: Blue border + handles
- Hover: Light blue highlight
- Locked: Gray out (images, backgrounds - optional)

### 2.3 Drag & Drop Implementation

**Library**: Use `@dnd-kit/core` (already installed)

**Features**:
- Click and drag to reposition
- Hold Shift to constrain to axis
- Show coordinates while dragging
- Snap to 5px grid (toggleable)

**Technical Approach**:
```typescript
// Wrap editable elements with DraggableElement
<DraggableElement
  id={`${layoutKey}-${elementKey}`}
  position={{ x: currentX, y: currentY }}
  onPositionChange={(newPos) => handlePositionChange(elementKey, newPos)}
>
  {/* Original element */}
</DraggableElement>
```

### 2.4 Resize Handles

**Implementation**:
- 8 resize handles (corners + midpoints)
- Maintain aspect ratio with Shift
- Live preview while resizing
- Min/max constraints per element type

### 2.5 Rotation Control

**UI**:
- Rotation handle at top-center
- Rotate around element center
- Snap to 15° increments (hold Shift to disable)
- Show angle indicator

### 2.6 Toolbar Controls

**Location**: Floating toolbar above canvas

**Controls**:
- **Position**: X, Y inputs with ±1px buttons
- **Size**: W, H inputs with aspect ratio lock
- **Rotation**: Angle input with reset button
- **Alignment**: Align left/center/right, top/middle/bottom
- **Grid**: Toggle snap-to-grid
- **Reset**: Reset element to spec default

### 2.7 Save & Apply

**Save Flow**:
1. User makes changes in visual mode
2. "Save Layout Changes" button appears
3. Click to save → Updates SKU's `position_overrides` field
4. Success toast: "Layout saved! Changes will appear in exports."

**Data Saved**:
```json
{
  "bigStat": {
    "headline": { "y": 700 },
    "ingredient1": { "x": 30, "y": 120, "rotation": 5 }
  }
}
```

---

## Phase 3: Render Engine Integration

### 3.1 Position Override Resolution

**New Function** (`lib/layout-utils.ts`):
```typescript
function resolveElementPosition(
  layoutKey: string,
  elementKey: string,
  spec: any,
  skuOverrides?: SKUPositionOverrides,
  masterOverrides?: LayoutMasterOverride[]
): ElementPosition {
  // 1. Start with spec default
  let position = spec.elements[elementKey]
  
  // 2. Apply master override if exists
  const masterOverride = masterOverrides?.find(...)
  if (masterOverride) {
    position = { ...position, ...masterOverride }
  }
  
  // 3. Apply SKU override if exists
  const skuOverride = skuOverrides?.[layoutKey]?.[elementKey]
  if (skuOverride) {
    position = { ...position, ...skuOverride }
  }
  
  return position
}
```

### 3.2 Update Layout Components

**Pattern**: Each layout component checks for overrides

```typescript
// Before:
const headlineTop = spec.elements.headline.top

// After:
const headlinePosition = resolveElementPosition(
  'bigStat', 'headline', spec, sku.positionOverrides
)
const headlineTop = headlinePosition.top
```

**Implementation Strategy**:
- Create HOC: `withPositionOverrides(LayoutComponent)`
- Automatically injects resolved positions
- No changes needed to layout logic

---

## Phase 4: Master Layout Editor

### 4.1 New Route: `/layouts/edit`

**Navigation**:
- Add to main sidebar under "Layout Manager" or similar
- Shows grid of all 14 layouts
- Click one to open editor

### 4.2 Master Editor UI

**Layout**:
```
┌─────────────────────────────────────────┐
│  [< Back]  Layout: Big Stat    [Save]   │
├──────────────┬──────────────────────────┤
│              │                          │
│  Element     │                          │
│  Tree        │    Canvas Preview        │
│              │    (1080x1080)           │
│  - Headline  │                          │
│  - Stats     │                          │
│  - Images    │                          │
│  ...         │                          │
│              │                          │
└──────────────┴──────────────────────────┘
```

**Features**:
- Same visual editing as per-SKU mode
- Changes save to `layout_master_overrides` table
- All SKUs inherit these changes (unless they have overrides)
- "Reset to Original Spec" button

### 4.3 Element Tree (Left Sidebar)

**Purpose**: 
- List all elements in layout
- Click to select
- Toggle visibility
- Lock/unlock for editing
- Show which have overrides (badge)

**UI**:
```
□ Headline (overridden)
□ Stat Value
□ Product Image
□ Ingredient 1 (overridden)
  □ Image
  □ Label
```

### 4.4 Save to Database

**Flow**:
1. User edits master layout
2. Click "Save Master Layout"
3. Upsert to `layout_master_overrides` table
4. Show affected SKU count
5. Invalidate preview cache

---

## Phase 5: Polish & UX

### 5.1 Undo/Redo

**Implementation**:
- Track history stack
- Cmd+Z / Cmd+Shift+Z
- Max 50 steps

### 5.2 Keyboard Shortcuts

- **Arrow keys**: Move 1px
- **Shift + Arrow**: Move 10px
- **Alt + Arrow**: Resize 1px
- **Cmd + D**: Duplicate element
- **Delete**: Reset to default
- **Cmd + /**: Show keyboard shortcuts

### 5.3 Measurement Tools

- Show distances between elements
- Smart guides when aligning
- Ruler overlays
- Pixel coordinates on hover

### 5.4 Preview Mode Toggle

**Three modes**:
1. **Edit Mode**: Interactive, handles visible
2. **Preview Mode**: Shows final output, no handles
3. **Compare Mode**: Side-by-side with spec default

### 5.5 Batch Operations

**Master Editor Only**:
- "Apply to All Layouts" (e.g., move all headlines down 10px)
- "Copy Position From..." (copy element position across layouts)

---

## Phase 6: Quality Assurance

### 6.1 Validation Rules

**Constraints**:
- Elements can't go outside canvas (0-1080px)
- Min/max size per element type
- Warn if text might overflow
- Check if images are occluded

### 6.2 Export Verification

**Test Suite**:
- Export with overrides applied
- Compare to preview
- Ensure pixel-perfect match
- Test all 14 layouts

### 6.3 Reset Functionality

**Per Element**: "Reset to Default"
**Per Layout**: "Reset All Elements"
**Per SKU**: "Reset Layout Overrides"
**Global**: "Reset Master Overrides"

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. Add database schema
2. Update TypeScript types
3. Create `resolveElementPosition` utility
4. Test with one layout manually

### Week 2: Per-SKU Editor
5. Build visual edit mode toggle
6. Implement drag & drop for text elements
7. Add resize handles
8. Add rotation control
9. Build toolbar controls
10. Save to SKU overrides

### Week 3: Render Engine
11. Update all 14 layout components to use overrides
12. Test exports match preview
13. Handle edge cases

### Week 4: Master Editor
14. Build `/layouts/edit` page
15. Create element tree sidebar
16. Implement save to master overrides
17. Show affected SKU count

### Week 5: Polish
18. Add undo/redo
19. Keyboard shortcuts
20. Measurement tools
21. Validation rules
22. Documentation

---

## Success Criteria

✅ **Functional**:
- User can visually adjust any element position/size/rotation
- Changes save and persist
- Exports match adjusted preview exactly
- No degradation to existing layouts

✅ **UX**:
- Intuitive drag and drop
- Precise control with inputs
- Clear visual feedback
- Fast performance (no lag)

✅ **Technical**:
- Non-destructive edits
- Can reset to spec defaults
- Master overrides cascade properly
- Database queries optimized

---

## Files to Create/Modify

### New Files
- `types/layout-editor.ts` - TypeScript types
- `lib/layout-utils.ts` - Override resolution logic
- `components/layout-editor/VisualEditor.tsx` - Main editor component
- `components/layout-editor/DraggableElement.tsx` - Drag wrapper
- `components/layout-editor/ElementToolbar.tsx` - Controls
- `components/layout-editor/ElementTree.tsx` - Left sidebar
- `app/layouts/edit/page.tsx` - Master editor page
- `supabase-layout-overrides.sql` - DB schema

### Modified Files
- `types/sku.ts` - Add positionOverrides field
- `lib/supabase.ts` - Add layout override queries
- `app/brands/[id]/skus/[skuId]/page.tsx` - Add visual mode toggle
- All 14 layout components - Use override resolution

### Database Queries Needed
- `getLayoutMasterOverrides(layoutKey)`
- `saveLayoutMasterOverride(layoutKey, elementKey, overrides)`
- `deleteLayoutMasterOverride(layoutKey, elementKey)`
- `getSKUWithOverrides(skuId)`
- `updateSKUPositionOverrides(skuId, overrides)`

---

## Risk Mitigation

### Risk: Breaking Existing Layouts
**Mitigation**: 
- All changes are additive (overrides only)
- Comprehensive testing before rollout
- Feature flag to disable editor

### Risk: Performance with Many Overrides
**Mitigation**:
- Index database properly
- Cache resolved positions
- Lazy load override data

### Risk: Complex UI State Management
**Mitigation**:
- Use Zustand for editor state
- Clear separation of concerns
- Unit tests for override resolution

---

## Future Enhancements (Post-MVP)

- **Templates**: Save common position sets as templates
- **Responsive**: Different positions for different sizes
- **Animation**: Add entrance animations per element
- **Collaboration**: Multiple users editing same layout
- **Version History**: See previous versions, restore
- **AI Assist**: "Make this look more balanced" suggestions

