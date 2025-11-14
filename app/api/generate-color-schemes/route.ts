import { NextRequest, NextResponse } from 'next/server'

interface GenerateColorSchemesRequest {
  brandKnowledge?: {
    brandVoice?: string
    information?: string
  }
  brandName?: string
  currentColors?: {
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
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateColorSchemesRequest = await request.json()
    const { brandKnowledge, brandName, currentColors } = body

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Build the prompt for color scheme generation
    const prompt = buildColorPrompt(brandKnowledge, brandName, currentColors)

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert color designer specializing in brand color palettes. Generate harmonious, professional color schemes that match brand personality and industry standards. Always return valid JSON only, no markdown formatting.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: `OpenAI API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const generatedSchemes = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({ schemes: generatedSchemes.schemes })
  } catch (error) {
    console.error('Error generating color schemes:', error)
    return NextResponse.json(
      { error: 'Failed to generate color schemes. Please try again.' },
      { status: 500 }
    )
  }
}

function buildColorPrompt(
  brandKnowledge?: { brandVoice?: string; information?: string },
  brandName?: string,
  currentColors?: GenerateColorSchemesRequest['currentColors']
): string {
  let prompt = `Generate 5 different color scheme options for a brand. Each scheme should be cohesive, professional, and appropriate for the brand's industry and personality.

`

  if (brandName) {
    prompt += `BRAND NAME: ${brandName}\n\n`
  }

  if (brandKnowledge?.information) {
    prompt += `BRAND CONTEXT:\n${brandKnowledge.information}\n\n`
  }

  if (brandKnowledge?.brandVoice) {
    prompt += `BRAND VOICE:\n${brandKnowledge.brandVoice}\n\n`
  }

  if (currentColors) {
    prompt += `CURRENT COLOR SCHEME (for reference, but generate NEW schemes):\n${JSON.stringify(currentColors, null, 2)}\n\n`
  }

  prompt += `Generate 5 different color scheme options. Each scheme must include all 10 color variables. Return ONLY valid JSON matching this exact structure:

{
  "schemes": [
    {
      "name": "Scheme 1 name (e.g., 'Modern Minimal', 'Bold Energy', 'Natural Earth')",
      "description": "Brief description of the scheme's personality (10-15 words)",
      "colors": {
        "bg": "#hex color - main background (light, neutral)",
        "bgAlt": "#hex color - alternate background (slightly different shade)",
        "primary": "#hex color - primary brand color (main brand identity)",
        "primarySoft": "#hex color - softer version of primary (lighter/muted)",
        "accent": "#hex color - accent color (complementary, for highlights)",
        "text": "#hex color - primary text color (dark, high contrast)",
        "textSecondary": "#hex color - secondary text (lighter gray)",
        "badge": "#hex color - badge/pill background (light, pastel)",
        "check": "#hex color - success/checkmark color (green)",
        "cross": "#hex color - error/cross color (red)"
      }
    },
    {
      "name": "Scheme 2 name",
      "description": "Brief description",
      "colors": {
        "bg": "#hex",
        "bgAlt": "#hex",
        "primary": "#hex",
        "primarySoft": "#hex",
        "accent": "#hex",
        "text": "#hex",
        "textSecondary": "#hex",
        "badge": "#hex",
        "check": "#hex",
        "cross": "#hex"
      }
    },
    {
      "name": "Scheme 3 name",
      "description": "Brief description",
      "colors": {
        "bg": "#hex",
        "bgAlt": "#hex",
        "primary": "#hex",
        "primarySoft": "#hex",
        "accent": "#hex",
        "text": "#hex",
        "textSecondary": "#hex",
        "badge": "#hex",
        "check": "#hex",
        "cross": "#hex"
      }
    },
    {
      "name": "Scheme 4 name",
      "description": "Brief description",
      "colors": {
        "bg": "#hex",
        "bgAlt": "#hex",
        "primary": "#hex",
        "primarySoft": "#hex",
        "accent": "#hex",
        "text": "#hex",
        "textSecondary": "#hex",
        "badge": "#hex",
        "check": "#hex",
        "cross": "#hex"
      }
    },
    {
      "name": "Scheme 5 name",
      "description": "Brief description",
      "colors": {
        "bg": "#hex",
        "bgAlt": "#hex",
        "primary": "#hex",
        "primarySoft": "#hex",
        "accent": "#hex",
        "text": "#hex",
        "textSecondary": "#hex",
        "badge": "#hex",
        "check": "#hex",
        "cross": "#hex"
      }
    }
  ]
}

COLOR GUIDELINES:
- bg: Light, neutral background (usually #F5F5F5 to #FFFFFF range, or warm off-whites)
- bgAlt: Slightly different shade from bg (can be warmer/cooler, but still light)
- primary: Main brand color - should reflect brand personality (can be bold, muted, professional, etc.)
- primarySoft: Lighter/more muted version of primary (usually 20-40% lighter or desaturated)
- accent: Complementary color that works with primary (for highlights, CTAs, important elements)
- text: Dark color for primary text (usually #000000 to #333333, or dark version of primary)
- textSecondary: Medium gray for secondary text (usually #666666 to #999999)
- badge: Light, pastel color for badges/pills (should contrast well with text)
- check: Green for success/positive (usually #00B140, #10B981, or similar)
- cross: Red for errors/negative (usually #D44B3E, #EF4444, or similar)

IMPORTANT:
- All colors must be valid hex codes (e.g., #F9F7F2, #161716)
- Ensure good contrast ratios for accessibility (text on bg should be readable)
- Colors should be harmonious - use color theory (complementary, analogous, triadic schemes)
- Match the brand's personality and industry
- Each scheme should be distinctly different from the others
- Return ONLY the JSON object, no markdown, no code blocks, no explanations`

  return prompt
}


