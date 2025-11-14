-- Add Fluid DAM credentials column to brands table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS fluid_dam JSONB DEFAULT NULL;

-- Add a comment to document the column
COMMENT ON COLUMN brands.fluid_dam IS 'Brand-specific Fluid DAM credentials: { apiToken, baseUrl, subdomain }';
