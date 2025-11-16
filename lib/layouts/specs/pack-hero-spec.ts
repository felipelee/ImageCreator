// Pack Hero: Tall Packshot (1080×1920)
// Extracted from Figma plugin code: createPackHeroComponent

export const PACK_HERO_SPEC = {
  canvas: { width: 1080, height: 1920 },
  
  elements: {
    topBackground: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 600,
      backgroundColor: 'bg',
      imageKey: 'backgroundHero', // Image to use when in image mode
      objectFit: 'cover' as const,
      zIndex: 0
    },
    
    logo: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 60,
      left: 440,
      width: 200,
      height: 80,
      backgroundColor: '#CCCCCC',
      opacity: 0.3,
      zIndex: 1
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 200,
      left: 90,
      width: 900,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'text',
      textAlign: 'center' as const,
      zIndex: 2,
      copyKey: 'packHero.headline'
    },
    
    subhead: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 450,
      left: 140,
      width: 800,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'textSecondary',
      textAlign: 'center' as const,
      zIndex: 2,
      copyKey: 'packHero.subhead'
    },
    
    productPack: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 650,
      left: 190,
      width: 700,
      height: 900,
      objectFit: 'contain' as const,
      zIndex: 3,
      imageKey: 'productPrimary'
    },
    
    bottomStrip: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 1620,
      left: 0,
      width: 1080,
      height: 300,
      backgroundColor: 'primarySoft',
      zIndex: 1
    }
  }
}

