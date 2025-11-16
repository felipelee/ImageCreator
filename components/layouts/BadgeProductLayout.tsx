import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BADGE_PRODUCT_SPEC } from '@/lib/layouts/specs/badge-product-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface BadgeProductLayoutProps {
  brand: Brand
  sku: SKU
}

export function BadgeProductLayout({ brand, sku }: BadgeProductLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = BADGE_PRODUCT_SPEC
  const colors = brand.colors || { bg: '#4A90E2' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  // Determine background mode (image or color)
  const backgroundImage = sku.images.backgroundBadgeProduct || brand.images.backgroundBadgeProduct
  const backgroundMode = sku.backgroundMode?.badgeProduct || 
    (backgroundImage ? 'image' : 'color')
  
  // Get background color (will be used in color mode)
  const backgroundColor = getFieldColorValue(brand, sku, 'badgeProduct', 'Background Color', 'bg')

  // Resolve positions with overrides
  const productImagePos = resolveElementPosition('badgeProduct', 'productImage', {
    top: 140,
    left: 240,
    x: 240,
    y: 140,
    width: 600,
    height: 800,
    zIndex: 10
  }, sku.positionOverrides)
  
  const badge1Pos = resolveElementPosition('badgeProduct', 'badge1', {
    top: 180,
    left: 100,
    x: 100,
    y: 180,
    width: 180,
    height: 180,
    zIndex: 20
  }, sku.positionOverrides)
  
  const badge2Pos = resolveElementPosition('badgeProduct', 'badge2', {
    top: 180,
    left: 800,
    x: 800,
    y: 180,
    width: 180,
    height: 180,
    zIndex: 20
  }, sku.positionOverrides)
  
  const badge3Pos = resolveElementPosition('badgeProduct', 'badge3', {
    top: 720,
    left: 100,
    x: 100,
    y: 720,
    width: 180,
    height: 180,
    zIndex: 20
  }, sku.positionOverrides)
  
  const badge4Pos = resolveElementPosition('badgeProduct', 'badge4', {
    top: 720,
    left: 800,
    x: 800,
    y: 720,
    width: 180,
    height: 180,
    zIndex: 20
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
      {/* Background - Image or Color */}
      {backgroundMode === 'image' && backgroundImage ? (
        <img
          src={backgroundImage}
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
      ) : (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.background.top,
            left: spec.elements.background.left,
            width: spec.elements.background.width,
            height: spec.elements.background.height,
            backgroundColor: backgroundColor,
            zIndex: spec.elements.background.zIndex
          }}
        />
      )}

      {/* Main Product Image */}
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

      {/* Badge 1 - Top Left */}
      {(sku.images.badge1 || true) && (
        <div
          style={{
            position: 'absolute',
            top: badge1Pos.top,
            left: badge1Pos.left,
            width: badge1Pos.width,
            height: badge1Pos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: badge1Pos.zIndex ?? 20,
            transform: combineTransforms(undefined, badge1Pos.rotation)
          }}
        >
          <img
            src={sku.images.badge1 || '/placeholder-image.svg'}
            alt="Badge 1"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: sku.images.badge1 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Badge 2 - Top Right */}
      {(sku.images.badge2 || true) && (
        <div
          style={{
            position: 'absolute',
            top: badge2Pos.top,
            left: badge2Pos.left,
            width: badge2Pos.width,
            height: badge2Pos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: badge2Pos.zIndex ?? 20,
            transform: combineTransforms(undefined, badge2Pos.rotation)
          }}
        >
          <img
            src={sku.images.badge2 || '/placeholder-image.svg'}
            alt="Badge 2"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: sku.images.badge2 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Badge 3 - Bottom Left */}
      {(sku.images.badge3 || true) && (
        <div
          style={{
            position: 'absolute',
            top: badge3Pos.top,
            left: badge3Pos.left,
            width: badge3Pos.width,
            height: badge3Pos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: badge3Pos.zIndex ?? 20,
            transform: combineTransforms(undefined, badge3Pos.rotation)
          }}
        >
          <img
            src={sku.images.badge3 || '/placeholder-image.svg'}
            alt="Badge 3"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: sku.images.badge3 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Badge 4 - Bottom Right */}
      {(sku.images.badge4 || true) && (
        <div
          style={{
            position: 'absolute',
            top: badge4Pos.top,
            left: badge4Pos.left,
            width: badge4Pos.width,
            height: badge4Pos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: badge4Pos.zIndex ?? 20,
            transform: combineTransforms(undefined, badge4Pos.rotation)
          }}
        >
          <img
            src={sku.images.badge4 || '/placeholder-image.svg'}
            alt="Badge 4"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: sku.images.badge4 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.badgeProduct || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

