// Ingredient Hero: Spotlight One Key Ingredient (1080×1080)
// Deep dive into one hero ingredient with benefits

export const INGREDIENT_HERO_SPEC = {
  canvas: { width: 1080, height: 1080 },
  
  elements: {
    background: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      backgroundColor: 'bg',
      zIndex: 0
    },
    
    // Ingredient name - large
    ingredientName: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 60,
      left: 60,
      width: 960,
      fontSize: 80,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'accent',
      textAlign: 'center' as const,
      zIndex: 3,
      copyKey: 'ingredientHero.ingredientName'
    },
    
    // Tagline
    tagline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 170,
      left: 100,
      width: 880,
      fontSize: 32,
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'textSecondary',
      textAlign: 'center' as const,
      zIndex: 3,
      copyKey: 'ingredientHero.tagline'
    },
    
    // Ingredient image - large circular
    ingredientImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 270,
      left: 290,
      width: 500,
      height: 500,
      borderRadius: 250,
      objectFit: 'cover' as const,
      zIndex: 2,
      imageKey: 'ingredientA'
    },
    
    // Benefits container at bottom
    benefitsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 820,
      left: 80,
      width: 920,
      zIndex: 3
    },
    
    // Benefit pill style
    benefitPill: {
      paddingX: 24,
      paddingY: 12,
      borderRadius: 24,
      backgroundColor: 'accent',
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: 0,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      gap: 16
    },
    
    // Product badge in corner
    productBadge: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 260,
      left: 750,
      width: 260,
      height: 120,
      backgroundColor: 'primarySoft',
      borderRadius: 60,
      zIndex: 4
    },
    
    productBadgeText: {
      fontSize: 22,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      color: 'primary',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const
    }
  }
}

