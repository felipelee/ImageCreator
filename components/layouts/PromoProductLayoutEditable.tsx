'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { PROMO_PRODUCT_SPEC } from '@/lib/layouts/specs/promo-product-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface PromoProductLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

export function PromoProductLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: PromoProductLayoutEditableProps) {
  const spec = PROMO_PRODUCT_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const bgColor = getFieldColorValue(brand, sku, 'promo', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'promo', 'Headline', 'accent')
  const statColor = getFieldColorValue(brand, sku, 'promo', 'Stat 1 Value', 'accent')

  const stats = [
    {
      value: sku.copy.promo?.stat1_value || '47%',
      label: sku.copy.promo?.stat1_label || 'LESS MUSCLE FATIGUE*',
      labelWidth: spec.elements.statStyle.stat1?.labelWidth || 200
    },
    {
      value: sku.copy.promo?.stat2_value || '4X',
      label: sku.copy.promo?.stat2_label || 'MORE MUSCLE PROTEIN SYNTHESIS THAN WHEY*',
      labelWidth: spec.elements.statStyle.stat2?.labelWidth || 254
    },
    {
      value: sku.copy.promo?.stat3_value || '144%',
      label: sku.copy.promo?.stat3_label || 'BETTER STRENGTH RECOVERY VS WHEY*',
      labelWidth: spec.elements.statStyle.stat3?.labelWidth || 171
    }
  ]

  // Resolve positions
  const headlinePos = resolveElementPosition('promoProduct', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('promoProduct', 'productImage', spec.elements.productImage, sku.positionOverrides)
  
  // Individual stat positions
  const stat1Pos = resolveElementPosition('promoProduct', 'stat1', {
    top: 494,
    left: 80,
    x: 80,
    y: 494,
    width: 400,
    height: 136,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat2Pos = resolveElementPosition('promoProduct', 'stat2', {
    top: 670,
    left: 80,
    x: 80,
    y: 670,
    width: 400,
    height: 136,
    zIndex: 20
  }, sku.positionOverrides)
  
  const stat3Pos = resolveElementPosition('promoProduct', 'stat3', {
    top: 846,
    left: 80,
    x: 80,
    y: 846,
    width: 400,
    height: 136,
    zIndex: 20
  }, sku.positionOverrides)
  
  const promoBadgePos = resolveElementPosition('promoProduct', 'badge', spec.elements.promoBadge, sku.positionOverrides)
  const badgeTextPos = resolveElementPosition('promoProduct', 'badgeText', spec.elements.badgeTextContainer, sku.positionOverrides)

  // Editable props
  const getEditableProps = (elementKey: string) => {
    if (!isEditMode) return {}
    
    const isSelected = selectedElement === elementKey
    
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelectElement(elementKey)
      },
      className: isEditMode ? 'editable-element' : '',
      style: {
        outline: isSelected ? '2px solid #3b82f6' : 'none',
        outlineOffset: '2px',
        cursor: isEditMode ? (isSelected ? 'grab' : 'pointer') : 'default',
        transition: 'outline 0.15s ease'
      },
      'data-element-key': elementKey,
      'data-editable': 'true'
    }
  }

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
          top: 0,
          left: 0,
          width: 1080,
          height: 1080,
          backgroundColor: bgColor,
          zIndex: 0
        }}
      />

      {/* Headline - Editable */}
      <p
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
          zIndex: headlinePos.zIndex ?? spec.elements.headline.zIndex,
          margin: 0,
          padding: 0,
          transform: headlinePos.rotation ? `rotate(${headlinePos.rotation}deg)` : undefined,
          ...((getEditableProps('headline') as any).style || {})
        }}
      >
        {sku.copy.promo?.headline || 'Peptide fuel. Not another pre-workout.'}
      </p>

      {/* Individual Stats - Each Editable */}
      {[
        { stat: stats[0], pos: stat1Pos, key: 'stat1' },
        { stat: stats[1], pos: stat2Pos, key: 'stat2' },
        { stat: stats[2], pos: stat3Pos, key: 'stat3' }
      ].map(({ stat, pos, key }) => (
        <div
          key={key}
          {...getEditableProps(key)}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            height: pos.height,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            zIndex: pos.zIndex ?? 20,
            transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined,
            ...((getEditableProps(key) as any).style || {})
          }}
        >
          {/* Stat Value */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.statStyle.value.fontSize,
              fontWeight: spec.elements.statStyle.value.fontWeight,
              lineHeight: spec.elements.statStyle.value.lineHeight,
              letterSpacing: `${spec.elements.statStyle.value.letterSpacing}px`,
              color: statColor,
              margin: 0,
              padding: 0,
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}
          >
            {stat.value}
          </p>
          
          {/* Stat Label */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.statStyle.label.fontSize,
              fontWeight: spec.elements.statStyle.label.fontWeight,
              lineHeight: spec.elements.statStyle.label.lineHeight,
              letterSpacing: `${spec.elements.statStyle.label.letterSpacing}px`,
              textTransform: spec.elements.statStyle.label.textTransform,
              color: statColor,
              width: stat.labelWidth,
              margin: 0,
              padding: 0,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              pointerEvents: 'none'
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}

      {/* Product Image - Editable */}
      {sku.images.productAngle && (
        <div
          {...getEditableProps('productImage')}
          style={{
            position: 'absolute',
            top: productImagePos.top,
            left: productImagePos.left,
            width: productImagePos.width ? `${productImagePos.width}px` : spec.elements.productImage.width,
            height: productImagePos.height ? `${productImagePos.height}px` : spec.elements.productImage.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: productImagePos.zIndex ?? spec.elements.productImage.zIndex,
            transform: productImagePos.rotation ? `rotate(${productImagePos.rotation}deg)` : undefined,
            ...((getEditableProps('productImage') as any).style || {})
          }}
        >
          <img
            src={sku.images.productAngle}
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

      {/* Promo Badge - Editable */}
      <div
        {...getEditableProps('badge')}
        style={{
          position: 'absolute',
          top: promoBadgePos.top ?? spec.elements.promoBadge.top,
          left: promoBadgePos.left ?? spec.elements.promoBadge.left,
          width: promoBadgePos.width ? `${promoBadgePos.width}px` : spec.elements.promoBadge.width,
          height: promoBadgePos.height ? `${promoBadgePos.height}px` : spec.elements.promoBadge.height,
          borderRadius: '50%',
          backgroundColor: brand.images.promoBadge ? 'transparent' : (colors.accent || '#323429'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: promoBadgePos.zIndex ?? spec.elements.promoBadge.zIndex,
          transform: promoBadgePos.rotation ? `rotate(${promoBadgePos.rotation}deg)` : undefined,
          ...((getEditableProps('badge') as any).style || {})
        }}
      >
        {brand.images.promoBadge && (
          <img
            src={brand.images.promoBadge}
            alt="Promo"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {/* Badge Text - Editable (layered on top) */}
      <div
        {...getEditableProps('badgeText')}
        style={{
          position: 'absolute',
          top: badgeTextPos.top ?? spec.elements.badgeTextContainer.top,
          left: badgeTextPos.left ?? spec.elements.badgeTextContainer.left,
          width: badgeTextPos.width ?? spec.elements.badgeTextContainer.width,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          lineHeight: '0',
          transform: badgeTextPos.rotation ? `rotate(${badgeTextPos.rotation}deg) ${spec.elements.badgeTextContainer.transform}` : spec.elements.badgeTextContainer.transform,
          zIndex: badgeTextPos.zIndex ?? spec.elements.badgeTextContainer.zIndex,
          ...((getEditableProps('badgeText') as any).style || {})
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.badgeNote.fontSize,
            fontWeight: spec.elements.badgeNote.fontWeight,
            lineHeight: spec.elements.badgeNote.lineHeight,
            color: spec.elements.badgeNote.color,
            textAlign: spec.elements.badgeNote.textAlign,
            margin: 0,
            padding: 0,
            marginBottom: '8px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {sku.copy.promo?.badgeNote || 'First Time Order?'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.badgeText.fontSize,
            fontWeight: spec.elements.badgeText.fontWeight,
            lineHeight: 'normal',
            letterSpacing: `${spec.elements.badgeText.letterSpacing}px`,
            color: spec.elements.badgeText.color,
            textAlign: spec.elements.badgeText.textAlign,
            margin: 0,
            padding: 0,
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {sku.copy.promo?.badge || 'Unlock 10% OFF at checkout'}
        </p>
      </div>

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.promoProduct || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={isEditMode}
        selectedElement={selectedElement}
        onSelectElement={onSelectElement}
      />
    </div>
  )
}

