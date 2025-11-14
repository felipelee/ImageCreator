import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { INGREDIENT_HERO_SPEC } from '@/lib/layouts/specs/ingredient-hero-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface IngredientHeroLayoutProps {
  brand: Brand
  sku: SKU
}

export function IngredientHeroLayout({ brand, sku }: IngredientHeroLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = INGREDIENT_HERO_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const ingredientNameColor = getFieldColorValue(brand, sku, 'ingredientHero', 'Ingredient Name', 'accent')
  const taglineColor = getFieldColorValue(brand, sku, 'ingredientHero', 'Tagline', 'textSecondary')
  const badgeBgColor = getFieldColorValue(brand, sku, 'ingredientHero', 'Product Badge', 'primarySoft')
  const badgeTextColor = getFieldColorValue(brand, sku, 'ingredientHero', 'Product Badge', 'primary')
  const pillBgColor = getFieldColorValue(brand, sku, 'ingredientHero', 'Benefit Pills', 'accent')

  const benefits = [
    sku.copy.ingredientHero?.benefit1 || 'Boosts energy',
    sku.copy.ingredientHero?.benefit2 || 'Supports recovery',
    sku.copy.ingredientHero?.benefit3 || 'Enhances focus'
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

      {/* Ingredient Name */}
      <h1
        style={{
          position: 'absolute',
          top: spec.elements.ingredientName.top,
          left: spec.elements.ingredientName.left,
          width: spec.elements.ingredientName.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.ingredientName.fontSize,
          fontWeight: spec.elements.ingredientName.fontWeight,
          lineHeight: spec.elements.ingredientName.lineHeight,
          letterSpacing: `${spec.elements.ingredientName.letterSpacing}px`,
          color: ingredientNameColor,
          textAlign: spec.elements.ingredientName.textAlign,
          zIndex: spec.elements.ingredientName.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.ingredientHero?.ingredientName || 'L-THEANINE'}
      </h1>

      {/* Tagline */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.tagline.top,
          left: spec.elements.tagline.left,
          width: spec.elements.tagline.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.tagline.fontSize,
          fontWeight: spec.elements.tagline.fontWeight,
          lineHeight: spec.elements.tagline.lineHeight,
          letterSpacing: `${spec.elements.tagline.letterSpacing}px`,
          color: taglineColor,
          textAlign: spec.elements.tagline.textAlign,
          zIndex: spec.elements.tagline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.ingredientHero?.tagline || 'The focus and calm amino acid'}
      </p>

      {/* Ingredient Image */}
      {sku.images.ingredientA && (
        <img
          src={sku.images.ingredientA}
          alt="Ingredient"
          style={{
            position: 'absolute',
            top: spec.elements.ingredientImage.top,
            left: spec.elements.ingredientImage.left,
            width: spec.elements.ingredientImage.width,
            height: spec.elements.ingredientImage.height,
            borderRadius: spec.elements.ingredientImage.borderRadius,
            objectFit: spec.elements.ingredientImage.objectFit,
            zIndex: spec.elements.ingredientImage.zIndex
          }}
        />
      )}

      {/* Product Badge */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.productBadge.top,
          left: spec.elements.productBadge.left,
          width: spec.elements.productBadge.width,
          height: spec.elements.productBadge.height,
          backgroundColor: badgeBgColor,
          borderRadius: spec.elements.productBadge.borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: spec.elements.productBadge.zIndex
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.productBadgeText.fontSize,
            fontWeight: spec.elements.productBadgeText.fontWeight,
            lineHeight: spec.elements.productBadgeText.lineHeight,
            letterSpacing: `${spec.elements.productBadgeText.letterSpacing}px`,
            color: badgeTextColor,
            textAlign: spec.elements.productBadgeText.textAlign,
            textTransform: spec.elements.productBadgeText.textTransform,
            margin: 0,
            padding: 0
          }}
        >
          {sku.copy.ingredientHero?.productBadge || 'INSIDE'}
        </p>
      </div>

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
          gap: `${spec.elements.benefitPill.gap}px`,
          flexWrap: 'wrap',
          zIndex: spec.elements.benefitsContainer.zIndex
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              backgroundColor: pillBgColor,
              paddingLeft: spec.elements.benefitPill.paddingX,
              paddingRight: spec.elements.benefitPill.paddingX,
              paddingTop: spec.elements.benefitPill.paddingY,
              paddingBottom: spec.elements.benefitPill.paddingY,
              borderRadius: spec.elements.benefitPill.borderRadius,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.benefitPill.fontSize,
                fontWeight: spec.elements.benefitPill.fontWeight,
                lineHeight: spec.elements.benefitPill.lineHeight,
                letterSpacing: `${spec.elements.benefitPill.letterSpacing}px`,
                color: spec.elements.benefitPill.color,
                textAlign: spec.elements.benefitPill.textAlign,
                whiteSpace: 'nowrap'
              }}
            >
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

