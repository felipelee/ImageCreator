import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { STUDY_CITATION_SPEC } from '@/lib/layouts/specs/study-citation-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface StudyCitationLayoutProps {
  brand: Brand
  sku: SKU
}

export function StudyCitationLayout({ brand, sku }: StudyCitationLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = STUDY_CITATION_SPEC
  const colors = brand.colors || { bgAlt: '#8B7F8B' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const bgColor = getFieldColorValue(brand, sku, 'studyCitation', 'Background Color', 'bgAlt')
  const textColor = '#FFFFFF' // Always white for readability

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

      {/* Study Context (top) */}
      <p
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
          transform: combineTransforms(undefined, studyContextPos.rotation)
        }}
      >
        {sku.copy.studyCitation?.context || 'In a double-blind, randomized trial,'}
      </p>

      {/* Main Finding (large text) */}
      <h1
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
          overflowWrap: 'break-word'
        }}
      >
        {sku.copy.studyCitation?.finding || 'Participants saw a 17% reduction in TSH and a significant increase in both T3 and T4 levels'}
      </h1>

      {/* Supplement Name (with) */}
      <p
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
          transform: combineTransforms(undefined, supplementNamePos.rotation)
        }}
      >
        {sku.copy.studyCitation?.supplementName || 'with Ashwagandha supplementation'}
      </p>

      {/* Source Citation */}
      <p
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
          transform: combineTransforms(undefined, sourceCitationPos.rotation)
        }}
      >
        {sku.copy.studyCitation?.source || 'Source:\nPubMed PMID: 28829155'}
      </p>

      {/* Ingredient Image */}
      {(sku.images.ingredientA || true) && (
        <div
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
            transform: combineTransforms(undefined, ingredientImagePos.rotation)
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
              opacity: sku.images.ingredientA ? 1 : 0.3
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
        isEditMode={false}
      />
    </div>
  )
}

