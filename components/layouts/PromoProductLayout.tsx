import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { PROMO_PRODUCT_SPEC } from '@/lib/layouts/specs/promo-product-spec'
import { getFieldColorValue } from '@/lib/color-utils'

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
          top: spec.elements.headline.top,
          left: spec.elements.headline.left,
          width: spec.elements.headline.width,
          height: spec.elements.headline.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.headline.fontSize,
          fontWeight: spec.elements.headline.fontWeight,
          lineHeight: spec.elements.headline.lineHeight,
          letterSpacing: `${spec.elements.headline.letterSpacing}px`,
          color: headlineColor,
          textAlign: spec.elements.headline.textAlign,
          zIndex: spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.promo?.headline || 'Peptide fuel. Not another pre-workout.'}
      </p>

      {/* Stats Container */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.statsContainer.top,
          left: spec.elements.statsContainer.left,
          display: 'flex',
          flexDirection: 'column',
          gap: spec.elements.statsContainer.gap,
          zIndex: spec.elements.statsContainer.zIndex
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              height: 136
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
                padding: 0
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Product Image */}
      {sku.images.productAngle && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.productImage.top,
            left: spec.elements.productImage.left,
            width: spec.elements.productImage.width,
            height: spec.elements.productImage.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: spec.elements.productImage.zIndex
          }}
        >
          <img
            src={sku.images.productAngle}
            alt="Product"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
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

