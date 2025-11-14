// Design tokens extracted from Figma plugin
// These are the default values from the GetJoy brand

export const DEFAULT_COLORS = {
  bg: '#FFF7E9',
  bgAlt: '#F5F0E6',
  primary: '#00B140',
  primarySoft: '#C8F3D5',
  accent: '#FFCD3C',
  text: '#184020',
  textSecondary: '#36563C',
  badge: '#FFB020',
  check: '#00B140',
  cross: '#D44B3E'
}

export const DEFAULT_FONTS = {
  family: 'Inter',
  sizes: {
    h1: 72,
    h2: 48,
    body: 32,
    overline: 24,
    cta: 36
  },
  weights: {
    h1: 700,
    h2: 700,
    body: 400,
    overline: 600,
    cta: 700
  },
  lineHeights: {
    h1: 1.0,  // 100%
    h2: 1.1,  // 110%
    body: 1.4,  // 140%
    overline: 1.2,
    cta: 1.1
  },
  letterSpacing: {
    h1: -2,
    h2: -1,
    body: 0,
    overline: 1,
    cta: 0.5
  }
}

export const TEXT_STYLES = {
  h1: {
    fontSize: 72,
    fontWeight: 700,
    lineHeight: 1.0,
    letterSpacing: -2
  },
  h2: {
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: -1
  },
  body: {
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0
  },
  overline: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: 1,
    textTransform: 'uppercase' as const
  },
  cta: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const
  },
  disclaimer: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0
  }
}

