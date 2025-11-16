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

    console.log('Generating batch 3/3...')
    const content = await generateBatch(apiKey, brandKnowledge, productInformation, skuName)
    
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating batch 3:', error)
    return NextResponse.json(
      { error: `Failed to generate batch 3: ${error instanceof Error ? error.message : 'Unknown error'}` },
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
      throw new Error(`Batch 3 timed out. Try reducing Brand DNA/Product Information length.`)
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

  // Batch 3: 7 new layouts
  prompt += `Generate copy for these 7 layouts. Return valid JSON:

{
  "hero": {
    "headline": "headline (3-6 words, uppercase)",
    "subhead": "subheadline (8-15 words)",
    "offerBadge": "badge text (3-5 words)"
  },
  "ingredientBenefits": {
    "headline": "ingredient name (uppercase, 1-3 words)",
    "subheadline": "what it does (8-15 words)",
    "benefit1": "benefit (2-3 words)",
    "benefit2": "benefit (2-3 words)",
    "benefit3": "benefit (2-3 words)",
    "benefit4": "benefit (2-3 words)",
    "benefit5": "benefit (2-3 words)"
  },
  "packHero": {
    "headline": "headline (3-6 words, uppercase)",
    "subhead": "subheadline (8-15 words)"
  },
  "priceComparison": {
    "headline": "headline (3-5 words)",
    "priceLeft": "price (e.g., '$49')",
    "labelLeft": "label (2-3 words)",
    "priceCenter": "price (e.g., '$35')",
    "labelCenter": "label (2-3 words)",
    "benefit1": "benefit (3-6 words)",
    "benefit2": "benefit (3-6 words)",
    "benefit3": "benefit (3-6 words)",
    "benefit4": "benefit (3-6 words)",
    "benefit5": "benefit (3-6 words)",
    "benefit6": "benefit (3-6 words)",
    "disclaimer": "disclaimer (10-20 words)"
  },
  "statsWithProduct": {
    "headline": "headline (uppercase, 4-8 words)",
    "stat1_value": "stat value (e.g., '78%', '2X')",
    "stat1_label": "stat label (6-10 words)",
    "stat2_value": "stat value (e.g., '71%', '3X')",
    "stat2_label": "stat label (6-10 words)",
    "stat3_value": "stat value (e.g., '69%', '4X')",
    "stat3_label": "stat label (6-10 words)"
  },
  "studyCitation": {
    "context": "study context (6-10 words)",
    "finding": "main finding (10-20 words)",
    "supplementName": "supplement name (2-4 words)",
    "source": "source citation (e.g., 'Source: Journal Name, Year')"
  },
  "testimonialDetail": {
    "rating": "★★★★★",
    "quoteHeadline": "quote headline (5-10 words)",
    "reviewText": "detailed review (20-40 words)",
    "customerName": "customer name (e.g., 'Sarah M.')"
  }
}

Write conversational, authentic copy. Be specific and benefit-focused. Keep it simple and clear.`

  return prompt
}

