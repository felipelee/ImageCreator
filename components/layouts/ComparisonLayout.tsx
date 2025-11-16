import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { COMPARISON_SPEC } from '@/lib/layouts/specs/comparison-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'
import { CustomElementRenderer } from '@/components/layout-editor/CustomElementRenderer'

interface ComparisonLayoutProps {
  brand: Brand
  sku: SKU
}

export function ComparisonLayout({ brand, sku }: ComparisonLayoutProps) {
  const spec = COMPARISON_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const bgColor = getFieldColorValue(brand, sku, 'compare', 'Background Color', 'bg')
  const headlineColor = getFieldColorValue(brand, sku, 'compare', 'Headline', 'text')
  const leftLabelColor = getFieldColorValue(brand, sku, 'compare', 'Left Label (Your Product)', 'bg')
  const rightLabelColor = getFieldColorValue(brand, sku, 'compare', 'Right Label (Their Product)', 'textSecondary')
  const rowTextColor = getFieldColorValue(brand, sku, 'compare', 'Row 1 Feature', 'text')

  // Comparison rows data
  const rows = [
    { label: sku.copy.compare?.row1_label || 'Feature 1' },
    { label: sku.copy.compare?.row2_label || 'Feature 2' },
    { label: sku.copy.compare?.row3_label || 'Feature 3' },
    { label: sku.copy.compare?.row4_label || 'Feature 4' }
  ]

  // Resolve positions with overrides
  const leftColumnPos = resolveElementPosition('compare', 'leftColumn', spec.elements.leftColumn, sku.positionOverrides)
  const rightColumnPos = resolveElementPosition('compare', 'rightColumn', spec.elements.rightColumn, sku.positionOverrides)
  const headlinePos = resolveElementPosition('compare', 'headline', spec.elements.headline, sku.positionOverrides)
  const leftImagePos = resolveElementPosition('compare', 'leftImage', spec.elements.leftImage, sku.positionOverrides)
  const rightImagePos = resolveElementPosition('compare', 'rightImage', spec.elements.rightImage, sku.positionOverrides)
  const leftLabelPos = resolveElementPosition('compare', 'leftLabel', spec.elements.leftLabel, sku.positionOverrides)
  const rightLabelPos = resolveElementPosition('compare', 'rightLabel', spec.elements.rightLabel, sku.positionOverrides)
  
  // Row positions
  const row1Pos = resolveElementPosition('compare', 'row1', spec.elements.row1, sku.positionOverrides)
  const row2Pos = resolveElementPosition('compare', 'row2', spec.elements.row2, sku.positionOverrides)
  const row3Pos = resolveElementPosition('compare', 'row3', spec.elements.row3, sku.positionOverrides)
  const row4Pos = resolveElementPosition('compare', 'row4', spec.elements.row4, sku.positionOverrides)

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

      {/* Headline */}
      <h1
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
          transform: headlinePos.rotation ? `rotate(${headlinePos.rotation}deg)` : undefined
        }}
      >
        {sku.copy.compare?.headline || 'COMPARE THE\nDIFFERENCE'}
      </h1>

      {/* Left Highlight Column */}
      <div
        style={{
          position: 'absolute',
          top: leftColumnPos.top,
          left: leftColumnPos.left,
          width: leftColumnPos.width ? `${leftColumnPos.width}px` : spec.elements.leftColumn.width,
          height: leftColumnPos.height ? `${leftColumnPos.height}px` : spec.elements.leftColumn.height,
          borderRadius: spec.elements.leftColumn.borderRadius,
          backgroundColor: colors.accent,
          zIndex: leftColumnPos.zIndex ?? spec.elements.leftColumn.zIndex,
          transform: leftColumnPos.rotation ? `rotate(${leftColumnPos.rotation}deg)` : undefined
        }}
      />

      {/* Right Highlight Column */}
      <div
        style={{
          position: 'absolute',
          top: rightColumnPos.top,
          left: rightColumnPos.left,
          width: rightColumnPos.width ? `${rightColumnPos.width}px` : spec.elements.rightColumn.width,
          height: rightColumnPos.height ? `${rightColumnPos.height}px` : spec.elements.rightColumn.height,
          borderRadius: spec.elements.rightColumn.borderRadius,
          backgroundColor: colors.bgAlt,
          zIndex: rightColumnPos.zIndex ?? spec.elements.rightColumn.zIndex,
          transform: rightColumnPos.rotation ? `rotate(${rightColumnPos.rotation}deg)` : undefined
        }}
      />

      {/* Left Comparison Image (Yours) */}
      {(sku.images.comparisonOurs || true) && (
        <div
          style={{
            position: 'absolute',
            top: leftImagePos.top,
            left: leftImagePos.left,
            width: leftImagePos.width,
            height: leftImagePos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: leftImagePos.zIndex ?? spec.elements.leftImage.zIndex,
            transform: leftImagePos.rotation ? `rotate(${leftImagePos.rotation}deg)` : undefined
          }}
        >
          <img
            src={sku.images.comparisonOurs || '/placeholder-image.svg'}
            alt="Your Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: sku.images.comparisonOurs ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Right Comparison Image (Theirs) */}
      {(sku.images.comparisonTheirs || true) && (
        <div
          style={{
            position: 'absolute',
            top: rightImagePos.top,
            left: rightImagePos.left,
            width: rightImagePos.width,
            height: rightImagePos.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: rightImagePos.zIndex ?? spec.elements.rightImage.zIndex,
            transform: rightImagePos.rotation ? `rotate(${rightImagePos.rotation}deg)` : undefined
          }}
        >
          <img
            src={sku.images.comparisonTheirs || '/placeholder-image.svg'}
            alt="Their Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: sku.images.comparisonTheirs ? 1 : 0.3
            }}
          />
        </div>
      )}

      {/* Left Label */}
      <p
        style={{
          position: 'absolute',
          top: leftLabelPos.top,
          left: leftLabelPos.left,
          width: leftLabelPos.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.leftLabel.fontSize,
          fontWeight: spec.elements.leftLabel.fontWeight,
          lineHeight: spec.elements.leftLabel.lineHeight,
          letterSpacing: `${spec.elements.leftLabel.letterSpacing}px`,
          color: leftLabelColor,
          textAlign: spec.elements.leftLabel.textAlign,
          transform: spec.elements.leftLabel.transform,
          zIndex: leftLabelPos.zIndex ?? spec.elements.leftLabel.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.compare?.leftLabel || 'Your Product'}
      </p>

      {/* Right Label */}
      <p
        style={{
          position: 'absolute',
          top: rightLabelPos.top,
          left: rightLabelPos.left,
          width: rightLabelPos.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.rightLabel.fontSize,
          fontWeight: spec.elements.rightLabel.fontWeight,
          lineHeight: spec.elements.rightLabel.lineHeight,
          letterSpacing: `${spec.elements.rightLabel.letterSpacing}px`,
          color: rightLabelColor,
          textAlign: spec.elements.rightLabel.textAlign,
          transform: spec.elements.rightLabel.transform,
          zIndex: rightLabelPos.zIndex ?? spec.elements.rightLabel.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.compare?.rightLabel || 'Standard Alternative'}
      </p>

      {/* Comparison Rows - Individual with position overrides */}
      {[
        { row: rows[0], pos: row1Pos, key: 'row1' },
        { row: rows[1], pos: row2Pos, key: 'row2' },
        { row: rows[2], pos: row3Pos, key: 'row3' },
        { row: rows[3], pos: row4Pos, key: 'row4' }
      ].map(({ row, pos, key }, index) => {
        if (!row) return null
        
        const rowHeight = 120
        const verticalPadding = 24
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              width: 949,
              height: `${rowHeight}px`,
              paddingTop: `${verticalPadding}px`,
              paddingBottom: `${verticalPadding}px`,
              display: 'flex',
              alignItems: 'center',
              borderBottom: index < 3 ? '1px solid #6c6c6c' : 'none',
              zIndex: pos.zIndex ?? 20,
              transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined
            }}
          >
            {/* Feature Label */}
            <div
              style={{
                width: spec.elements.row.label.width,
                paddingRight: '20px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <p
                style={{
                  fontSize: spec.elements.row.label.fontSize,
                  fontWeight: spec.elements.row.label.fontWeight,
                  lineHeight: spec.elements.row.label.lineHeight,
                  color: rowTextColor,
                  margin: 0,
                  padding: 0,
                  fontFamily: fonts.family,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {row.label}
              </p>
            </div>

            {/* Checkmark (Yours) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: spec.elements.row.checkmark.leftPosition - 75,
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5
              }}
            >
              <span
                style={{
                  fontSize: spec.elements.row.checkmark.fontSize,
                  color: colors.bgAlt,
                  fontWeight: 'bold',
                  lineHeight: 1,
                  display: 'block'
                }}
              >
                {spec.elements.row.checkmark.symbol}
              </span>
            </div>

            {/* Cross (Theirs) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: spec.elements.row.cross.leftPosition - 75,
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5
              }}
            >
              <span
                style={{
                  fontSize: spec.elements.row.cross.fontSize,
                  color: colors.accent,
                  fontWeight: 'bold',
                  lineHeight: 1,
                  display: 'block'
                }}
              >
                {spec.elements.row.cross.symbol}
              </span>
            </div>
          </div>
        )
      })}

      {/* Custom Elements */}
      <CustomElementRenderer
        customElements={sku.customElements?.compare || []}
        brand={brand}
        sku={sku}
        skuContentOverrides={sku.customElementContent || {}}
        isEditMode={false}
      />
    </div>
  )
}

