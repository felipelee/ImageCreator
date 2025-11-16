/*
  # Initial Schema for Social Post Generator

  1. New Tables
    - `brands`
      - `id` (bigserial, primary key)
      - `name` (text, not null) - Brand name
      - `colors` (jsonb, not null) - Color palette with bg, primary, accent, etc.
      - `fonts` (jsonb, not null) - Typography settings with family, sizes, weights
      - `images` (jsonb, not null) - Brand-level images (logos, backgrounds)
      - `knowledge` (jsonb) - Brand voice and information for AI
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `skus`
      - `id` (bigserial, primary key)
      - `brand_id` (bigint, foreign key to brands)
      - `name` (text, not null) - SKU name
      - `color_overrides` (jsonb) - Per-layout color customizations
      - `image_overrides` (jsonb) - Per-layout image selections
      - `copy` (jsonb, not null) - All copy content for layouts
      - `images` (jsonb, not null) - SKU-specific images
      - `product_information` (text) - Product details for AI
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `brands` table
    - Enable RLS on `skus` table
    - Add policies for public read/write access (no auth required)
    - Cascade delete SKUs when brand is deleted

  3. Performance
    - Index on skus.brand_id for fast lookups
    - Index on created_at columns for sorting
    - Automatic updated_at timestamp trigger
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  colors JSONB NOT NULL DEFAULT '{}'::jsonb,
  fonts JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '{}'::jsonb,
  knowledge JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create SKUs table
CREATE TABLE IF NOT EXISTS skus (
  id BIGSERIAL PRIMARY KEY,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_overrides JSONB DEFAULT '{}'::jsonb,
  image_overrides JSONB DEFAULT '{}'::jsonb,
  copy JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB NOT NULL DEFAULT '{}'::jsonb,
  product_information TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skus_brand_id ON skus(brand_id);
CREATE INDEX IF NOT EXISTS idx_brands_created_at ON brands(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skus_updated_at ON skus;
CREATE TRIGGER update_skus_updated_at BEFORE UPDATE ON skus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

-- Allow all operations for public access (no auth required)
DROP POLICY IF EXISTS "Allow all operations on brands" ON brands;
CREATE POLICY "Allow all operations on brands" ON brands
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on skus" ON skus;
CREATE POLICY "Allow all operations on skus" ON skus
    FOR ALL USING (true) WITH CHECK (true);