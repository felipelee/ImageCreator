import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { PROBLEM_SOLUTION_SPEC } from '@/lib/layouts/specs/problem-solution-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface ProblemSolutionLayoutProps {
  brand: Brand
  sku: SKU
}

export function ProblemSolutionLayout({ brand, sku }: ProblemSolutionLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = PROBLEM_SOLUTION_SPEC
  const colors = brand.colors
  const fonts = brand.fonts
  
  const problemBgColor = getFieldColorValue(brand, sku, 'problemSolution', 'Problem Panel', 'bgAlt')
  const problemTextColor = getFieldColorValue(brand, sku, 'problemSolution', 'Problem Text', 'text')
  const solutionBgColor = getFieldColorValue(brand, sku, 'problemSolution', 'Solution Panel', 'accent')

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
          backgroundColor: colors.bg,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Problem Container */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.problemContainer.top,
          left: spec.elements.problemContainer.left,
          width: spec.elements.problemContainer.width,
          height: spec.elements.problemContainer.height,
          backgroundColor: problemBgColor,
          borderRadius: spec.elements.problemContainer.borderRadius,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${spec.elements.problemContainer.padding}px`,
          zIndex: spec.elements.problemContainer.zIndex
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.problemLabel.fontSize,
            fontWeight: spec.elements.problemLabel.fontWeight,
            lineHeight: spec.elements.problemLabel.lineHeight,
            letterSpacing: `${spec.elements.problemLabel.letterSpacing}px`,
            color: colors.textSecondary,
            textAlign: spec.elements.problemLabel.textAlign,
            textTransform: spec.elements.problemLabel.textTransform,
            margin: 0,
            padding: 0,
            marginBottom: '16px'
          }}
        >
          {sku.copy.problemSolution?.problemLabel || 'THE PROBLEM'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.problemText.fontSize,
            fontWeight: spec.elements.problemText.fontWeight,
            lineHeight: spec.elements.problemText.lineHeight,
            letterSpacing: `${spec.elements.problemText.letterSpacing}px`,
            color: problemTextColor,
            textAlign: spec.elements.problemText.textAlign,
            margin: 0,
            padding: 0
          }}
        >
          {sku.copy.problemSolution?.problemText || 'You\'re tired of products that don\'t deliver'}
        </p>
      </div>

      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.arrow.top,
          left: spec.elements.arrow.left,
          fontSize: spec.elements.arrow.fontSize,
          color: solutionBgColor,
          zIndex: spec.elements.arrow.zIndex
        }}
      >
        ↓
      </div>

      {/* Product Image */}
      {sku.images.productPrimary && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.productImage.top,
            left: spec.elements.productImage.left,
            width: spec.elements.productImage.width,
            height: spec.elements.productImage.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: spec.elements.productImage.zIndex
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
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Solution Container */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.solutionContainer.top,
          left: spec.elements.solutionContainer.left,
          width: spec.elements.solutionContainer.width,
          height: spec.elements.solutionContainer.height,
          backgroundColor: solutionBgColor,
          borderRadius: spec.elements.solutionContainer.borderRadius,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${spec.elements.solutionContainer.padding}px`,
          zIndex: spec.elements.solutionContainer.zIndex
        }}
      >
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.solutionLabel.fontSize,
            fontWeight: spec.elements.solutionLabel.fontWeight,
            lineHeight: spec.elements.solutionLabel.lineHeight,
            letterSpacing: `${spec.elements.solutionLabel.letterSpacing}px`,
            color: spec.elements.solutionLabel.color,
            textAlign: spec.elements.solutionLabel.textAlign,
            textTransform: spec.elements.solutionLabel.textTransform,
            margin: 0,
            padding: 0,
            marginBottom: '16px'
          }}
        >
          {sku.copy.problemSolution?.solutionLabel || 'THE SOLUTION'}
        </p>
        <p
          style={{
            fontFamily: fonts.family,
            fontSize: spec.elements.solutionText.fontSize,
            fontWeight: spec.elements.solutionText.fontWeight,
            lineHeight: spec.elements.solutionText.lineHeight,
            letterSpacing: `${spec.elements.solutionText.letterSpacing}px`,
            color: spec.elements.solutionText.color,
            textAlign: spec.elements.solutionText.textAlign,
            margin: 0,
            padding: 0
          }}
        >
          {sku.copy.problemSolution?.solutionText || 'Real results from science-backed ingredients'}
        </p>
      </div>
    </div>
  )
}

