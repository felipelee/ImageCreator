import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { HERO_SPEC } from '@/lib/layouts/specs/hero-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface HeroLayoutProps {
  brand: Brand
  sku: SKU
}

export function HeroLayout({ brand, sku }: HeroLayoutProps) {
  const spec = HERO_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  // Get colors with potential overrides
  const overlayColor = getFieldColorValue(brand, sku, 'hero1', 'Overlay Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'hero1', 'Headline', 'text')
  const subheadColor = getFieldColorValue(brand, sku, 'hero1', 'Subhead', 'textSecondary')
  const badgeColor = getFieldColorValue(brand, sku, 'hero1', 'Offer Badge', 'badge')

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
      {/* Background Image */}
      {brand.images.backgroundHero && (
        <img
          src={brand.images.backgroundHero}
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

      {/* Overlay Bar */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.overlay.top,
          left: spec.elements.overlay.left,
          width: spec.elements.overlay.width,
          height: spec.elements.overlay.height,
          backgroundColor: overlayColor,
          opacity: spec.elements.overlay.opacity,
          zIndex: spec.elements.overlay.zIndex
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
        {sku.copy.hero1?.headline || 'HEADLINE'}
      </h1>

      {/* Subhead */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.subhead.top,
          left: spec.elements.subhead.left,
          width: spec.elements.subhead.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.subhead.fontSize,
          fontWeight: spec.elements.subhead.fontWeight,
          lineHeight: spec.elements.subhead.lineHeight,
          letterSpacing: `${spec.elements.subhead.letterSpacing}px`,
          color: subheadColor,
          textAlign: spec.elements.subhead.textAlign,
          zIndex: spec.elements.subhead.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.hero1?.subhead || 'Your subheadline goes here'}
      </p>

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

      {/* Offer Badge */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.offerBadge.top,
          left: spec.elements.offerBadge.left,
          width: spec.elements.offerBadge.width,
          height: spec.elements.offerBadge.height,
          borderRadius: spec.elements.offerBadge.borderRadius,
          backgroundColor: badgeColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: spec.elements.offerBadge.zIndex
        }}
      >
        <span
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.offerBadge.text.fontSize,
            fontWeight: spec.elements.offerBadge.text.fontWeight,
            lineHeight: spec.elements.offerBadge.text.lineHeight,
            letterSpacing: `${spec.elements.offerBadge.text.letterSpacing}px`,
            color: spec.elements.offerBadge.text.color,
            textAlign: spec.elements.offerBadge.text.textAlign,
            whiteSpace: spec.elements.offerBadge.text.whiteSpace
          }}
        >
          {sku.copy.hero1?.offerBadge || '50% OFF\nFIRST ORDER'}
        </span>
      </div>
    </div>
  )
}

