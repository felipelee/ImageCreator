# Supabase Storage Setup

To enable image uploads, you need to create Storage buckets in your Supabase project.

## Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard: `https://supabase.com/dashboard/project/xxqmiktzuvqmvbqqlzde`
2. Click on **Storage** in the left sidebar
3. Click **"New bucket"** button

### Create These 3 Buckets:

#### Bucket 1: `brand-images`
- **Name:** `brand-images`
- **Public:** ✅ Yes (checked)
- **File size limit:** 50 MB
- Click **Create bucket**

#### Bucket 2: `sku-images`  
- **Name:** `sku-images`
- **Public:** ✅ Yes (checked)
- **File size limit:** 50 MB
- Click **Create bucket**

#### Bucket 3: `generated-assets`
- **Name:** `generated-assets`
- **Public:** ✅ Yes (checked)
- **File size limit:** 50 MB
- Click **Create bucket**

## Step 2: Set Bucket Policies (Optional but Recommended)

For each bucket, you can set up Row Level Security (RLS) policies:

### For Development (Allow All - Simple)

Run this SQL in the **SQL Editor** for each bucket:

```sql
-- Allow public access to read files
CREATE POLICY "Allow public to read brand-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-images');

-- Allow anyone to upload files (you can add authentication later)
CREATE POLICY "Allow anyone to upload brand-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-images');

-- Allow anyone to update files
CREATE POLICY "Allow anyone to update brand-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-images');

-- Allow anyone to delete files
CREATE POLICY "Allow anyone to delete brand-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-images');
```

**Repeat for `sku-images` and `generated-assets`** (just change the bucket name).

### For Production (With Authentication - More Secure)

If you want to add authentication later, you can use policies like:

```sql
-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-images' 
  AND auth.role() = 'authenticated'
);
```

## Step 3: Test Storage

After creating the buckets, you can test by:

1. Going to Storage in Supabase
2. Selecting a bucket
3. Clicking **Upload file** to test manually

## Usage in Code

The app now uses the `lib/supabase-storage.ts` utilities:

```typescript
import { uploadImage, uploadImageFromUrl } from '@/lib/supabase-storage'
import { STORAGE_BUCKETS } from '@/lib/supabase-storage'

// Upload from a File input
const url = await uploadImage(STORAGE_BUCKETS.BRAND_IMAGES, file)

// Upload from a URL or base64
const url = await uploadImageFromUrl(STORAGE_BUCKETS.SKU_IMAGES, imageUrl)
```

## Storage Limits

**Supabase Free Tier:**
- 1 GB storage
- 2 GB bandwidth per month

**Pro Tier ($25/month):**
- 100 GB storage
- 200 GB bandwidth

## Next Steps

Once buckets are created:
1. Images will automatically be uploaded to Supabase Storage
2. Old base64/local images can be migrated over time
3. All new uploads will use cloud storage

---

**Note:** The app will work without storage setup, but images won't persist between deploys on Netlify. Setting up storage ensures images are permanently stored in the cloud.

