// Social Proof: Multiple Reviews (1080×1080)
// Showcases multiple customer reviews with ratings

export const SOCIAL_PROOF_SPEC = {
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
      imageKey: 'lifestyleC', // Image to use when in image mode
      objectFit: 'cover' as const,
      zIndex: 0
    },
    
    // Top headline
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 60,
      left: 60,
      width: 960,
      fontSize: 56,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: -1,
      color: 'accent',
      textAlign: 'center' as const,
      zIndex: 2,
      copyKey: 'socialProof.headline'
    },
    
    // Product image at bottom
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 820,
      left: 390,
      width: 300,
      height: 200,
      objectFit: 'contain' as const,
      zIndex: 4,
      imageKey: 'productPrimary'
    },
    
    // Reviews container
    reviewsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 180,
      left: 60,
      width: 960,
      gap: 24,
      zIndex: 2
    },
    
    // Review card style
    reviewCard: {
      backgroundColor: 'bgAlt',
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      stars: {
        fontSize: 28,
        color: 'accent',
        marginBottom: 12
      },
      quote: {
        fontSize: 22,
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: 0,
        color: 'text',
        marginBottom: 12
      },
      name: {
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: 0,
        color: 'textSecondary'
      }
    }
  }
}

