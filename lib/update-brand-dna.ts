// Utility to update existing Brand 1 with correct DNA from Figma
import { db } from '@/lib/db'

export async function updateBrand1DNA() {
  try {
    const brand1 = await db.brands.get(1)
    
    if (!brand1) {
      console.log('Brand 1 not found')
      return
    }

    // Update with exact Figma values
    await db.brands.update(1, {
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
          display: 300, // Giant stat text
          h1: 72,      // H1 MD
          h2: 48,      // H2
          body: 32,    // Body
          overline: 24, // Overline
          cta: 36,     // CTA
          badge: 32    // Badge
        },
        weights: {
          display: 700, // Bold
          h1: 700,     // Bold
          h2: 700,     // Bold
          body: 400,   // Regular
          overline: 600, // Semi Bold
          cta: 700,    // Bold
          badge: 700   // Bold
        },
        lineHeights: {
          display: 1.0, // 100%
          h1: 1.0,     // 100%
          h2: 1.1,     // 110%
          body: 1.4,   // 140%
          overline: 1.2, // Auto
          cta: 1.1,    // Auto
          badge: 1.4   // 140%
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
      updatedAt: new Date()
    })

    console.log('✓ Brand 1 DNA updated successfully!')
    return true
  } catch (error) {
    console.error('Failed to update Brand 1:', error)
    return false
  }
}

