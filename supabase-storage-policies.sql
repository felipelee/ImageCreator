-- Supabase Storage Policies
-- Run this SQL in your Supabase SQL Editor to allow image uploads

-- ============================================
-- BRAND IMAGES BUCKET POLICIES
-- ============================================

-- Allow anyone to read brand images (public bucket)
CREATE POLICY "Allow public to read brand-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-images');

-- Allow anyone to upload brand images
CREATE POLICY "Allow anyone to upload brand-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-images');

-- Allow anyone to update brand images
CREATE POLICY "Allow anyone to update brand-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-images');

-- Allow anyone to delete brand images
CREATE POLICY "Allow anyone to delete brand-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-images');

-- ============================================
-- SKU IMAGES BUCKET POLICIES
-- ============================================

-- Allow anyone to read SKU images (public bucket)
CREATE POLICY "Allow public to read sku-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'sku-images');

-- Allow anyone to upload SKU images
CREATE POLICY "Allow anyone to upload sku-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sku-images');

-- Allow anyone to update SKU images
CREATE POLICY "Allow anyone to update sku-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sku-images');

-- Allow anyone to delete SKU images
CREATE POLICY "Allow anyone to delete sku-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'sku-images');

-- ============================================
-- GENERATED ASSETS BUCKET POLICIES
-- ============================================

-- Allow anyone to read generated assets (public bucket)
CREATE POLICY "Allow public to read generated-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-assets');

-- Allow anyone to upload generated assets
CREATE POLICY "Allow anyone to upload generated-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-assets');

-- Allow anyone to update generated assets
CREATE POLICY "Allow anyone to update generated-assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'generated-assets');

-- Allow anyone to delete generated assets
CREATE POLICY "Allow anyone to delete generated-assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'generated-assets');

-- ============================================
-- SUCCESS!
-- ============================================
-- After running this SQL, image uploads should work!
-- Test by uploading an image in your app.

