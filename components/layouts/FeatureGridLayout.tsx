import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { FEATURE_GRID_SPEC } from '@/lib/layouts/specs/feature-grid-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface FeatureGridLayoutProps {
  brand: Brand
  sku: SKU
}

export function FeatureGridLayout({ brand, sku }: FeatureGridLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = FEATURE_GRID_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getFieldColorValue(brand, sku, 'featureGrid', 'Headline', 'accent')
  const cardBgColor = getFieldColorValue(brand, sku, 'featureGrid', 'Card Background', 'bgAlt')
  const titleColor = getFieldColorValue(brand, sku, 'featureGrid', 'Feature Title', 'accent')
  const textColor = getFieldColorValue(brand, sku, 'featureGrid', 'Feature Text', 'text')

  const features = [
    {
      icon: sku.copy.featureGrid?.feature1_icon || '⚡',
      title: sku.copy.featureGrid?.feature1_title || 'Fast Acting',
      description: sku.copy.featureGrid?.feature1_desc || 'Feel the difference in minutes'
    },
    {
      icon: sku.copy.featureGrid?.feature2_icon || '🔬',
      title: sku.copy.featureGrid?.feature2_title || 'Science-Backed',
      description: sku.copy.featureGrid?.feature2_desc || 'Clinically proven ingredients'
    },
    {
      icon: sku.copy.featureGrid?.feature3_icon || '🌱',
      title: sku.copy.featureGrid?.feature3_title || 'All Natural',
      description: sku.copy.featureGrid?.feature3_desc || 'No artificial ingredients'
    },
    {
      icon: sku.copy.featureGrid?.feature4_icon || '✓',
      title: sku.copy.featureGrid?.feature4_title || 'Easy to Use',
      description: sku.copy.featureGrid?.feature4_desc || 'Simple daily routine'
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
          zIndex: spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.featureGrid?.headline || 'Why You\'ll Love It'}
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

      {/* Feature Grid */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.gridContainer.top,
          left: spec.elements.gridContainer.left,
          width: spec.elements.gridContainer.width,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: `${spec.elements.gridContainer.gap}px`,
          zIndex: spec.elements.gridContainer.zIndex
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              width: spec.elements.featureCard.width,
              height: spec.elements.featureCard.height,
              backgroundColor: cardBgColor,
              borderRadius: spec.elements.featureCard.borderRadius,
              padding: `${spec.elements.featureCard.padding}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                fontSize: spec.elements.featureCard.icon.fontSize,
                marginBottom: `${spec.elements.featureCard.icon.marginBottom}px`
              }}
            >
              {feature.icon}
            </div>
            <h3
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.featureCard.title.fontSize,
                fontWeight: spec.elements.featureCard.title.fontWeight,
                lineHeight: spec.elements.featureCard.title.lineHeight,
                letterSpacing: `${spec.elements.featureCard.title.letterSpacing}px`,
                color: titleColor,
                margin: 0,
                padding: 0,
                marginBottom: `${spec.elements.featureCard.title.marginBottom}px`
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.featureCard.description.fontSize,
                fontWeight: spec.elements.featureCard.description.fontWeight,
                lineHeight: spec.elements.featureCard.description.lineHeight,
                letterSpacing: `${spec.elements.featureCard.description.letterSpacing}px`,
                color: textColor,
                margin: 0,
                padding: 0
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

