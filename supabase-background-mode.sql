-- Add background_mode column to SKUs table
-- This allows users to choose between background image or background color per layout

ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS background_mode JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN skus.background_mode IS 'Per-layout background mode selection: { "layoutKey": "image" | "color" }';

