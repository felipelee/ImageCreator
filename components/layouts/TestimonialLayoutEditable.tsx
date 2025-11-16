'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TESTIMONIAL_SPEC } from '@/lib/layouts/specs/testimonial-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface TestimonialLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

export function TestimonialLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: TestimonialLayoutEditableProps) {
  const spec = TESTIMONIAL_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const quotePanelColor = getFieldColorValue(brand, sku, 'testimonial', 'Quote Panel Color', 'bg')
  const quoteColor = getFieldColorValue(brand, sku, 'testimonial', 'Quote', 'text')
  const ratingColor = getFieldColorValue(brand, sku, 'testimonial', 'Rating', 'accent')
  const ctaColor = getFieldColorValue(brand, sku, 'testimonial', 'CTA Strip', 'accent')

  // Resolve positions
  const quoteContainerPos = resolveElementPosition('testimonial', 'quoteContainer', {
    top: 680, left: 60, x: 60, y: 680, width: 960, height: 280, zIndex: 20
  }, sku.positionOverrides)
  
  const starsPos = resolveElementPosition('testimonial', 'stars', {
    top: 710, left: 60, x: 60, y: 710, width: 960, height: 40, zIndex: 21
  }, sku.positionOverrides)
  
  const quotePos = resolveElementPosition('testimonial', 'quote', {
    top: 770, left: 60, x: 60, y: 770, width: 960, height: 104, zIndex: 21
  }, sku.positionOverrides)
  
  const namePos = resolveElementPosition('testimonial', 'name', {
    top: 889, left: 60, x: 60, y: 889, width: 960, height: 40, zIndex: 21
  }, sku.positionOverrides)
  
  const ctaStripPos = resolveElementPosition('testimonial', 'ctaStrip', spec.elements.ctaStrip, sku.positionOverrides)
  const ctaTextPos = resolveElementPosition('testimonial', 'ctaText', {
    ...spec.elements.ctaText,
    top: 1036,
    y: 1036
  }, sku.positionOverrides)

  // Editable props
  const getEditableProps = (elementKey: string) => {
    if (!isEditMode) return {}
    
    const isSelected = selectedElement === elementKey
    
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelectElement(elementKey)
      },
      className: isEditMode ? 'editable-element' : '',
      style: {
        outline: isSelected ? '2px solid #3b82f6' : 'none',
        outlineOffset: '2px',
        cursor: isEditMode ? (isSelected ? 'grab' : 'pointer') : 'default',
        transition: 'outline 0.15s ease'
      },
      'data-element-key': elementKey,
      'data-editable': 'true'
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
        overflow: 'hidden',
        fontFamily: fonts.family
      }}
    >
      {/* Background Photo */}
      {sku.images.testimonialPhoto && (
        <img
          src={sku.images.testimonialPhoto}
          alt=""
          style={{
            position: 'absolute',
            top: spec.elements.background.top,
            left: spec.elements.background.left,
            width: spec.elements.background.width,
            height: spec.elements.background.height,
            objectFit: spec.elements.background.objectFit,
            zIndex: spec.elements.background.zIndex
          }}
        />
      )}

      {/* Quote Container Background - Editable */}
      <div
        {...getEditableProps('quoteContainer')}
        style={{
          position: 'absolute',
          top: quoteContainerPos.top,
          left: quoteContainerPos.left,
          width: quoteContainerPos.width ? `${quoteContainerPos.width}px` : 960,
          height: quoteContainerPos.height ? `${quoteContainerPos.height}px` : 320,
          borderRadius: spec.elements.quoteContainer.cornerRadius,
          backgroundColor: quotePanelColor,
          opacity: spec.elements.quoteContainer.opacity,
          zIndex: quoteContainerPos.zIndex ?? spec.elements.quoteContainer.zIndex,
          transform: quoteContainerPos.rotation ? `rotate(${quoteContainerPos.rotation}deg)` : undefined,
          ...((getEditableProps('quoteContainer') as any).style || {})
        }}
      />

      {/* Stars - Editable */}
      <p
        {...getEditableProps('stars')}
        style={{
          position: 'absolute',
          top: starsPos.top,
          left: starsPos.left,
          width: starsPos.width ? `${starsPos.width}px` : 960,
          fontFamily: fonts.family,
          fontSize: spec.elements.stars.fontSize,
          fontWeight: spec.elements.stars.fontWeight,
          lineHeight: spec.elements.stars.lineHeight,
          letterSpacing: `${spec.elements.stars.letterSpacing}px`,
          color: ratingColor,
          textAlign: spec.elements.stars.textAlign,
          zIndex: starsPos.zIndex ?? 21,
          margin: 0,
          padding: 0,
          transform: starsPos.rotation ? `rotate(${starsPos.rotation}deg)` : undefined,
          ...((getEditableProps('stars') as any).style || {})
        }}
      >
        {sku.copy.testimonial?.ratingLabel || '★★★★★'}
      </p>

      {/* Quote Text - Editable */}
      <p
        {...getEditableProps('quote')}
        style={{
          position: 'absolute',
          top: quotePos.top,
          left: quotePos.left,
          width: quotePos.width ? `${quotePos.width}px` : 960,
          height: quotePos.height ? `${quotePos.height}px` : 'auto',
          fontFamily: fonts.family,
          fontSize: spec.elements.quoteText.fontSize,
          fontWeight: spec.elements.quoteText.fontWeight,
          lineHeight: spec.elements.quoteText.lineHeight,
          letterSpacing: `${spec.elements.quoteText.letterSpacing}px`,
          color: quoteColor,
          textAlign: spec.elements.quoteText.textAlign,
          zIndex: quotePos.zIndex ?? 21,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          transform: quotePos.rotation ? `rotate(${quotePos.rotation}deg)` : undefined,
          ...((getEditableProps('quote') as any).style || {})
        }}
      >
        "{sku.copy.testimonial?.quote || 'This product has completely changed my life. I feel better, have more energy, and the results are amazing!'}"
      </p>

      {/* Name - Editable */}
      <p
        {...getEditableProps('name')}
        style={{
          position: 'absolute',
          top: namePos.top,
          left: namePos.left,
          width: namePos.width ? `${namePos.width}px` : 960,
          fontFamily: fonts.family,
          fontSize: spec.elements.nameText.fontSize,
          fontWeight: spec.elements.nameText.fontWeight,
          lineHeight: spec.elements.nameText.lineHeight,
          letterSpacing: `${spec.elements.nameText.letterSpacing}px`,
          color: quoteColor,
          textAlign: spec.elements.nameText.textAlign,
          zIndex: namePos.zIndex ?? 21,
          margin: 0,
          padding: 0,
          transform: namePos.rotation ? `rotate(${namePos.rotation}deg)` : undefined,
          ...((getEditableProps('name') as any).style || {})
        }}
      >
        {sku.copy.testimonial?.name || '-Sarah S.'}
      </p>

      {/* CTA Strip Background */}
      <div
        style={{
          position: 'absolute',
          top: ctaStripPos.top,
          left: ctaStripPos.left,
          width: ctaStripPos.width,
          height: ctaStripPos.height,
          backgroundColor: ctaColor,
          zIndex: ctaStripPos.zIndex ?? spec.elements.ctaStrip.zIndex
        }}
      />

      {/* CTA Text - Editable */}
      <p
        {...getEditableProps('ctaText')}
        style={{
          position: 'absolute',
          top: ctaTextPos.top,
          left: ctaTextPos.left,
          width: ctaTextPos.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.ctaText.fontSize,
          fontWeight: spec.elements.ctaText.fontWeight,
          lineHeight: spec.elements.ctaText.lineHeight,
          letterSpacing: `${spec.elements.ctaText.letterSpacing}px`,
          color: spec.elements.ctaText.color,
          textAlign: spec.elements.ctaText.textAlign,
          transform: spec.elements.ctaText.transform || 'translateX(-50%)',
          zIndex: ctaTextPos.zIndex ?? spec.elements.ctaText.zIndex,
          margin: 0,
          padding: 0,
          ...((getEditableProps('ctaText') as any).style || {})
        }}
      >
        {sku.copy.testimonial?.ctaStrip || 'Save $10 off your first order'}
      </p>

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.testimonial || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={isEditMode}
        selectedElement={selectedElement}
        onSelectElement={onSelectElement}
      />
    </div>
  )
}

