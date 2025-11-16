import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { MULTI_STATS_SPEC } from '@/lib/layouts/specs/multi-stats-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition } from '@/lib/layout-utils'

interface MultiStatsLayoutProps {
  brand: Brand
  sku: SKU
}

export function MultiStatsLayout({ brand, sku }: MultiStatsLayoutProps) {
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

  // Resolve positions with overrides
  const headlinePos = resolveElementPosition('multiStats', 'headline', spec.elements.headline, sku.positionOverrides)
  const disclaimerPos = resolveElementPosition('multiStats', 'disclaimer', {
    ...spec.elements.disclaimer,
    top: 1036,
    left: 657,
    x: 657,
    y: 1036,
    width: 395
  }, sku.positionOverrides)
  const stat1Pos = resolveElementPosition('multiStats', 'stat1', { 
    top: 285, 
    left: 657, 
    x: 657, 
    y: 285, 
    width: 393, 
    zIndex: 20 
  }, sku.positionOverrides)
  const stat2Pos = resolveElementPosition('multiStats', 'stat2', { 
    top: 549, 
    left: 652, 
    x: 652, 
    y: 549, 
    width: 351, 
    zIndex: 20 
  }, sku.positionOverrides)
  const stat3Pos = resolveElementPosition('multiStats', 'stat3', { 
    top: 796, 
    left: 650, 
    x: 650, 
    y: 796, 
    width: 420, 
    zIndex: 20 
  }, sku.positionOverrides)

  // Render a single stat with value and label
  const renderStat = (stat: typeof stats[0], pos: any) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          zIndex: pos.zIndex ?? 20,
          transform: pos.rotation ? `rotate(${pos.rotation}deg)` : undefined
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spec.elements.statStyle.label.marginTop
          }}
        >
          {/* Stat Value */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.statStyle.value.fontSize,
              fontWeight: spec.elements.statStyle.value.fontWeight,
              lineHeight: spec.elements.statStyle.value.lineHeight,
              letterSpacing: `${spec.elements.statStyle.value.letterSpacing}px`,
              color: statColor,
              margin: 0,
              padding: 0,
              whiteSpace: 'nowrap'
            }}
          >
            {stat.value}
          </p>

          {/* Stat Label */}
          <p
            style={{
              fontFamily: fonts.family,
              fontSize: spec.elements.statStyle.label.fontSize,
              fontWeight: spec.elements.statStyle.label.fontWeight,
              lineHeight: spec.elements.statStyle.label.lineHeight,
              letterSpacing: `${spec.elements.statStyle.label.letterSpacing}px`,
              textTransform: spec.elements.statStyle.label.textTransform,
              color: statColor,
              width: spec.elements.statStyle.label.width,
              margin: 0,
              padding: 0
            }}
          >
            {stat.label}
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
            top: spec.elements.background.top,
            left: spec.elements.background.left,
            width: spec.elements.background.width,
            height: spec.elements.background.height,
            objectFit: spec.elements.background.objectFit,
            zIndex: spec.elements.background.zIndex,
            display: 'block'
          }}
        />
      )}

      {/* Headline */}
      <p
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
          padding: 0
        }}
      >
        {sku.copy.stats?.headline || 'People who take Make Wellness peptides are:'}
      </p>

      {/* Individual Stats - Each with position overrides */}
      {renderStat(stats[0], stat1Pos)}
      {renderStat(stats[1], stat2Pos)}
      {renderStat(stats[2], stat3Pos)}

      {/* Disclaimer */}
      <p
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
          padding: 0
        }}
      >
        {sku.copy.stats?.disclaimer || '*Based on a 60-day study showing benefits from daily use.'}
      </p>
    </div>
  )
}

