// Product Promo with Badge (1080×1080)
// Extracted from Figma via MCP

export const PROMO_PRODUCT_SPEC = {
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
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 80,
      left: 80,
      width: 656,
      height: 566,
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'accent',
      textAlign: 'left' as const,
      zIndex: 2,
      copyKey: 'promo.headline'
    },
    
    statsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 494,
      left: 80,
      gap: 40,
      zIndex: 2
    },
    
    statStyle: {
      value: {
        fontSize: 96,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: -2,
        color: 'accent'
      },
      label: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: 1,
        textTransform: 'uppercase' as const,
        color: 'accent'
      },
      stat1: {
        labelWidth: 200,
        labelHeight: 60
      },
      stat2: {
        labelWidth: 254,
        labelHeight: 136
      },
      stat3: {
        labelWidth: 171,
        labelHeight: 136
      }
    },
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 352,
      left: 489,
      width: 632,
      height: 772,
      objectFit: 'contain' as const,
      zIndex: 1,
      imageKey: 'productAngle'
    },
    
    promoBadge: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 60,
      left: 770,
      width: 240,
      height: 240,
      zIndex: 3,
      imageKey: 'promoBadge'
    },
    
    badgeNote: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 142,
      left: 890,
      width: 200,
      height: 18,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.0,
      letterSpacing: 0,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 4,
      copyKey: 'promo.badgeNote'
    },
    
    badgeTextContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 189,
      left: 890,
      width: 200,
      transform: 'translateX(-50%) translateY(-50%)',
      zIndex: 4
    },
    
    badgeText: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: 0,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      copyKey: 'promo.badge'
    }
  }
}

