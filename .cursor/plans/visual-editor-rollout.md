# Visual Editor - Complete Rollout Plan

## Current Status ✅

**What's Working (Statement Layout):**
- ✅ Full visual editor with drag/drop/resize/rotate
- ✅ Figma-style layers panel with reordering
- ✅ Custom element creation (text, badge, image, shape)
- ✅ Position overrides respect in preview & export
- ✅ Theme-powered configuration
- ✅ Delete custom elements
- ✅ Toast notifications (no alerts!)
- ✅ Shared CustomElementRenderer for consistency
- ✅ Database schema ready

**What's Proven:**
- Architecture is solid
- Performance is good
- UI/UX is intuitive
- Data persistence works

## Implementation Strategy

### Phase 1: Roll Out to All 14 Layouts (Week 1-2)

**Priority Order** (easiest to hardest):

**Tier 1 - Simple Text Layouts** (Days 1-3):
1. **BeforeAfterLayout** - Similar to Statement
2. **ProblemSolutionLayout** - Similar structure
3. **FeatureGridLayout** - Grid of text cards
4. **SocialProofLayout** - Review cards

**Tier 2 - Product-Focused** (Days 4-6):
5. **PromoProductLayout** - Product + stats
6. **BottleListLayout** - Hand + product
7. **IngredientHeroLayout** - Ingredient spotlight
8. **PriceComparisonLayout** - Price comparison

**Tier 3 - Complex Layouts** (Days 7-10):
9. **ComparisonLayout** - Two-column comparison
10. **TestimonialLayout** - Photo + quote
11. **BenefitsLayout** - Pack + callouts
12. **BigStatLayout** - Large stat + ingredients
13. **MultiStatsLayout** - Three metrics
14. **TimelineLayout** - Journey milestones

**Pattern for Each Layout:**
1. Create `{Layout}Editable.tsx` version
2. Update regular `{Layout}.tsx` to use:
   - `resolveElementPosition` for all elements
   - `CustomElementRenderer` for custom elements
3. Add to SKU editor visual editor modal
4. Add layer definitions
5. Test positioning, custom elements, export

### Phase 2: Master Layout Editor Page (Week 3)

**Route:** `/layouts/edit`

**Features:**
```
┌─────────────────────────────────────────────────────┐
│  [All Layouts] Master Layout Editor                │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  Layout List │         Canvas Preview               │
│              │                                      │
│  □ Statement │       [1080x1080 canvas]            │
│  □ Testimonial│                                    │
│  □ Benefits  │                                      │
│  □ Big Stat  │                                      │
│  ...         │                                      │
│              │                                      │
│              │  [Save Master] [Reset All]           │
└──────────────┴──────────────────────────────────────┘
```

**Functionality:**
- Select layout from list
- Edit using same visual editor
- Changes save to `layout_master_overrides` table
- Affects ALL SKUs (unless they have per-SKU override)
- Show "Affects X SKUs" warning before save
- Can preview impact across brands

**Data Flow:**
```
Spec File (immutable)
    ↓
Master Override (global for all SKUs)
    ↓
SKU Override (per-SKU customization)
```

### Phase 3: Bulk Operations & Templates (Week 4)

**Template Library:**
- Save current layout state as template
- Apply template to other layouts
- "Copy position from..." across layouts
- Batch operations (move all headlines down 10px)

**SKU Inheritance:**
- "Apply Master to This SKU" button
- Reset single SKU to master
- Bulk reset all SKUs to master
- View diff between SKU and master

### Phase 4: Advanced Features (Week 5+)

**Custom Element Templates:**
- Pre-built badge styles
- Common text formats
- Icon library
- Save custom elements as reusable components

**Collaboration:**
- Layout change history
- Restore previous versions
- Lock layouts from editing
- Approval workflow

**Analytics:**
- Track most-customized layouts
- See which SKUs have overrides
- Performance insights
- Export statistics

## Technical Architecture

### Database Schema

**Current:**
```sql
skus:
- position_overrides JSONB
- custom_elements JSONB
- custom_element_content JSONB

layout_master_overrides:
- layout_key
- element_key
- x, y, width, height, rotation
```

**Add for Master Editor:**
```sql
layout_master_overrides:
- custom_elements JSONB  // Master custom elements
```

### File Structure

```
components/
  layouts/
    {Layout}.tsx           ← Regular (uses overrides + custom elements)
    {Layout}Editable.tsx   ← Visual editor version
  layout-editor/
    VisualEditorModal.tsx      ← Modal wrapper
    LayersPanel.tsx            ← Layers list
    ElementToolbar.tsx         ← Position controls
    ElementConfigPanel.tsx     ← Custom element config
    BackgroundConfigPanel.tsx  ← Background config
    CustomElementRenderer.tsx  ← Shared renderer
    SelectionOverlay.tsx       ← Handles & bounding box
    AddElementMenu.tsx         ← Add element dropdown

app/
  layouts/
    edit/
      page.tsx           ← Master layout editor
      [layoutKey]/
        page.tsx         ← Individual layout editor
```

### Reusable Patterns

**For Each Layout, Create:**

1. **Editable Version** (`{Layout}Editable.tsx`):
```typescript
export function {Layout}Editable({ 
  brand, sku, isEditMode, selectedElement, 
  onSelectElement, onPositionChange, onSizeChange, onRotationChange 
}) {
  // Resolve ALL element positions
  const elem1Pos = resolveElementPosition(...)
  const elem2Pos = resolveElementPosition(...)
  
  // Render with getEditableProps for each element
  return (
    <div>
      <ElementWithOverrides position={elem1Pos} />
      <ElementWithOverrides position={elem2Pos} />
      <CustomElementRenderer customElements={...} />
    </div>
  )
}
```

2. **Regular Version** (`{Layout}.tsx`):
```typescript
export function {Layout}({ brand, sku }) {
  // Same position resolution
  const elem1Pos = resolveElementPosition(...)
  
  // Same rendering, no edit mode
  return (
    <div>
      <ElementWithOverrides position={elem1Pos} />
      <CustomElementRenderer customElements={...} isEditMode={false} />
    </div>
  )
}
```

**DRY Helper:**
```typescript
// Extract to shared file
function useStatementPositions(sku: SKU) {
  return {
    statement: resolveElementPosition('statement', 'statement', SPEC.elements.statement, sku.positionOverrides),
    productImage: resolveElementPosition('statement', 'productImage', SPEC.elements.productImage, sku.positionOverrides),
    // ... etc
  }
}
```

## Migration Strategy

### Option A: Big Bang (Not Recommended)
- Update all 14 layouts at once
- High risk
- Hard to test

### Option B: Incremental (Recommended)
**Week 1:**
- Roll out Tier 1 (4 simple layouts)
- Test thoroughly with real data
- Fix any bugs

**Week 2:**
- Roll out Tier 2 (4 product layouts)
- Validate export quality
- Ensure performance

**Week 3:**
- Roll out Tier 3 (6 complex layouts)
- Build master editor
- End-to-end testing

**Benefits:**
- Lower risk
- Can iterate on pattern
- Users get value sooner
- Easier to debug

### Option C: Hybrid (Best)
1. **Quick wins first** - Enable visual editor for Statement only
2. **Gather feedback** - Use it in production for 1 week
3. **Refine** - Fix any UX issues
4. **Batch rollout** - Do Tier 1 layouts together
5. **Master editor** - Build once patterns are proven
6. **Complete rollout** - Remaining layouts

## Success Metrics

**Phase 1 Success:**
- All 14 layouts have visual editors
- Position overrides work in all layouts
- Custom elements render in all layouts
- Export quality maintained
- Performance <2s per layout export

**Phase 2 Success:**
- Master editor can edit any layout
- Changes cascade to all SKUs
- Override system clear and predictable
- Bulk operations save time

**Phase 3 Success:**
- Custom elements used in 50%+ of SKUs
- Template library has 10+ presets
- Users create complex layouts easily
- No support tickets about editor

## Risk Mitigation

**Risk:** Breaking existing layouts
**Mitigation:** Keep both old and new components, feature flag

**Risk:** Performance with many custom elements
**Mitigation:** Lazy loading, virtualization, optimize re-renders

**Risk:** Export quality degradation
**Mitigation:** Test suite for all layouts, visual regression testing

**Risk:** Database size growth
**Mitigation:** JSONB compression, archive old versions, cleanup scripts

## Next Steps (Immediate)

### This Week:
1. ✅ ~~Statement layout complete~~
2. **Test thoroughly** - Add custom elements, position everything, export
3. **Run SQL migration** in production
4. **User acceptance** - Get feedback on Statement editor

### Next Week:
5. **Roll out Tier 1** - 4 simple layouts
6. **Documentation** - How to use visual editor
7. **Video walkthrough** - Record tutorial

### Following Week:
8. **Build master editor page**
9. **Roll out remaining layouts**
10. **Training & launch**

---

**Current State:** Statement layout is production-ready! 🎉
**Next Milestone:** Roll out to 4 more layouts
**End Goal:** Complete visual design system for all layouts

