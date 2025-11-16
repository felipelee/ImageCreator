'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TIMELINE_SPEC } from '@/lib/layouts/specs/timeline-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface TimelineLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

export function TimelineLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: TimelineLayoutEditableProps) {
  if (!brand || !sku) return null
  
  const spec = TIMELINE_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', primarySoft: '#DCE0D2' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const headlineColor = '#FFFFFF' // Always white on dark overlay
  const badgeColor = colors.primarySoft || '#DCE0D2'
  const descriptionColor = '#FFFFFF' // Always white

  const milestones = [
    {
      time: sku.copy.timeline?.milestone1_time || '7 Days',
      title: sku.copy.timeline?.milestone1_title || 'Smoother, more stable energy during the day'
    },
    {
      time: sku.copy.timeline?.milestone2_time || '7 Days',
      title: sku.copy.timeline?.milestone2_title || 'Smoother, more stable energy during the day'
    },
    {
      time: sku.copy.timeline?.milestone3_time || '7 Days',
      title: sku.copy.timeline?.milestone3_title || 'Smoother, more stable energy during the day'
    }
  ]

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('timeline', 'headline', spec.elements.headline, sku.positionOverrides)
  const productImagePos = resolveElementPosition('timeline', 'productImage', spec.elements.productImage, sku.positionOverrides)
  const timelineLinePos = resolveElementPosition('timeline', 'timelineLine', spec.elements.timelineLine, sku.positionOverrides)
  
  // Individual milestone positions
  const milestone1Pos = resolveElementPosition('timeline', 'milestone1', {
    top: 300,
    left: 487,
    x: 487,
    y: 300,
    width: 518,
    zIndex: 2
  }, sku.positionOverrides)
  
  const milestone2Pos = resolveElementPosition('timeline', 'milestone2', {
    top: 300 + 80 + 80, // container top + gap + first milestone estimated height
    left: 487,
    x: 487,
    y: 380,
    width: 518,
    zIndex: 2
  }, sku.positionOverrides)
  
  const milestone3Pos = resolveElementPosition('timeline', 'milestone3', {
    top: 300 + 160 + 160,
    left: 487,
    x: 487,
    y: 460,
    width: 518,
    zIndex: 2
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
      {/* Background Image - not editable */}
      {sku.images.lifestyleTimeline && (
        <img
          src={sku.images.lifestyleTimeline}
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

      {/* Dark Overlay - not editable */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.overlay.top,
          left: spec.elements.overlay.left,
          width: spec.elements.overlay.width,
          height: spec.elements.overlay.height,
          backgroundColor: spec.elements.overlay.backgroundColor,
          zIndex: spec.elements.overlay.zIndex
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
          transform: combineTransforms(spec.elements.headline.transform, headlinePos.rotation),
          ...((getEditableProps('headline') as any).style || {})
        }}
      >
        {sku.copy.timeline?.headline || 'Feel the change'}
      </p>

      {/* Timeline Line (vertical line connecting milestones) - Editable */}
      <div
        {...getEditableProps('timelineLine')}
        style={{
          position: 'absolute',
          top: timelineLinePos.top,
          left: timelineLinePos.left,
          width: timelineLinePos.width,
          height: timelineLinePos.height,
          backgroundColor: spec.elements.timelineLine.backgroundColor,
          transform: combineTransforms(spec.elements.timelineLine.transform, timelineLinePos.rotation),
          zIndex: timelineLinePos.zIndex ?? spec.elements.timelineLine.zIndex,
          pointerEvents: isEditMode ? 'auto' : 'none'
        }}
      />

      {/* Milestone 1 - Editable */}
      <div
        {...getEditableProps('milestone1')}
        style={{
          position: 'absolute',
          top: milestone1Pos.top,
          left: milestone1Pos.left,
          width: milestone1Pos.width,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spec.elements.milestoneStyle.container.gap,
          zIndex: milestone1Pos.zIndex ?? 2,
          transform: combineTransforms(undefined, milestone1Pos.rotation),
          ...((getEditableProps('milestone1') as any).style || {})
        }}
      >
        <div
          style={{
            backgroundColor: badgeColor,
            paddingLeft: spec.elements.milestoneStyle.badge.paddingX,
            paddingRight: spec.elements.milestoneStyle.badge.paddingX,
            paddingTop: spec.elements.milestoneStyle.badge.paddingY,
            paddingBottom: spec.elements.milestoneStyle.badge.paddingY,
            borderRadius: spec.elements.milestoneStyle.badge.borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            minHeight: '44px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.milestoneStyle.badge.fontSize,
              fontWeight: spec.elements.milestoneStyle.badge.fontWeight,
              lineHeight: spec.elements.milestoneStyle.badge.lineHeight,
              letterSpacing: `${spec.elements.milestoneStyle.badge.letterSpacing}px`,
              textTransform: spec.elements.milestoneStyle.badge.textTransform,
              color: spec.elements.milestoneStyle.badge.color,
              textAlign: spec.elements.milestoneStyle.badge.textAlign,
              margin: 0,
              padding: 0,
              whiteSpace: 'pre',
              display: 'block'
            }}
          >
            {milestones[0].time}
          </p>
        </div>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.milestoneStyle.description.fontSize,
            fontWeight: spec.elements.milestoneStyle.description.fontWeight,
            lineHeight: spec.elements.milestoneStyle.description.lineHeight,
            letterSpacing: `${spec.elements.milestoneStyle.description.letterSpacing}px`,
            color: descriptionColor,
            flex: 1,
            margin: 0,
            padding: 0,
            pointerEvents: isEditMode ? 'none' : 'auto',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {milestones[0].title}
        </p>
      </div>

      {/* Milestone 2 - Editable */}
      <div
        {...getEditableProps('milestone2')}
        style={{
          position: 'absolute',
          top: milestone2Pos.top,
          left: milestone2Pos.left,
          width: milestone2Pos.width,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spec.elements.milestoneStyle.container.gap,
          zIndex: milestone2Pos.zIndex ?? 2,
          transform: combineTransforms(undefined, milestone2Pos.rotation),
          ...((getEditableProps('milestone2') as any).style || {})
        }}
      >
        <div
          style={{
            backgroundColor: badgeColor,
            paddingLeft: spec.elements.milestoneStyle.badge.paddingX,
            paddingRight: spec.elements.milestoneStyle.badge.paddingX,
            paddingTop: spec.elements.milestoneStyle.badge.paddingY,
            paddingBottom: spec.elements.milestoneStyle.badge.paddingY,
            borderRadius: spec.elements.milestoneStyle.badge.borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            minHeight: '44px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.milestoneStyle.badge.fontSize,
              fontWeight: spec.elements.milestoneStyle.badge.fontWeight,
              lineHeight: spec.elements.milestoneStyle.badge.lineHeight,
              letterSpacing: `${spec.elements.milestoneStyle.badge.letterSpacing}px`,
              textTransform: spec.elements.milestoneStyle.badge.textTransform,
              color: spec.elements.milestoneStyle.badge.color,
              textAlign: spec.elements.milestoneStyle.badge.textAlign,
              margin: 0,
              padding: 0,
              whiteSpace: 'pre',
              display: 'block'
            }}
          >
            {milestones[1].time}
          </p>
        </div>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.milestoneStyle.description.fontSize,
            fontWeight: spec.elements.milestoneStyle.description.fontWeight,
            lineHeight: spec.elements.milestoneStyle.description.lineHeight,
            letterSpacing: `${spec.elements.milestoneStyle.description.letterSpacing}px`,
            color: descriptionColor,
            flex: 1,
            margin: 0,
            padding: 0,
            pointerEvents: isEditMode ? 'none' : 'auto',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {milestones[1].title}
        </p>
      </div>

      {/* Milestone 3 - Editable */}
      <div
        {...getEditableProps('milestone3')}
        style={{
          position: 'absolute',
          top: milestone3Pos.top,
          left: milestone3Pos.left,
          width: milestone3Pos.width,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spec.elements.milestoneStyle.container.gap,
          zIndex: milestone3Pos.zIndex ?? 2,
          transform: combineTransforms(undefined, milestone3Pos.rotation),
          ...((getEditableProps('milestone3') as any).style || {})
        }}
      >
        <div
          style={{
            backgroundColor: badgeColor,
            paddingLeft: spec.elements.milestoneStyle.badge.paddingX,
            paddingRight: spec.elements.milestoneStyle.badge.paddingX,
            paddingTop: spec.elements.milestoneStyle.badge.paddingY,
            paddingBottom: spec.elements.milestoneStyle.badge.paddingY,
            borderRadius: spec.elements.milestoneStyle.badge.borderRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            minHeight: '44px',
            pointerEvents: isEditMode ? 'none' : 'auto'
          }}
        >
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.milestoneStyle.badge.fontSize,
              fontWeight: spec.elements.milestoneStyle.badge.fontWeight,
              lineHeight: spec.elements.milestoneStyle.badge.lineHeight,
              letterSpacing: `${spec.elements.milestoneStyle.badge.letterSpacing}px`,
              textTransform: spec.elements.milestoneStyle.badge.textTransform,
              color: spec.elements.milestoneStyle.badge.color,
              textAlign: spec.elements.milestoneStyle.badge.textAlign,
              margin: 0,
              padding: 0,
              whiteSpace: 'pre',
              display: 'block'
            }}
          >
            {milestones[2].time}
          </p>
        </div>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.milestoneStyle.description.fontSize,
            fontWeight: spec.elements.milestoneStyle.description.fontWeight,
            lineHeight: spec.elements.milestoneStyle.description.lineHeight,
            letterSpacing: `${spec.elements.milestoneStyle.description.letterSpacing}px`,
            color: descriptionColor,
            flex: 1,
            margin: 0,
            padding: 0,
            pointerEvents: isEditMode ? 'none' : 'auto',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {milestones[2].title}
        </p>
      </div>

      {/* Product Image - Editable */}
      {sku.images.productAngle && (
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
            overflow: 'hidden',
            zIndex: productImagePos.zIndex ?? spec.elements.productImage.zIndex,
            transform: combineTransforms(undefined, productImagePos.rotation),
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

      {/* Custom Elements - User-created elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.timeline || []}
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

