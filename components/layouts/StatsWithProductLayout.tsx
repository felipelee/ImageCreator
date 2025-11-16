import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { STATS_WITH_PRODUCT_SPEC } from '@/lib/layouts/specs/stats-with-product-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface StatsWithProductLayoutProps {
  brand: Brand
  sku: SKU
}

export function StatsWithProductLayout({ brand, sku }: StatsWithProductLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = STATS_WITH_PRODUCT_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', text: '#323429', textSecondary: '#6C6C6C' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const bgColor = getFieldColorValue(brand, sku, 'statsWithProduct', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'statsWithProduct', 'Headline', 'text')
  const statColor = getFieldColorValue(brand, sku, 'statsWithProduct', 'Stat Values', 'text')
  const labelColor = getFieldColorValue(brand, sku, 'statsWithProduct', 'Stat Labels', 'text')

  // Resolve positions with overrides - each stat component individually
  const headlinePos = resolveElementPosition('statsWithProduct', 'headline', {
    top: 95,
    left: 70,
    x: 70,
    y: 95,
    width: 600,
    height: 50,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat1ValuePos = resolveElementPosition('statsWithProduct', 'stat1Value', {
    top: 220,
    left: 70,
    x: 70,
    y: 220,
    width: 400,
    height: 150,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat1LabelPos = resolveElementPosition('statsWithProduct', 'stat1Label', {
    top: 380,
    left: 70,
    x: 70,
    y: 380,
    width: 400,
    height: 60,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat2ValuePos = resolveElementPosition('statsWithProduct', 'stat2Value', {
    top: 480,
    left: 70,
    x: 70,
    y: 480,
    width: 400,
    height: 150,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat2LabelPos = resolveElementPosition('statsWithProduct', 'stat2Label', {
    top: 640,
    left: 70,
    x: 70,
    y: 640,
    width: 400,
    height: 80,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat3ValuePos = resolveElementPosition('statsWithProduct', 'stat3Value', {
    top: 760,
    left: 70,
    x: 70,
    y: 760,
    width: 400,
    height: 150,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat3LabelPos = resolveElementPosition('statsWithProduct', 'stat3Label', {
    top: 920,
    left: 70,
    x: 70,
    y: 920,
    width: 400,
    height: 80,
    zIndex: 20
  }, sku.positionOverrides)
  
  const productImagePos = resolveElementPosition('statsWithProduct', 'productImage', {
    top: 200,
    left: 580,
    x: 580,
    y: 200,
    width: 450,
    height: 700,
    zIndex: 15
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
        {sku.copy.statsWithProduct?.headline || 'THE BENEFITS AFTER 60 DAYS'}
      </p>

      {/* Stat 1 Value */}
      <p
        style={{
          position: 'absolute',
          top: stat1ValuePos.top,
          left: stat1ValuePos.left,
          width: stat1ValuePos.width,
          height: stat1ValuePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stat1Value.fontSize,
          fontWeight: spec.elements.stat1Value.fontWeight,
          lineHeight: spec.elements.stat1Value.lineHeight,
          letterSpacing: `${spec.elements.stat1Value.letterSpacing}px`,
          color: statColor,
          textAlign: spec.elements.stat1Value.textAlign,
          zIndex: stat1ValuePos.zIndex ?? spec.elements.stat1Value.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, stat1ValuePos.rotation)
        }}
      >
        {sku.copy.statsWithProduct?.stat1_value || '90%'}
      </p>

      {/* Stat 1 Label */}
      <p
        style={{
          position: 'absolute',
          top: stat1LabelPos.top,
          left: stat1LabelPos.left,
          width: stat1LabelPos.width,
          height: stat1LabelPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stat1Label.fontSize,
          fontWeight: spec.elements.stat1Label.fontWeight,
          lineHeight: spec.elements.stat1Label.lineHeight,
          letterSpacing: `${spec.elements.stat1Label.letterSpacing}px`,
          color: labelColor,
          textAlign: spec.elements.stat1Label.textAlign,
          zIndex: stat1LabelPos.zIndex ?? spec.elements.stat1Label.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, stat1LabelPos.rotation)
        }}
      >
        {sku.copy.statsWithProduct?.stat1_label || 'felt more motivated*'}
      </p>

      {/* Stat 2 Value */}
      <p
        style={{
          position: 'absolute',
          top: stat2ValuePos.top,
          left: stat2ValuePos.left,
          width: stat2ValuePos.width,
          height: stat2ValuePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stat2Value.fontSize,
          fontWeight: spec.elements.stat2Value.fontWeight,
          lineHeight: spec.elements.stat2Value.lineHeight,
          letterSpacing: `${spec.elements.stat2Value.letterSpacing}px`,
          color: statColor,
          textAlign: spec.elements.stat2Value.textAlign,
          zIndex: stat2ValuePos.zIndex ?? spec.elements.stat2Value.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, stat2ValuePos.rotation)
        }}
      >
        {sku.copy.statsWithProduct?.stat2_value || '84%'}
      </p>

      {/* Stat 2 Label */}
      <p
        style={{
          position: 'absolute',
          top: stat2LabelPos.top,
          left: stat2LabelPos.left,
          width: stat2LabelPos.width,
          height: stat2LabelPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stat2Label.fontSize,
          fontWeight: spec.elements.stat2Label.fontWeight,
          lineHeight: spec.elements.stat2Label.lineHeight,
          letterSpacing: `${spec.elements.stat2Label.letterSpacing}px`,
          color: labelColor,
          textAlign: spec.elements.stat2Label.textAlign,
          zIndex: stat2LabelPos.zIndex ?? spec.elements.stat2Label.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, stat2LabelPos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {sku.copy.statsWithProduct?.stat2_label || 'were more likely to start or complete a task*'}
      </p>

      {/* Stat 3 Value */}
      <p
        style={{
          position: 'absolute',
          top: stat3ValuePos.top,
          left: stat3ValuePos.left,
          width: stat3ValuePos.width,
          height: stat3ValuePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stat3Value.fontSize,
          fontWeight: spec.elements.stat3Value.fontWeight,
          lineHeight: spec.elements.stat3Value.lineHeight,
          letterSpacing: `${spec.elements.stat3Value.letterSpacing}px`,
          color: statColor,
          textAlign: spec.elements.stat3Value.textAlign,
          zIndex: stat3ValuePos.zIndex ?? spec.elements.stat3Value.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, stat3ValuePos.rotation)
        }}
      >
        {sku.copy.statsWithProduct?.stat3_value || '79%'}
      </p>

      {/* Stat 3 Label */}
      <p
        style={{
          position: 'absolute',
          top: stat3LabelPos.top,
          left: stat3LabelPos.left,
          width: stat3LabelPos.width,
          height: stat3LabelPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.stat3Label.fontSize,
          fontWeight: spec.elements.stat3Label.fontWeight,
          lineHeight: spec.elements.stat3Label.lineHeight,
          letterSpacing: `${spec.elements.stat3Label.letterSpacing}px`,
          color: labelColor,
          textAlign: spec.elements.stat3Label.textAlign,
          zIndex: stat3LabelPos.zIndex ?? spec.elements.stat3Label.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, stat3LabelPos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {sku.copy.statsWithProduct?.stat3_label || 'felt more ambitious and able to take on a difficult task*'}
      </p>

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

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.statsWithProduct || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

