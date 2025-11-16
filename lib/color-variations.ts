import { Brand } from '@/types/brand'

export interface ColorVariation {
  name: string
  description: string
  colorMapping: Partial<Record<keyof Brand['colors'], keyof Brand['colors']>>
}

/**
 * Generate color variations for a layout by swapping different color keys
 * This creates different visual combinations using the same brand palette
 */
export function generateColorVariations(brand: Brand, layoutKey: string): ColorVariation[] {
  const colors = brand.colors
  const colorKeys = Object.keys(colors) as Array<keyof Brand['colors']>
  
  // Define variation strategies based on layout type
  const variations: ColorVariation[] = []
  
  if (layoutKey === 'compare') {
    variations.push(
      {
        name: 'Default',
        description: 'Original color scheme',
        colorMapping: {}
      },
      {
        name: 'High Contrast',
        description: 'Stronger contrast for readability',
        colorMapping: {
          bg: 'bg',
          bgAlt: 'bgAlt',
          primary: 'accent',
          accent: 'primary',
          text: 'text',
          textSecondary: 'textSecondary'
        }
      },
      {
        name: 'Soft & Muted',
        description: 'Softer, more subtle colors',
        colorMapping: {
          bg: 'bgAlt',
          bgAlt: 'bg',
          primary: 'primarySoft',
          accent: 'primarySoft',
          text: 'textSecondary',
          textSecondary: 'text'
        }
      },
      {
        name: 'Bold Accent',
        description: 'Accent color as primary',
        colorMapping: {
          primary: 'accent',
          accent: 'primary',
          bg: 'bg',
          bgAlt: 'bgAlt'
        }
      },
      {
        name: 'Dark Mode',
        description: 'Darker backgrounds, lighter text',
        colorMapping: {
          bg: 'primary',
          bgAlt: 'accent',
          text: 'bg',
          textSecondary: 'bgAlt',
          primary: 'bg',
          accent: 'bgAlt'
        }
      }
    )
  } else if (layoutKey === 'testimonial') {
    variations.push(
      {
        name: 'Default',
        description: 'Original color scheme',
        colorMapping: {}
      },
      {
        name: 'Warm Background',
        description: 'Warmer background tones',
        colorMapping: {
          bg: 'bgAlt',
          bgAlt: 'bg'
        }
      },
      {
        name: 'Bold Quote',
        description: 'Stronger quote panel',
        colorMapping: {
          bg: 'primary',
          text: 'bg',
          accent: 'bgAlt'
        }
      },
      {
        name: 'Soft & Elegant',
        description: 'Softer, more elegant',
        colorMapping: {
          bg: 'primarySoft',
          text: 'primary',
          accent: 'primarySoft'
        }
      },
      {
        name: 'High Contrast',
        description: 'Maximum readability',
        colorMapping: {
          bg: 'accent',
          text: 'bg',
          accent: 'primary'
        }
      }
    )
  } else if (layoutKey === 'benefits' || layoutKey === 'promoProduct') {
    variations.push(
      {
        name: 'Default',
        description: 'Original color scheme',
        colorMapping: {}
      },
      {
        name: 'Vibrant',
        description: 'More vibrant colors',
        colorMapping: {
          primary: 'accent',
          accent: 'primary',
          bgAlt: 'badge'
        }
      },
      {
        name: 'Subtle',
        description: 'More subtle, muted',
        colorMapping: {
          primary: 'primarySoft',
          accent: 'primarySoft',
          bgAlt: 'bg'
        }
      },
      {
        name: 'Bold Stats',
        description: 'Stronger stat colors',
        colorMapping: {
          accent: 'primary',
          primary: 'accent'
        }
      },
      {
        name: 'Light & Airy',
        description: 'Lighter overall feel',
        colorMapping: {
          bg: 'bgAlt',
          bgAlt: 'bg',
          primary: 'primarySoft',
          accent: 'primarySoft'
        }
      }
    )
  } else if (layoutKey === 'multiStats' || layoutKey === 'stats') {
    variations.push(
      {
        name: 'Default',
        description: 'Original color scheme',
        colorMapping: {}
      },
      {
        name: 'Dark Background',
        description: 'Dark bg, light text',
        colorMapping: {
          bg: 'primary',
          text: 'bg',
          textSecondary: 'bgAlt'
        }
      },
      {
        name: 'Accent Background',
        description: 'Accent color background',
        colorMapping: {
          bg: 'accent',
          text: 'bg',
          textSecondary: 'bgAlt'
        }
      },
      {
        name: 'Soft Background',
        description: 'Softer background',
        colorMapping: {
          bg: 'bgAlt',
          text: 'primary',
          textSecondary: 'textSecondary'
        }
      },
      {
        name: 'High Contrast',
        description: 'Maximum contrast',
        colorMapping: {
          bg: 'primary',
          text: 'bgAlt',
          textSecondary: 'bg'
        }
      }
    )
  } else if (layoutKey === 'timeline') {
    variations.push(
      {
        name: 'Default',
        description: 'Original color scheme',
        colorMapping: {}
      },
      {
        name: 'Warm Tones',
        description: 'Warmer color palette',
        colorMapping: {
          primarySoft: 'badge',
          accent: 'primary'
        }
      },
      {
        name: 'Cool Tones',
        description: 'Cooler color palette',
        colorMapping: {
          primarySoft: 'primary',
          accent: 'primarySoft'
        }
      },
      {
        name: 'Bold Badges',
        description: 'Stronger badge colors',
        colorMapping: {
          primarySoft: 'accent',
          accent: 'primary'
        }
      },
      {
        name: 'Subtle Badges',
        description: 'Softer badge colors',
        colorMapping: {
          primarySoft: 'bgAlt',
          accent: 'primarySoft'
        }
      }
    )
  } else {
    // Generic variations for other layouts
    variations.push(
      {
        name: 'Default',
        description: 'Original color scheme',
        colorMapping: {}
      },
      {
        name: 'Accent Primary',
        description: 'Swap primary and accent',
        colorMapping: {
          primary: 'accent',
          accent: 'primary'
        }
      },
      {
        name: 'Soft Colors',
        description: 'Use softer variants',
        colorMapping: {
          primary: 'primarySoft',
          accent: 'primarySoft',
          bg: 'bgAlt'
        }
      },
      {
        name: 'High Contrast',
        description: 'Stronger contrast',
        colorMapping: {
          text: 'primary',
          primary: 'accent',
          accent: 'primary'
        }
      },
      {
        name: 'Muted',
        description: 'More muted palette',
        colorMapping: {
          primary: 'primarySoft',
          accent: 'primarySoft',
          text: 'textSecondary',
          textSecondary: 'text'
        }
      }
    )
  }
  
  return variations
}

/**
 * Apply a color variation to a brand, returning a modified brand object
 */
export function applyColorVariation(brand: Brand, variation: ColorVariation): Brand {
  const modifiedColors = { ...brand.colors }
  
  // Apply the color mapping
  Object.entries(variation.colorMapping).forEach(([targetKey, sourceKey]) => {
    modifiedColors[targetKey as keyof Brand['colors']] = brand.colors[sourceKey]
  })
  
  return {
    ...brand,
    colors: modifiedColors
  }
}



