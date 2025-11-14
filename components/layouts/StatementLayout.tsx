import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { STATEMENT_SPEC } from '@/lib/layouts/specs/statement-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface StatementLayoutProps {
  brand: Brand
  sku: SKU
}

export function StatementLayout({ brand, sku }: StatementLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = STATEMENT_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const statementColor = getFieldColorValue(brand, sku, 'statement', 'Statement', 'accent')
  const ctaColor = getFieldColorValue(brand, sku, 'statement', 'CTA Strip', 'accent')
  const benefitBgColor = getFieldColorValue(brand, sku, 'statement', 'Benefit Pills', 'primarySoft')
  const benefitTextColor = getFieldColorValue(brand, sku, 'statement', 'Benefit Pills', 'primary')

  const benefits = [
    sku.copy.statement?.benefit1 || 'Science-backed',
    sku.copy.statement?.benefit2 || 'No artificial ingredients',
    sku.copy.statement?.benefit3 || 'Results you can feel'
  ].filter(Boolean)

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

      {/* Bold Statement */}
      <h1
        style={{
          position: 'absolute',
          top: spec.elements.statement.top,
          left: spec.elements.statement.left,
          width: spec.elements.statement.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.statement.fontSize,
          fontWeight: spec.elements.statement.fontWeight,
          lineHeight: spec.elements.statement.lineHeight,
          letterSpacing: `${spec.elements.statement.letterSpacing}px`,
          color: statementColor,
          textAlign: spec.elements.statement.textAlign,
          zIndex: spec.elements.statement.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.statement?.statement || 'Ready to feel the difference?'}
      </h1>

      {/* Product Image */}
      {sku.images.productPrimary && (
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
            zIndex: spec.elements.productImage.zIndex
          }}
        >
          <img
            src={sku.images.productPrimary}
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

      {/* Benefits Pills */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.benefitsContainer.top,
          left: spec.elements.benefitsContainer.left,
          width: spec.elements.benefitsContainer.width,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spec.elements.benefitStyle.gap,
          flexWrap: 'wrap',
          zIndex: spec.elements.benefitsContainer.zIndex
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              backgroundColor: benefitBgColor,
              paddingLeft: spec.elements.benefitStyle.pill.paddingX,
              paddingRight: spec.elements.benefitStyle.pill.paddingX,
              paddingTop: spec.elements.benefitStyle.pill.paddingY,
              paddingBottom: spec.elements.benefitStyle.pill.paddingY,
              borderRadius: spec.elements.benefitStyle.pill.borderRadius,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.benefitStyle.pill.fontSize,
                fontWeight: spec.elements.benefitStyle.pill.fontWeight,
                lineHeight: spec.elements.benefitStyle.pill.lineHeight,
                letterSpacing: `${spec.elements.benefitStyle.pill.letterSpacing}px`,
                color: benefitTextColor,
                textAlign: spec.elements.benefitStyle.pill.textAlign,
                whiteSpace: 'nowrap'
              }}
            >
              {benefit}
            </span>
          </div>
        ))}
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
          zIndex: spec.elements.ctaText.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.statement?.cta || 'SHOP NOW • SAVE 25%'}
      </p>
    </div>
  )
}

