// Bottle List: Hand Holding Product with Benefits (1080×1080)
// Extracted from Figma via MCP

export const BOTTLE_LIST_SPEC = {
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
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: -13,
      left: -295,
      width: 877.876,
      height: 1267.81,
      rotation: 10.741,
      zIndex: 1,
      imageKey: 'lifestyleA'
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 135,
      left: 487,
      width: 500,
      height: 207,
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'accent',
      textAlign: 'left' as const,
      zIndex: 2,
      copyKey: 'bottle.headline'
    },
    
    benefitsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 392, // 135 + 207 (headline height) + 50 (spacing)
      left: 487,
      gap: 50,
      zIndex: 30
    },
    
    benefitStyle: {
      container: {
        gap: 20
      },
      icon: {
        size: 60,
        fontSize: 48,
        fontWeight: 300,
        lineHeight: 1.1,
        letterSpacing: -1,
        color: 'accent'
      },
      title: {
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: 0.5,
        color: 'accent',
        height: 50,
        width: 420
      },
      description: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: 1,
        textTransform: 'uppercase' as const,
        color: 'textSecondary',
        width: 420,
        gap: 8
      }
    }
  }
}

