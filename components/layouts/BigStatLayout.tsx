import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BIG_STAT_SPEC } from '@/lib/layouts/specs/big-stat-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface BigStatLayoutProps {
  brand: Brand
  sku: SKU
}

export function BigStatLayout({ brand, sku }: BigStatLayoutProps) {
  const spec = BIG_STAT_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const bgColor = getFieldColorValue(brand, sku, 'bigStat', 'Background Color', 'bgAlt')
  const statColor = getFieldColorValue(brand, sku, 'bigStat', 'Stat Value', 'accent')
  const headlineColor = getFieldColorValue(brand, sku, 'bigStat', 'Headline', 'accent')
  const labelColor = getFieldColorValue(brand, sku, 'bigStat', 'Ingredient 1 (Top Left)', 'accent')

  const ingredientImages = [
    sku.images.ingredientA,
    sku.images.ingredientB,
    sku.images.ingredientC,
    sku.images.ingredientD
  ]

  const ingredientLabels = [
    sku.copy.stat97?.ingredient1 || 'Ingredient 1',
    sku.copy.stat97?.ingredient2 || 'Ingredient 2',
    sku.copy.stat97?.ingredient3 || 'Ingredient 3',
    sku.copy.stat97?.ingredient4 || 'Ingredient 4'
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
      {/* Background Color */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.backgroundColor.top,
          left: spec.elements.backgroundColor.left,
          width: spec.elements.backgroundColor.width,
          height: spec.elements.backgroundColor.height,
          backgroundColor: bgColor,
          zIndex: spec.elements.backgroundColor.zIndex
        }}
      />

      {/* Background Image (with opacity) */}
      {brand.images.backgroundAlt && (
        <img
          src={brand.images.backgroundAlt}
          alt=""
          style={{
            position: 'absolute',
            top: spec.elements.backgroundImage.top,
            left: spec.elements.backgroundImage.left,
            width: spec.elements.backgroundImage.width,
            height: spec.elements.backgroundImage.height,
            objectFit: spec.elements.backgroundImage.objectFit,
            opacity: spec.elements.backgroundImage.opacity,
            zIndex: spec.elements.backgroundImage.zIndex
          }}
        />
      )}

      {/* Large Stat Value */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.statValue.top,
          left: spec.elements.statValue.left,
          width: spec.elements.statValue.width,
          fontFamily: fonts.family,
          fontSize: fonts.sizes.display,
          fontWeight: fonts.weights.display,
          lineHeight: fonts.lineHeights.display,
          letterSpacing: `${fonts.letterSpacing.display}px`,
          color: statColor,
          textAlign: spec.elements.statValue.textAlign,
          transform: spec.elements.statValue.transform,
          zIndex: spec.elements.statValue.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.stat97?.value || '100%'}
      </p>

      {/* Headline */}
      <p
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
        {sku.copy.stat97?.headline || 'Naturally sourced Bioactive Precision Peptides™'}
      </p>

      {/* 4 Ingredient Images with Labels */}
      {spec.elements.ingredients.map((ingredient, index) => (
        <div key={index}>
          {/* Circular Ingredient Image */}
          {ingredientImages[index] && (
            <div
              style={{
                position: 'absolute',
                top: ingredient.image.top,
                left: ingredient.image.left,
                width: ingredient.image.size,
                height: ingredient.image.size,
                borderRadius: ingredient.image.size / 2,
                overflow: 'hidden',
                zIndex: ingredient.image.zIndex
              }}
            >
              <img
                src={ingredientImages[index]}
                alt={ingredientLabels[index]}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Label Pill with Text */}
          <div
            style={{
              position: 'absolute',
              top: ingredient.label.top,
              left: ingredient.label.left,
              width: ingredient.label.width,
              height: spec.elements.ingredientLabelStyle.height,
              backgroundColor: labelColor,
              borderRadius: spec.elements.ingredientLabelStyle.borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}
          >
            <span
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.ingredientLabelStyle.fontSize,
                fontWeight: spec.elements.ingredientLabelStyle.fontWeight,
                color: spec.elements.ingredientLabelStyle.color,
                textAlign: spec.elements.ingredientLabelStyle.textAlign,
                margin: 0,
                padding: 0
              }}
            >
              {ingredientLabels[index]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

