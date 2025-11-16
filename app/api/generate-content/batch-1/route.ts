import { NextRequest, NextResponse } from 'next/server'

interface GenerateContentRequest {
  brandKnowledge?: {
    brandVoice?: string
    information?: string
  }
  productInformation?: string
  skuName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateContentRequest = await request.json()
    const { brandKnowledge, productInformation, skuName } = body

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    console.log('Generating batch 1/3...')
    const content = await generateBatch(apiKey, brandKnowledge, productInformation, skuName)
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating batch 1:', error)
    return NextResponse.json(
      { error: `Failed to generate batch 1: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

async function generateBatch(
  apiKey: string,
  brandKnowledge?: any,
  productInformation?: string,
  skuName?: string
) {
  const prompt = buildPrompt(brandKnowledge, productInformation, skuName)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter for social media ads. Write in a conversational, friendly tone like you're talking to a friend - not corporate marketing speak. Be authentic, clear, and compelling. Return ONLY valid JSON, no markdown.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        response_format: { type: 'json_object' },
        max_tokens: 2500
      })
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI')
    }
    
    const content = JSON.parse(data.choices[0].message.content)
    return content
  } catch (fetchError: any) {
    clearTimeout(timeoutId)
    
    if (fetchError.name === 'AbortError') {
      throw new Error(`Batch 1 timed out. Try reducing Brand DNA/Product Information length.`)
    }
    throw fetchError
  }
}

function buildPrompt(
  brandKnowledge?: any,
  productInformation?: string,
  skuName?: string
): string {
  let prompt = `Generate ad copy for social media posts.

`

  if (brandKnowledge?.information) {
    prompt += `BRAND: ${brandKnowledge.information}\n\n`
  }

  if (brandKnowledge?.brandVoice) {
    prompt += `VOICE: ${brandKnowledge.brandVoice}\n\n`
  }

  if (productInformation) {
    prompt += `PRODUCT: ${productInformation}\n\n`
  }

  if (skuName) {
    prompt += `NAME: ${skuName}\n\n`
  }

  // Batch 1: 7 core layouts
  prompt += `Generate copy for these 7 layouts. Return valid JSON:

{
  "compare": {
    "headline": "comparison headline (3-6 words, uppercase)",
    "leftLabel": "your product (2-3 words)",
    "rightLabel": "competitor (2-3 words)",
    "row1_label": "advantage 1 (4-6 words)",
    "row2_label": "advantage 2 (4-6 words)",
    "row3_label": "advantage 3 (4-6 words)",
    "row4_label": "advantage 4 (4-6 words)"
  },
  "testimonial": {
    "quote": "customer quote (10-20 words, authentic)",
    "name": "customer name (e.g., 'Sarah M.')",
    "ratingLabel": "★★★★★",
    "ctaStrip": "CTA (5-10 words)"
  },
  "benefits": {
    "headline": "benefits headline (4-8 words)",
    "bullet1": "benefit with stat (6-10 words)",
    "bullet2": "benefit with stat (6-10 words)",
    "bullet3": "benefit with stat (6-10 words)",
    "bullet4": "benefit with stat (6-10 words)"
  },
  "stat97": {
    "value": "stat value (e.g., '97%', '100%')",
    "headline": "stat headline (6-10 words)",
    "ingredient1": "ingredient name",
    "ingredient2": "ingredient name",
    "ingredient3": "ingredient name",
    "ingredient4": "ingredient name"
  },
  "stats": {
    "headline": "stats intro based on product (6-12 words)",
    "stat1_value": "compelling stat from product info (e.g., '78%', '2X', '50%')",
    "stat1_label": "specific outcome for this product (uppercase, 6-10 words)",
    "stat2_value": "different stat from product info (e.g., '71%', '3X', '45%')",
    "stat2_label": "specific outcome for this product (uppercase, 6-10 words)",
    "stat3_value": "third stat from product info (e.g., '69%', '4X', '60%')",
    "stat3_label": "specific outcome for this product (uppercase, 6-10 words)",
    "disclaimer": "study context or timeframe (10-20 words)"
  },
  "promo": {
    "headline": "promo headline based on product (4-8 words)",
    "stat1_value": "compelling stat from product info (e.g., '47%', '2X', '50%')",
    "stat1_label": "specific benefit for this product (uppercase, 4-8 words)",
    "stat2_value": "different stat from product info (e.g., '4X', '3X', '100%')",
    "stat2_label": "specific benefit for this product (uppercase, 4-8 words)",
    "stat3_value": "third stat from product info (e.g., '144%', '5X', '75%')",
    "stat3_label": "specific benefit for this product (uppercase, 4-8 words)",
    "badge": "promotional offer or hook (4-8 words)",
    "badgeNote": "catchy hook (2-4 words)"
  },
  "bottle": {
    "headline": "product headline (2-4 words)",
    "benefit1_icon": "icon matching benefit (choose from: 'dumbbell', 'battery', 'heart-pulse', 'zap', 'brain', 'shield', 'leaf', 'target', 'activity', 'sparkles', 'star', 'award')",
    "benefit1": "benefit title (2-3 words)",
    "benefit1_detail": "benefit detail for this product (uppercase, 8-12 words)",
    "benefit2_icon": "different icon matching benefit (choose from: 'dumbbell', 'battery', 'heart-pulse', 'zap', 'brain', 'shield', 'leaf', 'target', 'activity', 'sparkles', 'star', 'award')",
    "benefit2": "benefit title (2-3 words)",
    "benefit2_detail": "benefit detail for this product (uppercase, 8-12 words)",
    "benefit3_icon": "third icon matching benefit (choose from: 'dumbbell', 'battery', 'heart-pulse', 'zap', 'brain', 'shield', 'leaf', 'target', 'activity', 'sparkles', 'star', 'award')",
    "benefit3": "benefit title (2-3 words)",
    "benefit3_detail": "benefit detail for this product (uppercase, 8-12 words)"
  }
}

Write conversational, authentic copy. Be specific and benefit-focused. Keep it simple and clear.`

  return prompt
}

