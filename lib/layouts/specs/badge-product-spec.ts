// Badge Product Layout (1080×1080)
// Main product centered with 4 circular badge callouts

export const BADGE_PRODUCT_SPEC = {
  canvas: { width: 1080, height: 1080 },
  
  elements: {
    background: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      objectFit: 'cover' as const,
      zIndex: 0,
      imageKey: 'backgroundBadgeProduct',
      backgroundColorFallback: 'bg' // Color to use when in color mode
    },
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 140,
      left: 240,
      width: 600,
      height: 800,
      objectFit: 'contain' as const,
      zIndex: 10,
      imageKey: 'productPrimary'
    },
    
    badge1: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 180,
      left: 100,
      width: 180,
      height: 180,
      objectFit: 'contain' as const,
      zIndex: 20,
      imageKey: 'badge1'
    },
    
    badge2: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 180,
      left: 800,
      width: 180,
      height: 180,
      objectFit: 'contain' as const,
      zIndex: 20,
      imageKey: 'badge2'
    },
    
    badge3: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 720,
      left: 100,
      width: 180,
      height: 180,
      objectFit: 'contain' as const,
      zIndex: 20,
      imageKey: 'badge3'
    },
    
    badge4: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 720,
      left: 800,
      width: 180,
      height: 180,
      objectFit: 'contain' as const,
      zIndex: 20,
      imageKey: 'badge4'
    }
  }
}

