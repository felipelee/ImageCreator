// Testimonial Detail Layout (1080×1080)
// Lifestyle photo on top with detailed review section below

export const TESTIMONIAL_DETAIL_SPEC = {
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
      imageKey: 'testimonialPhoto2', // Image to use when in image mode
      objectFit: 'cover' as const,
      zIndex: 0
    },
    
    lifestylePhoto: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 540,
      objectFit: 'cover' as const,
      zIndex: 10,
      imageKey: 'lifestyleA'
    },
    
    reviewPanel: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 540,
      left: 0,
      width: 1080,
      height: 540,
      backgroundColor: 'bg',
      zIndex: 15
    },
    
    stars: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 580,
      left: 24,
      width: 200,
      height: 40,
      fontSize: 28,
      fontWeight: 400,
      lineHeight: 1.0,
      letterSpacing: 2,
      color: 'accent',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'testimonialDetail.rating'
    },
    
    quoteHeadline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 640,
      left: 24,
      width: 1032,
      height: 80,
      fontSize: 40,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'testimonialDetail.quoteHeadline'
    },
    
    reviewText: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 740,
      left: 24,
      width: 1032,
      height: 200,
      fontSize: 24,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'testimonialDetail.reviewText'
    },
    
    customerName: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 980,
      left: 24,
      width: 300,
      height: 40,
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'testimonialDetail.customerName'
    },
    
    verifiedBadge: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 985,
      left: 160,
      width: 160,
      height: 30,
      zIndex: 20
    }
  }
}

