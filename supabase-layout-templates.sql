-- Layout Templates Table
-- Stores master layout definitions that can be managed through the admin UI
-- These serve as templates that SKUs use (with potential overrides at SKU level)

CREATE TABLE IF NOT EXISTS layout_templates (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,           -- e.g., "bottleList", "testimonial"
  name TEXT NOT NULL,                  -- Display name: "Bottle List"
  description TEXT,                    -- User-friendly description
  category TEXT,                       -- "product", "testimonial", "comparison", "stats", etc.
  enabled BOOLEAN DEFAULT true,        -- Whether layout is available for use
  spec JSONB NOT NULL,                -- Full layout specification (positions, styles, elements)
  thumbnail_url TEXT,                  -- Preview thumbnail URL
  copy_template JSONB,                 -- Default copy structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_layout_templates_key ON layout_templates(key);
CREATE INDEX IF NOT EXISTS idx_layout_templates_enabled ON layout_templates(enabled);
CREATE INDEX IF NOT EXISTS idx_layout_templates_category ON layout_templates(category);

-- Add comment for documentation
COMMENT ON TABLE layout_templates IS 'Master layout templates that can be managed through admin UI';
COMMENT ON COLUMN layout_templates.key IS 'Unique identifier for the layout (used in code)';
COMMENT ON COLUMN layout_templates.spec IS 'Full layout specification including canvas size, elements, positions, and styles';
COMMENT ON COLUMN layout_templates.copy_template IS 'Structure defining what copy fields this layout requires';

-- Updated_at trigger (reuse function if it exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to layout_templates
DROP TRIGGER IF EXISTS update_layout_templates_updated_at ON layout_templates;
CREATE TRIGGER update_layout_templates_updated_at
  BEFORE UPDATE ON layout_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

