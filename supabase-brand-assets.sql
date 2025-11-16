-- Brand Assets Table
-- Stores reusable assets (badges, ingredients, icons, backgrounds) for a brand
-- Reduces duplicate uploads and storage costs

CREATE TABLE IF NOT EXISTS brand_assets (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('badge', 'ingredient', 'icon', 'background', 'other')),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  folder TEXT, -- e.g., 'certifications', 'vitamins', 'minerals'
  tags TEXT[], -- searchable tags for filtering
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brand_assets_brand_id ON brand_assets(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_assets_type ON brand_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_brand_assets_folder ON brand_assets(folder);
CREATE INDEX IF NOT EXISTS idx_brand_assets_tags ON brand_assets USING GIN(tags);

-- Row Level Security Policies
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view assets from their own brands
CREATE POLICY "Users can view brand assets"
  ON brand_assets
  FOR SELECT
  USING (true); -- Adjust based on your auth setup

-- Policy: Users can insert assets to their own brands
CREATE POLICY "Users can create brand assets"
  ON brand_assets
  FOR INSERT
  WITH CHECK (true); -- Adjust based on your auth setup

-- Policy: Users can update their own brand assets
CREATE POLICY "Users can update brand assets"
  ON brand_assets
  FOR UPDATE
  USING (true); -- Adjust based on your auth setup

-- Policy: Users can delete their own brand assets
CREATE POLICY "Users can delete brand assets"
  ON brand_assets
  FOR DELETE
  USING (true); -- Adjust based on your auth setup

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_brand_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brand_assets_updated_at
  BEFORE UPDATE ON brand_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_assets_updated_at();

-- Comments for documentation
COMMENT ON TABLE brand_assets IS 'Stores reusable brand assets (badges, ingredients, icons) to reduce duplicate uploads';
COMMENT ON COLUMN brand_assets.asset_type IS 'Type of asset: badge, ingredient, icon, background, or other';
COMMENT ON COLUMN brand_assets.folder IS 'Logical folder for organization (e.g., certifications, vitamins)';
COMMENT ON COLUMN brand_assets.tags IS 'Searchable tags for filtering and categorization';

