// Before/After: Transformation Layout (1080×1080)
// Split screen showing before vs after with product

export const BEFORE_AFTER_SPEC = {
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
    
    // Top headline
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 60,
      left: 60,
      width: 960,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'accent',
      textAlign: 'center' as const,
      zIndex: 3,
      copyKey: 'beforeAfter.headline'
    },
    
    // Before section
    beforeContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 200,
      left: 60,
      width: 440,
      height: 580,
      zIndex: 2
    },
    
    beforeLabel: {
      type: 'text' as const,
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      color: 'textSecondary',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      copyKey: 'beforeAfter.beforeLabel'
    },
    
    beforeText: {
      type: 'text' as const,
      fontSize: 24,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'center' as const,
      marginTop: 20,
      copyKey: 'beforeAfter.beforeText'
    },
    
    // After section
    afterContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 200,
      left: 580,
      width: 440,
      height: 580,
      zIndex: 2
    },
    
    afterLabel: {
      type: 'text' as const,
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      color: 'accent',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      copyKey: 'beforeAfter.afterLabel'
    },
    
    afterText: {
      type: 'text' as const,
      fontSize: 24,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'center' as const,
      marginTop: 20,
      copyKey: 'beforeAfter.afterText'
    },
    
    // Product image at bottom center
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 820,
      left: 390,
      width: 300,
      height: 220,
      objectFit: 'contain' as const,
      zIndex: 4,
      imageKey: 'productPrimary'
    },
    
    // Divider line
    divider: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 180,
      left: 538,
      width: 4,
      height: 720,
      backgroundColor: 'primarySoft',
      zIndex: 1
    }
  }
}

