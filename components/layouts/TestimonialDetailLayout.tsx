import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TESTIMONIAL_DETAIL_SPEC } from '@/lib/layouts/specs/testimonial-detail-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface TestimonialDetailLayoutProps {
  brand: Brand
  sku: SKU
}

export function TestimonialDetailLayout({ brand, sku }: TestimonialDetailLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = TESTIMONIAL_DETAIL_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', accent: '#FF8C42', text: '#323429' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const bgColor = getFieldColorValue(brand, sku, 'testimonialDetail', 'Background Color', 'bg')
  const starsColor = getFieldColorValue(brand, sku, 'testimonialDetail', 'Stars', 'accent')
  const quoteColor = getFieldColorValue(brand, sku, 'testimonialDetail', 'Quote Headline', 'text')
  const textColor = getFieldColorValue(brand, sku, 'testimonialDetail', 'Review Text', 'text')
  const nameColor = getFieldColorValue(brand, sku, 'testimonialDetail', 'Customer Name', 'text')
  const badgeColor = getFieldColorValue(brand, sku, 'testimonialDetail', 'Verified Badge', 'accent')

  // Resolve positions with overrides
  const lifestylePhotoPos = resolveElementPosition('testimonialDetail', 'lifestylePhoto', {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    width: 1080,
    height: 540,
    zIndex: 10
  }, sku.positionOverrides)
  
  const starsPos = resolveElementPosition('testimonialDetail', 'stars', {
    top: 580,
    left: 24,
    x: 24,
    y: 580,
    width: 200,
    height: 40,
    zIndex: 20
  }, sku.positionOverrides)
  
  const quoteHeadlinePos = resolveElementPosition('testimonialDetail', 'quoteHeadline', {
    top: 640,
    left: 24,
    x: 24,
    y: 640,
    width: 1032,
    height: 80,
    zIndex: 20
  }, sku.positionOverrides)
  
  const reviewTextPos = resolveElementPosition('testimonialDetail', 'reviewText', {
    top: 740,
    left: 24,
    x: 24,
    y: 740,
    width: 1032,
    height: 200,
    zIndex: 20
  }, sku.positionOverrides)
  
  const customerNamePos = resolveElementPosition('testimonialDetail', 'customerName', {
    top: 980,
    left: 24,
    x: 24,
    y: 980,
    width: 300,
    height: 40,
    zIndex: 20
  }, sku.positionOverrides)
  
  const verifiedBadgePos = resolveElementPosition('testimonialDetail', 'verifiedBadge', {
    top: 985,
    left: 160,
    x: 160,
    y: 985,
    width: 160,
    height: 30,
    zIndex: 20
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
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.background.top,
          left: spec.elements.background.left,
          width: spec.elements.background.width,
          height: spec.elements.background.height,
          backgroundColor: bgColor,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Lifestyle Photo (Top Half) */}
      {(sku.images.lifestyleA || true) && (
        <div
          style={{
            position: 'absolute',
            top: lifestylePhotoPos.top,
            left: lifestylePhotoPos.left,
            width: lifestylePhotoPos.width,
            height: lifestylePhotoPos.height,
            overflow: 'hidden',
            zIndex: lifestylePhotoPos.zIndex ?? 10,
            transform: combineTransforms(undefined, lifestylePhotoPos.rotation)
          }}
        >
          <img
            src={sku.images.lifestyleA || '/placeholder-image.svg'}
            alt="Customer using product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.lifestyleA ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Review Panel Background */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.reviewPanel.top,
          left: spec.elements.reviewPanel.left,
          width: spec.elements.reviewPanel.width,
          height: spec.elements.reviewPanel.height,
          backgroundColor: bgColor,
          zIndex: spec.elements.reviewPanel.zIndex
        }}
      />

      {/* Star Rating */}
      <p
        style={{
          position: 'absolute',
          top: starsPos.top,
          left: starsPos.left,
          width: starsPos.width,
          height: starsPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stars.fontSize,
          fontWeight: spec.elements.stars.fontWeight,
          lineHeight: spec.elements.stars.lineHeight,
          letterSpacing: `${spec.elements.stars.letterSpacing}px`,
          color: starsColor,
          textAlign: spec.elements.stars.textAlign,
          zIndex: starsPos.zIndex ?? spec.elements.stars.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, starsPos.rotation)
        }}
      >
        {sku.copy.testimonialDetail?.rating || '★ ★ ★ ★ ★'}
      </p>

      {/* Quote Headline */}
      <h2
        style={{
          position: 'absolute',
          top: quoteHeadlinePos.top,
          left: quoteHeadlinePos.left,
          width: quoteHeadlinePos.width,
          height: quoteHeadlinePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.quoteHeadline.fontSize,
          fontWeight: spec.elements.quoteHeadline.fontWeight,
          lineHeight: spec.elements.quoteHeadline.lineHeight,
          letterSpacing: `${spec.elements.quoteHeadline.letterSpacing}px`,
          color: quoteColor,
          textAlign: spec.elements.quoteHeadline.textAlign,
          zIndex: quoteHeadlinePos.zIndex ?? spec.elements.quoteHeadline.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, quoteHeadlinePos.rotation)
        }}
      >
        "{sku.copy.testimonialDetail?.quoteHeadline || 'Noticeable Difference'}"
      </h2>

      {/* Review Text */}
      <p
        style={{
          position: 'absolute',
          top: reviewTextPos.top,
          left: reviewTextPos.left,
          width: reviewTextPos.width,
          height: reviewTextPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.reviewText.fontSize,
          fontWeight: spec.elements.reviewText.fontWeight,
          lineHeight: spec.elements.reviewText.lineHeight,
          letterSpacing: `${spec.elements.reviewText.letterSpacing}px`,
          color: textColor,
          textAlign: spec.elements.reviewText.textAlign,
          zIndex: reviewTextPos.zIndex ?? spec.elements.reviewText.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, reviewTextPos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        "{sku.copy.testimonialDetail?.reviewText || 'There is a noticeable difference when I drink other coffees. This inadvertently cut my coffee cravings way back. No plans on changing brands anytime soon.'}"
      </p>

      {/* Customer Name */}
      <p
        style={{
          position: 'absolute',
          top: customerNamePos.top,
          left: customerNamePos.left,
          width: customerNamePos.width,
          height: customerNamePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.customerName.fontSize,
          fontWeight: spec.elements.customerName.fontWeight,
          lineHeight: spec.elements.customerName.lineHeight,
          letterSpacing: `${spec.elements.customerName.letterSpacing}px`,
          color: nameColor,
          textAlign: spec.elements.customerName.textAlign,
          zIndex: customerNamePos.zIndex ?? spec.elements.customerName.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, customerNamePos.rotation)
        }}
      >
        {sku.copy.testimonialDetail?.customerName || 'Denise T.'}
      </p>

      {/* Verified Badge */}
      <div
        style={{
          position: 'absolute',
          top: verifiedBadgePos.top,
          left: verifiedBadgePos.left,
          width: verifiedBadgePos.width,
          height: verifiedBadgePos.height,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: verifiedBadgePos.zIndex ?? 20,
          transform: combineTransforms(undefined, verifiedBadgePos.rotation)
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ✓
        </div>
        <span
          style={{
            fontFamily: fonts.family,
            fontSize: '18px',
            fontWeight: 400,
            color: badgeColor
          }}
        >
          Verified Buyer
        </span>
      </div>

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.testimonialDetail || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

