// Hero: Photo + Product Badge (1080×1350)
// Extracted from Figma plugin code: createHeroPhotoComponent

export const HERO_SPEC = {
  canvas: { width: 1080, height: 1350 },
  
  elements: {
    background: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1350,
      objectFit: 'cover' as const,
      zIndex: 0
    },
    
    overlay: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 600,
      height: 1350,
      backgroundColor: 'bg',
      opacity: 0.95,
      zIndex: 1
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 80,
      left: 60,
      width: 520,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 2,
      copyKey: 'hero1.headline'
    },
    
    subhead: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 280,
      left: 60,
      width: 520,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'textSecondary',
      textAlign: 'left' as const,
      zIndex: 2,
      copyKey: 'hero1.subhead'
    },
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 750,
      left: 80,
      width: 400,
      height: 500,
      objectFit: 'contain' as const,
      zIndex: 3,
      imageKey: 'productPrimary'
    },
    
    offerBadge: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 850,
      left: 400,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'badge',
      zIndex: 4,
      
      text: {
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: 0.5,
        color: '#FFFFFF',
        textAlign: 'center' as const,
        whiteSpace: 'pre-line' as const,
        copyKey: 'hero1.offerBadge'
      }
    }
  }
}

