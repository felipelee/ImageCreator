// Study Citation Layout (1080×1080)
// Highlights clinical research findings with source citation

export const STUDY_CITATION_SPEC = {
  canvas: { width: 1080, height: 1080 },
  
  elements: {
    background: {
      type: 'rectangle' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 1080,
      height: 1080,
      backgroundColor: 'bgAlt',
      imageKey: 'backgroundAlt', // Image to use when in image mode
      objectFit: 'cover' as const,
      zIndex: 0
    },
    
    studyContext: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 120,
      left: 84,
      width: 912,
      height: 60,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'studyCitation.context'
    },
    
    mainFinding: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 200,
      left: 84,
      width: 912,
      height: 450,
      fontSize: 84,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: -2,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'studyCitation.finding'
    },
    
    supplementName: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 680,
      left: 84,
      width: 500,
      height: 60,
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: 0,
      color: 'text',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'studyCitation.supplementName'
    },
    
    sourceCitation: {
      type: 'text' as const,
      position: 'absolute' as const,
      top: 980,
      left: 84,
      width: 400,
      height: 60,
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0,
      color: 'textSecondary',
      textAlign: 'left' as const,
      zIndex: 20,
      copyKey: 'studyCitation.source'
    },
    
    ingredientImage: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 680,
      left: 620,
      width: 376,
      height: 376,
      objectFit: 'contain' as const,
      zIndex: 15,
      imageKey: 'ingredientA'
    }
  }
}

