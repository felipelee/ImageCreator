# Master Layout Management - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migrations (2 minutes)

Open your Supabase SQL Editor and run these two files in order:

```sql
-- 1. Create the table
-- Copy contents of: supabase-layout-templates.sql

-- 2. Seed with layouts  
-- Copy contents of: supabase-seed-layouts.sql
```

### Step 2: Start Your Server (30 seconds)

```bash
npm run dev
```

### Step 3: Visit the Admin Page (10 seconds)

Navigate to: **http://localhost:3000/admin/layouts**

You should see 11 pre-loaded layouts! 🎉

---

## 📍 Key URLs

- **Gallery**: `/admin/layouts` - View all layouts
- **Edit**: `/admin/layouts/[key]` - Edit a specific layout
- **Create**: `/admin/layouts/new` - Create new layout
- **SKU Editor**: `/brands/[id]/skus/[skuId]` - Customize per SKU

---

## 🎯 Common Tasks

### Create a New Layout

1. Go to `/admin/layouts`
2. Click "Create Layout"
3. Fill in: key, name, category
4. Choose: blank canvas or duplicate existing
5. Review and create

### Edit an Existing Layout

1. Go to `/admin/layouts`
2. Find your layout card
3. Click "Edit"
4. Modify metadata or JSON spec
5. Click "Save Changes"

### Enable/Disable a Layout

1. Go to `/admin/layouts`
2. Find your layout card
3. Click the power icon button
4. Layout toggles between enabled/disabled

### Duplicate a Layout

1. Go to `/admin/layouts`
2. Find your layout card
3. Click the copy icon button
4. New layout created with `_copy_` suffix

### Customize Layout Per SKU

1. Go to SKU editor: `/brands/[id]/skus/[skuId]`
2. Scroll to any layout preview
3. Click "Open Visual Editor"
4. Drag/resize elements
5. Save (creates SKU override, master unchanged)

---

## 🗂️ File Locations

### Database
- `supabase-layout-templates.sql` - Schema
- `supabase-seed-layouts.sql` - Seed data

### Backend
- `lib/layout-service.ts` - Core logic
- `app/api/admin/layouts/route.ts` - API endpoints
- `types/layout-template.ts` - TypeScript types

### Frontend
- `app/admin/layouts/page.tsx` - Gallery
- `app/admin/layouts/[key]/page.tsx` - Editor  
- `app/admin/layouts/new/page.tsx` - Creator

### Navigation
- `components/admin/AppSidebar.tsx` - "Layouts" link

---

## 💡 Key Concepts

### Master Templates
- Stored in database (`layout_templates` table)
- Managed via admin interface
- Apply to all brands/SKUs by default

### SKU Overrides
- Stored in SKU record (`position_overrides` field)
- Created via visual editor
- Independent from master (copy model)
- Can be cleared to revert to master

### The Flow
```
Master Template (DB) 
    ↓
[Used by all SKUs]
    ↓
SKU adds overrides (via visual editor)
    ↓
Render: Master + Overrides
```

---

## 🔧 Troubleshooting

### "Layouts not loading"
- Check database connection
- Verify migrations ran
- Check browser console
- Hardcoded fallbacks should work

### "Can't save layout"
- Check JSON syntax
- Verify required fields filled
- Check network tab for errors

### "Visual editor not working"
- This is for SKU customization only
- Master layouts edited via JSON
- Check SKU editor page instead

---

## 📚 Documentation

- **Full Documentation**: `LAYOUT_MANAGEMENT_SYSTEM.md`
- **Testing Guide**: `LAYOUT_TESTING_CHECKLIST.md`
- **Implementation Summary**: `LAYOUT_IMPLEMENTATION_COMPLETE.md`
- **This Guide**: `LAYOUT_QUICK_START.md`

---

## ✅ Quick Verification

Test these to verify everything works:

```
1. Visit /admin/layouts - See 11 layouts ✓
2. Click "Edit" on any layout ✓
3. Change name, save - See success ✓
4. Create new layout ✓
5. Go to SKU editor - Layouts render ✓
6. Use visual editor - Creates override ✓
```

If all pass, you're good to go! 🎉

---

## 🆘 Need Help?

1. Check documentation files listed above
2. Review browser console for errors
3. Verify database migrations ran
4. Check network tab for API errors
5. Ensure Supabase env vars are set

---

**That's it! You now have a complete master layout management system.** 🚀

