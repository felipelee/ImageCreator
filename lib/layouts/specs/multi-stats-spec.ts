// Multi Stats: Three Metrics (1080×1080)
// Extracted from Figma via MCP

export const MULTI_STATS_SPEC = {
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
      imageKey: 'lifestyleMultiStats'
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 48,
      left: 555,
      width: 930,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'bg',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'stats.headline'
    },
    
    statsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 280,
      left: 638,
      gap: 40,
      zIndex: 2
    },
    
    statStyle: {
      value: {
        fontSize: 128,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: -2,
        color: 'bg'
      },
      label: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: 1,
        textTransform: 'uppercase' as const,
        color: 'bg',
        width: 420,
        marginTop: 8
      }
    },
    
    disclaimer: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 1018,
      left: 638,
      width: 357,
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'rgba(128, 128, 128, 0.7)',
      textAlign: 'left' as const,
      zIndex: 2,
      copyKey: 'stats.disclaimer'
    }
  }
}

