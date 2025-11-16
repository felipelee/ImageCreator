-- Seed script to populate layout_templates table with existing layouts
-- Run this after creating the layout_templates table

-- Insert all existing layout templates

-- 1. Bottle List (Product + Benefits)
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'bottleList',
  'Bottle List',
  'Hand holding product with key benefits listed with icons',
  'product',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"backgroundColor":"bg","zIndex":0},"productImage":{"type":"image","position":"absolute","top":-13,"left":-295,"width":877.876,"height":1267.81,"rotation":10.741,"zIndex":1,"imageKey":"lifestyleA"},"headline":{"type":"text","position":"absolute","top":135,"left":487,"width":500,"height":207,"fontSize":96,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"left","zIndex":2,"copyKey":"bottle.headline"},"benefitsContainer":{"type":"container","position":"absolute","top":392,"left":487,"gap":50,"zIndex":30},"benefitStyle":{"container":{"gap":20},"icon":{"size":60,"fontSize":48,"fontWeight":300,"lineHeight":1.1,"letterSpacing":-1,"color":"accent"},"title":{"fontSize":36,"fontWeight":700,"lineHeight":1.0,"letterSpacing":0.5,"color":"accent","height":50,"width":420},"description":{"fontSize":24,"fontWeight":700,"lineHeight":1.0,"letterSpacing":1,"textTransform":"uppercase","color":"textSecondary","width":420,"gap":8}}}}',
  '{"bottle":{"headline":{"label":"Headline","type":"text","required":true},"benefit1":{"label":"Benefit 1","type":"text","required":true},"benefit1_detail":{"label":"Benefit 1 Detail","type":"text","required":true},"benefit2":{"label":"Benefit 2","type":"text","required":true},"benefit2_detail":{"label":"Benefit 2 Detail","type":"text","required":true},"benefit3":{"label":"Benefit 3","type":"text","required":true},"benefit3_detail":{"label":"Benefit 3 Detail","type":"text","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 2. Comparison
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'comparison',
  'Comparison',
  'Side-by-side comparison of your product vs competitors',
  'comparison',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1350,"backgroundColor":"bg","zIndex":0},"headline":{"type":"text","position":"absolute","top":115,"left":56,"width":470,"fontSize":72,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"text","textAlign":"left","zIndex":2,"copyKey":"compare.headline"},"highlightLeft":{"type":"rectangle","position":"absolute","top":164,"left":546,"width":217,"height":847,"borderRadius":20,"backgroundColor":"accent","zIndex":1},"highlightRight":{"type":"rectangle","position":"absolute","top":164,"left":806,"width":217,"height":847,"borderRadius":20,"backgroundColor":"bgAlt","zIndex":1},"comparisonYours":{"type":"image","position":"absolute","top":64,"left":534,"width":229,"height":229,"borderRadius":114.5,"objectFit":"contain","clipPath":"circle(50%)","zIndex":3,"imageKey":"comparisonOurs"},"comparisonTheirs":{"type":"image","position":"absolute","top":76,"left":815,"width":200,"height":200,"borderRadius":100,"objectFit":"cover","clipPath":"circle(50%)","zIndex":3,"imageKey":"comparisonTheirs"},"leftLabel":{"type":"text","position":"absolute","top":306,"left":655,"width":200,"fontSize":32,"fontWeight":400,"lineHeight":1.4,"letterSpacing":0,"color":"bg","textAlign":"center","transform":"translateX(-50%)","zIndex":4,"copyKey":"compare.leftLabel"},"rightLabel":{"type":"text","position":"absolute","top":306,"left":915,"width":200,"fontSize":32,"fontWeight":400,"lineHeight":1.4,"letterSpacing":0,"color":"textSecondary","textAlign":"center","transform":"translateX(-50%)","zIndex":4,"copyKey":"compare.rightLabel"}}}',
  '{"compare":{"headline":{"label":"Headline","type":"text","required":true},"leftLabel":{"label":"Left Label","type":"text","required":true},"rightLabel":{"label":"Right Label","type":"text","required":true},"row1_label":{"label":"Row 1 Label","type":"text","required":true},"row2_label":{"label":"Row 2 Label","type":"text","required":true},"row3_label":{"label":"Row 3 Label","type":"text","required":true},"row4_label":{"label":"Row 4 Label","type":"text","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 3. Testimonial
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'testimonial',
  'Testimonial',
  'Customer photo with quote overlay and star rating',
  'testimonial',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"image","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"objectFit":"cover","zIndex":0,"imageKey":"testimonialPhoto"},"quoteContainer":{"type":"container","position":"absolute","bottom":120,"left":56,"right":56,"width":968,"maxWidth":968,"cornerRadius":20,"backgroundColor":"bg","opacity":0.9,"padding":{"top":32,"bottom":32,"left":48,"right":48},"zIndex":2},"ctaStrip":{"type":"rectangle","position":"absolute","top":1000,"left":0,"width":1080,"height":80,"backgroundColor":"accent","zIndex":4},"ctaText":{"type":"text","position":"absolute","top":1040,"left":540,"width":1000,"fontSize":36,"fontWeight":700,"lineHeight":1.0,"letterSpacing":0.5,"color":"#FFFFFF","textAlign":"center","transform":"translate(-50%, -50%)","zIndex":5,"copyKey":"testimonial.ctaStrip"}}}',
  '{"testimonial":{"quote":{"label":"Quote","type":"textarea","required":true},"name":{"label":"Customer Name","type":"text","required":true},"ratingLabel":{"label":"Rating Label","type":"text","required":true},"ctaStrip":{"label":"CTA Text","type":"text","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 4. Big Stat
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'bigStat',
  'Big Stat',
  'Large percentage stat with ingredient circles',
  'stats',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"backgroundColor":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"backgroundColor":"bgAlt","zIndex":0},"backgroundImage":{"type":"image","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"objectFit":"cover","opacity":0.2,"zIndex":1,"imageKey":"backgroundAlt"},"statValue":{"type":"text","position":"absolute","top":384,"left":540,"width":1080,"useDisplayFont":true,"color":"accent","textAlign":"center","transform":"translateX(-50%)","zIndex":2,"copyKey":"stat97.value"},"headline":{"type":"text","position":"absolute","top":676,"left":540,"width":729,"fontSize":48,"fontWeight":700,"lineHeight":1.1,"letterSpacing":-1,"color":"accent","textAlign":"center","transform":"translateX(-50%)","zIndex":2,"copyKey":"stat97.headline"}}}',
  '{"stat97":{"value":{"label":"Stat Value","type":"text","required":true},"headline":{"label":"Headline","type":"text","required":true},"ingredient1":{"label":"Ingredient 1","type":"text","required":true},"ingredient2":{"label":"Ingredient 2","type":"text","required":true},"ingredient3":{"label":"Ingredient 3","type":"text","required":true},"ingredient4":{"label":"Ingredient 4","type":"text","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 5. Multi Stats
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'multiStats',
  'Multi Stats',
  'Three statistics with lifestyle background image',
  'stats',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"image","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"objectFit":"cover","zIndex":0,"imageKey":"lifestyleMultiStats"},"headline":{"type":"text","position":"absolute","top":113,"left":56,"width":968,"fontSize":72,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"left","zIndex":2,"copyKey":"stats.headline"}}}',
  '{"stats":{"headline":{"label":"Headline","type":"text","required":true},"stat1_value":{"label":"Stat 1 Value","type":"text","required":true},"stat1_label":{"label":"Stat 1 Label","type":"text","required":true},"stat2_value":{"label":"Stat 2 Value","type":"text","required":true},"stat2_label":{"label":"Stat 2 Label","type":"text","required":true},"stat3_value":{"label":"Stat 3 Value","type":"text","required":true},"stat3_label":{"label":"Stat 3 Label","type":"text","required":true},"disclaimer":{"label":"Disclaimer","type":"text","required":false}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 6. Promo Product
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'promoProduct',
  'Promo Product',
  'Product image with promotional badge and key stats',
  'promotional',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"backgroundColor":"bg","zIndex":0},"headline":{"type":"text","position":"absolute","top":113,"left":56,"width":400,"fontSize":64,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"left","zIndex":2,"copyKey":"promo.headline"},"productImage":{"type":"image","position":"absolute","top":469,"left":540,"width":684,"height":684,"objectFit":"contain","transform":"translateX(-50%)","zIndex":3,"imageKey":"productPrimary"}}}',
  '{"promo":{"headline":{"label":"Headline","type":"text","required":true},"stat1_value":{"label":"Stat 1 Value","type":"text","required":true},"stat1_label":{"label":"Stat 1 Label","type":"text","required":true},"stat2_value":{"label":"Stat 2 Value","type":"text","required":true},"stat2_label":{"label":"Stat 2 Label","type":"text","required":true},"stat3_value":{"label":"Stat 3 Value","type":"text","required":true},"stat3_label":{"label":"Stat 3 Label","type":"text","required":true},"badge":{"label":"Badge Text","type":"text","required":true},"badgeNote":{"label":"Badge Note","type":"text","required":false}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 7. Timeline
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'timeline',
  'Timeline',
  'Visual timeline showing progression or process with milestones',
  'educational',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"image","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"objectFit":"cover","zIndex":0,"imageKey":"lifestyleTimeline"},"headline":{"type":"text","position":"absolute","top":113,"left":56,"width":968,"fontSize":72,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"left","zIndex":2,"copyKey":"timeline.headline"}}}',
  '{"timeline":{"headline":{"label":"Headline","type":"text","required":true},"subhead":{"label":"Subhead","type":"text","required":false},"milestone1_time":{"label":"Milestone 1 Time","type":"text","required":true},"milestone1_title":{"label":"Milestone 1 Title","type":"text","required":true},"milestone1_detail":{"label":"Milestone 1 Detail","type":"text","required":true},"milestone2_time":{"label":"Milestone 2 Time","type":"text","required":true},"milestone2_title":{"label":"Milestone 2 Title","type":"text","required":true},"milestone2_detail":{"label":"Milestone 2 Detail","type":"text","required":true},"milestone3_time":{"label":"Milestone 3 Time","type":"text","required":true},"milestone3_title":{"label":"Milestone 3 Title","type":"text","required":true},"milestone3_detail":{"label":"Milestone 3 Detail","type":"text","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 8. Feature Grid
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'featureGrid',
  'Feature Grid',
  'Grid of feature cards with icons and descriptions',
  'product',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"backgroundColor":"bg","zIndex":0},"headline":{"type":"text","position":"absolute","top":113,"left":56,"width":968,"fontSize":72,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"center","zIndex":2,"copyKey":"featureGrid.headline"}}}',
  '{"featureGrid":{"headline":{"label":"Headline","type":"text","required":true},"feature1_icon":{"label":"Feature 1 Icon","type":"text","required":true},"feature1_title":{"label":"Feature 1 Title","type":"text","required":true},"feature1_desc":{"label":"Feature 1 Description","type":"textarea","required":true},"feature2_icon":{"label":"Feature 2 Icon","type":"text","required":true},"feature2_title":{"label":"Feature 2 Title","type":"text","required":true},"feature2_desc":{"label":"Feature 2 Description","type":"textarea","required":true},"feature3_icon":{"label":"Feature 3 Icon","type":"text","required":true},"feature3_title":{"label":"Feature 3 Title","type":"text","required":true},"feature3_desc":{"label":"Feature 3 Description","type":"textarea","required":true},"feature4_icon":{"label":"Feature 4 Icon","type":"text","required":true},"feature4_title":{"label":"Feature 4 Title","type":"text","required":true},"feature4_desc":{"label":"Feature 4 Description","type":"textarea","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 10. Social Proof
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'socialProof',
  'Social Proof',
  'Customer reviews and ratings showcased prominently',
  'social-proof',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"backgroundColor":"bg","zIndex":0},"headline":{"type":"text","position":"absolute","top":113,"left":56,"width":968,"fontSize":72,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"center","zIndex":2,"copyKey":"socialProof.headline"}}}',
  '{"socialProof":{"headline":{"label":"Headline","type":"text","required":true},"review1_rating":{"label":"Review 1 Rating","type":"text","required":true},"review1_quote":{"label":"Review 1 Quote","type":"textarea","required":true},"review1_name":{"label":"Review 1 Name","type":"text","required":true},"review2_rating":{"label":"Review 2 Rating","type":"text","required":true},"review2_quote":{"label":"Review 2 Quote","type":"textarea","required":true},"review2_name":{"label":"Review 2 Name","type":"text","required":true},"review3_rating":{"label":"Review 3 Rating","type":"text","required":true},"review3_quote":{"label":"Review 3 Quote","type":"textarea","required":true},"review3_name":{"label":"Review 3 Name","type":"text","required":true}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

-- 11. Price Comparison
INSERT INTO layout_templates (key, name, description, category, enabled, spec, copy_template)
VALUES (
  'priceComparison',
  'Price Comparison',
  'Compare prices and value proposition side-by-side',
  'promotional',
  true,
  '{"canvas":{"width":1080,"height":1080},"elements":{"background":{"type":"rectangle","position":"absolute","top":0,"left":0,"width":1080,"height":1080,"backgroundColor":"bg","zIndex":0},"headline":{"type":"text","position":"absolute","top":113,"left":56,"width":968,"fontSize":72,"fontWeight":700,"lineHeight":1.0,"letterSpacing":-2,"color":"accent","textAlign":"center","zIndex":2,"copyKey":"priceComparison.headline"}}}',
  '{"priceComparison":{"headline":{"label":"Headline","type":"text","required":true},"priceLeft":{"label":"Left Price","type":"text","required":true},"labelLeft":{"label":"Left Label","type":"text","required":true},"priceCenter":{"label":"Center Price","type":"text","required":true},"labelCenter":{"label":"Center Label","type":"text","required":true},"benefit1":{"label":"Benefit 1","type":"text","required":true},"benefit2":{"label":"Benefit 2","type":"text","required":true},"benefit3":{"label":"Benefit 3","type":"text","required":true},"benefit4":{"label":"Benefit 4","type":"text","required":true},"benefit5":{"label":"Benefit 5","type":"text","required":true},"benefit6":{"label":"Benefit 6","type":"text","required":true},"disclaimer":{"label":"Disclaimer","type":"text","required":false}}}'
) ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  spec = EXCLUDED.spec,
  copy_template = EXCLUDED.copy_template,
  updated_at = NOW();

