# Layout Management System - Testing Checklist

## Setup (Do these first)

- [ ] Run database migration: `supabase-layout-templates.sql`
- [ ] Run seed script: `supabase-seed-layouts.sql`
- [ ] Start development server: `npm run dev`

## 1. Gallery Page Tests (`/admin/layouts`)

### Basic Viewing
- [ ] Navigate to `/admin/layouts`
- [ ] Verify 11 layouts are displayed
- [ ] Check stats cards show correct totals
- [ ] Verify each layout card shows: name, key, category badge, description

### Search & Filter
- [ ] Search for "Bottle" - should show "Bottle List"
- [ ] Filter by category "product" - should show product layouts
- [ ] Filter by status "enabled" - should show only enabled layouts
- [ ] Toggle between Grid and List view

### Quick Actions
- [ ] Click "Enable/Disable" toggle on a layout
- [ ] Click "Duplicate" - verify copy is created with `_copy_` suffix
- [ ] Click "Delete" on a non-critical layout - confirm deletion works
- [ ] Click "Edit" - should navigate to editor page

## 2. Layout Editor Tests (`/admin/layouts/[key]`)

### Metadata Tab
- [ ] Navigate to `/admin/layouts/bottleList`
- [ ] Verify all fields are populated correctly
- [ ] Change the display name
- [ ] Update the description
- [ ] Change category dropdown
- [ ] Toggle enabled status
- [ ] Click "Save Changes" - verify success toast

### Specification Tab
- [ ] Switch to "Specification" tab
- [ ] Verify spec JSON is displayed
- [ ] Make a small edit to the JSON
- [ ] Try invalid JSON - should show error on save
- [ ] Fix JSON and save successfully

### Navigation
- [ ] Click "Back" button - should return to gallery
- [ ] Use browser back button - should work correctly

## 3. Layout Creator Tests (`/admin/layouts/new`)

### Step 1: Basic Info
- [ ] Click "Create Layout" from gallery
- [ ] Try to proceed without filling fields - should show validation error
- [ ] Enter invalid key (with spaces) - should show error
- [ ] Enter valid key "testLayout123"
- [ ] Fill in name "Test Layout"
- [ ] Add description and select category
- [ ] Click "Next"

### Step 2: Starting Point
- [ ] Select "Start from Blank Canvas"
- [ ] Switch to "Duplicate Existing Layout"
- [ ] Select "Bottle List" from dropdown
- [ ] Click "Next"

### Step 3: Review & Create
- [ ] Verify all entered information is displayed
- [ ] Click "Create Layout"
- [ ] Verify redirect to editor page
- [ ] Check layout appears in gallery

## 4. API Tests (Optional - via browser DevTools Network tab)

### GET Requests
- [ ] `GET /api/admin/layouts` - returns all layouts
- [ ] `GET /api/admin/layouts/bottleList` - returns single layout
- [ ] `GET /api/admin/layouts/stats` - returns statistics

### POST/PUT Requests
- [ ] `POST /api/admin/layouts` - creates new layout
- [ ] `PUT /api/admin/layouts/testLayout123` - updates layout
- [ ] `PATCH /api/admin/layouts/bottleList` - toggles enabled

### Error Handling
- [ ] `GET /api/admin/layouts/nonexistent` - returns 404
- [ ] `POST /api/admin/layouts` with duplicate key - returns 409

## 5. Integration Tests (SKU Editor)

### Verify SKU Editor Still Works
- [ ] Navigate to any SKU editor: `/brands/[id]/skus/[skuId]`
- [ ] Verify layouts render correctly
- [ ] Scroll through different layouts (Comparison, Testimonial, etc.)

### Visual Editor Integration
- [ ] Click "Open Visual Editor" on any layout
- [ ] Drag an element to reposition it
- [ ] Save changes
- [ ] Verify changes are saved in SKU (not affecting master)

### Master Layout Independence
- [ ] Go to `/admin/layouts/bottleList`
- [ ] Note a position value in the spec (e.g., headline top: 135)
- [ ] Go to SKU editor, use visual editor to move headline
- [ ] Save SKU
- [ ] Return to `/admin/layouts/bottleList`
- [ ] Verify spec is unchanged (SKU created override, not modified master)

## 6. Navigation Tests

### Sidebar
- [ ] Verify "Layouts" link appears in sidebar
- [ ] Click it - navigates to `/admin/layouts`
- [ ] Active state highlights when on layouts pages
- [ ] Works in collapsed sidebar mode

### Breadcrumbs
- [ ] Check breadcrumbs on editor page
- [ ] Click breadcrumb links - navigate correctly

## 7. Dark Mode Tests

- [ ] Toggle dark mode
- [ ] Verify gallery page looks good in dark mode
- [ ] Check editor page in dark mode
- [ ] Verify creator wizard in dark mode
- [ ] Check buttons, cards, and inputs have proper contrast

## 8. Responsive Tests

### Mobile (< 768px)
- [ ] Gallery page adapts to single column
- [ ] Filters stack vertically
- [ ] Cards are full width
- [ ] Editor tabs are scrollable

### Tablet (768px - 1024px)
- [ ] Gallery shows 2 columns
- [ ] Filters display inline
- [ ] Editor has good layout

## 9. Performance Tests

### Caching
- [ ] Open DevTools Network tab
- [ ] Load `/admin/layouts` - note API call
- [ ] Refresh page within 5 minutes - layouts should load faster (cached)
- [ ] Wait 5+ minutes and refresh - new API call (cache expired)

### Fallback System
- [ ] Temporarily break database connection (or disable network in DevTools)
- [ ] Try to render a layout in SKU editor
- [ ] Verify it falls back to hardcoded spec (check console for fallback message)

## 10. Error Handling Tests

### Validation
- [ ] Try to create layout with existing key - should show error
- [ ] Try to save layout with invalid JSON - should show error
- [ ] Try to access non-existent layout key - should redirect to gallery

### Network Errors
- [ ] Simulate slow network (DevTools > Network > Throttling)
- [ ] Verify loading states appear
- [ ] Verify error toasts show when appropriate

## Issues to Report

If you encounter any issues during testing, note them here:

- [ ] Issue 1: ___________________________________
- [ ] Issue 2: ___________________________________
- [ ] Issue 3: ___________________________________

## Test Results

- **Date Tested**: _______________
- **Tested By**: _______________
- **Overall Status**: ⬜ Pass / ⬜ Fail / ⬜ Needs Fixes
- **Notes**: ___________________________________

---

## Quick Smoke Test (5 minutes)

If you just need a quick verification that everything works:

1. [ ] Navigate to `/admin/layouts` - see 11 layouts
2. [ ] Click "Edit" on "Bottle List"
3. [ ] Change name, hit Save - see success message
4. [ ] Click "Create Layout" button
5. [ ] Fill in form, create new layout - see it in gallery
6. [ ] Go to any SKU editor - layouts still render
7. [ ] Open visual editor, move an element, save
8. [ ] Return to master layout editor - spec unchanged

**If all 8 steps pass, core functionality is working! ✅**

