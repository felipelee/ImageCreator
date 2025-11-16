import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
// @ts-ignore - dom-to-image-more doesn't have official types
import domtoimage from 'dom-to-image-more'

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
        console.warn(`Satori failed for ${layoutType}, falling back to dom-to-image:`, errorText)
        throw new Error(`Satori API error: ${errorText}`)
      }

      const blob = await response.blob()
      
      // Validate blob
      if (!blob || blob.size === 0) {
        throw new Error('Satori returned empty blob')
      }

      return blob
    } catch (error) {
      console.error(`Satori rendering failed for ${layoutType}, falling back to dom-to-image:`, error)
      // Fall through to dom-to-image fallback
    }
  }
  
  // Fallback: try to find the element and use dom-to-image
  // This requires the element to be rendered on the page
  throw new Error(`Layout ${layoutType}: Satori failed and dom-to-image fallback requires DOM element. Please check console for details.`)
}

// dom-to-image-more renderer for preview components
export async function renderLayoutFromElement(
  element: HTMLElement,
  options?: RenderOptions
): Promise<Blob> {
  const scale = options?.scale || 2
  const format = options?.format || 'png'
  const quality = options?.quality || 0.95

  console.log('[dom-to-image] Starting render...', { scale, format, quality })

  // Ensure fonts and images are loaded
  await document.fonts.ready
  await waitForImages(element)
  
  // Small delay for paint
  await new Promise(resolve => setTimeout(resolve, 500))

  // Add "exporting" class to strip all debug borders/outlines
  document.body.classList.add('exporting')

  try {
    // dom-to-image-more handles modern CSS natively - no workarounds needed!
    const dataUrl = await domtoimage.toPng(element, {
      width: element.offsetWidth * scale,
      height: element.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`
      },
      quality: quality,
      cacheBust: true // Ensure fresh images
    })

    console.log('[dom-to-image] Render successful')

    // Convert data URL to blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    // Convert to desired format if needed
    if (format !== 'png') {
      return convertBlobFormat(blob, format, quality)
    }
    
    return blob
  } catch (error) {
    console.error('[dom-to-image] Render failed:', error)
    throw new Error(`Failed to render layout: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    // Always remove the exporting class, even if there was an error
    document.body.classList.remove('exporting')
  }
}

// Helper: Convert blob to different format
async function convertBlobFormat(blob: Blob, format: 'jpg' | 'webp', quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      
      // Draw white background for jpg
      if (format === 'jpg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/webp'
    canvas.toBlob(
        (result) => {
          if (result) resolve(result)
          else reject(new Error('Failed to convert format'))
      },
      mimeType,
      quality
    )
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for conversion'))
    }
    
    img.src = url
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

