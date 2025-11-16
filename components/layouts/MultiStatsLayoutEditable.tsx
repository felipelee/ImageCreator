'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { MULTI_STATS_SPEC } from '@/lib/layouts/specs/multi-stats-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface MultiStatsLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

export function MultiStatsLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: MultiStatsLayoutEditableProps) {
  const spec = MULTI_STATS_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getFieldColorValue(brand, sku, 'multiStats', 'Headline', 'bg')
  const statColor = getFieldColorValue(brand, sku, 'multiStats', 'Stat 1 Value', 'bg')

  const stats = [
    {
      value: sku.copy.stats?.stat1_value || '78%',
      label: sku.copy.stats?.stat1_label || 'MORE LIKELY TO WAKE UP ACTUALLY RESTED'
    },
    {
      value: sku.copy.stats?.stat2_value || '71%',
      label: sku.copy.stats?.stat2_label || 'MORE LIKELY TO FEEL IN CONTROL OF CRAVINGS'
    },
    {
      value: sku.copy.stats?.stat3_value || '69%',
      label: sku.copy.stats?.stat3_label || 'MORE LIKELY TO FEEL STEADY, ALL-DAY ENERGY'
    }
  ]

  // Resolve positions
  const headlinePos = resolveElementPosition('multiStats', 'headline', spec.elements.headline, sku.positionOverrides)
  const disclaimerPos = resolveElementPosition('multiStats', 'disclaimer', {
    ...spec.elements.disclaimer,
    top: 1036,
    left: 657,
    x: 657,
    y: 1036,
    width: 395
  }, sku.positionOverrides)
  const stat1Pos = resolveElementPosition('multiStats', 'stat1', { top: 285, left: 657, x: 657, y: 285, width: 393, zIndex: 20 }, sku.positionOverrides)
  const stat2Pos = resolveElementPosition('multiStats', 'stat2', { top: 549, left: 652, x: 652, y: 549, width: 351, zIndex: 20 }, sku.positionOverrides)
  const stat3Pos = resolveElementPosition('multiStats', 'stat3', { top: 796, left: 650, x: 650, y: 796, width: 420, zIndex: 20 }, sku.positionOverrides)

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
        overflow: 'hidden',
        fontFamily: fonts.family
      }}
    >
      {/* Background Image */}
      {sku.images.lifestyleMultiStats && (
        <img
          src={sku.images.lifestyleMultiStats}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1080,
            height: 1080,
            objectFit: 'cover',
            zIndex: 0
          }}
        />
      )}

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
          textAlign: spec.elements.headline.textAlign,
          transform: spec.elements.headline.transform,
          zIndex: headlinePos.zIndex ?? spec.elements.headline.zIndex,
          margin: 0,
          padding: 0,
          ...((getEditableProps('headline') as any).style || {})
        }}
      >
        {sku.copy.stats?.headline || 'People who take Make Wellness peptides are:'}
      </p>

      {/* Stats - Individual Editable Containers */}
      {[stat1Pos, stat2Pos, stat3Pos].map((statPos, index) => (
        <div
          key={index}
          {...getEditableProps(`stat${index + 1}`)}
          style={{
            position: 'absolute',
            top: statPos.top,
            left: statPos.left,
            width: statPos.width ? `${statPos.width}px` : 900,
            zIndex: statPos.zIndex ?? 20,
            transform: statPos.rotation ? `rotate(${statPos.rotation}deg)` : undefined,
            ...((getEditableProps(`stat${index + 1}`) as any).style || {})
          }}
        >
          <p style={{
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
          }}>
            {stats[index].value}
          </p>

          <p style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.statStyle.label.fontSize,
            fontWeight: spec.elements.statStyle.label.fontWeight,
            lineHeight: spec.elements.statStyle.label.lineHeight,
            letterSpacing: `${spec.elements.statStyle.label.letterSpacing}px`,
            textTransform: spec.elements.statStyle.label.textTransform,
            color: statColor,
            width: spec.elements.statStyle.label.width,
            margin: 0,
            padding: 0,
            marginTop: spec.elements.statStyle.label.marginTop,
            pointerEvents: 'none'
          }}>
            {stats[index].label}
          </p>
        </div>
      ))}

      {/* Disclaimer - Editable */}
      <p
        {...getEditableProps('disclaimer')}
        style={{
          position: 'absolute',
          top: disclaimerPos.top,
          left: disclaimerPos.left,
          width: disclaimerPos.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.disclaimer.fontSize,
          fontWeight: spec.elements.disclaimer.fontWeight,
          lineHeight: spec.elements.disclaimer.lineHeight,
          letterSpacing: `${spec.elements.disclaimer.letterSpacing}px`,
          color: spec.elements.disclaimer.color,
          textAlign: spec.elements.disclaimer.textAlign,
          zIndex: disclaimerPos.zIndex ?? spec.elements.disclaimer.zIndex,
          margin: 0,
          padding: 0,
          ...((getEditableProps('disclaimer') as any).style || {})
        }}
      >
        {sku.copy.stats?.disclaimer || '*Based on a 60-day study showing benefits from daily use.'}
      </p>

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.multiStats || []}
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

