import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { SOCIAL_PROOF_SPEC } from '@/lib/layouts/specs/social-proof-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { DraggableElement } from '@/components/layout-editor/DraggableElement'

interface SocialProofLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  onElementDrag?: (elementKey: string, newPos: { x: number, y: number }) => void
  onElementResize?: (elementKey: string, newSize: { width: number, height: number }) => void
  onElementRotate?: (elementKey: string, rotation: number) => void
  selectedElement?: string | null
  onSelectElement?: (elementKey: string | null) => void
}

export function SocialProofLayoutEditable({
  brand,
  sku,
  isEditMode = false,
  onElementDrag,
  onElementResize,
  onElementRotate,
  selectedElement,
  onSelectElement
}: SocialProofLayoutEditableProps) {
  if (!brand || !sku) return null
  
  const spec = SOCIAL_PROOF_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getFieldColorValue(brand, sku, 'socialProof', 'Headline', 'accent')
  const cardBgColor = getFieldColorValue(brand, sku, 'socialProof', 'Review Cards', 'bgAlt')
  const starsColor = getFieldColorValue(brand, sku, 'socialProof', 'Stars', 'accent')
  const quoteColor = getFieldColorValue(brand, sku, 'socialProof', 'Quote Text', 'text')
  const nameColor = getFieldColorValue(brand, sku, 'socialProof', 'Name', 'textSecondary')

  const reviews = [
    {
      stars: sku.copy.socialProof?.review1_rating || '★★★★★',
      quote: sku.copy.socialProof?.review1_quote || 'Game changer! I feel amazing.',
      name: sku.copy.socialProof?.review1_name || '- Jessica M.'
    },
    {
      stars: sku.copy.socialProof?.review2_rating || '★★★★★',
      quote: sku.copy.socialProof?.review2_quote || 'Best purchase I\'ve made all year.',
      name: sku.copy.socialProof?.review2_name || '- David L.'
    },
    {
      stars: sku.copy.socialProof?.review3_rating || '★★★★★',
      quote: sku.copy.socialProof?.review3_quote || 'Actually works. No gimmicks.',
      name: sku.copy.socialProof?.review3_name || '- Sarah K.'
    }
  ]

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('socialProof', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('socialProof', 'productImage', spec.elements.productImage, sku.positionOverrides)

  const getEditableProps = (elementKey: string) => {
    if (!isEditMode) return {}
    return {
      'data-element-key': elementKey,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelectElement?.(elementKey)
      }
    }
  }

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
      onClick={() => isEditMode && onSelectElement?.(null)}
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

      {/* Headline - Editable */}
      <h1
        {...getEditableProps('headline')}
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
          transform: combineTransforms(
            headlinePos.rotation ? `rotate(${headlinePos.rotation}deg)` : undefined
          ),
          pointerEvents: isEditMode ? 'auto' : 'auto',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {sku.copy.socialProof?.headline || 'Real People. Real Results.'}
      </h1>

      {/* Reviews - Static (don't need individual editing) */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.reviewsContainer.top,
          left: spec.elements.reviewsContainer.left,
          width: spec.elements.reviewsContainer.width,
          display: 'flex',
          flexDirection: 'column',
          gap: `${spec.elements.reviewsContainer.gap}px`,
          zIndex: spec.elements.reviewsContainer.zIndex
        }}
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            style={{
              backgroundColor: cardBgColor,
              borderRadius: spec.elements.reviewCard.borderRadius,
              padding: `${spec.elements.reviewCard.padding}px`,
              marginBottom: `${spec.elements.reviewCard.marginBottom}px`
            }}
          >
            {/* Stars */}
            <p
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.reviewCard.stars.fontSize,
                color: starsColor,
                margin: 0,
                padding: 0,
                marginBottom: `${spec.elements.reviewCard.stars.marginBottom}px`
              }}
            >
              {review.stars}
            </p>
            {/* Quote */}
            <p
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.reviewCard.quote.fontSize,
                fontWeight: spec.elements.reviewCard.quote.fontWeight,
                lineHeight: spec.elements.reviewCard.quote.lineHeight,
                letterSpacing: `${spec.elements.reviewCard.quote.letterSpacing}px`,
                color: quoteColor,
                margin: 0,
                padding: 0,
                marginBottom: `${spec.elements.reviewCard.quote.marginBottom}px`,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              "{review.quote}"
            </p>
            {/* Name */}
            <p
              style={{
                fontFamily: fonts.family,
                fontSize: spec.elements.reviewCard.name.fontSize,
                fontWeight: spec.elements.reviewCard.name.fontWeight,
                lineHeight: spec.elements.reviewCard.name.lineHeight,
                letterSpacing: `${spec.elements.reviewCard.name.letterSpacing}px`,
                color: nameColor,
                margin: 0,
                padding: 0
              }}
            >
              {review.name}
            </p>
          </div>
        ))}
      </div>

      {/* Product Image - Editable */}
      {sku.images.productPrimary && (
        <div
          {...getEditableProps('productImage')}
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
            transform: combineTransforms(
              productImagePos.rotation ? `rotate(${productImagePos.rotation}deg)` : undefined
            ),
            pointerEvents: isEditMode ? 'auto' : 'auto'
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
              objectFit: 'contain',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* Draggable Elements Overlay */}
      {isEditMode && (
        <>
          <DraggableElement
            elementKey="headline"
            initialPosition={{ x: headlinePos.left, y: headlinePos.top }}
            initialSize={{ width: headlinePos.width, height: spec.elements.headline.fontSize * 1.2 }}
            initialRotation={headlinePos.rotation || 0}
            isSelected={selectedElement === 'headline'}
            onDrag={(pos) => onElementDrag?.('headline', pos)}
            onResize={(size) => onElementResize?.('headline', size)}
            onRotate={(rotation) => onElementRotate?.('headline', rotation)}
            onSelect={() => onSelectElement?.('headline')}
            canResize={true}
            canRotate={true}
          />

          <DraggableElement
            elementKey="productImage"
            initialPosition={{ x: productImagePos.left, y: productImagePos.top }}
            initialSize={{ width: productImagePos.width, height: productImagePos.height }}
            initialRotation={productImagePos.rotation || 0}
            isSelected={selectedElement === 'productImage'}
            onDrag={(pos) => onElementDrag?.('productImage', pos)}
            onResize={(size) => onElementResize?.('productImage', size)}
            onRotate={(rotation) => onElementRotate?.('productImage', rotation)}
            onSelect={() => onSelectElement?.('productImage')}
            canResize={true}
            canRotate={true}
          />
        </>
      )}
    </div>
  )
}

