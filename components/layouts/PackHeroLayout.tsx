import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { PACK_HERO_SPEC } from '@/lib/layouts/specs/pack-hero-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface PackHeroLayoutProps {
  brand: Brand
  sku: SKU
}

export function PackHeroLayout({ brand, sku }: PackHeroLayoutProps) {
  const spec = PACK_HERO_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const bgColor = getFieldColorValue(brand, sku, 'packHero', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'packHero', 'Headline', 'text')
  const subheadColor = getFieldColorValue(brand, sku, 'packHero', 'Subhead', 'textSecondary')

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
      {/* Top Background */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.topBackground.top,
          left: spec.elements.topBackground.left,
          width: spec.elements.topBackground.width,
          height: spec.elements.topBackground.height,
          backgroundColor: bgColor,
          zIndex: spec.elements.topBackground.zIndex
        }}
      />

      {/* Logo Placeholder */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.logo.top,
          left: spec.elements.logo.left,
          width: spec.elements.logo.width,
          height: spec.elements.logo.height,
          backgroundColor: spec.elements.logo.backgroundColor,
          opacity: spec.elements.logo.opacity,
          zIndex: spec.elements.logo.zIndex
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
        {sku.copy.packHero?.headline || 'PREMIUM QUALITY.\nPROVEN RESULTS.'}
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
        {sku.copy.packHero?.subhead || 'The difference you can feel'}
      </p>

      {/* Product Pack */}
      {sku.images.productPrimary && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.productPack.top,
            left: spec.elements.productPack.left,
            width: spec.elements.productPack.width,
            height: spec.elements.productPack.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: spec.elements.productPack.zIndex
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

      {/* Bottom Strip */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.bottomStrip.top,
          left: spec.elements.bottomStrip.left,
          width: spec.elements.bottomStrip.width,
          height: spec.elements.bottomStrip.height,
          backgroundColor: colors.primarySoft,
          zIndex: spec.elements.bottomStrip.zIndex
        }}
      />
    </div>
  )
}

