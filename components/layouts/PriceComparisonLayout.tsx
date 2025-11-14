import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { PRICE_COMPARISON_SPEC } from '@/lib/layouts/specs/price-comparison-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface PriceComparisonLayoutProps {
  brand: Brand
  sku: SKU
}

export function PriceComparisonLayout({ brand, sku }: PriceComparisonLayoutProps) {
  const spec = PRICE_COMPARISON_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const bgColor = getFieldColorValue(brand, sku, 'priceComparison', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'priceComparison', 'Headline', 'text')
  const priceLeftColor = getFieldColorValue(brand, sku, 'priceComparison', 'Price Left', 'text')
  const priceCenterColor = getFieldColorValue(brand, sku, 'priceComparison', 'Price Center', 'bg')
  const priceHighlightBg = getFieldColorValue(brand, sku, 'priceComparison', 'Price Highlight', 'primary')
  const benefitColor = getFieldColorValue(brand, sku, 'priceComparison', 'Benefit 1', 'text')
  const disclaimerColor = getFieldColorValue(brand, sku, 'priceComparison', 'Disclaimer', 'textSecondary')

  // Benefits list (6 items)
  const benefits = [
    sku.copy.priceComparison?.benefit1 || 'Multivitamin & mineral',
    sku.copy.priceComparison?.benefit2 || 'Pre & Probiotic',
    sku.copy.priceComparison?.benefit3 || 'Greens Superfood',
    sku.copy.priceComparison?.benefit4 || 'Stress Adaptogen',
    sku.copy.priceComparison?.benefit5 || 'Immune Support',
    sku.copy.priceComparison?.benefit6 || 'Cognitive Support'
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
        backgroundColor: bgColor,
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
      <div
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
          transform: spec.elements.headline.transform,
          zIndex: spec.elements.headline.zIndex,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {sku.copy.priceComparison?.headline || 'FIT replaced the pile of supplements I\'d been taking for years.'}
      </div>

      {/* Supplements Pile Image */}
      {sku.images.supplementsPile && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.supplementsPile.top,
            left: spec.elements.supplementsPile.left,
            width: spec.elements.supplementsPile.width,
            height: spec.elements.supplementsPile.height,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: spec.elements.supplementsPile.zIndex
          }}
        >
          <img
            src={sku.images.supplementsPile}
            alt="Supplements Pile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: spec.elements.supplementsPile.objectFit,
              display: 'block'
            }}
          />
        </div>
      )}

      {/* Product Image */}
      {sku.images.productImage && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.productImage.top,
            left: spec.elements.productImage.left,
            width: spec.elements.productImage.width,
            height: spec.elements.productImage.height,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: spec.elements.productImage.zIndex
          }}
        >
          <img
            src={sku.images.productImage}
            alt="Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: spec.elements.productImage.objectFit,
              display: 'block'
            }}
          />
        </div>
      )}

      {/* Left Price (Higher - Supplements) */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.priceLeft.top,
          left: spec.elements.priceLeft.left,
          width: spec.elements.priceLeft.width,
          height: spec.elements.priceLeft.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.priceLeft.fontSize,
          fontWeight: spec.elements.priceLeft.fontWeight,
          lineHeight: spec.elements.priceLeft.lineHeight,
          color: priceLeftColor,
          textAlign: spec.elements.priceLeft.textAlign,
          transform: spec.elements.priceLeft.transform,
          zIndex: spec.elements.priceLeft.zIndex,
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {sku.copy.priceComparison?.priceLeft || '$225'}
      </p>

      <p
        style={{
          position: 'absolute',
          top: spec.elements.labelLeft.top,
          left: spec.elements.labelLeft.left,
          width: spec.elements.labelLeft.width,
          height: spec.elements.labelLeft.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.labelLeft.fontSize,
          fontWeight: spec.elements.labelLeft.fontWeight,
          lineHeight: spec.elements.labelLeft.lineHeight,
          color: priceLeftColor,
          textAlign: spec.elements.labelLeft.textAlign,
          transform: spec.elements.labelLeft.transform,
          zIndex: spec.elements.labelLeft.zIndex,
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {sku.copy.priceComparison?.labelLeft || 'Total per month'}
      </p>

      {/* Price Highlight Box */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.priceHighlight.top,
          left: spec.elements.priceHighlight.left,
          width: spec.elements.priceHighlight.width,
          height: spec.elements.priceHighlight.height,
          borderRadius: spec.elements.priceHighlight.borderRadius,
          backgroundColor: priceHighlightBg,
          zIndex: spec.elements.priceHighlight.zIndex
        }}
      />

      {/* Center Price (Lower - Your Product) */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.priceCenter.top,
          left: spec.elements.priceCenter.left,
          width: spec.elements.priceCenter.width,
          height: spec.elements.priceCenter.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.priceCenter.fontSize,
          fontWeight: spec.elements.priceCenter.fontWeight,
          lineHeight: spec.elements.priceCenter.lineHeight,
          color: priceCenterColor,
          textAlign: spec.elements.priceCenter.textAlign,
          transform: spec.elements.priceCenter.transform,
          zIndex: spec.elements.priceCenter.zIndex,
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {sku.copy.priceComparison?.priceCenter || '$79'}
      </p>

      <p
        style={{
          position: 'absolute',
          top: spec.elements.labelCenter.top,
          left: spec.elements.labelCenter.left,
          width: spec.elements.labelCenter.width,
          height: spec.elements.labelCenter.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.labelCenter.fontSize,
          fontWeight: spec.elements.labelCenter.fontWeight,
          lineHeight: spec.elements.labelCenter.lineHeight,
          color: getFieldColorValue(brand, sku, 'priceComparison', 'Label Center', 'primary'),
          textAlign: spec.elements.labelCenter.textAlign,
          transform: spec.elements.labelCenter.transform,
          zIndex: spec.elements.labelCenter.zIndex,
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {sku.copy.priceComparison?.labelCenter || 'Total per month'}
      </p>

      {/* Benefits List */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.benefitsContainer.top,
          left: spec.elements.benefitsContainer.left,
          width: spec.elements.benefitsContainer.width,
          zIndex: spec.elements.benefitsContainer.zIndex
        }}
      >
        {benefits.map((benefit, index) => (
          <p
            key={index}
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.benefit.fontSize,
              fontWeight: spec.elements.benefit.fontWeight,
              lineHeight: spec.elements.benefit.lineHeight,
              color: benefitColor,
              height: spec.elements.benefit.height,
              margin: 0,
              padding: 0,
              marginBottom: index < benefits.length - 1 ? spec.elements.benefit.gap : 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {benefit}
          </p>
        ))}
      </div>

      {/* Disclaimer */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.disclaimer.top,
          left: spec.elements.disclaimer.left,
          width: spec.elements.disclaimer.width,
          height: spec.elements.disclaimer.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.disclaimer.fontSize,
          fontWeight: spec.elements.disclaimer.fontWeight,
          lineHeight: spec.elements.disclaimer.lineHeight,
          color: disclaimerColor,
          textAlign: spec.elements.disclaimer.textAlign,
          transform: spec.elements.disclaimer.transform,
          zIndex: spec.elements.disclaimer.zIndex,
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7
        }}
      >
        {sku.copy.priceComparison?.disclaimer || 'Based on current available data for average industry prices'}
      </p>
    </div>
  )
}

