import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TESTIMONIAL_SPEC } from '@/lib/layouts/specs/testimonial-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface TestimonialLayoutProps {
  brand: Brand
  sku: SKU
}

export function TestimonialLayout({ brand, sku }: TestimonialLayoutProps) {
  const spec = TESTIMONIAL_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const quotePanelColor = getFieldColorValue(brand, sku, 'testimonial', 'Quote Panel Color', 'bg')
  const quoteColor = getFieldColorValue(brand, sku, 'testimonial', 'Quote', 'text')
  const ratingColor = getFieldColorValue(brand, sku, 'testimonial', 'Rating', 'accent')
  const ctaColor = getFieldColorValue(brand, sku, 'testimonial', 'CTA Strip', 'accent')

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
      {/* Background Photo - Client Testimonial */}
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

      {/* Quote Container - Auto Height */}
      <div
        style={{
          position: 'absolute',
          bottom: spec.elements.quoteContainer.bottom,
          left: spec.elements.quoteContainer.left,
          right: spec.elements.quoteContainer.right,
          maxWidth: spec.elements.quoteContainer.maxWidth,
          margin: '0 auto',
          borderRadius: spec.elements.quoteContainer.cornerRadius,
          backgroundColor: quotePanelColor,
          opacity: spec.elements.quoteContainer.opacity,
          padding: `${spec.elements.quoteContainer.padding.top}px ${spec.elements.quoteContainer.padding.right}px ${spec.elements.quoteContainer.padding.bottom}px ${spec.elements.quoteContainer.padding.left}px`,
          zIndex: spec.elements.quoteContainer.zIndex,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
      {/* Stars */}
      <p
        style={{
          fontFamily: fonts.family,
          fontSize: spec.elements.stars.fontSize,
          fontWeight: spec.elements.stars.fontWeight,
          lineHeight: spec.elements.stars.lineHeight,
          letterSpacing: `${spec.elements.stars.letterSpacing}px`,
          color: ratingColor,
          textAlign: spec.elements.stars.textAlign,
          marginBottom: spec.elements.stars.marginBottom,
          margin: `0 0 ${spec.elements.stars.marginBottom}px 0`,
          padding: 0
        }}
      >
        {sku.copy.testimonial?.ratingLabel || '★★★★★'}
      </p>

      {/* Quote Text */}
      <p
        style={{
          fontFamily: fonts.family,
          fontSize: spec.elements.quoteText.fontSize,
          fontWeight: spec.elements.quoteText.fontWeight,
          lineHeight: spec.elements.quoteText.lineHeight,
          letterSpacing: `${spec.elements.quoteText.letterSpacing}px`,
          color: quoteColor,
          textAlign: spec.elements.quoteText.textAlign,
          margin: `0 0 ${spec.elements.quoteText.marginBottom}px 0`,
          padding: 0
        }}
      >
        "{sku.copy.testimonial?.quote || 'This product has completely changed my life. I feel better, have more energy, and the results are amazing!'}"
      </p>

      {/* Name */}
      <p
        style={{
          fontFamily: fonts.family,
          fontSize: spec.elements.nameText.fontSize,
          fontWeight: spec.elements.nameText.fontWeight,
          lineHeight: spec.elements.nameText.lineHeight,
          letterSpacing: `${spec.elements.nameText.letterSpacing}px`,
          color: quoteColor,
          textAlign: spec.elements.nameText.textAlign,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.testimonial?.name || '-Sarah S.'}
      </p>
      </div>

      {/* CTA Strip Background */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.ctaStrip.top,
          left: spec.elements.ctaStrip.left,
          width: spec.elements.ctaStrip.width,
          height: spec.elements.ctaStrip.height,
          backgroundColor: ctaColor,
          zIndex: spec.elements.ctaStrip.zIndex
        }}
      />

      {/* CTA Text */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.ctaText.top,
          left: spec.elements.ctaText.left,
          width: spec.elements.ctaText.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.ctaText.fontSize,
          fontWeight: spec.elements.ctaText.fontWeight,
          lineHeight: spec.elements.ctaText.lineHeight,
          letterSpacing: `${spec.elements.ctaText.letterSpacing}px`,
          color: spec.elements.ctaText.color,
          textAlign: spec.elements.ctaText.textAlign,
          transform: spec.elements.ctaText.transform,
          zIndex: spec.elements.ctaText.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.testimonial?.ctaStrip || 'Save $10 off your first order'}
      </p>
    </div>
  )
}

