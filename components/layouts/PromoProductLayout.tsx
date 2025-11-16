import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { PROMO_PRODUCT_SPEC } from '@/lib/layouts/specs/promo-product-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'

interface PromoProductLayoutProps {
  brand: Brand
  sku: SKU
}

export function PromoProductLayout({ brand, sku }: PromoProductLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = PROMO_PRODUCT_SPEC
  const colors = brand.colors || { bg: '#F9F7F2' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const headlineColor = getFieldColorValue(brand, sku, 'promo', 'Headline', 'accent')
  const statColor = getFieldColorValue(brand, sku, 'promo', 'Stat 1 Value', 'accent')

  const stats = [
    {
      value: sku.copy.promo?.stat1_value || '47%',
      label: sku.copy.promo?.stat1_label || 'LESS MUSCLE FATIGUE*',
      labelWidth: spec.elements.statStyle.stat1?.labelWidth || 200,
      labelHeight: spec.elements.statStyle.stat1?.labelHeight || 60
    },
    {
      value: sku.copy.promo?.stat2_value || '4X',
      label: sku.copy.promo?.stat2_label || 'MORE MUSCLE PROTEIN SYNTHESIS THAN WHEY*',
      labelWidth: spec.elements.statStyle.stat2?.labelWidth || 254,
      labelHeight: spec.elements.statStyle.stat2?.labelHeight || 136
    },
    {
      value: sku.copy.promo?.stat3_value || '144%',
      label: sku.copy.promo?.stat3_label || 'BETTER STRENGTH RECOVERY VS WHEY*',
      labelWidth: spec.elements.statStyle.stat3?.labelWidth || 171,
      labelHeight: spec.elements.statStyle.stat3?.labelHeight || 136
    }
  ]

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('promoProduct', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('promoProduct', 'productImage', spec.elements.productImage, sku.positionOverrides)
  
  // Individual stat positions
  const stat1Pos = resolveElementPosition('promoProduct', 'stat1', {
    top: 494,
    left: 80,
    x: 80,
    y: 494,
    width: 400,
    height: 136,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat2Pos = resolveElementPosition('promoProduct', 'stat2', {
    top: 670,
    left: 80,
    x: 80,
    y: 670,
    width: 400,
    height: 136,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat3Pos = resolveElementPosition('promoProduct', 'stat3', {
    top: 846,
    left: 80,
    x: 80,
    y: 846,
    width: 400,
    height: 136,
    zIndex: 20
  }, sku.positionOverrides)

  // Render a single stat with value and label
  const renderStat = (stat: typeof stats[0], pos: any) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          height: pos.height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
          zIndex: pos.zIndex ?? 20,
          transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined
        }}
      >
        {/* Stat Value */}
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.statStyle.value.fontSize,
            fontWeight: spec.elements.statStyle.value.fontWeight,
            lineHeight: spec.elements.statStyle.value.lineHeight,
            letterSpacing: `${spec.elements.statStyle.value.letterSpacing}px`,
            color: statColor,
            margin: 0,
            padding: 0,
            whiteSpace: 'nowrap'
          }}
        >
          {stat.value}
        </p>

        {/* Stat Label */}
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.statStyle.label.fontSize,
            fontWeight: spec.elements.statStyle.label.fontWeight,
            lineHeight: spec.elements.statStyle.label.lineHeight,
            letterSpacing: `${spec.elements.statStyle.label.letterSpacing}px`,
            textTransform: spec.elements.statStyle.label.textTransform,
            color: statColor,
            width: stat.labelWidth,
            height: stat.labelHeight,
            margin: 0,
            padding: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {stat.label}
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
        backgroundColor: colors.bg,
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
          backgroundColor: colors.bg,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Headline */}
      <p
        style={{
          position: 'absolute',
          top: headlinePos.top,
          left: headlinePos.left,
          width: headlinePos.width,
          height: headlinePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.headline.fontSize,
          fontWeight: spec.elements.headline.fontWeight,
          lineHeight: spec.elements.headline.lineHeight,
          letterSpacing: `${spec.elements.headline.letterSpacing}px`,
          color: headlineColor,
          textAlign: spec.elements.headline.textAlign,
          zIndex: headlinePos.zIndex ?? spec.elements.headline.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, headlinePos.rotation)
        }}
      >
        {sku.copy.promo?.headline || 'Peptide fuel. Not another pre-workout.'}
      </p>

      {/* Individual Stats - Each with position overrides */}
      {renderStat(stats[0], stat1Pos)}
      {renderStat(stats[1], stat2Pos)}
      {renderStat(stats[2], stat3Pos)}

      {/* Product Image */}
      {(sku.images.productAngle || true) && (
        <div
          style={{
            position: 'absolute',
            top: productImagePos.top,
            left: productImagePos.left,
            width: productImagePos.width,
            height: productImagePos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: productImagePos.zIndex ?? spec.elements.productImage.zIndex,
            transform: combineTransforms(undefined, productImagePos.rotation)
          }}
        >
          <img
            src={sku.images.productAngle || '/placeholder-image.svg'}
            alt="Product"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: sku.images.productAngle ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Promo Badge Background */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.promoBadge.top,
          left: spec.elements.promoBadge.left,
          width: spec.elements.promoBadge.width,
          height: spec.elements.promoBadge.height,
          borderRadius: '50%',
          backgroundColor: brand.images.promoBadge ? 'transparent' : (colors.accent || '#323429'),
          zIndex: spec.elements.promoBadge.zIndex
        }}
      >
        {brand.images.promoBadge && (
          <img
            src={brand.images.promoBadge}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              maxWidth: 'none',
              borderRadius: '50%'
            }}
          />
        )}
      </div>

      {/* Badge Note */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.badgeNote.top,
          left: spec.elements.badgeNote.left,
          width: spec.elements.badgeNote.width,
          height: spec.elements.badgeNote.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.badgeNote.fontSize,
          fontWeight: spec.elements.badgeNote.fontWeight,
          lineHeight: spec.elements.badgeNote.lineHeight,
          letterSpacing: `${spec.elements.badgeNote.letterSpacing}px`,
          color: spec.elements.badgeNote.color,
          textAlign: spec.elements.badgeNote.textAlign,
          transform: spec.elements.badgeNote.transform,
          zIndex: spec.elements.badgeNote.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.promo?.badgeNote || 'First Time Order?'}
        <br aria-hidden="true" />
        <br aria-hidden="true" />
      </p>

      {/* Badge Text Container */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.badgeTextContainer.top,
          left: spec.elements.badgeTextContainer.left,
          width: spec.elements.badgeTextContainer.width,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          lineHeight: '0',
          transform: spec.elements.badgeTextContainer.transform,
          zIndex: spec.elements.badgeTextContainer.zIndex
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.badgeText.fontSize,
            fontWeight: spec.elements.badgeText.fontWeight,
            lineHeight: 'normal',
            letterSpacing: `${spec.elements.badgeText.letterSpacing}px`,
            color: spec.elements.badgeText.color,
            textAlign: spec.elements.badgeText.textAlign,
            margin: 0,
            padding: 0
          }}
        >
          {sku.copy.promo?.badge || 'Unlock 10% OFF at checkout'}
        </p>
      </div>
    </div>
  )
}

