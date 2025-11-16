-- Layout Master Overrides Table
-- Stores global position/size/rotation adjustments for layout elements
-- These apply to all SKUs unless overridden at SKU level

CREATE TABLE IF NOT EXISTS layout_master_overrides (
  id SERIAL PRIMARY KEY,
  layout_key TEXT NOT NULL,
  element_key TEXT NOT NULL,
  x NUMERIC,
  y NUMERIC,
  width NUMERIC,
  height NUMERIC,
  rotation NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one override per element per layout
  UNIQUE(layout_key, element_key)
);

-- Add indexes for fast lookups (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_layout_master_overrides_layout_key ON layout_master_overrides(layout_key);

-- Add position_overrides column to SKUs table
ALTER TABLE skus 
ADD COLUMN IF NOT EXISTS position_overrides JSONB DEFAULT '{}'::jsonb;

-- Add custom_elements column to SKUs table
ALTER TABLE skus
ADD COLUMN IF NOT EXISTS custom_elements JSONB DEFAULT '{}'::jsonb;

-- Add custom_element_content column to SKUs table  
ALTER TABLE skus
ADD COLUMN IF NOT EXISTS custom_element_content JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON TABLE layout_master_overrides IS 'Global position/size/rotation overrides for layout elements that apply to all SKUs';
COMMENT ON COLUMN skus.position_overrides IS 'Per-SKU position/size/rotation overrides. Structure: { layoutKey: { elementKey: { x, y, width, height, rotation } } }';

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to layout_master_overrides
DROP TRIGGER IF EXISTS update_layout_master_overrides_updated_at ON layout_master_overrides;
CREATE TRIGGER update_layout_master_overrides_updated_at
  BEFORE UPDATE ON layout_master_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

