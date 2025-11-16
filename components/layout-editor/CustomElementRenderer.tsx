'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { CustomElement as CustomElementType } from '@/types/custom-element'

interface CustomElementRendererProps {
  customElements?: CustomElementType[]
  brand: Brand
  sku: SKU
  skuContentOverrides?: { [elementId: string]: any }
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementId: string) => void
}

export function CustomElementRenderer({
  customElements = [],
  brand,
  sku,
  skuContentOverrides = {},
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {}
}: CustomElementRendererProps) {
  if (customElements.length === 0) return null

  const getEditableProps = (elementId: string) => {
    if (!isEditMode) return {}
    
    const isSelected = selectedElement === elementId
    
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelectElement(elementId)
      },
      className: isEditMode ? 'editable-element' : '',
      style: {
        outline: isSelected ? '2px solid #3b82f6' : 'none',
        outlineOffset: '2px',
        cursor: isEditMode ? (isSelected ? 'grab' : 'pointer') : 'default',
        transition: 'outline 0.15s ease'
      },
      'data-element-key': elementId,
      'data-editable': 'true'
    }
  }

  return (
    <>
      {customElements.map((element) => {
        // Resolve content (SKU override > element default)
        const contentOverride = skuContentOverrides[element.id]
        const text = contentOverride?.text || element.content.text || ''
        const imageKey = contentOverride?.imageKey || element.content.imageKey
        
        // Get colors from brand
        const bgColorKey = element.style.backgroundColor || 'primarySoft'
        const textColorKey = element.style.textColor || 'primary'
        const bgColor = brand.colors[bgColorKey as keyof typeof brand.colors] || brand.colors.primary
        const textColor = brand.colors[textColorKey as keyof typeof brand.colors] || brand.colors.text

        // Render based on type
        switch (element.type) {
          case 'text':
            return (
              <p
                key={element.id}
                {...getEditableProps(element.id)}
                style={{
                  position: 'absolute',
                  top: element.y,
                  left: element.x,
                  width: element.width ? `${element.width}px` : 'auto',
                  fontFamily: brand.fonts.family,
                  fontSize: element.style.fontSize || 48,
                  fontWeight: element.style.fontWeight || 700,
                  color: textColor,
                  margin: 0,
                  padding: 0,
                  zIndex: element.zIndex,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                  ...((getEditableProps(element.id) as any).style || {})
                }}
              >
                {text || 'Text'}
              </p>
            )

          case 'badge':
            return (
              <div
                key={element.id}
                {...getEditableProps(element.id)}
                style={{
                  position: 'absolute',
                  top: element.y,
                  left: element.x,
                  width: element.width ? `${element.width}px` : 'auto',
                  height: element.height ? `${element.height}px` : 'auto',
                  minWidth: element.width ? `${element.width}px` : 'auto',
                  backgroundColor: bgColor,
                  color: textColor,
                  padding: `${element.style.padding || 14}px ${(element.style.padding || 14) * 2}px`,
                  borderRadius: element.style.borderRadius || 28,
                  fontSize: element.style.fontSize || 22,
                  fontWeight: element.style.fontWeight || 600,
                  fontFamily: brand.fonts.family,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  zIndex: element.zIndex,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                  ...((getEditableProps(element.id) as any).style || {})
                }}
              >
                <span style={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {text || 'Badge'}
                </span>
              </div>
            )

          case 'image':
            const imageSrc = imageKey 
              ? (brand.images[imageKey as keyof typeof brand.images] || sku.images[imageKey as keyof typeof sku.images])
              : undefined
            
            return (
              <div
                key={element.id}
                {...getEditableProps(element.id)}
                style={{
                  position: 'absolute',
                  top: element.y,
                  left: element.x,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: element.zIndex,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                  ...((getEditableProps(element.id) as any).style || {})
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={element.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: element.style.objectFit || 'contain',
                      pointerEvents: 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center text-xs text-muted-foreground border border-dashed">
                    No image
                  </div>
                )}
              </div>
            )

          case 'shape':
            return (
              <div
                key={element.id}
                {...getEditableProps(element.id)}
                style={{
                  position: 'absolute',
                  top: element.y,
                  left: element.x,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  backgroundColor: bgColor,
                  borderRadius: element.style.borderRadius || 0,
                  zIndex: element.zIndex,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                  ...((getEditableProps(element.id) as any).style || {})
                }}
              />
            )

          default:
            return null
        }
      })}
    </>
  )
}

