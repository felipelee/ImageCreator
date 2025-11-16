// Ingredient Benefits Layout (1080×1080)
// Large ingredient photo with headline and 5 benefit badges

export const INGREDIENT_BENEFITS_SPEC = {
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
    
    ingredientImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 540,
      height: 820,
      objectFit: 'cover' as const,
      zIndex: 10,
      imageKey: 'ingredientA'
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 240,
      left: 530,
      width: 520,
      height: 240,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: -1,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'ingredientBenefits.headline'
    },
    
    subheadline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 580,
      left: 530,
      width: 520,
      height: 120,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'ingredientBenefits.subheadline'
    },
    
    benefitsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 820,
      left: 47,
      width: 986,
      gap: 20,
      zIndex: 20
    },
    
    benefitStyle: {
      icon: {
        size: 80,
        fontSize: 64,
        color: 'accent'
      },
      label: {
        fontSize: 20,
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: 0,
        color: 'accent',
        textAlign: 'center' as const,
        marginTop: 12,
        width: 160
      }
    }
  }
}

