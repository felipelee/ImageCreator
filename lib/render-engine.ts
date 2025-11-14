import html2canvas from 'html2canvas'

export interface RenderOptions {
  scale?: number
  format?: 'png' | 'jpg' | 'webp'
  quality?: number
}

// Helper: Wait for all images to load
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img')
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve()
    return new Promise((resolve) => {
      img.onload = () => resolve(undefined)
      img.onerror = () => resolve(undefined)
      setTimeout(() => resolve(undefined), 5000)
    })
  })
  await Promise.all(imagePromises)
}

export async function renderLayout(
  element: HTMLElement,
  options?: RenderOptions
): Promise<Blob> {
  const scale = options?.scale || 2
  const format = options?.format || 'png'
  const quality = options?.quality || 0.95

  // Ensure fonts and images are loaded
  await document.fonts.ready
  await waitForImages(element)
  
  // Small delay for paint
  await new Promise(resolve => setTimeout(resolve, 300))

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      // In the cloned document, ensure all images render properly
      const clonedElement = clonedDoc.querySelector('[style*="position: relative"]') as HTMLElement
      if (clonedElement) {
        clonedElement.style.transform = 'none'
      }
    }
  })

  return new Promise((resolve, reject) => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png'
    
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to create blob'))
      },
      mimeType,
      quality
    )
  })
}

export async function renderAllForSKU(
  layoutElements: HTMLElement[],
  options?: RenderOptions
): Promise<Blob[]> {
  const results: Blob[] = []
  
  for (const element of layoutElements) {
    try {
      const blob = await renderLayout(element, options)
      results.push(blob)
    } catch (error) {
      console.error('Failed to render layout:', error)
      throw error
    }
  }
  
  return results
}

