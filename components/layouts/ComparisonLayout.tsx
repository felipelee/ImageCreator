import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { COMPARISON_SPEC } from '@/lib/layouts/specs/comparison-spec'
import { getFieldColorValue } from '@/lib/color-utils'

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
          top: spec.elements.headline.top,
          left: spec.elements.headline.left,
          width: spec.elements.headline.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.headline.fontSize,
          fontWeight: spec.elements.headline.fontWeight,
          lineHeight: spec.elements.headline.lineHeight,
          letterSpacing: `${spec.elements.headline.letterSpacing}px`,
          color: headlineColor,
          textAlign: spec.elements.headline.textAlign,
          zIndex: spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.compare?.headline || 'COMPARE THE\nDIFFERENCE'}
      </h1>

      {/* Left Highlight Column */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.highlightLeft.top,
          left: spec.elements.highlightLeft.left,
          width: spec.elements.highlightLeft.width,
          height: spec.elements.highlightLeft.height,
          borderRadius: spec.elements.highlightLeft.borderRadius,
          backgroundColor: colors.accent,
          zIndex: spec.elements.highlightLeft.zIndex
        }}
      />

      {/* Right Highlight Column */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.highlightRight.top,
          left: spec.elements.highlightRight.left,
          width: spec.elements.highlightRight.width,
          height: spec.elements.highlightRight.height,
          borderRadius: spec.elements.highlightRight.borderRadius,
          backgroundColor: colors.bgAlt,
          zIndex: spec.elements.highlightRight.zIndex
        }}
      />

      {/* Left Comparison Image (Yours) */}
      {sku.images.comparisonOurs && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.comparisonYours.top,
            left: spec.elements.comparisonYours.left,
            width: spec.elements.comparisonYours.width,
            height: spec.elements.comparisonYours.height,
            borderRadius: spec.elements.comparisonYours.borderRadius,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: spec.elements.comparisonYours.zIndex
          }}
        >
          <img
            src={sku.images.comparisonOurs}
            alt="Your Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Right Comparison Image (Theirs) */}
      {sku.images.comparisonTheirs && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.comparisonTheirs.top,
            left: spec.elements.comparisonTheirs.left,
            width: spec.elements.comparisonTheirs.width,
            height: spec.elements.comparisonTheirs.height,
            borderRadius: spec.elements.comparisonTheirs.borderRadius,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: spec.elements.comparisonTheirs.zIndex
          }}
        >
          <img
            src={sku.images.comparisonTheirs}
            alt="Their Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Left Label */}
      <p
        style={{
          position: 'absolute',
          top: spec.elements.leftLabel.top,
          left: spec.elements.leftLabel.left,
          width: spec.elements.leftLabel.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.leftLabel.fontSize,
          fontWeight: spec.elements.leftLabel.fontWeight,
          lineHeight: spec.elements.leftLabel.lineHeight,
          letterSpacing: `${spec.elements.leftLabel.letterSpacing}px`,
          color: leftLabelColor,
          textAlign: spec.elements.leftLabel.textAlign,
          transform: spec.elements.leftLabel.transform,
          zIndex: spec.elements.leftLabel.zIndex,
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
          top: spec.elements.rightLabel.top,
          left: spec.elements.rightLabel.left,
          width: spec.elements.rightLabel.width,
          fontFamily: fonts.family,
          fontSize: spec.elements.rightLabel.fontSize,
          fontWeight: spec.elements.rightLabel.fontWeight,
          lineHeight: spec.elements.rightLabel.lineHeight,
          letterSpacing: `${spec.elements.rightLabel.letterSpacing}px`,
          color: rightLabelColor,
          textAlign: spec.elements.rightLabel.textAlign,
          transform: spec.elements.rightLabel.transform,
          zIndex: spec.elements.rightLabel.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.compare?.rightLabel || 'Standard Alternative'}
      </p>

      {/* Comparison Rows */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.rowsContainer.top,
          left: spec.elements.rowsContainer.left,
          width: spec.elements.rowsContainer.width,
          zIndex: spec.elements.rowsContainer.zIndex
        }}
      >
        {rows.map((row, index) => {
          // Calculate row height based on text content
          const labelText = row.label || ''
          const estimatedLines = Math.ceil(labelText.length / 40) // Rough estimate: ~40 chars per line
          const minRowHeight = Math.max(60, estimatedLines * 44) // Minimum 60px, or based on text lines
          
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                marginTop: index > 0 ? `${spec.elements.row.gap}px` : 0,
                paddingBottom: index < rows.length - 1 ? `${spec.elements.row.gap}px` : 0,
                borderBottom: index < rows.length - 1 ? '1px solid rgba(108, 108, 108, 0.3)' : 'none',
                minHeight: `${minRowHeight}px`,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Feature Label */}
              <p
                style={{
                  position: 'relative',
                  width: spec.elements.row.label.width,
                  fontSize: spec.elements.row.label.fontSize,
                  fontWeight: spec.elements.row.label.fontWeight,
                  lineHeight: spec.elements.row.label.lineHeight,
                  color: rowTextColor,
                  margin: 0,
                  padding: 0,
                  paddingRight: '20px',
                  fontFamily: fonts.family,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                  maxHeight: '120px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {row.label}
              </p>

              {/* Checkmark Container (Yours) - Centered in left highlight column */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: spec.elements.row.checkmark.leftPosition - spec.elements.rowsContainer.left,
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

              {/* Cross Container (Theirs) - Centered in right highlight column */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: spec.elements.row.cross.leftPosition - spec.elements.rowsContainer.left,
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
      </div>
    </div>
  )
}

