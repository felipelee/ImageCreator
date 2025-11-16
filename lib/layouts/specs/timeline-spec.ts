// Timeline: Journey (1080×1080)
// Extracted from Figma via MCP

export const TIMELINE_SPEC = {
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
      imageKey: 'lifestyleTimeline',
      backgroundColorFallback: 'bg' // Color to use when in color mode
    },
    
    overlay: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      backgroundColor: 'rgba(22, 23, 22, 0.78)',
      zIndex: 1
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 61,
      left: 540,
      width: 796,
      height: 96,
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 2,
      copyKey: 'timeline.headline'
    },
    
    timelineContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 300,
      left: 487, // Moved left from 540 to align better
      width: 518,
      gap: 80,
      zIndex: 2
    },
    
    timelineLine: {
      type: 'line' as const,
      position: 'absolute' as const,
      top: 346,
      left: 575,
      x: 575,
      y: 346,
      width: 2,
      height: 550,
      backgroundColor: 'rgb(255, 255, 255)',
      transform: 'translateX(-50%)',
      zIndex: 20
    },
    
    milestoneStyle: {
      container: {
        gap: 40
      },
      badge: {
        backgroundColor: 'primarySoft',
        paddingX: 40,
        paddingY: 10,
        borderRadius: 500,
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.0,
        letterSpacing: 1,
        textTransform: 'uppercase' as const,
        color: '#000000',
        textAlign: 'center' as const
      },
      description: {
        fontSize: 32,
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: 0,
        color: '#FFFFFF',
        flex: 1
      }
    },
    
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 280,
      left: -67,
      width: 632,
      height: 772,
      objectFit: 'contain' as const,
      zIndex: 2,
      imageKey: 'productAngle'
    }
  }
}

