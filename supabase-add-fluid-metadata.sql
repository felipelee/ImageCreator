-- Migration: Add fluid_metadata column to skus table
-- This enables storing Fluid product/variant IDs for push-to-Fluid functionality

-- Add fluid_metadata column to skus table
ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS fluid_metadata JSONB DEFAULT '{}'::jsonb;

-- Add an index for better query performance when filtering by Fluid product IDs
CREATE INDEX IF NOT EXISTS idx_skus_fluid_metadata ON skus USING GIN (fluid_metadata);

-- Add a comment explaining the field
COMMENT ON COLUMN skus.fluid_metadata IS 'Stores Fluid DAM product metadata (productId, variantId, productSlug, productTitle) for push-to-Fluid functionality';

