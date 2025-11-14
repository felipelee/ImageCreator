import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import html2canvas from 'html2canvas'

export interface RenderOptions {
  scale?: number
  format?: 'png' | 'jpg' | 'webp'
  quality?: number
}

// Layouts that have been converted to Satori
const SATORI_LAYOUTS = new Set([
  'statement',
  'testimonial',
  'comparison',
  'benefits',
  'bigStat',
  'multiStats',
  'promoProduct',
  'bottleList',
  'timeline',
  'priceComparison',
  'beforeAfter',
  'problemSolution',
  'featureGrid',
  'socialProof',
  'ingredientHero'
])

export async function renderLayout(
  layoutType: string,
  brand: Brand,
  sku: SKU,
  options?: RenderOptions
): Promise<Blob> {
  // Try Satori first if layout is converted
  if (SATORI_LAYOUTS.has(layoutType)) {
    try {
      const response = await fetch('/api/render-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand,
          sku,
          layoutType,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.warn(`Satori failed for ${layoutType}, falling back to html2canvas:`, errorText)
        throw new Error(`Satori API error: ${errorText}`)
      }

      const blob = await response.blob()
      
      // Validate blob
      if (!blob || blob.size === 0) {
        throw new Error('Satori returned empty blob')
      }

      return blob
    } catch (error) {
      console.error(`Satori rendering failed for ${layoutType}, falling back to html2canvas:`, error)
      // Fall through to html2canvas fallback
    }
  }
  
  // Fallback: try to find the element and use html2canvas
  // This requires the element to be rendered on the page
  throw new Error(`Layout ${layoutType}: Satori failed and html2canvas fallback requires DOM element. Please check console for details.`)
}

// Legacy html2canvas renderer for preview components
export async function renderLayoutFromElement(
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
  await new Promise(resolve => setTimeout(resolve, 500))

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
      // Fix for html2canvas rendering issues
      
      // 1. Fix flexbox centering in pill labels
      const flexCenterElements = clonedDoc.querySelectorAll('[style*="display: flex"]')
      flexCenterElements.forEach((el: Element) => {
        const htmlEl = el as HTMLElement
        if (htmlEl.style.display === 'flex') {
          if (htmlEl.style.alignItems === 'center' && htmlEl.style.justifyContent === 'center') {
            const spans = htmlEl.querySelectorAll('span')
            spans.forEach((span: Element) => {
              const spanEl = span as HTMLElement
              if (!spanEl.style.lineHeight || spanEl.style.lineHeight === 'normal') {
                spanEl.style.lineHeight = htmlEl.style.height || 'normal'
                spanEl.style.display = 'flex'
                spanEl.style.alignItems = 'center'
                spanEl.style.justifyContent = 'center'
                spanEl.style.height = '100%'
              }
            })
          }
        }
      })
      
      // 2. Ensure the root element has no transform
      const clonedElement = clonedDoc.querySelector('[style*="position: relative"]') as HTMLElement
      if (clonedElement && clonedElement.style.transform && !clonedElement.querySelector('[style*="rotate"]')) {
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

export async function renderAllForSKU(
  layouts: Array<{ type: string; brand: Brand; sku: SKU }>,
  options?: RenderOptions
): Promise<Blob[]> {
  const results: Blob[] = []
  
  for (const layout of layouts) {
    try {
      const blob = await renderLayout(layout.type, layout.brand, layout.sku, options)
      results.push(blob)
    } catch (error) {
      console.error('Failed to render layout:', error)
      throw error
    }
  }
  
  return results
}

