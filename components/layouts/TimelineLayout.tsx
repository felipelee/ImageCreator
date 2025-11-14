import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { TIMELINE_SPEC } from '@/lib/layouts/specs/timeline-spec'
import { getFieldColorValue } from '@/lib/color-utils'

interface TimelineLayoutProps {
  brand: Brand
  sku: SKU
}

export function TimelineLayout({ brand, sku }: TimelineLayoutProps) {
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
          top: spec.elements.headline.top,
          left: spec.elements.headline.left,
          width: spec.elements.headline.width,
          height: spec.elements.headline.height,
          fontFamily: fonts.family,
          fontSize: spec.elements.headline.fontSize,
          fontWeight: spec.elements.headline.fontWeight,
          lineHeight: spec.elements.headline.lineHeight,
          letterSpacing: `${spec.elements.headline.letterSpacing}px`,
          color: headlineColor,
          textAlign: spec.elements.headline.textAlign,
          transform: spec.elements.headline.transform,
          zIndex: spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.timeline?.headline || 'Feel the change'}
      </p>

      {/* Timeline Container */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.timelineContainer.top,
          left: spec.elements.timelineContainer.left,
          width: spec.elements.timelineContainer.width,
          display: 'flex',
          flexDirection: 'column',
          gap: spec.elements.timelineContainer.gap,
          zIndex: spec.elements.timelineContainer.zIndex
        }}
      >
        {milestones.map((milestone, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: spec.elements.milestoneStyle.container.gap,
              width: '100%'
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
                flexShrink: 0
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
                  whiteSpace: 'pre'
                }}
              >
                {milestone.time}
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
                padding: 0
              }}
            >
              {milestone.title}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline Line (vertical line connecting milestones) */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.timelineLine.top,
          left: spec.elements.timelineLine.left,
          width: spec.elements.timelineLine.width,
          height: spec.elements.timelineLine.height,
          backgroundColor: spec.elements.timelineLine.backgroundColor,
          transform: spec.elements.timelineLine.transform,
          zIndex: spec.elements.timelineLine.zIndex
        }}
      />

      {/* Product Image */}
      {sku.images.productAngle && (
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
            overflow: 'hidden',
            zIndex: spec.elements.productImage.zIndex
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
              objectFit: 'contain'
            }}
          />
        </div>
      )}
    </div>
  )
}

