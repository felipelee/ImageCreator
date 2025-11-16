# Universal Visual Editor - Clean Architecture

## Core Concept

**One Visual Editor Component** that works with ANY layout by:
1. Getting fed the layout's element definitions
2. Hydrating with brand/SKU data
3. Saving back to the appropriate storage

## Architecture

### The Universal Editor (Already Built!)

```
VisualEditorModal
├─ Accepts: layoutKey, elementDefinitions[], brand, sku
├─ Renders: Any layout component inside
├─ Provides: Drag, resize, rotate, layers panel
└─ Saves: To master OR SKU depending on context
```

### What We Need to Build

#### 1. Element Definition System

**Create:** `lib/layout-element-definitions.ts`

```typescript
export const LAYOUT_ELEMENT_DEFINITIONS = {
  statement: [
    { key: 'background', label: 'Background', type: 'background', locked: true },
    { key: 'statement', label: 'Headline Text', type: 'text' },
    { key: 'productImage', label: 'Product Image', type: 'image' },
    { key: 'benefit1', label: 'Badge: Benefit 1', type: 'container' },
    // ... etc
  ],
  testimonial: [
    { key: 'background', label: 'Background Photo', type: 'background' },
    { key: 'quoteContainer', label: 'Quote Panel', type: 'container' },
    // ... etc
  ],
  // ... all 14 layouts
}
```

#### 2. Generic Layout Wrapper

**Create:** `components/layout-editor/EditableLayoutWrapper.tsx`

```typescript
function EditableLayoutWrapper({ 
  layoutKey, 
  brand, 
  sku, 
  isEditMode,
  selectedElement,
  ...editHandlers 
}) {
  // Get the appropriate layout component
  const LayoutComponent = LAYOUT_COMPONENTS[layoutKey]
  
  // Get element definitions for this layout
  const elementDefs = LAYOUT_ELEMENT_DEFINITIONS[layoutKey]
  
  // Wrap the layout to make elements interactive
  return (
    <InteractiveLayoutContext.Provider value={{
      isEditMode,
      selectedElement,
      onSelect,
      onPositionChange,
      // ... etc
    }}>
      <LayoutComponent brand={brand} sku={sku} />
      <CustomElementRenderer customElements={...} />
    </InteractiveLayoutContext.Provider>
  )
}
```

#### 3. Update All Layout Components

**Pattern for Each Layout:**

```typescript
// BenefitsLayout.tsx
export function BenefitsLayout({ brand, sku }) {
  // Use context to check if we're in edit mode
  const { isEditMode, selectedElement, onSelect } = useEditableLayout()
  
  // Resolve positions (works in both edit and preview mode)
  const headlinePos = resolveElementPosition('benefits', 'headline', SPEC.headline, sku.positionOverrides)
  
  // Render with conditional edit props
  return (
    <div>
      <h1 
        {...getEditableProps('headline')}  // Auto-adds click handlers if in edit mode
        style={{ 
          top: headlinePos.top, 
          left: headlinePos.left,
          // ... 
        }}
      >
        {sku.copy.benefits?.headline}
      </h1>
      
      {/* Render custom elements */}
      <CustomElementRenderer customElements={sku.customElements?.benefits} />
    </div>
  )
}
```

## Implementation Steps

### Step 1: Extract Element Definitions (1 day)
- Create element definition file for all 14 layouts
- Define layer structure, types, default positions
- One source of truth

### Step 2: Create Universal Wrapper (1 day)
- `EditableLayoutWrapper` component
- Context for edit mode state
- Works with any layout

### Step 3: Update Layouts to Use Overrides (2-3 days)
- Update all 14 regular layout components
- Add `resolveElementPosition` for each element
- Add `CustomElementRenderer`
- **No separate Editable versions needed!**

### Step 4: Build Master Editor Page (2 days)
- `/layouts/edit` route
- Layout selector sidebar
- Reuse `VisualEditorModal`
- Save to `layout_master_overrides`

### Step 5: Wire Up Both Contexts (1 day)
- Master editor uses `onSaveMaster` handler
- Per-SKU editor uses `onSaveSKU` handler
- Same visual editor, different save targets

## Benefits of This Approach

✅ **DRY:** One visual editor for everything
✅ **Maintainable:** Changes in one place
✅ **Scalable:** Easy to add new layouts
✅ **Flexible:** Works for master AND per-SKU
✅ **Consistent:** Same UX everywhere

## Example: Complete Flow

### Master Editor
1. Go to `/layouts/edit`
2. Select "Benefits" layout
3. Visual editor loads with Benefits layout
4. Move headline down 20px
5. Save → `layout_master_overrides` table
6. **ALL brands/SKUs** now have headline 20px lower

### Per-SKU Editor  
1. Edit SKU #42
2. Click "Edit Layout" on Benefits
3. Same visual editor loads
4. Move headline up 10px (for this SKU only)
5. Save → `sku.positionOverrides`
6. **Just SKU #42** has headline at custom position
7. Other SKUs still use master override

### Final Position
```
SKU #42 Headline Position = Spec (60px) + Master (-20px) + SKU (+10px) = 50px
Other SKUs = Spec (60px) + Master (-20px) = 40px
```

## Next Steps

**Option A: Build Master Editor First**
- Create `/layouts/edit` page
- Get element definitions working
- Test with Statement layout
- Then roll out to other layouts

**Option B: Roll Out to More Layouts First**
- Update 4 more layouts to support overrides
- Prove the pattern works
- Then build master editor

**My Recommendation:** Option A - Build master editor now while Statement is fresh in your mind. Once that works, rolling out to other layouts is just extracting element definitions.

**Ready to build the Master Layout Editor page?**

