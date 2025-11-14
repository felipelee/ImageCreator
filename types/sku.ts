export interface SKU {
  id?: number
  brandId: number
  name: string
  colorOverrides?: {
    [layoutKey: string]: {
      [fieldKey: string]: string // e.g., { "headline": "primary" } means use primary color instead of default
    }
  }
  imageOverrides?: {
    [layoutKey: string]: {
      [fieldKey: string]: string // e.g., { "Background Image": "lifestyleA" } means use lifestyleA instead of default
    }
  }
  copy: {
    hero1?: {
      headline: string
      subhead: string
      offerBadge: string
    }
    compare?: {
      headline: string
      leftLabel: string
      rightLabel: string
      row1_label: string
      row2_label: string
      row3_label: string
      row4_label: string
      promoBadge: string
    }
    packHero?: {
      headline: string
      subhead: string
    }
    testimonial?: {
      quote: string
      name: string
      ratingLabel: string
      ctaStrip: string
    }
    benefits?: {
      headline: string
      bullet1: string
      bullet2: string
      bullet3: string
      bullet4: string
    }
    stat97?: {
      value: string
      headline: string
      ingredient1: string
      ingredient2: string
      ingredient3: string
      ingredient4: string
    }
    stats?: {
      headline: string
      stat1_value: string
      stat1_label: string
      stat2_value: string
      stat2_label: string
      stat3_value: string
      stat3_label: string
      disclaimer: string
    }
    badges?: {
      headline: string
      badge1: string
      badge2: string
      badge3: string
      badge4: string
      badge5: string
    }
    promo?: {
      headline: string
      stat1_value: string
      stat1_label: string
      stat2_value: string
      stat2_label: string
      stat3_value: string
      stat3_label: string
      badge: string
      badgeNote: string
    }
    bottle?: {
      headline: string
      benefit1: string
      benefit1_detail: string
      benefit2: string
      benefit2_detail: string
      benefit3: string
      benefit3_detail: string
      benefit4: string
      benefit4_detail: string
    }
    ingredients?: {
      headline: string
      ingredient1: string
      ingredient2: string
      ingredient3: string
      ingredient4: string
    }
    timeline?: {
      headline: string
      subhead: string
      milestone1_time: string
      milestone1_title: string
      milestone1_detail: string
      milestone2_time: string
      milestone2_title: string
      milestone2_detail: string
      milestone3_time: string
      milestone3_title: string
      milestone3_detail: string
    }
    usefor?: {
      headline: string
      item1: string
      item2: string
      item3: string
      item4: string
      badge: string
    }
    poweredby?: {
      headline: string
      subhead: string
      badge1: string
      badge2: string
      badge3: string
      badge4: string
      badge5: string
      badge6: string
    }
    price?: {
      headline: string
      oldPrice: string
      newPrice: string
      oldLabel: string
      newLabel: string
      benefit1: string
      benefit2: string
      benefit3: string
      benefit4: string
      benefit5: string
      benefit6: string
      disclaimer: string
    }
    lineup?: {
      headline: string
      stat: string
      statDetail: string
      cta: string
      disclaimer: string
    }
    hand?: {
      headline: string
      stat: string
      badge: string
      badgeDetail: string
      disclaimer: string
    }
    celebrity?: {
      quote: string
      mediaLogo: string
    }
    singleStat?: {
      stat: string
      headline: string
      subhead: string
      disclaimer: string
    }
    priceComparison?: {
      headline: string
      priceLeft: string
      labelLeft: string
      priceCenter: string
      labelCenter: string
      benefit1: string
      benefit2: string
      benefit3: string
      benefit4: string
      benefit5: string
      benefit6: string
      disclaimer: string
    }
    statement?: {
      statement: string
      benefit1: string
      benefit2: string
      benefit3: string
      cta: string
    }
    beforeAfter?: {
      headline: string
      beforeLabel: string
      beforeText: string
      afterLabel: string
      afterText: string
    }
    problemSolution?: {
      problemLabel: string
      problemText: string
      solutionLabel: string
      solutionText: string
    }
    featureGrid?: {
      headline: string
      feature1_icon: string
      feature1_title: string
      feature1_desc: string
      feature2_icon: string
      feature2_title: string
      feature2_desc: string
      feature3_icon: string
      feature3_title: string
      feature3_desc: string
      feature4_icon: string
      feature4_title: string
      feature4_desc: string
    }
    socialProof?: {
      headline: string
      review1_rating: string
      review1_quote: string
      review1_name: string
      review2_rating: string
      review2_quote: string
      review2_name: string
      review3_rating: string
      review3_quote: string
      review3_name: string
    }
    ingredientHero?: {
      ingredientName: string
      tagline: string
      benefit1: string
      benefit2: string
      benefit3: string
      productBadge: string
    }
  }
  images: {
    productPrimary?: string
    productAngle?: string
    productDetail?: string
    ingredientA?: string
    ingredientB?: string
    ingredientC?: string
    ingredientD?: string
    lifestyleA?: string
    lifestyleB?: string
    lifestyleC?: string
    lifestyleTimeline?: string
    lifestyleMultiStats?: string
    comparisonOurs?: string
    comparisonTheirs?: string
    testimonialPhoto?: string
    supplementsPile?: string
    productImage?: string
  }
  productInformation?: string // Product-specific information for AI content generation
  createdAt: Date
  updatedAt: Date
}

