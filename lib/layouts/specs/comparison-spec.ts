// Comparison: Ours vs Theirs (1080×1080)
// Extracted from Figma via MCP

export const COMPARISON_SPEC = {
  canvas: { width: 1080, height: 1080 },
  
  elements: {
    background: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1350,
      backgroundColor: 'bg',
      zIndex: 0
    },
    
    headline: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 115,
      left: 56,
      width: 470,
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.0,
      letterSpacing: -2,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 2,
      copyKey: 'compare.headline'
    },
    
    // Left highlight column (dark - "yours")
    leftColumn: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 164,
      left: 546,
      width: 217,
      height: 847,
      borderRadius: 20,
      backgroundColor: 'accent',
      zIndex: 1
    },
    
    // Right highlight column (light - "theirs")
    rightColumn: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 164,
      left: 806,
      width: 217,
      height: 847,
      borderRadius: 20,
      backgroundColor: 'bgAlt',
      zIndex: 1
    },
    
    // Left comparison image
    leftImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 64,
      left: 534,
      width: 229,
      height: 229,
      objectFit: 'contain' as const,
      zIndex: 3,
      imageKey: 'comparisonOurs'
    },
    
    // Right comparison image
    rightImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 76,
      left: 815,
      width: 200,
      height: 200,
      objectFit: 'cover' as const,
      zIndex: 3,
      imageKey: 'comparisonTheirs'
    },
    
    // Left label ("Natural Peptides")
    leftLabel: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 306,
      left: 655,
      width: 200,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'bg',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 4,
      copyKey: 'compare.leftLabel'
    },
    
    // Right label ("Synthetic Alternatives")
    rightLabel: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 306,
      left: 915,
      width: 200,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
      color: 'textSecondary',
      textAlign: 'center' as const,
      transform: 'translateX(-50%)',
      zIndex: 4,
      copyKey: 'compare.rightLabel'
    },
    
    // Comparison rows container
    rowsContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 436,
      left: 75,
      width: 880,
      zIndex: 2
    },
    
    // Row 1
    row1: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 436,
      left: 75,
      width: 880,
      zIndex: 20
    },
    
    // Row 2 (120px row height + 16px gap = 136px spacing)
    row2: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 572,
      left: 75,
      width: 880,
      zIndex: 20
    },
    
    // Row 3
    row3: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 708,
      left: 75,
      width: 880,
      zIndex: 20
    },
    
    // Row 4
    row4: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 844,
      left: 75,
      width: 880,
      zIndex: 20
    },
    
    // Individual row specs (4 rows total)
    row: {
      gap: 16, // Gap between rows (margin between divider and next row)
      label: {
        width: 400,
        fontSize: 32,
        fontWeight: 700,
        lineHeight: 1.4,
        color: 'text'
      },
      checkmark: {
        fontSize: 48,
        color: 'bgAlt',
        leftPosition: 654.5, // Center of left highlight column (546 + 217/2)
        symbol: '✓'
      },
      cross: {
        fontSize: 48,
        color: 'accent',
        leftPosition: 914.5, // Center of right highlight column (806 + 217/2)
        symbol: '✗'
      }
    }
  }
}

