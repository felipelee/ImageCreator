export interface Brand {
  id?: number
  name: string
  colors: {
    bg: string
    bgAlt: string
    primary: string
    primarySoft: string
    accent: string
    text: string
    textSecondary: string
    badge: string
    check: string
    cross: string
  }
  fonts: {
    family: string
    sizes: {
      display: number
      h1: number
      h2: number
      body: number
      overline: number
      cta: number
      badge: number
    }
    weights: {
      display: number
      h1: number
      h2: number
      body: number
      overline: number
      cta: number
      badge: number
    }
    lineHeights: {
      display: number
      h1: number
      h2: number
      body: number
      overline: number
      cta: number
      badge: number
    }
    letterSpacing: {
      display: number
      h1: number
      h2: number
      body: number
      overline: number
      cta: number
      badge: number
    }
  }
  images: {
    logoHorizontal?: string
    logoSquare?: string
    backgroundHero?: string
    backgroundAlt?: string
    backgroundBenefits?: string
    backgroundStats?: string
    promoBadge?: string
    timelineLine?: string
  }
  knowledge?: {
    brandVoice?: string // Brand's way of talking, tone, style
    information?: string // General brand information, context, background
  }
  fluidDam?: {
    apiToken?: string // Brand-specific Fluid DAM API token
    baseUrl?: string // e.g., https://brandname.fluid.app
    subdomain?: string // e.g., brandname
  }
  createdAt: Date
  updatedAt: Date
}

export const DEFAULT_BRAND: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'New Brand',
  colors: {
    bg: '#F9F7F2',
    bgAlt: '#EAE0D6',
    primary: '#161716',
    primarySoft: '#DCE0D2',
    accent: '#323429',
    text: '#161716',
    textSecondary: '#6C6C6C',
    badge: '#EAD7F3',
    check: '#00B140',
    cross: '#D44B3E'
  },
  fonts: {
    family: 'Inter',
    sizes: {
      display: 300,
      h1: 72,
      h2: 48,
      body: 32,
      overline: 24,
      cta: 36,
      badge: 32
    },
    weights: {
      display: 700,
      h1: 700,
      h2: 700,
      body: 400,
      overline: 600,
      cta: 700,
      badge: 700
    },
    lineHeights: {
      display: 1.0,
      h1: 1.0,
      h2: 1.1,
      body: 1.4,
      overline: 1.2,
      cta: 1.1,
      badge: 1.4
    },
    letterSpacing: {
      display: -14,
      h1: -2,
      h2: -1,
      body: 0,
      overline: 1,
      cta: 0.5,
      badge: 0
    }
  },
  images: {}
}

