// Element definitions for all 14 layouts
// Used by visual editor to show layers and enable editing

export interface LayoutElementDefinition {
  key: string
  label: string
  type: 'text' | 'image' | 'container' | 'background'
  locked?: boolean
  defaultZIndex?: number
}

export const LAYOUT_ELEMENT_DEFINITIONS: Record<string, LayoutElementDefinition[]> = {
  statement: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'ctaStrip', label: 'CTA Strip Background', type: 'background', locked: true, defaultZIndex: 10 },
    { key: 'statement', label: 'Headline Text', type: 'text', defaultZIndex: 20 },
    { key: 'benefit1', label: 'Badge: Science-backed', type: 'container', defaultZIndex: 20 },
    { key: 'benefit2', label: 'Badge: No artificial', type: 'container', defaultZIndex: 20 },
    { key: 'benefit3', label: 'Badge: Results', type: 'container', defaultZIndex: 20 },
    { key: 'ctaText', label: 'CTA Text', type: 'text', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 30 }
  ],
  
  testimonial: [
    { key: 'background', label: 'Background Photo', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'ctaStrip', label: 'CTA Strip (Bottom)', type: 'background', locked: true, defaultZIndex: 10 },
    { key: 'quoteContainer', label: 'Quote Panel Background', type: 'container', defaultZIndex: 20 },
    { key: 'stars', label: 'Rating Stars', type: 'text', defaultZIndex: 21 },
    { key: 'quote', label: 'Quote Text', type: 'text', defaultZIndex: 21 },
    { key: 'name', label: 'Customer Name', type: 'text', defaultZIndex: 21 },
    { key: 'ctaText', label: 'CTA Text', type: 'text', defaultZIndex: 30 }
  ],
  
  compare: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'leftColumn', label: 'Left Column (Dark)', type: 'background', defaultZIndex: 1 },
    { key: 'rightColumn', label: 'Right Column (Light)', type: 'background', defaultZIndex: 1 },
    { key: 'leftImage', label: 'Your Product Image', type: 'image', defaultZIndex: 3 },
    { key: 'rightImage', label: 'Their Product Image', type: 'image', defaultZIndex: 3 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 2 },
    { key: 'leftLabel', label: 'Left Label Text ("Ours")', type: 'text', defaultZIndex: 4 },
    { key: 'rightLabel', label: 'Right Label Text ("Theirs")', type: 'text', defaultZIndex: 4 },
    { key: 'row1', label: 'Feature Row 1', type: 'container', defaultZIndex: 20 },
    { key: 'row2', label: 'Feature Row 2', type: 'container', defaultZIndex: 20 },
    { key: 'row3', label: 'Feature Row 3', type: 'container', defaultZIndex: 20 },
    { key: 'row4', label: 'Feature Row 4', type: 'container', defaultZIndex: 20 }
  ],
  
  benefits: [
    { key: 'background', label: 'Background Image', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 10 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'callout1', label: 'Benefit: Top Left', type: 'container', defaultZIndex: 30 },
    { key: 'callout2', label: 'Benefit: Top Right', type: 'container', defaultZIndex: 30 },
    { key: 'callout3', label: 'Benefit: Bottom Right', type: 'container', defaultZIndex: 30 },
    { key: 'callout4', label: 'Benefit: Bottom Left', type: 'container', defaultZIndex: 30 }
  ],
  
  bigStat: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'backgroundImage', label: 'Background Image Overlay', type: 'background', locked: true, defaultZIndex: 1 },
    { key: 'statValue', label: 'Large Stat (100%)', type: 'text', defaultZIndex: 20 },
    { key: 'headline', label: 'Headline Text', type: 'text', defaultZIndex: 20 },
    { key: 'ingredient1', label: 'Ingredient 1 Image', type: 'image', defaultZIndex: 40 },
    { key: 'ingredient2', label: 'Ingredient 2 Image', type: 'image', defaultZIndex: 40 },
    { key: 'ingredient3', label: 'Ingredient 3 Image', type: 'image', defaultZIndex: 40 },
    { key: 'ingredient4', label: 'Ingredient 4 Image', type: 'image', defaultZIndex: 40 },
    { key: 'label1', label: 'Ingredient 1 Label', type: 'container', defaultZIndex: 41 },
    { key: 'label2', label: 'Ingredient 2 Label', type: 'container', defaultZIndex: 41 },
    { key: 'label3', label: 'Ingredient 3 Label', type: 'container', defaultZIndex: 41 },
    { key: 'label4', label: 'Ingredient 4 Label', type: 'container', defaultZIndex: 41 }
  ],
  
  multiStats: [
    { key: 'background', label: 'Background Image', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'stat1', label: 'Stat 1 (78%)', type: 'container', defaultZIndex: 20 },
    { key: 'stat2', label: 'Stat 2 (71%)', type: 'container', defaultZIndex: 20 },
    { key: 'stat3', label: 'Stat 3 (69%)', type: 'container', defaultZIndex: 20 },
    { key: 'disclaimer', label: 'Disclaimer', type: 'text', defaultZIndex: 20 }
  ],
  
  promoProduct: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'stat1', label: 'Stat 1 (47%)', type: 'container', defaultZIndex: 20 },
    { key: 'stat2', label: 'Stat 2 (4X)', type: 'container', defaultZIndex: 20 },
    { key: 'stat3', label: 'Stat 3 (144%)', type: 'container', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 30 },
    { key: 'badge', label: 'Promo Badge', type: 'container', defaultZIndex: 40 },
    { key: 'badgeText', label: 'Badge Text', type: 'text', defaultZIndex: 41 }
  ],
  
  bottleList: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'benefit1', label: 'Benefit 1: Stronger muscles', type: 'container', defaultZIndex: 20 },
    { key: 'benefit2', label: 'Benefit 2: Faster recovery', type: 'container', defaultZIndex: 20 },
    { key: 'benefit3', label: 'Benefit 3: Healthy aging', type: 'container', defaultZIndex: 20 },
    { key: 'productImage', label: 'Hand Holding Product', type: 'image', defaultZIndex: 30 }
  ],
  
  timeline: [
    { key: 'background', label: 'Background Image', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'timelineLine', label: 'Timeline Line', type: 'container', defaultZIndex: 10 },
    { key: 'milestone1', label: 'Milestone 1', type: 'container', defaultZIndex: 20 },
    { key: 'milestone2', label: 'Milestone 2', type: 'container', defaultZIndex: 20 },
    { key: 'milestone3', label: 'Milestone 3', type: 'container', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 30 }
  ],
  
  problemSolution: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'problemContainer', label: 'Problem Panel', type: 'container', defaultZIndex: 20 },
    { key: 'arrow', label: 'Arrow', type: 'text', locked: true, defaultZIndex: 25 },
    { key: 'solutionContainer', label: 'Solution Panel', type: 'container', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 30 }
  ],
  
  featureGrid: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'feature1', label: 'Feature Card 1', type: 'container', defaultZIndex: 20 },
    { key: 'feature2', label: 'Feature Card 2', type: 'container', defaultZIndex: 20 },
    { key: 'feature3', label: 'Feature Card 3', type: 'container', defaultZIndex: 20 },
    { key: 'feature4', label: 'Feature Card 4', type: 'container', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 30 }
  ],
  
  socialProof: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'review1', label: 'Review Card 1', type: 'container', defaultZIndex: 20 },
    { key: 'review2', label: 'Review Card 2', type: 'container', defaultZIndex: 20 },
    { key: 'review3', label: 'Review Card 3', type: 'container', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 30 }
  ],
  
  ingredientHero: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'ingredientName', label: 'Ingredient Name', type: 'text', defaultZIndex: 20 },
    { key: 'tagline', label: 'Tagline', type: 'text', defaultZIndex: 20 },
    { key: 'ingredientImage', label: 'Ingredient Image', type: 'image', defaultZIndex: 30 },
    { key: 'benefitsContainer', label: 'Benefits Pills', type: 'container', defaultZIndex: 20 },
    { key: 'productBadge', label: 'Product Badge', type: 'container', defaultZIndex: 40 }
  ],
  
  priceComparison: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'priceLeft', label: 'Price Left', type: 'text', defaultZIndex: 20 },
    { key: 'priceCenter', label: 'Price Center', type: 'text', defaultZIndex: 20 },
    { key: 'benefitsList', label: 'Benefits List', type: 'container', defaultZIndex: 20 }
  ],
  
  badgeProduct: [
    { key: 'background', label: 'Background Image', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'productImage', label: 'Main Product Photo', type: 'image', defaultZIndex: 10 },
    { key: 'badge1', label: 'Badge 1 (Top Left)', type: 'image', defaultZIndex: 20 },
    { key: 'badge2', label: 'Badge 2 (Top Right)', type: 'image', defaultZIndex: 20 },
    { key: 'badge3', label: 'Badge 3 (Bottom Left)', type: 'image', defaultZIndex: 20 },
    { key: 'badge4', label: 'Badge 4 (Bottom Right)', type: 'image', defaultZIndex: 20 }
  ],
  
  studyCitation: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'studyContext', label: 'Study Context (Top)', type: 'text', defaultZIndex: 20 },
    { key: 'mainFinding', label: 'Main Finding', type: 'text', defaultZIndex: 20 },
    { key: 'supplementName', label: 'Supplement Name', type: 'text', defaultZIndex: 20 },
    { key: 'sourceCitation', label: 'Source Citation', type: 'text', defaultZIndex: 20 },
    { key: 'ingredientImage', label: 'Ingredient Image', type: 'image', defaultZIndex: 15 }
  ],
  
  ugcGrid: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'photo1', label: 'Photo 1 (Top Left)', type: 'image', defaultZIndex: 10 },
    { key: 'photo2', label: 'Photo 2 (Top Right)', type: 'image', defaultZIndex: 10 },
    { key: 'photo3', label: 'Photo 3 (Bottom Left)', type: 'image', defaultZIndex: 10 },
    { key: 'photo4', label: 'Photo 4 (Bottom Right)', type: 'image', defaultZIndex: 10 }
  ],
  
  testimonialDetail: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'reviewPanel', label: 'Review Panel', type: 'background', locked: true, defaultZIndex: 15 },
    { key: 'lifestylePhoto', label: 'Lifestyle Photo', type: 'image', defaultZIndex: 10 },
    { key: 'stars', label: 'Star Rating', type: 'text', defaultZIndex: 20 },
    { key: 'quoteHeadline', label: 'Quote Headline', type: 'text', defaultZIndex: 20 },
    { key: 'reviewText', label: 'Review Text', type: 'text', defaultZIndex: 20 },
    { key: 'customerName', label: 'Customer Name', type: 'text', defaultZIndex: 20 },
    { key: 'verifiedBadge', label: 'Verified Badge', type: 'container', defaultZIndex: 20 }
  ],
  
  statsWithProduct: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'stat1Value', label: 'Stat 1 Value', type: 'text', defaultZIndex: 20 },
    { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', defaultZIndex: 20 },
    { key: 'stat2Value', label: 'Stat 2 Value', type: 'text', defaultZIndex: 20 },
    { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', defaultZIndex: 20 },
    { key: 'stat3Value', label: 'Stat 3 Value', type: 'text', defaultZIndex: 20 },
    { key: 'stat3Label', label: 'Stat 3 Label', type: 'text', defaultZIndex: 20 },
    { key: 'productImage', label: 'Product Image', type: 'image', defaultZIndex: 15 }
  ],
  
  ingredientBenefits: [
    { key: 'background', label: 'Background', type: 'background', locked: true, defaultZIndex: 0 },
    { key: 'ingredientImage', label: 'Ingredient Photo', type: 'image', defaultZIndex: 10 },
    { key: 'headline', label: 'Headline', type: 'text', defaultZIndex: 20 },
    { key: 'subheadline', label: 'Subheadline', type: 'text', defaultZIndex: 20 }
  ]
}

// Helper to get element definitions with custom elements merged in
export function getLayoutElements(
  layoutKey: string,
  customElements: any[] = [],
  positionOverrides: any = {}
): LayoutElementDefinition[] {
  const builtIn = LAYOUT_ELEMENT_DEFINITIONS[layoutKey] || []
  
  // Add custom elements
  const custom = customElements.map(el => ({
    key: el.id,
    label: el.label,
    type: el.type as 'text' | 'image' | 'container',
    defaultZIndex: el.zIndex
  }))
  
  const all = [...builtIn, ...custom]
  
  // Sort by actual z-index (from overrides or defaults)
  return all.sort((a, b) => {
    const aZ = positionOverrides?.[a.key]?.zIndex ?? a.defaultZIndex ?? 0
    const bZ = positionOverrides?.[b.key]?.zIndex ?? b.defaultZIndex ?? 0
    return aZ - bZ
  })
}

