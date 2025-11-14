// Problem/Solution: Problem → Product → Solution (1080×1080)
// Shows the problem, your product, and the solution

export const PROBLEM_SOLUTION_SPEC = {
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
    
    // Problem section (top)
    problemContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 60,
      left: 60,
      width: 960,
      height: 280,
      backgroundColor: 'bgAlt',
      borderRadius: 20,
      padding: 40,
      zIndex: 2
    },
    
    problemLabel: {
      type: 'text' as const,
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      color: 'textSecondary',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      copyKey: 'problemSolution.problemLabel'
    },
    
    problemText: {
      type: 'text' as const,
      fontSize: 36,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'center' as const,
      marginTop: 16,
      copyKey: 'problemSolution.problemText'
    },
    
    // Arrow
    arrow: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 360,
      left: 510,
      fontSize: 60,
      color: 'accent',
      zIndex: 3,
      content: '↓'
    },
    
    // Product section (middle)
    productImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 420,
      left: 340,
      width: 400,
      height: 300,
      objectFit: 'contain' as const,
      zIndex: 3,
      imageKey: 'productPrimary'
    },
    
    // Solution section (bottom)
    solutionContainer: {
      type: 'container' as const,
      position: 'absolute' as const,
      top: 740,
      left: 60,
      width: 960,
      height: 280,
      backgroundColor: 'accent',
      borderRadius: 20,
      padding: 40,
      zIndex: 2
    },
    
    solutionLabel: {
      type: 'text' as const,
      fontSize: 28,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      copyKey: 'problemSolution.solutionLabel'
    },
    
    solutionText: {
      type: 'text' as const,
      fontSize: 36,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: '#FFFFFF',
      textAlign: 'center' as const,
      marginTop: 16,
      copyKey: 'problemSolution.solutionText'
    }
  }
}

