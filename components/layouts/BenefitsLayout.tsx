import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BENEFITS_SPEC } from '@/lib/layouts/specs/benefits-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface BenefitsLayoutProps {
  brand: Brand
  sku: SKU
}

export function BenefitsLayout({ brand, sku }: BenefitsLayoutProps) {
  const spec = BENEFITS_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getFieldColorValue(brand, sku, 'benefits', 'Headline', 'primary')
  const bulletBgColor = getFieldColorValue(brand, sku, 'benefits', 'Benefit 1 (Top Left)', 'primary')
  const bulletTextColor = getFieldColorValue(brand, sku, 'benefits', 'Benefit 1 (Top Left)', 'bgAlt')

  const benefits = [
    sku.copy.benefits?.bullet1 || '54% better overall performance*',
    sku.copy.benefits?.bullet2 || '47% less muscle fatigue*',
    sku.copy.benefits?.bullet3 || '4X more muscle protein synthesis*',
    sku.copy.benefits?.bullet4 || '144% stronger strength recovery vs whey*'
  ]

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
      {/* Background Image */}
      {brand.images.backgroundBenefits && (
        <img
          src={brand.images.backgroundBenefits}
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

      {/* Headline */}
      <h1
        style={{
          position: 'absolute',
          top: spec.elements.headline.top,
          left: spec.elements.headline.left,
          width: spec.elements.headline.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.headline.fontSize,
          fontWeight: spec.elements.headline.fontWeight,
          lineHeight: spec.elements.headline.lineHeight,
          letterSpacing: `${spec.elements.headline.letterSpacing}px`,
          color: headlineColor,
          textAlign: spec.elements.headline.textAlign,
          transform: spec.elements.headline.transform,
          zIndex: spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.benefits?.headline || 'Train Harder, Bounce Back Faster'}
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

      {/* Benefit Callouts with Connectors */}
      {spec.elements.callouts.map((callout, index) => {
        const connectorOnRight = callout.connectorSide === 'right'
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: callout.position.top,
              left: callout.position.left,
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              zIndex: 3,
              flexDirection: connectorOnRight ? 'row' : 'row-reverse'
            }}
          >
            {/* Benefit Badge */}
            <div
              style={{
                backgroundColor: bulletBgColor,
                color: bulletTextColor,
                fontSize: spec.elements.calloutStyle.fontSize,
                fontWeight: spec.elements.calloutStyle.fontWeight,
                lineHeight: spec.elements.calloutStyle.lineHeight,
                paddingLeft: spec.elements.calloutStyle.paddingX,
                paddingRight: spec.elements.calloutStyle.paddingX,
                paddingTop: spec.elements.calloutStyle.paddingY,
                paddingBottom: spec.elements.calloutStyle.paddingY,
                borderRadius: spec.elements.calloutStyle.borderRadius,
                textAlign: spec.elements.calloutStyle.textAlign,
                maxWidth: spec.elements.calloutStyle.maxWidth,
                minWidth: spec.elements.calloutStyle.minWidth,
                fontFamily: fonts.family
              }}
            >
              {benefits[index]}
            </div>

            {/* Connector Line */}
            <div
              style={{
                width: spec.elements.connector.width,
                height: spec.elements.connector.height,
                backgroundColor: bulletBgColor
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

