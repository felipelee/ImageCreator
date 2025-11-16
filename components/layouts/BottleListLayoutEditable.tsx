'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BOTTLE_LIST_SPEC } from '@/lib/layouts/specs/bottle-list-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'
import { Dumbbell, Battery, HeartPulse, Zap, Brain, Shield, Leaf, Target, Activity } from 'lucide-react'

interface BottleListLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

// Icon component mappings - expanded list for user selection
const BENEFIT_ICONS = {
  'dumbbell': Dumbbell,
  'battery': Battery,
  'heart-pulse': HeartPulse,
  'zap': Zap,
  'brain': Brain,
  'shield': Shield,
  'leaf': Leaf,
  'target': Target,
  'activity': Activity
}

export function BottleListLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: BottleListLayoutEditableProps) {
  if (!brand || !sku) return null
  
  const spec = BOTTLE_LIST_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', accent: '#323429', textSecondary: '#6C6C6C' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const headlineColor = getFieldColorValue(brand, sku, 'bottle', 'Headline', 'accent')
  const titleColor = getFieldColorValue(brand, sku, 'bottle', 'Benefit 1', 'accent')
  const descriptionColor = getFieldColorValue(brand, sku, 'bottle', 'Benefit 1 Detail', 'textSecondary')
  const iconColor = getFieldColorValue(brand, sku, 'bottle', 'Benefit 1', 'accent')

  // Get icon choices from SKU data (with fallback defaults)
  const benefit1Icon = sku.copy.bottle?.benefit1_icon || 'dumbbell'
  const benefit2Icon = sku.copy.bottle?.benefit2_icon || 'battery'
  const benefit3Icon = sku.copy.bottle?.benefit3_icon || 'heart-pulse'

  const benefits = [
    {
      icon: benefit1Icon,
      title: sku.copy.bottle?.benefit1 || 'Stronger muscles',
      description: sku.copy.bottle?.benefit1_detail || 'SUPPORTS MUSCLE PROTEIN SYNTHESIS AND LEAN MUSCLE REPAIR'
    },
    {
      icon: benefit2Icon,
      title: sku.copy.bottle?.benefit2 || 'Faster recovery',
      description: sku.copy.bottle?.benefit2_detail || 'SUPPORTS MUSCLE STRENGTH RECOVERY BETWEEN WORKOUTS'
    },
    {
      icon: benefit3Icon,
      title: sku.copy.bottle?.benefit3 || 'Healthy aging',
      description: sku.copy.bottle?.benefit3_detail || 'HELPS MAINTAIN NAD+ LEVELS TO SUPPORT LONG-TERM MUSCLE FUNCTION'
    }
  ]

  // Resolve positions with overrides for individual benefits
  const headlinePos = resolveElementPosition('bottleList', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('bottleList', 'productImage', spec.elements.productImage, sku.positionOverrides)
  
  const benefit1Pos = resolveElementPosition('bottleList', 'benefit1', {
    top: 392,
    left: 487,
    x: 487,
    y: 392,
    width: 500,
    height: 150,
    zIndex: 30
  }, sku.positionOverrides)
  
  const benefit2Pos = resolveElementPosition('bottleList', 'benefit2', {
    top: 592,
    left: 487,
    x: 487,
    y: 592,
    width: 500,
    height: 150,
    zIndex: 30
  }, sku.positionOverrides)
  
  const benefit3Pos = resolveElementPosition('bottleList', 'benefit3', {
    top: 792,
    left: 487,
    x: 487,
    y: 792,
    width: 500,
    height: 150,
    zIndex: 30
  }, sku.positionOverrides)

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
      'data-editable': 'true',
      'data-icon-editable': elementKey.startsWith('benefit') ? 'true' : undefined
    }
  }

  // Render a single benefit row
  const renderBenefit = (benefit: typeof benefits[0], pos: any, key: string) => {
    const IconComponent = BENEFIT_ICONS[benefit.icon as keyof typeof BENEFIT_ICONS]
    
    return (
      <div
        {...getEditableProps(key)}
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          height: pos.height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spec.elements.benefitStyle.container.gap,
          zIndex: pos.zIndex ?? 20,
          transform: combineTransforms(undefined, pos.rotation),
          ...((getEditableProps(key) as any).style || {})
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: spec.elements.benefitStyle.icon.size,
            height: spec.elements.benefitStyle.icon.size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {IconComponent && (
            <IconComponent
              size={spec.elements.benefitStyle.icon.fontSize}
              style={{
                color: iconColor,
                strokeWidth: 1.5
              }}
            />
          )}
        </div>

        {/* Text Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spec.elements.benefitStyle.description.gap,
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          {/* Title */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.benefitStyle.title.fontSize,
              fontWeight: spec.elements.benefitStyle.title.fontWeight,
              lineHeight: spec.elements.benefitStyle.title.lineHeight,
              letterSpacing: `${spec.elements.benefitStyle.title.letterSpacing}px`,
              color: titleColor,
              width: spec.elements.benefitStyle.title.width,
              height: spec.elements.benefitStyle.title.height,
              margin: 0,
              padding: 0
            }}
          >
            {benefit.title}
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.benefitStyle.description.fontSize,
              fontWeight: spec.elements.benefitStyle.description.fontWeight,
              lineHeight: spec.elements.benefitStyle.description.lineHeight,
              letterSpacing: `${spec.elements.benefitStyle.description.letterSpacing}px`,
              textTransform: spec.elements.benefitStyle.description.textTransform,
              color: descriptionColor,
              width: spec.elements.benefitStyle.description.width,
              margin: 0,
              padding: 0,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {benefit.description}
          </p>
        </div>
      </div>
    )
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

      {/* Product Image (Hand holding product) - Editable */}
      {(sku.images.lifestyleA || true) && (
        <div
          {...getEditableProps('productImage')}
          style={{
            position: 'absolute',
            top: productImagePos.top,
            left: productImagePos.left,
            width: productImagePos.width,
            height: productImagePos.height,
            zIndex: productImagePos.zIndex ?? spec.elements.productImage.zIndex,
            transform: combineTransforms(
              productImagePos.rotation ? `rotate(${productImagePos.rotation}deg)` : undefined
            ),
            transformOrigin: 'top left',
            ...((getEditableProps('productImage') as any).style || {})
          }}
        >
          <img
            src={sku.images.lifestyleA || '/placeholder-image.svg'}
            alt="Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '76% 50%',
              pointerEvents: 'none',
              opacity: sku.images.lifestyleA ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Headline - Editable */}
      <p
        {...getEditableProps('headline')}
        style={{
          position: 'absolute',
          top: headlinePos.top,
          left: headlinePos.left,
          width: headlinePos.width,
          height: headlinePos.height,
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
        {sku.copy.bottle?.headline || 'Stronger, Longer'}
      </p>

      {/* Individual Benefits - Each Editable */}
      {renderBenefit(benefits[0], benefit1Pos, 'benefit1')}
      {renderBenefit(benefits[1], benefit2Pos, 'benefit2')}
      {renderBenefit(benefits[2], benefit3Pos, 'benefit3')}

      {/* Custom Elements - User-created elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.bottleList || []}
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
