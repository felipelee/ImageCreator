import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TESTIMONIAL_SPEC } from '@/lib/layouts/specs/testimonial-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface TestimonialLayoutProps {
  brand: Brand
  sku: SKU
}

export function TestimonialLayout({ brand, sku }: TestimonialLayoutProps) {
  const spec = TESTIMONIAL_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  // Determine background mode (image or color)
  const backgroundMode = sku.backgroundMode?.testimonial || 
    (sku.images.testimonialPhoto ? 'image' : 'color')
  
  // Get background color (will be used in color mode)
  const backgroundColor = getFieldColorValue(brand, sku, 'testimonial', 'Background Color', 'bg')
  
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
      {/* Background - Image or Color */}
      {backgroundMode === 'image' && sku.images.testimonialPhoto ? (
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
      ) : (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.background.top,
            left: spec.elements.background.left,
            width: spec.elements.background.width,
            height: spec.elements.background.height,
            backgroundColor: backgroundColor,
            zIndex: spec.elements.background.zIndex
          }}
        />
      )}

      {/* Quote Container Background */}
      <div
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
          transform: quoteContainerPos.rotation ? `rotate(${quoteContainerPos.rotation}deg)` : undefined
        }}
      />

      {/* Stars */}
      <p
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
          transform: starsPos.rotation ? `rotate(${starsPos.rotation}deg)` : undefined
        }}
      >
        {sku.copy.testimonial?.ratingLabel || '★★★★★'}
      </p>

      {/* Quote Text */}
      <p
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
          transform: quotePos.rotation ? `rotate(${quotePos.rotation}deg)` : undefined
        }}
      >
        "{sku.copy.testimonial?.quote || 'This product has completely changed my life. I feel better, have more energy, and the results are amazing!'}"
      </p>

      {/* Name */}
      <p
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
          transform: namePos.rotation ? `rotate(${namePos.rotation}deg)` : undefined
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
          zIndex: ctaStripPos.zIndex ?? spec.elements.ctaStrip.zIndex,
          transform: ctaStripPos.rotation ? `rotate(${ctaStripPos.rotation}deg)` : undefined
        }}
      />

      {/* CTA Text */}
      <p
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
          padding: 0
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
        isEditMode={false}
      />
    </div>
  )
}

