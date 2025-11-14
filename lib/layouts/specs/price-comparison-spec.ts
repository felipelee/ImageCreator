// Price Comparison (1080×1080)
// Extracted from Figma via MCP

export const PRICE_COMPARISON_SPEC = {
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
      top: 60,
      left: 540,
      width: 900,
      height: 239,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'text',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'priceComparison.headline'
    },
    
    // Left side - Supplements Pile placeholder
    supplementsPile: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 349,
      left: 80,
      width: 350,
      height: 450,
      objectFit: 'cover' as const,
      zIndex: 1,
      imageKey: 'supplementsPile'
    },
    
    // Center - Product image
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 349,
      left: 365,
      width: 350,
      height: 450,
      objectFit: 'contain' as const,
      zIndex: 1,
      imageKey: 'productImage'
    },
    
    // Left price (higher price - supplements pile)
    priceLeft: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 839,
      left: 250,
      width: 300,
      height: 70,
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.0,
      color: 'text',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'priceComparison.priceLeft'
    },
    
    labelLeft: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 925,
      left: 250,
      width: 300,
      height: 30,
      fontSize: 20,
      fontWeight: 400,
      lineHeight: 1.0,
      color: 'text',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'priceComparison.labelLeft'
    },
    
    // Price highlight box (center)
    priceHighlight: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 824,
      left: 385,
      width: 300,
      height: 90,
      borderRadius: 8,
      backgroundColor: 'primary',
      zIndex: 1
    },
    
    // Center price (lower price - your product)
    priceCenter: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 839,
      left: 535,
      width: 280,
      height: 70,
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.0,
      color: 'bg',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 3,
      copyKey: 'priceComparison.priceCenter'
    },
    
    labelCenter: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 925,
      left: 535,
      width: 280,
      height: 30,
      fontSize: 20,
      fontWeight: 400,
      lineHeight: 1.0,
      color: 'primary',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'priceComparison.labelCenter'
    },
    
    // Right side benefits list (6 items)
    benefitsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 369,
      left: 750,
      width: 250,
      zIndex: 2
    },
    
    benefit: {
      fontSize: 24,
      fontWeight: 400,
      lineHeight: 1.0,
      color: 'text',
      height: 50,
      gap: 20 // Gap between benefit items
    },
    
    // Disclaimer text at bottom
    disclaimer: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 1020,
      left: 540,
      width: 900,
      height: 40,
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.4,
      color: 'textSecondary',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'priceComparison.disclaimer'
    }
  }
}

