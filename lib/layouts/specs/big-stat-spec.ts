// Big Stat: Large Percentage (1080×1080)
// Extracted from Figma via MCP

export const BIG_STAT_SPEC = {
  canvas: { width: 1080, height: 1080 },
  
  elements: {
    backgroundColor: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      backgroundColor: 'bgAlt',
      zIndex: 0
    },

    backgroundImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      objectFit: 'cover' as const,
      opacity: 0.2,
      zIndex: 1,
      imageKey: 'backgroundAlt'
    },
    
    statValue: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 384,
      left: 540,
      width: 1080,
      useDisplayFont: true, // Use brand.fonts.sizes.display
      color: 'accent',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2, // Behind ingredient images
      copyKey: 'stat97.value'
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 676,
      left: 540,
      width: 729,
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: -1,
      color: 'accent',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2, // Behind ingredient images
      copyKey: 'stat97.headline'
    },
    
    // 4 circular ingredient images with labels
    ingredients: [
      {
        // Top Left: Citric Acid
        image: { top: 113, left: 26, size: 409, zIndex: 4 },
        label: { top: 310, left: 210, width: 120 },
        copyKey: 'stat97.ingredient1'
      },
      {
        // Top Right: Pomelo Extract  
        image: { top: -69, left: 496, size: 627, zIndex: 4 },
        label: { top: 236, left: 725, width: 170 },
        copyKey: 'stat97.ingredient2'
      },
      {
        // Bottom Left: L-Theanine
        image: { top: 699, left: 26, size: 395, zIndex: 4 },
        label: { top: 980, left: 200, width: 139 },
        copyKey: 'stat97.ingredient3'
      },
      {
        // Bottom Right: Methylcobalamin
        image: { top: 591, left: 564, size: 611, zIndex: 4 },
        label: { top: 897, left: 782, width: 195 },
        copyKey: 'stat97.ingredient4'
      }
    ],
    
    ingredientLabelStyle: {
      backgroundColor: 'accent',
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 600,
      height: 40,
      borderRadius: 20,
      textAlign: 'center' as const
    }
  }
}

