// Benefits: Pack + Callouts (1080×1080)
// Extracted from Figma via MCP

export const BENEFITS_SPEC = {
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
      imageKey: 'backgroundBenefits'
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 60,
      left: 540,
      width: 963,
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'primary',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'benefits.headline'
    },
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 270,
      left: 200,
      width: 680,
      height: 850,
      objectFit: 'contain' as const,
      zIndex: 1,
      imageKey: 'productPrimary'
    },
    
    // 4 benefit callouts positioned around product
    callouts: [
      {
        // Top Left: "54% better overall performance*"
        position: { top: 574, left: 64 },
        connectorSide: 'right' as const,
        copyKey: 'benefits.bullet1'
      },
      {
        // Top Right: "47% less muscle fatigue*"
        position: { top: 485, left: 573 },
        connectorSide: 'left' as const,
        copyKey: 'benefits.bullet2'
      },
      {
        // Bottom Right: "4X more muscle protein synthesis*"
        position: { top: 757, left: 581 },
        connectorSide: 'left' as const,
        copyKey: 'benefits.bullet3'
      },
      {
        // Bottom Left: "144% stronger strength recovery vs whey*"
        position: { top: 867, left: 24 },
        connectorSide: 'right' as const,
        copyKey: 'benefits.bullet4'
      }
    ],
    
    calloutStyle: {
      backgroundColor: 'primary',
      color: 'bgAlt',
      fontSize: 24, // Fixed size for pills
      fontWeight: 700,
      lineHeight: 1.4,
      paddingX: 40,
      paddingY: 15,
      borderRadius: 500, // Pill shape
      textAlign: 'center' as const,
      maxWidth: 380, // Limit width so text wraps
      minWidth: 260
    },
    
    connector: {
      width: 100,
      height: 3,
      color: 'primary'
    }
  }
}

