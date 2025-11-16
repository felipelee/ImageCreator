import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Helper to get color value (simplified version of getFieldColorValue)
function getColor(brand: any, sku: any, layoutKey: string, fieldName: string, fallback: string) {
  const colorOverrides = sku.colorOverrides?.[layoutKey]
  if (colorOverrides?.[fieldName]) {
    return colorOverrides[fieldName]
  }
  return brand.colors[fallback] || fallback
}

export async function POST(request: NextRequest) {
  try {
    const { brand, sku, layoutType } = await request.json()

    if (!brand || !sku || !layoutType) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Route to the appropriate layout renderer
    let layoutJSX: JSX.Element

    switch (layoutType) {
      case 'statement':
        layoutJSX = renderStatementLayout(brand, sku)
        break
      case 'testimonial':
        layoutJSX = renderTestimonialLayout(brand, sku)
        break
      case 'comparison':
        layoutJSX = renderComparisonLayout(brand, sku)
        break
      case 'benefits':
        layoutJSX = renderBenefitsLayout(brand, sku)
        break
      case 'bigStat':
        layoutJSX = renderBigStatLayout(brand, sku)
        break
      case 'multiStats':
        layoutJSX = renderMultiStatsLayout(brand, sku)
        break
      case 'promoProduct':
        layoutJSX = renderPromoProductLayout(brand, sku)
        break
      case 'bottleList':
        layoutJSX = renderBottleListLayout(brand, sku)
        break
      case 'timeline':
        layoutJSX = renderTimelineLayout(brand, sku)
        break
      case 'priceComparison':
        layoutJSX = renderPriceComparisonLayout(brand, sku)
        break
      case 'problemSolution':
        layoutJSX = renderProblemSolutionLayout(brand, sku)
        break
      case 'featureGrid':
        layoutJSX = renderFeatureGridLayout(brand, sku)
        break
      case 'socialProof':
        layoutJSX = renderSocialProofLayout(brand, sku)
        break
      case 'ingredientHero':
        layoutJSX = renderIngredientHeroLayout(brand, sku)
        break
      default:
        return new Response(`Unknown layout type: ${layoutType}`, { status: 400 })
    }

    return new ImageResponse(layoutJSX, {
      width: 1080,
      height: 1080,
    })
  } catch (error: any) {
    console.error('Error rendering ad:', error)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}

// ============================================================================
// LAYOUT RENDERERS
// ============================================================================

// Statement Layout
function renderStatementLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const statementColor = getColor(brand, sku, 'statement', 'Statement', 'accent')
  const ctaColor = getColor(brand, sku, 'statement', 'CTA Strip', 'accent')
  const benefitBgColor = getColor(brand, sku, 'statement', 'Benefit Pills', 'primarySoft')
  const benefitTextColor = getColor(brand, sku, 'statement', 'Benefit Pills', 'primary')

  const benefits = [
    sku.copy.statement?.benefit1 || 'Science-backed',
    sku.copy.statement?.benefit2 || 'No artificial ingredients',
    sku.copy.statement?.benefit3 || 'Results you can feel'
  ].filter(Boolean)

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          width: '960px',
          fontSize: '84px',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-2px',
          color: statementColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.statement?.statement || 'Ready to feel the difference?'}
      </div>

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '380px',
            left: '290px',
            width: '500px',
            height: '400px',
            objectFit: 'contain',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '820px',
          left: '80px',
          width: '920px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              backgroundColor: benefitBgColor,
              paddingLeft: '28px',
              paddingRight: '28px',
              paddingTop: '14px',
              paddingBottom: '14px',
              borderRadius: '28px',
              display: 'flex',
              fontSize: '22px',
              fontWeight: 600,
              color: benefitTextColor,
            }}
          >
            {benefit}
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '920px',
          left: '0px',
          width: '1080px',
          height: '160px',
          backgroundColor: ctaColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#FFFFFF',
            display: 'flex',
          }}
        >
          {sku.copy.statement?.cta || 'SHOP NOW • SAVE 25%'}
        </div>
      </div>
    </div>
  )
}

// Testimonial Layout
function renderTestimonialLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const quotePanelColor = getColor(brand, sku, 'testimonial', 'Quote Panel Color', 'bg')
  const quoteColor = getColor(brand, sku, 'testimonial', 'Quote', 'text')
  const ratingColor = getColor(brand, sku, 'testimonial', 'Rating', 'accent')

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      {sku.images.testimonialPhoto && (
        <img
          src={sku.images.testimonialPhoto}
          alt="Testimonial"
          style={{
            position: 'absolute',
            width: '1080px',
            height: '1080px',
            objectFit: 'cover',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          right: '60px',
          backgroundColor: quotePanelColor,
          opacity: 0.95,
          borderRadius: '24px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            color: ratingColor,
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          {sku.copy.testimonial?.ratingLabel || '★★★★★'}
        </div>

        <div
          style={{
            fontSize: '28px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: quoteColor,
            textAlign: 'center',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          "{sku.copy.testimonial?.quote || 'This product has completely changed my life!'}"
        </div>

        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: quoteColor,
            display: 'flex',
          }}
        >
          {sku.copy.testimonial?.attribution || '— Sarah M.'}
        </div>
      </div>
    </div>
  )
}

// Comparison Layout
function renderComparisonLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'compare', 'Headline', 'text')

  const rows = [
    sku.copy.compare?.row1_label || 'Feature 1',
    sku.copy.compare?.row2_label || 'Feature 2',
    sku.copy.compare?.row3_label || 'Feature 3',
    sku.copy.compare?.row4_label || 'Feature 4'
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          fontSize: '72px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: headlineColor,
          display: 'flex',
          whiteSpace: 'pre-wrap',
        }}
      >
        {sku.copy.compare?.headline || 'COMPARE THE\nDIFFERENCE'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '300px',
          left: '60px',
          width: '460px',
          height: '640px',
          backgroundColor: colors.accent,
          borderRadius: '24px',
          display: 'flex',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '300px',
          left: '560px',
          width: '460px',
          height: '640px',
          backgroundColor: colors.bgAlt,
          borderRadius: '24px',
          display: 'flex',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '340px',
          left: '60px',
          width: '960px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{ width: '460px', fontSize: '24px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            {sku.copy.compare?.leftLabel || 'Your Product'}
          </div>
          <div style={{ width: '460px', fontSize: '24px', fontWeight: 700, color: colors.textSecondary, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            {sku.copy.compare?.rightLabel || 'Their Product'}
          </div>
        </div>

        {rows.map((row, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '30px',
            }}
          >
            <div style={{ width: '460px', fontSize: '20px', color: '#FFFFFF', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              ✓
            </div>
            <div style={{ width: '460px', fontSize: '20px', color: colors.text, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {row}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Benefits Layout
function renderBenefitsLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'benefits', 'Headline', 'primary')
  const bulletBgColor = getColor(brand, sku, 'benefits', 'Benefit 1 (Top Left)', 'primary')

  const benefits = [
    sku.copy.benefits?.bullet1 || '54% better overall performance*',
    sku.copy.benefits?.bullet2 || '47% less muscle fatigue*',
    sku.copy.benefits?.bullet3 || '4X more muscle protein synthesis*',
    sku.copy.benefits?.bullet4 || '144% stronger strength recovery*'
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      {brand.images.backgroundBenefits && (
        <img
          src={brand.images.backgroundBenefits}
          alt="Background"
          style={{
            position: 'absolute',
            width: '1080px',
            height: '1080px',
            objectFit: 'cover',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          width: '960px',
          fontSize: '64px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.benefits?.headline || 'Train Harder, Bounce Back Faster'}
      </div>

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '340px',
            left: '340px',
            width: '400px',
            height: '400px',
            objectFit: 'contain',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '760px',
          left: '60px',
          width: '960px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              backgroundColor: bulletBgColor,
              padding: '16px 24px',
              borderRadius: '40px',
              fontSize: '18px',
              fontWeight: 600,
              color: '#FFFFFF',
              display: 'flex',
              minHeight: '50px',
              alignItems: 'center',
            }}
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  )
}

// BigStat Layout
function renderBigStatLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const statColor = getColor(brand, sku, 'bigStat', 'Stat Value', 'accent')
  const headlineColor = getColor(brand, sku, 'bigStat', 'Headline', 'accent')
  const labelColor = getColor(brand, sku, 'bigStat', 'Ingredient 1 (Top Left)', 'accent')

  const ingredientLabels = [
    sku.copy.stat97?.ingredient1 || 'Ingredient 1',
    sku.copy.stat97?.ingredient2 || 'Ingredient 2',
    sku.copy.stat97?.ingredient3 || 'Ingredient 3',
    sku.copy.stat97?.ingredient4 || 'Ingredient 4'
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bgAlt,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      {brand.images.backgroundAlt && (
        <img
          src={brand.images.backgroundAlt}
          alt="Background"
          style={{
            position: 'absolute',
            width: '1080px',
            height: '1080px',
            objectFit: 'cover',
            opacity: 0.15,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '180px',
          left: '60px',
          width: '960px',
          fontSize: '280px',
          fontWeight: 900,
          color: statColor,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {sku.copy.stat97?.value || '100%'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '520px',
          left: '60px',
          width: '960px',
          fontSize: '42px',
          fontWeight: 700,
          lineHeight: 1.2,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.stat97?.headline || 'Naturally sourced ingredients'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '740px',
          left: '100px',
          width: '880px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        {ingredientLabels.map((label, index) => (
          <div
            key={index}
            style={{
              backgroundColor: labelColor,
              padding: '12px 24px',
              borderRadius: '28px',
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
              display: 'flex',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

// MultiStats Layout
function renderMultiStatsLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'multiStats', 'Headline', 'primary')

  const stats = [
    { value: sku.copy.multiStats?.stat1_value || '54%', label: sku.copy.multiStats?.stat1_label || 'Better Performance' },
    { value: sku.copy.multiStats?.stat2_value || '47%', label: sku.copy.multiStats?.stat2_label || 'Less Fatigue' },
    { value: sku.copy.multiStats?.stat3_value || '4X', label: sku.copy.multiStats?.stat3_label || 'Protein Synthesis' }
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      {brand.images.backgroundStats && (
        <img
          src={brand.images.backgroundStats}
          alt="Background"
          style={{
            position: 'absolute',
            width: '1080px',
            height: '1080px',
            objectFit: 'cover',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          width: '960px',
          fontSize: '64px',
          fontWeight: 700,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.multiStats?.headline || 'The Numbers Don\'t Lie'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '300px',
          left: '60px',
          width: '960px',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '120px', fontWeight: 900, color: colors.accent, display: 'flex' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 600, color: colors.text, display: 'flex' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// PromoProduct Layout
function renderPromoProductLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'promoProduct', 'Headline', 'primary')
  const promoColor = getColor(brand, sku, 'promoProduct', 'Promo Text', 'accent')

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          width: '960px',
          fontSize: '72px',
          fontWeight: 700,
          lineHeight: 1.1,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.promoProduct?.headline || 'Limited Time Offer'}
      </div>

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '300px',
            left: '290px',
            width: '500px',
            height: '500px',
            objectFit: 'contain',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '850px',
          left: '60px',
          width: '960px',
          fontSize: '64px',
          fontWeight: 900,
          color: promoColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.promoProduct?.promoText || 'SAVE 25%'}
      </div>
    </div>
  )
}

// BottleList Layout
function renderBottleListLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'bottle', 'Headline', 'accent')
  const titleColor = getColor(brand, sku, 'bottle', 'Benefit 1', 'accent')
  const descriptionColor = getColor(brand, sku, 'bottle', 'Benefit 1 Detail', 'textSecondary')

  const benefits = [
    {
      icon: '💪',
      title: sku.copy.bottle?.benefit1 || 'Stronger muscles',
      description: sku.copy.bottle?.benefit1_detail || 'SUPPORTS MUSCLE PROTEIN SYNTHESIS'
    },
    {
      icon: '⚡',
      title: sku.copy.bottle?.benefit2 || 'Faster recovery',
      description: sku.copy.bottle?.benefit2_detail || 'SUPPORTS MUSCLE STRENGTH RECOVERY'
    },
    {
      icon: '❤️',
      title: sku.copy.bottle?.benefit3 || 'Healthy aging',
      description: sku.copy.bottle?.benefit3_detail || 'HELPS MAINTAIN NAD+ LEVELS'
    }
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '80px',
          width: '440px',
          fontSize: '80px',
          fontWeight: 700,
          lineHeight: 1,
          color: headlineColor,
          display: 'flex',
        }}
      >
        {sku.copy.bottle?.headline || 'Stronger, Longer'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '380px',
          left: '80px',
          width: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
            }}
          >
            <div style={{ fontSize: '48px', display: 'flex' }}>{benefit.icon}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: titleColor, display: 'flex' }}>
                {benefit.title}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: descriptionColor, display: 'flex' }}>
                {benefit.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sku.images.lifestyleA && (
        <img
          src={sku.images.lifestyleA}
          alt="Product"
          style={{
            position: 'absolute',
            top: '200px',
            right: '0px',
            width: '600px',
            height: '880px',
            objectFit: 'cover',
            objectPosition: '76% 50%',
          }}
        />
      )}
    </div>
  )
}

// Timeline Layout
function renderTimelineLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts

  const milestones = [
    {
      time: sku.copy.timeline?.milestone1_time || '7 Days',
      title: sku.copy.timeline?.milestone1_title || 'More stable energy'
    },
    {
      time: sku.copy.timeline?.milestone2_time || '14 Days',
      title: sku.copy.timeline?.milestone2_title || 'Better recovery'
    },
    {
      time: sku.copy.timeline?.milestone3_time || '30 Days',
      title: sku.copy.timeline?.milestone3_title || 'Peak performance'
    }
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      {sku.images.lifestyleTimeline && (
        <img
          src={sku.images.lifestyleTimeline}
          alt="Background"
          style={{
            position: 'absolute',
            width: '1080px',
            height: '1080px',
            objectFit: 'cover',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          width: '1080px',
          height: '1080px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          width: '960px',
          fontSize: '72px',
          fontWeight: 700,
          color: '#FFFFFF',
          display: 'flex',
        }}
      >
        {sku.copy.timeline?.headline || 'Feel the change'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '300px',
          left: '80px',
          width: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {milestones.map((milestone, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: colors.primarySoft,
                padding: '12px 24px',
                borderRadius: '28px',
                fontSize: '20px',
                fontWeight: 700,
                color: colors.primary,
                display: 'flex',
              }}
            >
              {milestone.time}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#FFFFFF', display: 'flex' }}>
              {milestone.title}
            </div>
          </div>
        ))}
      </div>

      {sku.images.productAngle && (
        <img
          src={sku.images.productAngle}
          alt="Product"
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            width: '300px',
            height: '400px',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  )
}

// PriceComparison Layout
function renderPriceComparisonLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'priceComparison', 'Headline', 'primary')

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '60px',
          width: '960px',
          fontSize: '64px',
          fontWeight: 700,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.priceComparison?.headline || 'Better Value'}
      </div>

      {sku.images.supplementsPile && (
        <img
          src={sku.images.supplementsPile}
          alt="Supplements"
          style={{
            position: 'absolute',
            top: '240px',
            left: '60px',
            width: '420px',
            height: '340px',
            objectFit: 'contain',
          }}
        />
      )}

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '240px',
            right: '60px',
            width: '420px',
            height: '340px',
            objectFit: 'contain',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '60px',
          width: '420px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '56px', fontWeight: 900, color: colors.textSecondary, display: 'flex' }}>
          {sku.copy.priceComparison?.leftPrice || '$150'}
        </div>
        <div style={{ fontSize: '24px', color: colors.text, display: 'flex' }}>
          {sku.copy.priceComparison?.leftLabel || 'Multiple Supplements'}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          right: '60px',
          width: '420px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '56px', fontWeight: 900, color: colors.accent, display: 'flex' }}>
          {sku.copy.priceComparison?.rightPrice || '$89'}
        </div>
        <div style={{ fontSize: '24px', color: colors.text, display: 'flex' }}>
          {sku.copy.priceComparison?.rightLabel || 'All-in-One'}
        </div>
      </div>
    </div>
  )
}

// ProblemSolution Layout
function renderProblemSolutionLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const problemBgColor = getColor(brand, sku, 'problemSolution', 'Problem Panel', 'bgAlt')
  const problemTextColor = getColor(brand, sku, 'problemSolution', 'Problem Text', 'text')
  const solutionBgColor = getColor(brand, sku, 'problemSolution', 'Solution Panel', 'accent')

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          width: '960px',
          height: '360px',
          backgroundColor: problemBgColor,
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 700, color: colors.textSecondary, marginBottom: '20px', display: 'flex' }}>
          {sku.copy.problemSolution?.problemLabel || 'THE PROBLEM'}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 600, color: problemTextColor, textAlign: 'center', display: 'flex' }}>
          {sku.copy.problemSolution?.problemText || 'Products that don\'t deliver'}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '480px',
          left: '490px',
          fontSize: '64px',
          color: solutionBgColor,
          display: 'flex',
        }}
      >
        ↓
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          width: '960px',
          height: '360px',
          backgroundColor: solutionBgColor,
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px', display: 'flex' }}>
          {sku.copy.problemSolution?.solutionLabel || 'THE SOLUTION'}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 600, color: '#FFFFFF', textAlign: 'center', display: 'flex' }}>
          {sku.copy.problemSolution?.solutionText || 'Real results from science-backed ingredients'}
        </div>
      </div>

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '440px',
            left: '340px',
            width: '400px',
            height: '300px',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  )
}

// FeatureGrid Layout
function renderFeatureGridLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'featureGrid', 'Headline', 'accent')
  const cardBgColor = getColor(brand, sku, 'featureGrid', 'Card Background', 'bgAlt')
  const titleColor = getColor(brand, sku, 'featureGrid', 'Feature Title', 'accent')
  const textColor = getColor(brand, sku, 'featureGrid', 'Feature Text', 'text')

  const features = [
    {
      icon: sku.copy.featureGrid?.feature1_icon || '⚡',
      title: sku.copy.featureGrid?.feature1_title || 'Fast Acting',
      description: sku.copy.featureGrid?.feature1_desc || 'Feel the difference in minutes'
    },
    {
      icon: sku.copy.featureGrid?.feature2_icon || '🔬',
      title: sku.copy.featureGrid?.feature2_title || 'Science-Backed',
      description: sku.copy.featureGrid?.feature2_desc || 'Clinically proven ingredients'
    },
    {
      icon: sku.copy.featureGrid?.feature3_icon || '🌱',
      title: sku.copy.featureGrid?.feature3_title || 'All Natural',
      description: sku.copy.featureGrid?.feature3_desc || 'No artificial ingredients'
    },
    {
      icon: sku.copy.featureGrid?.feature4_icon || '✓',
      title: sku.copy.featureGrid?.feature4_title || 'Easy to Use',
      description: sku.copy.featureGrid?.feature4_desc || 'Simple daily routine'
    }
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          width: '960px',
          fontSize: '64px',
          fontWeight: 700,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.featureGrid?.headline || 'Why You\'ll Love It'}
      </div>

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '200px',
            left: '340px',
            width: '400px',
            height: '300px',
            objectFit: 'contain',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          width: '960px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              width: '460px',
              height: '180px',
              backgroundColor: cardBgColor,
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px', display: 'flex' }}>
              {feature.icon}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: titleColor, marginBottom: '8px', display: 'flex' }}>
              {feature.title}
            </div>
            <div style={{ fontSize: '20px', color: textColor, display: 'flex' }}>
              {feature.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// SocialProof Layout
function renderSocialProofLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'socialProof', 'Headline', 'accent')
  const cardBgColor = getColor(brand, sku, 'socialProof', 'Review Cards', 'bgAlt')
  const starsColor = getColor(brand, sku, 'socialProof', 'Stars', 'accent')
  const quoteColor = getColor(brand, sku, 'socialProof', 'Quote Text', 'text')
  const nameColor = getColor(brand, sku, 'socialProof', 'Name', 'textSecondary')

  const reviews = [
    {
      stars: sku.copy.socialProof?.review1_rating || '★★★★★',
      quote: sku.copy.socialProof?.review1_quote || 'Game changer! I feel amazing.',
      name: sku.copy.socialProof?.review1_name || '- Jessica M.'
    },
    {
      stars: sku.copy.socialProof?.review2_rating || '★★★★★',
      quote: sku.copy.socialProof?.review2_quote || 'Best purchase I\'ve made all year.',
      name: sku.copy.socialProof?.review2_name || '- David L.'
    },
    {
      stars: sku.copy.socialProof?.review3_rating || '★★★★★',
      quote: sku.copy.socialProof?.review3_quote || 'Actually works. No gimmicks.',
      name: sku.copy.socialProof?.review3_name || '- Sarah K.'
    }
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          width: '960px',
          fontSize: '64px',
          fontWeight: 700,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.socialProof?.headline || 'Real People. Real Results.'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '220px',
          left: '60px',
          width: '640px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            style={{
              backgroundColor: cardBgColor,
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '24px', color: starsColor, marginBottom: '12px', display: 'flex' }}>
              {review.stars}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 500, color: quoteColor, marginBottom: '12px', display: 'flex' }}>
              "{review.quote}"
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: nameColor, display: 'flex' }}>
              {review.name}
            </div>
          </div>
        ))}
      </div>

      {sku.images.productPrimary && (
        <img
          src={sku.images.productPrimary}
          alt="Product"
          style={{
            position: 'absolute',
            top: '280px',
            right: '60px',
            width: '300px',
            height: '500px',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  )
}

// IngredientHero Layout
function renderIngredientHeroLayout(brand: any, sku: any) {
  const colors = brand.colors
  const fonts = brand.fonts
  
  const headlineColor = getColor(brand, sku, 'ingredientHero', 'Headline', 'accent')
  const ingredientNameColor = getColor(brand, sku, 'ingredientHero', 'Ingredient Name', 'primary')
  const descriptionColor = getColor(brand, sku, 'ingredientHero', 'Description', 'text')
  const benefitBgColor = getColor(brand, sku, 'ingredientHero', 'Benefit Pills', 'primarySoft')
  const benefitTextColor = getColor(brand, sku, 'ingredientHero', 'Benefit Pills', 'primary')

  const benefits = [
    sku.copy.ingredientHero?.benefit1 || 'Clinically proven',
    sku.copy.ingredientHero?.benefit2 || 'Pure & potent',
    sku.copy.ingredientHero?.benefit3 || 'Fast-absorbing'
  ].filter(Boolean)

  return (
    <div
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        backgroundColor: colors.bg,
        fontFamily: fonts.family,
        display: 'flex',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          width: '960px',
          fontSize: '48px',
          fontWeight: 700,
          color: headlineColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.ingredientHero?.headline || 'KEY INGREDIENT'}
      </div>

      {sku.images.ingredientA && (
        <img
          src={sku.images.ingredientA}
          alt="Ingredient"
          style={{
            position: 'absolute',
            top: '200px',
            left: '240px',
            width: '600px',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '24px',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: '660px',
          left: '60px',
          width: '960px',
          fontSize: '56px',
          fontWeight: 700,
          color: ingredientNameColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.ingredientHero?.ingredientName || 'Premium Ingredient'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '760px',
          left: '60px',
          width: '960px',
          fontSize: '24px',
          color: descriptionColor,
          textAlign: 'center',
          display: 'flex',
        }}
      >
        {sku.copy.ingredientHero?.description || 'Scientifically formulated for maximum effectiveness'}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '880px',
          left: '60px',
          width: '960px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            style={{
              backgroundColor: benefitBgColor,
              padding: '12px 28px',
              borderRadius: '28px',
              fontSize: '20px',
              fontWeight: 600,
              color: benefitTextColor,
              display: 'flex',
            }}
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  )
}
