'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { CustomElement as CustomElementType } from '@/types/custom-element'

interface CustomElementProps {
  element: CustomElementType
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  isSelected?: boolean
  onSelect?: () => void
  skuContentOverride?: any
}

export function CustomElement({
  element,
  brand,
  sku,
  isEditMode = false,
  isSelected = false,
  onSelect = () => {},
  skuContentOverride
}: CustomElementProps) {
  // Resolve content (SKU override > element default)
  const text = skuContentOverride?.text || element.content.text || ''
  const colorKey = skuContentOverride?.colorKey || element.content.colorKey || 'primary'
  const bgColorKey = element.style.backgroundColor || 'primarySoft'
  const textColorKey = element.style.textColor || 'primary'
  
  // Get actual colors from brand
  const bgColor = brand.colors[bgColorKey as keyof typeof brand.colors] || brand.colors.primary
  const textColor = brand.colors[textColorKey as keyof typeof brand.colors] || brand.colors.text
  
  // Editable props
  const editableProps = isEditMode ? {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect()
    },
    className: 'editable-element',
    style: {
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      outlineOffset: '2px',
      cursor: isEditMode ? (isSelected ? 'grab' : 'pointer') : 'default',
      transition: 'outline 0.15s ease'
    },
    'data-element-key': element.id,
    'data-editable': 'true'
  } : {}

  // Render based on type
  switch (element.type) {
    case 'text':
      return (
        <p
          {...editableProps}
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
            ...(editableProps.style || {})
          }}
        >
          {text || 'Text'}
        </p>
      )

    case 'badge':
      return (
        <div
          {...editableProps}
          style={{
            position: 'absolute',
            top: element.y,
            left: element.x,
            width: element.width ? `${element.width}px` : 'auto',
            height: element.height ? `${element.height}px` : 'auto',
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
            ...(editableProps.style || {})
          }}
        >
          {text || 'Badge'}
        </div>
      )

    case 'image':
      const imageKey = skuContentOverride?.imageKey || element.content.imageKey
      const imageSrc = imageKey ? (brand.images[imageKey as keyof typeof brand.images] || sku.images[imageKey as keyof typeof sku.images]) : undefined
      
      return (
        <div
          {...editableProps}
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
            ...(editableProps.style || {})
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
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed">
              No image
            </div>
          )}
        </div>
      )

    case 'shape':
      return (
        <div
          {...editableProps}
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
            ...(editableProps.style || {})
          }}
        />
      )

    default:
      return null
  }
}

