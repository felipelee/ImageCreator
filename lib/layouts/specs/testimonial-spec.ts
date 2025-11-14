// Testimonial: Photo + Quote (1080×1080)
// Extracted from Figma via MCP - Updated

export const TESTIMONIAL_SPEC = {
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
      imageKey: 'testimonialPhoto'
    },
    
    quoteContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      bottom: 120, // 120px from bottom (80px CTA strip + 40px gap)
      left: 56,
      right: 56,
      width: 968, // 1080 - 56 - 56
      maxWidth: 968,
      cornerRadius: 20,
      backgroundColor: 'bg',
      opacity: 0.9,
      padding: {
        top: 32,
        bottom: 32,
        left: 48,
        right: 48
      },
      zIndex: 2
    },
    
    stars: {
      fontSize: 34,
      fontWeight: 400,
      lineHeight: 1.0,
      letterSpacing: 0,
      color: 'accent',
      textAlign: 'center' as const,
      marginBottom: 20,
      copyKey: 'testimonial.ratingLabel'
    },
    
    quoteText: {
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'center' as const,
      marginBottom: 12,
      copyKey: 'testimonial.quote'
    },
    
    nameText: {
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'center' as const,
      copyKey: 'testimonial.name'
    },
    
    ctaStrip: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 1000,
      left: 0,
      width: 1080,
      height: 80,
      backgroundColor: 'accent',
      zIndex: 4
    },
    
    ctaText: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 1040,
      left: 540,
      width: 1000,
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: 0.5,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      transform: 'translate(-50%, -50%)',
      zIndex: 5,
      copyKey: 'testimonial.ctaStrip'
    }
  }
}

