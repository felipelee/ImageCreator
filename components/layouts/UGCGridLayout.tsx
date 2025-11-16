import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { UGC_GRID_SPEC } from '@/lib/layouts/specs/ugc-grid-spec'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface UGCGridLayoutProps {
  brand: Brand
  sku: SKU
}

export function UGCGridLayout({ brand, sku }: UGCGridLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = UGC_GRID_SPEC
  const colors = brand.colors || { bg: '#FFFFFF' }
  const fonts = brand.fonts || { family: 'Inter' }

  // Resolve positions with overrides - each photo individually positioned
  const photo1Pos = resolveElementPosition('ugcGrid', 'photo1', {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    width: 540,
    height: 540,
    zIndex: 10
  }, sku.positionOverrides)
  
  const photo2Pos = resolveElementPosition('ugcGrid', 'photo2', {
    top: 0,
    left: 540,
    x: 540,
    y: 0,
    width: 540,
    height: 540,
    zIndex: 10
  }, sku.positionOverrides)
  
  const photo3Pos = resolveElementPosition('ugcGrid', 'photo3', {
    top: 540,
    left: 0,
    x: 0,
    y: 540,
    width: 540,
    height: 540,
    zIndex: 10
  }, sku.positionOverrides)
  
  const photo4Pos = resolveElementPosition('ugcGrid', 'photo4', {
    top: 540,
    left: 540,
    x: 540,
    y: 540,
    width: 540,
    height: 540,
    zIndex: 10
  }, sku.positionOverrides)

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
        overflow: 'hidden',
        fontFamily: fonts.family,
        backgroundColor: colors.bg
      }}
    >
      {/* Photo 1 - Top Left */}
      {(sku.images.testimonialPhoto || true) && (
        <div
          style={{
            position: 'absolute',
            top: photo1Pos.top,
            left: photo1Pos.left,
            width: photo1Pos.width,
            height: photo1Pos.height,
            overflow: 'hidden',
            zIndex: photo1Pos.zIndex ?? 10,
            transform: combineTransforms(undefined, photo1Pos.rotation)
          }}
        >
          <img
            src={sku.images.testimonialPhoto || '/placeholder-image.svg'}
            alt="Customer 1"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.testimonialPhoto ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Photo 2 - Top Right */}
      {(sku.images.testimonialPhoto2 || true) && (
        <div
          style={{
            position: 'absolute',
            top: photo2Pos.top,
            left: photo2Pos.left,
            width: photo2Pos.width,
            height: photo2Pos.height,
            overflow: 'hidden',
            zIndex: photo2Pos.zIndex ?? 10,
            transform: combineTransforms(undefined, photo2Pos.rotation)
          }}
        >
          <img
            src={sku.images.testimonialPhoto2 || '/placeholder-image.svg'}
            alt="Customer 2"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.testimonialPhoto2 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Photo 3 - Bottom Left */}
      {(sku.images.testimonialPhoto3 || true) && (
        <div
          style={{
            position: 'absolute',
            top: photo3Pos.top,
            left: photo3Pos.left,
            width: photo3Pos.width,
            height: photo3Pos.height,
            overflow: 'hidden',
            zIndex: photo3Pos.zIndex ?? 10,
            transform: combineTransforms(undefined, photo3Pos.rotation)
          }}
        >
          <img
            src={sku.images.testimonialPhoto3 || '/placeholder-image.svg'}
            alt="Customer 3"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.testimonialPhoto3 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Photo 4 - Bottom Right */}
      {(sku.images.testimonialPhoto4 || true) && (
        <div
          style={{
            position: 'absolute',
            top: photo4Pos.top,
            left: photo4Pos.left,
            width: photo4Pos.width,
            height: photo4Pos.height,
            overflow: 'hidden',
            zIndex: photo4Pos.zIndex ?? 10,
            transform: combineTransforms(undefined, photo4Pos.rotation)
          }}
        >
          <img
            src={sku.images.testimonialPhoto4 || '/placeholder-image.svg'}
            alt="Customer 4"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.testimonialPhoto4 ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.ugcGrid || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

