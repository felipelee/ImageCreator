/*
  # Create Storage Bucket for SKU Images

  1. Storage
    - Create `sku-images` bucket for storing product and lifestyle images
    - Enable public access for image URLs
    - Set up policies for public uploads (no auth required)

  2. Security
    - Allow public read access for all images (needed for CDN delivery)
    - Allow public uploads, updates, and deletes (no auth required for now)
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('sku-images', 'sku-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for sku images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for sku images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for sku images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for sku images" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public read access for sku images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sku-images');

-- Allow public uploads
CREATE POLICY "Public upload access for sku images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'sku-images');

-- Allow public updates
CREATE POLICY "Public update access for sku images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'sku-images')
WITH CHECK (bucket_id = 'sku-images');

-- Allow public deletes
CREATE POLICY "Public delete access for sku images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'sku-images');