'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { STUDY_CITATION_SPEC } from '@/lib/layouts/specs/study-citation-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface StudyCitationLayoutEditableProps {
  brand: Brand
  sku: SKU
  isEditMode?: boolean
  selectedElement?: string | null
  onSelectElement?: (elementKey: string) => void
  onPositionChange?: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
}

export function StudyCitationLayoutEditable({ 
  brand, 
  sku,
  isEditMode = false,
  selectedElement = null,
  onSelectElement = () => {},
  onPositionChange = () => {},
  onSizeChange = () => {},
  onRotationChange = () => {}
}: StudyCitationLayoutEditableProps) {
  if (!brand || !sku) return null
  
  const spec = STUDY_CITATION_SPEC
  const colors = brand.colors || { bgAlt: '#8B7F8B' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const bgColor = getFieldColorValue(brand, sku, 'studyCitation', 'Background Color', 'bgAlt')
  const textColor = '#FFFFFF'

  // Resolve positions with overrides
  const studyContextPos = resolveElementPosition('studyCitation', 'studyContext', {
    top: 120,
    left: 84,
    x: 84,
    y: 120,
    width: 912,
    height: 60,
    zIndex: 20
  }, sku.positionOverrides)
  
  const mainFindingPos = resolveElementPosition('studyCitation', 'mainFinding', {
    top: 200,
    left: 84,
    x: 84,
    y: 200,
    width: 912,
    height: 450,
    zIndex: 20
  }, sku.positionOverrides)
  
  const supplementNamePos = resolveElementPosition('studyCitation', 'supplementName', {
    top: 680,
    left: 84,
    x: 84,
    y: 680,
    width: 500,
    height: 60,
    zIndex: 20
  }, sku.positionOverrides)
  
  const sourceCitationPos = resolveElementPosition('studyCitation', 'sourceCitation', {
    top: 980,
    left: 84,
    x: 84,
    y: 980,
    width: 400,
    height: 60,
    zIndex: 20
  }, sku.positionOverrides)
  
  const ingredientImagePos = resolveElementPosition('studyCitation', 'ingredientImage', {
    top: 680,
    left: 620,
    x: 620,
    y: 680,
    width: 376,
    height: 376,
    zIndex: 15
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
      onClick={() => isEditMode && onSelectElement?.(null)}
    >
      {/* Background Color */}
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

      {/* Study Context - Editable */}
      <p
        {...getEditableProps('studyContext')}
        style={{
          position: 'absolute',
          top: studyContextPos.top,
          left: studyContextPos.left,
          width: studyContextPos.width,
          height: studyContextPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.studyContext.fontSize,
          fontWeight: spec.elements.studyContext.fontWeight,
          lineHeight: spec.elements.studyContext.lineHeight,
          letterSpacing: `${spec.elements.studyContext.letterSpacing}px`,
          color: textColor,
          textAlign: spec.elements.studyContext.textAlign,
          zIndex: studyContextPos.zIndex ?? spec.elements.studyContext.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, studyContextPos.rotation),
          ...((getEditableProps('studyContext') as any).style || {})
        }}
      >
        {sku.copy.studyCitation?.context || 'In a double-blind, randomized trial,'}
      </p>

      {/* Main Finding - Editable */}
      <h1
        {...getEditableProps('mainFinding')}
        style={{
          position: 'absolute',
          top: mainFindingPos.top,
          left: mainFindingPos.left,
          width: mainFindingPos.width,
          height: mainFindingPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.mainFinding.fontSize,
          fontWeight: spec.elements.mainFinding.fontWeight,
          lineHeight: spec.elements.mainFinding.lineHeight,
          letterSpacing: `${spec.elements.mainFinding.letterSpacing}px`,
          color: textColor,
          textAlign: spec.elements.mainFinding.textAlign,
          zIndex: mainFindingPos.zIndex ?? spec.elements.mainFinding.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, mainFindingPos.rotation),
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          ...((getEditableProps('mainFinding') as any).style || {})
        }}
      >
        {sku.copy.studyCitation?.finding || 'Participants saw a 17% reduction in TSH and a significant increase in both T3 and T4 levels'}
      </h1>

      {/* Supplement Name - Editable */}
      <p
        {...getEditableProps('supplementName')}
        style={{
          position: 'absolute',
          top: supplementNamePos.top,
          left: supplementNamePos.left,
          width: supplementNamePos.width,
          height: supplementNamePos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.supplementName.fontSize,
          fontWeight: spec.elements.supplementName.fontWeight,
          lineHeight: spec.elements.supplementName.lineHeight,
          letterSpacing: `${spec.elements.supplementName.letterSpacing}px`,
          color: textColor,
          textAlign: spec.elements.supplementName.textAlign,
          zIndex: supplementNamePos.zIndex ?? spec.elements.supplementName.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, supplementNamePos.rotation),
          ...((getEditableProps('supplementName') as any).style || {})
        }}
      >
        {sku.copy.studyCitation?.supplementName || 'with Ashwagandha supplementation'}
      </p>

      {/* Source Citation - Editable */}
      <p
        {...getEditableProps('sourceCitation')}
        style={{
          position: 'absolute',
          top: sourceCitationPos.top,
          left: sourceCitationPos.left,
          width: sourceCitationPos.width,
          height: sourceCitationPos.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.sourceCitation.fontSize,
          fontWeight: spec.elements.sourceCitation.fontWeight,
          lineHeight: spec.elements.sourceCitation.lineHeight,
          letterSpacing: `${spec.elements.sourceCitation.letterSpacing}px`,
          color: textColor,
          textAlign: spec.elements.sourceCitation.textAlign,
          zIndex: sourceCitationPos.zIndex ?? spec.elements.sourceCitation.zIndex,
          margin: 0,
          padding: 0,
          transform: combineTransforms(undefined, sourceCitationPos.rotation),
          whiteSpace: 'pre-line',
          ...((getEditableProps('sourceCitation') as any).style || {})
        }}
      >
        {sku.copy.studyCitation?.source || 'Source:\nPubMed PMID: 28829155'}
      </p>

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: ingredientImagePos.zIndex ?? spec.elements.ingredientImage.zIndex,
            transform: combineTransforms(undefined, ingredientImagePos.rotation),
            ...((getEditableProps('ingredientImage') as any).style || {})
          }}
        >
          <img
            src={sku.images.ingredientA || '/placeholder-image.svg'}
            alt="Ingredient"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: sku.images.ingredientA ? 1 : 0.3,
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.studyCitation || []}
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

