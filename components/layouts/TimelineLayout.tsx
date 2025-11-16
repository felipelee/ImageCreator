import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TIMELINE_SPEC } from '@/lib/layouts/specs/timeline-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { resolveElementPosition, combineTransforms } from '@/lib/layout-utils'

interface TimelineLayoutProps {
  brand: Brand
  sku: SKU
}

export function TimelineLayout({ brand, sku }: TimelineLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = TIMELINE_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', primarySoft: '#DCE0D2' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  // Determine background mode (image or color)
  const backgroundMode = sku.backgroundMode?.timeline || 
    (sku.images.lifestyleTimeline ? 'image' : 'color')
  
  // Get background color (will be used in color mode)
  const backgroundColor = getFieldColorValue(brand, sku, 'timeline', 'Background Color', 'bg')
  
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
    height: 80,
    zIndex: 40
  }, sku.positionOverrides)
  
  const milestone2Pos = resolveElementPosition('timeline', 'milestone2', {
    top: 560,
    left: 487,
    x: 487,
    y: 560,
    width: 518,
    height: 80,
    zIndex: 50
  }, sku.positionOverrides)
  
  const milestone3Pos = resolveElementPosition('timeline', 'milestone3', {
    top: 850,
    left: 487,
    x: 487,
    y: 850,
    width: 518,
    height: 80,
    zIndex: 60
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
      {/* Background - Image or Color */}
      {backgroundMode === 'image' && sku.images.lifestyleTimeline ? (
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
      ) : (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.background.top,
            left: spec.elements.background.left,
            width: spec.elements.background.width,
            height: spec.elements.background.height,
            backgroundColor: backgroundColor,
            zIndex: spec.elements.background.zIndex
          }}
        />
      )}

      {/* Dark Overlay */}
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

      {/* Headline */}
      <p
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
          transform: combineTransforms(spec.elements.headline.transform, headlinePos.rotation),
          zIndex: headlinePos.zIndex ?? spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.timeline?.headline || 'Feel the change'}
      </p>

      {/* Milestone 1 */}
      <div
        style={{
          position: 'absolute',
          top: milestone1Pos.top,
          left: milestone1Pos.left,
          width: milestone1Pos.width,
          height: milestone1Pos.height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spec.elements.milestoneStyle.container.gap,
          zIndex: milestone1Pos.zIndex ?? 40,
          transform: milestone1Pos.rotation ? `rotate(${milestone1Pos.rotation}deg)` : undefined
        }}
      >
        {/* Time Badge */}
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
            minHeight: '44px'
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

        {/* Description */}
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
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {milestones[0].title}
        </p>
      </div>

      {/* Milestone 2 */}
      <div
        style={{
          position: 'absolute',
          top: milestone2Pos.top,
          left: milestone2Pos.left,
          width: milestone2Pos.width,
          height: milestone2Pos.height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spec.elements.milestoneStyle.container.gap,
          zIndex: milestone2Pos.zIndex ?? 50,
          transform: milestone2Pos.rotation ? `rotate(${milestone2Pos.rotation}deg)` : undefined
        }}
      >
        {/* Time Badge */}
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
            minHeight: '44px'
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

        {/* Description */}
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
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {milestones[1].title}
        </p>
      </div>

      {/* Milestone 3 */}
      <div
        style={{
          position: 'absolute',
          top: milestone3Pos.top,
          left: milestone3Pos.left,
          width: milestone3Pos.width,
          height: milestone3Pos.height,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: spec.elements.milestoneStyle.container.gap,
          zIndex: milestone3Pos.zIndex ?? 60,
          transform: milestone3Pos.rotation ? `rotate(${milestone3Pos.rotation}deg)` : undefined
        }}
      >
        {/* Time Badge */}
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
            minHeight: '44px'
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

        {/* Description */}
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
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {milestones[2].title}
        </p>
      </div>

      {/* Timeline Line (vertical line connecting milestones) */}
      <div
        style={{
          position: 'absolute',
          top: timelineLinePos.top,
          left: timelineLinePos.left,
          width: timelineLinePos.width,
          height: timelineLinePos.height,
          backgroundColor: spec.elements.timelineLine.backgroundColor,
          transform: combineTransforms(spec.elements.timelineLine.transform, timelineLinePos.rotation),
          zIndex: timelineLinePos.zIndex ?? spec.elements.timelineLine.zIndex
        }}
      />

      {/* Product Image */}
      {(sku.images.productAngle || true) && (
        <div
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
            transform: combineTransforms(undefined, productImagePos.rotation)
          }}
        >
          <img
            src={sku.images.productAngle || '/placeholder-image.svg'}
            alt="Product"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: sku.images.productAngle ? 1 : 0.3
            }}
          />
        </div>
      )}
    </div>
  )
}

