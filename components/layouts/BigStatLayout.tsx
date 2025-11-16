import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BIG_STAT_SPEC } from '@/lib/layouts/specs/big-stat-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

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

  // Resolve positions
  const statValuePos = resolveElementPosition('bigStat', 'statValue', spec.elements.statValue, sku.positionOverrides)
  const headlinePos = resolveElementPosition('bigStat', 'headline', spec.elements.headline, sku.positionOverrides)
  
  const ingredientPositions = spec.elements.ingredients.map((ing, i) => ({
    image: resolveElementPosition('bigStat', `ingredient${i + 1}`, {
      top: ing.image.top,
      left: ing.image.left,
      x: ing.image.left,
      y: ing.image.top,
      width: ing.image.size,
      height: ing.image.size,
      zIndex: ing.image.zIndex
    }, sku.positionOverrides),
    label: resolveElementPosition('bigStat', `label${i + 1}`, {
      top: ing.label.top,
      left: ing.label.left,
      x: ing.label.left,
      y: ing.label.top,
      width: ing.label.width,
      zIndex: ing.image.zIndex + 1
    }, sku.positionOverrides)
  }))

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
          top: statValuePos.top,
          left: statValuePos.left,
          width: statValuePos.width,
          fontFamily: fonts.family,
          fontSize: fonts.sizes.display,
          fontWeight: fonts.weights.display,
          lineHeight: fonts.lineHeights.display,
          letterSpacing: `${fonts.letterSpacing.display}px`,
          color: statColor,
          textAlign: spec.elements.statValue.textAlign,
          transform: spec.elements.statValue.transform,
          zIndex: statValuePos.zIndex ?? spec.elements.statValue.zIndex,
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
          transform: spec.elements.headline.transform,
          zIndex: headlinePos.zIndex ?? spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.stat97?.headline || 'Naturally sourced Bioactive Precision Peptides™'}
      </p>

      {/* Ingredient Images and Labels */}
      {ingredientImages.map((image, index) => {
        const positions = ingredientPositions[index]
        
        return (
          <div key={index}>
            {/* Ingredient Image */}
            <div
              style={{
                position: 'absolute',
                top: positions.image.top,
                left: positions.image.left,
                width: positions.image.width ? `${positions.image.width}px` : spec.elements.ingredients[index].image.size,
                height: positions.image.height ? `${positions.image.height}px` : spec.elements.ingredients[index].image.size,
                borderRadius: '50%',
                overflow: 'hidden',
                zIndex: positions.image.zIndex ?? spec.elements.ingredients[index].image.zIndex,
                transform: positions.image.rotation ? `rotate(${positions.image.rotation}deg)` : undefined
              }}
            >
              <img
                src={image || '/placeholder-image.svg'}
                alt={`Ingredient ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: image ? 1 : 0.3
                }}
              />
            </div>

            {/* Ingredient Label - Auto-grows with text */}
            <div
              style={{
                position: 'absolute',
                top: positions.label.top,
                left: positions.label.left,
                minWidth: positions.label.width ? undefined : spec.elements.ingredientLabelStyle.height,
                width: positions.label.width ? `${positions.label.width}px` : undefined,
                maxWidth: positions.label.width ? `${positions.label.width}px` : undefined,
                height: spec.elements.ingredientLabelStyle.height,
                backgroundColor: labelColor,
                color: spec.elements.ingredientLabelStyle.color,
                fontSize: spec.elements.ingredientLabelStyle.fontSize,
                fontWeight: spec.elements.ingredientLabelStyle.fontWeight,
                borderRadius: spec.elements.ingredientLabelStyle.borderRadius,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                fontFamily: fonts.family,
                boxSizing: 'border-box',
                zIndex: positions.label.zIndex ?? 50,
                transform: positions.label.rotation ? `rotate(${positions.label.rotation}deg)` : undefined,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textAlign: 'center'
              }}
            >
              {ingredientLabels[index]}
            </div>
          </div>
        )
      })}

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.bigStat || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

