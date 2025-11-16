'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BEFORE_AFTER_SPEC } from '@/lib/layouts/specs/before-after-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface BeforeAfterLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

export function BeforeAfterLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: BeforeAfterLayoutEditableProps) {
  if (!brand || !sku) return null
  
  const spec = BEFORE_AFTER_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getFieldColorValue(brand, sku, 'beforeAfter', 'Headline', 'accent')
  const beforeTextColor = getFieldColorValue(brand, sku, 'beforeAfter', 'Before Text', 'text')
  const afterTextColor = getFieldColorValue(brand, sku, 'beforeAfter', 'After Text', 'text')
  const dividerColor = getFieldColorValue(brand, sku, 'beforeAfter', 'Divider', 'primarySoft')

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('beforeAfter', 'headline', spec.elements.headline, sku.positionOverrides)
  const beforePanelPos = resolveElementPosition('beforeAfter', 'beforePanel', spec.elements.beforeContainer, sku.positionOverrides)
  const afterPanelPos = resolveElementPosition('beforeAfter', 'afterPanel', spec.elements.afterContainer, sku.positionOverrides)
  const productImagePos = resolveElementPosition('beforeAfter', 'productImage', spec.elements.productImage, sku.positionOverrides)

  // Editable props for elements
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
        backgroundColor: colors.bg,
        overflow: 'hidden',
        fontFamily: fonts.family
      }}
    >
      {/* Background - not editable */}
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
          transform: combineTransforms(undefined, headlinePos.rotation),
          ...((getEditableProps('headline') as any).style || {})
        }}
      >
        {sku.copy.beforeAfter?.headline || 'The Transformation'}
      </h1>

      {/* Divider Line - not editable */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.divider.top,
          left: spec.elements.divider.left,
          width: spec.elements.divider.width,
          height: spec.elements.divider.height,
          backgroundColor: dividerColor,
          zIndex: spec.elements.divider.zIndex
        }}
      />

      {/* Before Section - Editable */}
      <div
        {...getEditableProps('beforePanel')}
        style={{
          position: 'absolute',
          top: beforePanelPos.top,
          left: beforePanelPos.left,
          width: beforePanelPos.width,
          height: beforePanelPos.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: beforePanelPos.zIndex ?? spec.elements.beforeContainer.zIndex,
          transform: combineTransforms(undefined, beforePanelPos.rotation),
          ...((getEditableProps('beforePanel') as any).style || {})
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.beforeLabel.fontSize,
            fontWeight: spec.elements.beforeLabel.fontWeight,
            lineHeight: spec.elements.beforeLabel.lineHeight,
            letterSpacing: `${spec.elements.beforeLabel.letterSpacing}px`,
            color: colors.textSecondary,
            textAlign: spec.elements.beforeLabel.textAlign,
            textTransform: spec.elements.beforeLabel.textTransform,
            margin: 0,
            padding: 0,
            marginBottom: '20px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {sku.copy.beforeAfter?.beforeLabel || 'BEFORE'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.beforeText.fontSize,
            fontWeight: spec.elements.beforeText.fontWeight,
            lineHeight: spec.elements.beforeText.lineHeight,
            letterSpacing: `${spec.elements.beforeText.letterSpacing}px`,
            color: beforeTextColor,
            textAlign: spec.elements.beforeText.textAlign,
            margin: 0,
            padding: '0 20px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {sku.copy.beforeAfter?.beforeText || 'Feeling tired and sluggish throughout the day'}
        </p>
      </div>

      {/* After Section - Editable */}
      <div
        {...getEditableProps('afterPanel')}
        style={{
          position: 'absolute',
          top: afterPanelPos.top,
          left: afterPanelPos.left,
          width: afterPanelPos.width,
          height: afterPanelPos.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: afterPanelPos.zIndex ?? spec.elements.afterContainer.zIndex,
          transform: combineTransforms(undefined, afterPanelPos.rotation),
          ...((getEditableProps('afterPanel') as any).style || {})
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.afterLabel.fontSize,
            fontWeight: spec.elements.afterLabel.fontWeight,
            lineHeight: spec.elements.afterLabel.lineHeight,
            letterSpacing: `${spec.elements.afterLabel.letterSpacing}px`,
            color: headlineColor,
            textAlign: spec.elements.afterLabel.textAlign,
            textTransform: spec.elements.afterLabel.textTransform,
            margin: 0,
            padding: 0,
            marginBottom: '20px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {sku.copy.beforeAfter?.afterLabel || 'AFTER'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.afterText.fontSize,
            fontWeight: spec.elements.afterText.fontWeight,
            lineHeight: spec.elements.afterText.lineHeight,
            letterSpacing: `${spec.elements.afterText.letterSpacing}px`,
            color: afterTextColor,
            textAlign: spec.elements.afterText.textAlign,
            margin: 0,
            padding: '0 20px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {sku.copy.beforeAfter?.afterText || 'Sustained energy and mental clarity all day long'}
        </p>
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
            transform: combineTransforms(undefined, productImagePos.rotation),
            ...((getEditableProps('productImage') as any).style || {})
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

      {/* Custom Elements - User-created elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.beforeAfter || []}
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

