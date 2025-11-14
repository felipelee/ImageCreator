// Feature Grid: 4 Key Features (1080×1080)
// Clean grid showcasing 4 main product features

export const FEATURE_GRID_SPEC = {
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
    
    // Headline
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 60,
      left: 60,
      width: 960,
      fontSize: 64,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: -1.5,
      color: 'accent',
      textAlign: 'center' as const,
      zIndex: 2,
      copyKey: 'featureGrid.headline'
    },
    
    // Product image centered
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 200,
      left: 340,
      width: 400,
      height: 280,
      objectFit: 'contain' as const,
      zIndex: 3,
      imageKey: 'productPrimary'
    },
    
    // Grid container
    gridContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 520,
      left: 80,
      width: 920,
      gap: 40,
      zIndex: 2
    },
    
    // Feature card style
    featureCard: {
      width: 440,
      height: 220,
      backgroundColor: 'bgAlt',
      borderRadius: 16,
      padding: 32,
      icon: {
        fontSize: 48,
        marginBottom: 16
      },
      title: {
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: 0,
        color: 'accent',
        marginBottom: 12
      },
      description: {
        fontSize: 20,
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: 0,
        color: 'text'
      }
    }
  }
}

