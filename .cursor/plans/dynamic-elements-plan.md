# Dynamic Element Creation - Smart Theme-Powered System

## Vision
Allow users to add custom elements (badges, text, images) to any layout while keeping them fully powered by the brand theme. Elements can have defaults at the layout level, with SKU-specific content overrides.

## Architecture

### Data Structure

#### New Field: `customElements` (in Layout Overrides)
```typescript
interface CustomElement {
  id: string // unique ID like 'custom-badge-1'
  type: 'text' | 'badge' | 'image' | 'shape'
  label: string // user-friendly name
  
  // Position & styling (theme-aware)
  x: number
  y: number
  width?: number
  height?: number
  rotation?: number
  zIndex: number
  
  // Content (can be overridden per SKU)
  content?: {
    text?: string
    imageKey?: string // references brand.images or sku.images
    colorKey?: string // references brand.colors
  }
  
  // Styling
  style?: {
    fontSize?: number
    fontWeight?: number
    padding?: number
    borderRadius?: number
    backgroundColor?: string // color key reference
    textColor?: string // color key reference
  }
}
```

#### Storage Levels

**1. Layout Master Override** (applies to all SKUs):
```json
{
  "layoutKey": "statement",
  "customElements": [
    {
      "id": "custom-badge-promo",
      "type": "badge",
      "label": "Promo Badge",
      "x": 100,
      "y": 100,
      "content": { "text": "NEW!", "colorKey": "accent" },
      "style": { "fontSize": 24, "padding": 12, "borderRadius": 20 }
    }
  ]
}
```

**2. SKU Override** (per-SKU content customization):
```json
{
  "customElementContent": {
    "custom-badge-promo": {
      "text": "50% OFF" // Override just the text
    }
  }
}
```

## Implementation

### Phase 1: Add Element UI

**Button in Visual Editor Header**: "+ Add Element"

**Dropdown Menu**:
- Add Text
- Add Badge
- Add Image
- Add Shape (rectangle, circle)

**Click → Creates Element**:
- Appears at canvas center (540, 540)
- Auto-assigns unique ID
- Default styling from brand theme
- Immediately selectable

### Phase 2: Element Templates

**Pre-built Templates**:
- **Badge**: Pill shape, brand colors, medium padding
- **Text**: Headline style, brand font, theme color
- **Image**: Placeholder, contain sizing
- **Shape**: Basic rectangle, theme background color

**Smart Defaults**:
- Colors pull from `brand.colors` (user picks which key)
- Fonts use `brand.fonts.family`
- Sizing is theme-consistent

### Phase 3: Content Editing

**Double-click Element** → Edit content modal:

For **Text/Badge**:
- Text input (default value)
- Color picker (from brand.colors)
- Font size slider
- Padding/border radius

For **Image**:
- Select from brand.images or sku.images
- Or upload new
- Object-fit options

### Phase 4: SKU-Level Content Overrides

**In SKU Editor** (content editing mode):
- See all custom elements
- Override text per SKU
- Override image per SKU
- Position/size stays consistent (from master)

**Example Use Case**:
- Master layout has "NEW!" badge
- SKU 1 overrides text to "50% OFF"
- SKU 2 overrides to "LIMITED TIME"
- Position/styling stays the same

### Phase 5: Rendering System

**Update Layout Components**:
```typescript
// In StatementLayoutEditable.tsx
{customElements?.map(el => (
  <CustomElement
    key={el.id}
    element={el}
    brand={brand}
    sku={sku}
    skuContentOverride={sku.customElementContent?.[el.id]}
    isEditMode={isEditMode}
    isSelected={selectedElement === el.id}
    onSelect={() => onSelectElement(el.id)}
  />
))}
```

**CustomElement Component**:
- Renders based on type
- Pulls colors from brand.colors[element.colorKey]
- Uses sku override text if available
- Fully editable in visual mode

## UI/UX Flow

### Adding an Element

1. User clicks **"+ Add Element"**
2. Selects **"Add Badge"**
3. Badge appears at center with placeholder: **"Badge Text"**
4. Automatically selected with handles visible
5. User drags to position
6. **Double-click** to edit:
   - Change text to "NEW!"
   - Pick color from brand palette
   - Adjust padding/size
7. **Save** - badge is now part of the layout

### Per-SKU Customization

1. In **SKU Editor** (content tab)
2. See card: **"Custom Elements"**
3. List shows: "Promo Badge - NEW!"
4. Click **Edit** → Change text to "50% OFF"
5. Position/style unchanged (from master)
6. **Save** - this SKU now shows "50% OFF"

## Technical Details

### Database Schema

**Update `skus` table**:
```sql
ADD COLUMN custom_element_content JSONB DEFAULT '{}'::jsonb
```

**Update `layout_master_overrides` table**:
```sql
ADD COLUMN custom_elements JSONB DEFAULT '[]'::jsonb
```

### TypeScript Updates

**SKU Type**:
```typescript
interface SKU {
  // ... existing fields
  customElementContent?: {
    [elementId: string]: {
      text?: string
      imageKey?: string
      colorKey?: string
    }
  }
}
```

### Component Architecture

**New Components**:
- `CustomElement.tsx` - Renders any custom element
- `AddElementMenu.tsx` - Dropdown to add elements
- `ElementContentEditor.tsx` - Edit element content/style
- `CustomElementsList.tsx` - SKU editor list view

## Benefits

✅ **Fully Theme-Powered**: All colors/fonts from brand
✅ **Flexible**: Add any element type
✅ **Reusable**: Define once, customize per SKU
✅ **Non-Destructive**: Can delete custom elements anytime
✅ **Figma-like**: Drag, drop, customize

## Example Use Cases

**1. Seasonal Promo Badge**:
- Master: "PROMO" badge at top-right
- Summer SKUs: "SUMMER SALE"
- Holiday SKUs: "HOLIDAY DEAL"

**2. Rating Stars**:
- Master: ★★★★★ at bottom
- Each SKU: Same position, different rating

**3. Trust Badges**:
- Master: "Certified" badge
- Premium SKUs: "Premium Certified"
- Standard SKUs: "Quality Certified"

## Migration Path

**Existing Layouts**: No changes needed
**Custom Elements**: Opt-in per layout
**Backward Compatible**: Works alongside existing elements

---

This creates a **powerful, theme-consistent design system** where you define elements once and customize content per SKU!

