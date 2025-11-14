import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { BOTTLE_LIST_SPEC } from '@/lib/layouts/specs/bottle-list-spec'
import { getFieldColorValue } from '@/lib/color-utils'
import { Dumbbell, Battery, HeartPulse } from 'lucide-react'

interface BottleListLayoutProps {
  brand: Brand
  sku: SKU
}

// Icon component mappings
const BENEFIT_ICONS = {
  'dumbbell': Dumbbell,
  'battery-three-quarters': Battery,
  'heart-pulse': HeartPulse
}

export function BottleListLayout({ brand, sku }: BottleListLayoutProps) {
  if (!brand || !sku) return null
  
  const spec = BOTTLE_LIST_SPEC
  const colors = brand.colors || { bg: '#F9F7F2', accent: '#323429', textSecondary: '#6C6C6C' }
  const fonts = brand.fonts || { family: 'Inter' }
  
  const headlineColor = getFieldColorValue(brand, sku, 'bottle', 'Headline', 'accent')
  const titleColor = getFieldColorValue(brand, sku, 'bottle', 'Benefit 1', 'accent')
  const descriptionColor = getFieldColorValue(brand, sku, 'bottle', 'Benefit 1 Detail', 'textSecondary')
  const iconColor = getFieldColorValue(brand, sku, 'bottle', 'Benefit 1', 'accent')

  const benefits = [
    {
      icon: 'dumbbell',
      title: sku.copy.bottle?.benefit1 || 'Stronger muscles',
      description: sku.copy.bottle?.benefit1_detail || 'SUPPORTS MUSCLE PROTEIN SYNTHESIS AND LEAN MUSCLE REPAIR'
    },
    {
      icon: 'battery-three-quarters',
      title: sku.copy.bottle?.benefit2 || 'Faster recovery',
      description: sku.copy.bottle?.benefit2_detail || 'SUPPORTS MUSCLE STRENGTH RECOVERY BETWEEN WORKOUTS'
    },
    {
      icon: 'heart-pulse',
      title: sku.copy.bottle?.benefit3 || 'Healthy aging',
      description: sku.copy.bottle?.benefit3_detail || 'HELPS MAINTAIN NAD+ LEVELS TO SUPPORT LONG-TERM MUSCLE FUNCTION'
    }
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
          backgroundColor: colors.bg,
          zIndex: spec.elements.background.zIndex
        }}
      />

      {/* Product Image (Hand holding product) */}
      {sku.images.lifestyleA && (
        <div
          style={{
            position: 'absolute',
            top: spec.elements.productImage.top,
            left: spec.elements.productImage.left,
            width: spec.elements.productImage.width,
            height: spec.elements.productImage.height,
            transform: `rotate(${spec.elements.productImage.rotation}deg)`,
            transformOrigin: 'center',
            zIndex: spec.elements.productImage.zIndex,
            overflow: 'hidden'
          }}
        >
          <img
            src={sku.images.lifestyleA}
            alt="Product"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: '76% 50%'
            }}
          />
        </div>
      )}

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
          zIndex: spec.elements.headline.zIndex,
          margin: 0,
          padding: 0
        }}
      >
        {sku.copy.bottle?.headline || 'Stronger, Longer'}
      </p>

      {/* Benefits Container */}
      <div
        style={{
          position: 'absolute',
          top: spec.elements.benefitsContainer.top,
          left: spec.elements.benefitsContainer.left,
          display: 'flex',
          flexDirection: 'column',
          gap: spec.elements.benefitsContainer.gap,
          zIndex: spec.elements.benefitsContainer.zIndex
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: spec.elements.benefitStyle.container.gap
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: spec.elements.benefitStyle.icon.size,
                height: spec.elements.benefitStyle.icon.size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {(() => {
                const IconComponent = BENEFIT_ICONS[benefit.icon as keyof typeof BENEFIT_ICONS]
                if (!IconComponent) return null
                return (
                  <IconComponent
                    size={spec.elements.benefitStyle.icon.fontSize}
                    style={{
                      color: iconColor,
                      strokeWidth: 1.5
                    }}
                  />
                )
              })()}
            </div>

            {/* Text Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spec.elements.benefitStyle.description.gap
              }}
            >
              {/* Title */}
              <p
                style={{
                  fontFamily: fonts.family,
                  fontSize: spec.elements.benefitStyle.title.fontSize,
                  fontWeight: spec.elements.benefitStyle.title.fontWeight,
                  lineHeight: spec.elements.benefitStyle.title.lineHeight,
                  letterSpacing: `${spec.elements.benefitStyle.title.letterSpacing}px`,
                  color: titleColor,
                  width: spec.elements.benefitStyle.title.width,
                  height: spec.elements.benefitStyle.title.height,
                  margin: 0,
                  padding: 0
                }}
              >
                {benefit.title}
              </p>

              {/* Description */}
              <p
                style={{
                  fontFamily: fonts.family,
                  fontSize: spec.elements.benefitStyle.description.fontSize,
                  fontWeight: spec.elements.benefitStyle.description.fontWeight,
                  lineHeight: spec.elements.benefitStyle.description.lineHeight,
                  letterSpacing: `${spec.elements.benefitStyle.description.letterSpacing}px`,
                  textTransform: spec.elements.benefitStyle.description.textTransform,
                  color: descriptionColor,
                  width: spec.elements.benefitStyle.description.width,
                  margin: 0,
                  padding: 0
                }}
              >
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

