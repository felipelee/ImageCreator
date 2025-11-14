// Statement: Bold Question/Statement Ad (1080×1080)
// Eye-catching layout with bold statement, product, and quick benefits

export const STATEMENT_SPEC = {
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
    
    // Bold statement or question at top
    statement: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 60,
      left: 60,
      width: 960,
      fontSize: 84,
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: -2,
      color: 'accent',
      textAlign: 'center' as const,
      zIndex: 2,
      copyKey: 'statement.statement'
    },
    
    // Product image - centered
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 380,
      left: 290,
      width: 500,
      height: 400,
      objectFit: 'contain' as const,
      zIndex: 3,
      imageKey: 'productPrimary'
    },
    
    // Benefits container - bottom section
    benefitsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 820,
      left: 80,
      width: 920,
      zIndex: 2
    },
    
    // Benefit pill style
    benefitStyle: {
      height: 56,
      gap: 16,
      pill: {
        paddingX: 28,
        paddingY: 14,
        borderRadius: 28,
        backgroundColor: 'primarySoft',
        fontSize: 22,
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: 0,
        color: 'primary',
        textAlign: 'center' as const
      }
    },
    
    // CTA strip at bottom
    ctaStrip: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 920,
      left: 0,
      width: 1080,
      height: 160,
      backgroundColor: 'accent',
      zIndex: 1
    },
    
    ctaText: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 960,
      left: 60,
      width: 960,
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 1,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      zIndex: 2,
      copyKey: 'statement.cta'
    }
  }
}

