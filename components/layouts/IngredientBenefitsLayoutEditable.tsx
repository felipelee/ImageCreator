'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { INGREDIENT_BENEFITS_SPEC } from '@/lib/layouts/specs/ingredient-benefits-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'
import { 
  Dumbbell, Brain, FlaskRound, Zap, RefreshCw
} from 'lucide-react'

interface IngredientBenefitsLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

const BENEFIT_ICONS: Record<string, any> = {
  'dumbbell': Dumbbell,
  'brain': Brain,
  'flask': FlaskRound,
  'zap': Zap,
  'refresh': RefreshCw,
}

export function IngredientBenefitsLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: IngredientBenefitsLayoutEditableProps) {
  if (!brand || !sku) return null
  
  const spec = INGREDIENT_BENEFITS_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', text: '#323429', accent: '#E85D4F' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const bgColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Headline', 'text')
  const subheadlineColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Subheadline', 'text')
  const iconColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Benefit Icons', 'accent')
  const labelColor = getFieldColorValue(brand, sku, 'ingredientBenefits', 'Benefit Labels', 'accent')

  const benefits = [
    {
      icon: sku.copy.ingredientBenefits?.benefit1_icon || 'dumbbell',
      label: sku.copy.ingredientBenefits?.benefit1_label || 'Muscle Power'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit2_icon || 'brain',
      label: sku.copy.ingredientBenefits?.benefit2_label || 'Support Focus'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit3_icon || 'flask',
      label: sku.copy.ingredientBenefits?.benefit3_label || '3rd Party Tested'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit4_icon || 'zap',
      label: sku.copy.ingredientBenefits?.benefit4_label || 'Boost Energy'
    },
    {
      icon: sku.copy.ingredientBenefits?.benefit5_icon || 'refresh',
      label: sku.copy.ingredientBenefits?.benefit5_label || 'Recover Faster'
    }
  ]

  // Resolve positions with overrides
  const ingredientImagePos = resolveElementPosition('ingredientBenefits', 'ingredientImage', {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    width: 540,
    height: 820,
    zIndex: 10
  }, sku.positionOverrides)
  
  const headlinePos = resolveElementPosition('ingredientBenefits', 'headline', {
    top: 240,
    left: 530,
    x: 530,
    y: 240,
    width: 520,
    height: 240,
    zIndex: 20
  }, sku.positionOverrides)
  
  const subheadlinePos = resolveElementPosition('ingredientBenefits', 'subheadline', {
    top: 580,
    left: 530,
    x: 530,
    y: 580,
    width: 520,
    height: 120,
    zIndex: 20
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

  return (
    <div
      style={{
        position: 'relative',
        width: `${spec.canvas.width}px`,
        height: `${spec.canvas.height}px`,
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
          backgroundColor: bgColor,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Ingredient Image - Editable */}
      {(sku.images.ingredientA || true) && (
        <div
          {...getEditableProps('ingredientImage')}
          style={{
            position: 'absolute',
            top: ingredientImagePos.top,
            left: ingredientImagePos.left,
            width: ingredientImagePos.width,
            height: ingredientImagePos.height,
            overflow: 'hidden',
            zIndex: ingredientImagePos.zIndex ?? 10,
            transform: combineTransforms(undefined, ingredientImagePos.rotation),
            ...((getEditableProps('ingredientImage') as any).style || {})
          }}
        >
          <img
            src={sku.images.ingredientA || '/placeholder-image.svg'}
            alt="Ingredient"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.ingredientA ? 1 : 0.3,
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* Headline - Editable */}
      <h1
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
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          ...((getEditableProps('headline') as any).style || {})
        }}
      >
        {sku.copy.ingredientBenefits?.headline || 'What could you do with more energy?'}
      </h1>

      {/* Subheadline - Editable */}
      <p
        {...getEditableProps('subheadline')}
        style={{
          position: 'absolute',
          top: subheadlinePos.top,
          left: subheadlinePos.left,
          width: subheadlinePos.width,
          height: subheadlinePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.subheadline.fontSize,
          fontWeight: spec.elements.subheadline.fontWeight,
          lineHeight: spec.elements.subheadline.lineHeight,
          letterSpacing: `${spec.elements.subheadline.letterSpacing}px`,
          color: subheadlineColor,
          textAlign: spec.elements.subheadline.textAlign,
          zIndex: subheadlinePos.zIndex ?? spec.elements.subheadline.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, subheadlinePos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          ...((getEditableProps('subheadline') as any).style || {})
        }}
      >
        {sku.copy.ingredientBenefits?.subheadline || 'Feel your best every day, wherever it takes you.'}
      </p>

      {/* Benefits Row - Static (don't need individual editing) */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.benefitsContainer.top,
          left: spec.elements.benefitsContainer.left,
          width: spec.elements.benefitsContainer.width,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: `${spec.elements.benefitsContainer.gap}px`,
          zIndex: spec.elements.benefitsContainer.zIndex
        }}
      >
        {benefits.map((benefit, index) => {
          const IconComponent = BENEFIT_ICONS[benefit.icon as keyof typeof BENEFIT_ICONS]
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: spec.elements.benefitStyle.label.width,
                pointerEvents: isEditMode ? 'none' : 'auto'
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: spec.elements.benefitStyle.icon.size,
                  height: spec.elements.benefitStyle.icon.size,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
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
              
              {/* Label */}
              <p
                style={{
                  fontFamily: fonts.family,
                  fontSize: spec.elements.benefitStyle.label.fontSize,
                  fontWeight: spec.elements.benefitStyle.label.fontWeight,
                  lineHeight: spec.elements.benefitStyle.label.lineHeight,
                  letterSpacing: `${spec.elements.benefitStyle.label.letterSpacing}px`,
                  color: labelColor,
                  textAlign: spec.elements.benefitStyle.label.textAlign,
                  width: spec.elements.benefitStyle.label.width,
                  marginTop: `${spec.elements.benefitStyle.label.marginTop}px`,
                  margin: 0,
                  padding: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {benefit.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.ingredientBenefits || []}
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

