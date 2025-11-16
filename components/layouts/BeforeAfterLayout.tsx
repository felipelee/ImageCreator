import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BEFORE_AFTER_SPEC } from '@/lib/layouts/specs/before-after-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'

interface BeforeAfterLayoutProps {
  brand: Brand
  sku: SKU
}

export function BeforeAfterLayout({ brand, sku }: BeforeAfterLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = BEFORE_AFTER_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getFieldColorValue(brand, sku, 'beforeAfter', 'Headline', 'accent')
  const beforeTextColor = getFieldColorValue(brand, sku, 'beforeAfter', 'Before Text', 'text')
  const afterTextColor = getFieldColorValue(brand, sku, 'beforeAfter', 'After Text', 'text')
  const dividerColor = getFieldColorValue(brand, sku, 'beforeAfter', 'Divider', 'primarySoft')

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('beforeAfter', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('beforeAfter', 'productImage', spec.elements.productImage, sku.positionOverrides)

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
          top: headlinePos.top,
          left: headlinePos.left,
          width: headlinePos.width,
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
        {sku.copy.beforeAfter?.headline || 'The Transformation'}
      </h1>

      {/* Divider Line */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.divider.top,
          left: spec.elements.divider.left,
          width: spec.elements.divider.width,
          height: spec.elements.divider.height,
          backgroundColor: dividerColor,
          zIndex: spec.elements.divider.zIndex
        }}
      />

      {/* Before Section */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.beforeContainer.top,
          left: spec.elements.beforeContainer.left,
          width: spec.elements.beforeContainer.width,
          height: spec.elements.beforeContainer.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: spec.elements.beforeContainer.zIndex
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.beforeLabel.fontSize,
            fontWeight: spec.elements.beforeLabel.fontWeight,
            lineHeight: spec.elements.beforeLabel.lineHeight,
            letterSpacing: `${spec.elements.beforeLabel.letterSpacing}px`,
            color: colors.textSecondary,
            textAlign: spec.elements.beforeLabel.textAlign,
            textTransform: spec.elements.beforeLabel.textTransform,
            margin: 0,
            padding: 0,
            marginBottom: '20px'
          }}
        >
          {sku.copy.beforeAfter?.beforeLabel || 'BEFORE'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.beforeText.fontSize,
            fontWeight: spec.elements.beforeText.fontWeight,
            lineHeight: spec.elements.beforeText.lineHeight,
            letterSpacing: `${spec.elements.beforeText.letterSpacing}px`,
            color: beforeTextColor,
            textAlign: spec.elements.beforeText.textAlign,
            margin: 0,
            padding: '0 20px'
          }}
        >
          {sku.copy.beforeAfter?.beforeText || 'Feeling tired and sluggish throughout the day'}
        </p>
      </div>

      {/* After Section */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.afterContainer.top,
          left: spec.elements.afterContainer.left,
          width: spec.elements.afterContainer.width,
          height: spec.elements.afterContainer.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: spec.elements.afterContainer.zIndex
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.afterLabel.fontSize,
            fontWeight: spec.elements.afterLabel.fontWeight,
            lineHeight: spec.elements.afterLabel.lineHeight,
            letterSpacing: `${spec.elements.afterLabel.letterSpacing}px`,
            color: headlineColor,
            textAlign: spec.elements.afterLabel.textAlign,
            textTransform: spec.elements.afterLabel.textTransform,
            margin: 0,
            padding: 0,
            marginBottom: '20px'
          }}
        >
          {sku.copy.beforeAfter?.afterLabel || 'AFTER'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.afterText.fontSize,
            fontWeight: spec.elements.afterText.fontWeight,
            lineHeight: spec.elements.afterText.lineHeight,
            letterSpacing: `${spec.elements.afterText.letterSpacing}px`,
            color: afterTextColor,
            textAlign: spec.elements.afterText.textAlign,
            margin: 0,
            padding: '0 20px'
          }}
        >
          {sku.copy.beforeAfter?.afterText || 'Sustained energy and mental clarity all day long'}
        </p>
      </div>

      {/* Product Image */}
      {(sku.images.productPrimary || true) && (
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
            zIndex: productImagePos.zIndex ?? spec.elements.productImage.zIndex,
            transform: combineTransforms(undefined, productImagePos.rotation)
          }}
        >
          <img
            src={sku.images.productPrimary || '/placeholder-image.svg'}
            alt="Product"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: sku.images.productPrimary ? 1 : 0.3
            }}
          />
        </div>
      )}
    </div>
  )
}

