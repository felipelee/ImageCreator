// UGC Grid Layout (1080×1080)
// 2x2 grid of user-generated content testimonial photos

export const UGC_GRID_SPEC = {
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
    
    photo1: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: 540,
      height: 540,
      objectFit: 'cover' as const,
      zIndex: 10,
      imageKey: 'testimonialPhoto'
    },
    
    photo2: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 0,
      left: 540,
      width: 540,
      height: 540,
      objectFit: 'cover' as const,
      zIndex: 10,
      imageKey: 'testimonialPhoto2'
    },
    
    photo3: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 540,
      left: 0,
      width: 540,
      height: 540,
      objectFit: 'cover' as const,
      zIndex: 10,
      imageKey: 'testimonialPhoto3'
    },
    
    photo4: {
      type: 'image' as const,
      position: 'absolute' as const,
      top: 540,
      left: 540,
      width: 540,
      height: 540,
      objectFit: 'cover' as const,
      zIndex: 10,
      imageKey: 'testimonialPhoto4'
    }
  }
}

