// Stats With Product Layout (1080×1080)
// Multiple statistics on left with product image on right

export const STATS_WITH_PRODUCT_SPEC = {
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
      top: 95,
      left: 70,
      width: 600,
      height: 50,
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 2,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.headline'
    },
    
    stat1Value: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 220,
      left: 70,
      width: 400,
      height: 150,
      fontSize: 140,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -4,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.stat1_value'
    },
    
    stat1Label: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 380,
      left: 70,
      width: 400,
      height: 60,
      fontSize: 28,
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.stat1_label'
    },
    
    stat2Value: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 480,
      left: 70,
      width: 400,
      height: 150,
      fontSize: 140,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -4,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.stat2_value'
    },
    
    stat2Label: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 640,
      left: 70,
      width: 400,
      height: 80,
      fontSize: 28,
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.stat2_label'
    },
    
    stat3Value: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 760,
      left: 70,
      width: 400,
      height: 150,
      fontSize: 140,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -4,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.stat3_value'
    },
    
    stat3Label: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 920,
      left: 70,
      width: 400,
      height: 80,
      fontSize: 28,
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'statsWithProduct.stat3_label'
    },
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 200,
      left: 580,
      width: 450,
      height: 700,
      objectFit: 'contain' as const,
      zIndex: 15,
      imageKey: 'productPrimary'
    }
  }
}

