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

    // Split into 2 smaller batches to avoid timeout
    console.log('Generating batch 1/2...')
    const batch1 = await generateBatch(apiKey, brandKnowledge, productInformation, skuName, 1)
    
    console.log('Generating batch 2/2...')
    const batch2 = await generateBatch(apiKey, brandKnowledge, productInformation, skuName, 2)
    
    // Merge results
    const mergedContent = { ...batch1, ...batch2 }
    
    return NextResponse.json({ content: mergedContent })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

async function generateBatch(
  apiKey: string,
  brandKnowledge?: any,
  productInformation?: string,
  skuName?: string,
  batch: number = 1
) {
  const prompt = buildBatchPrompt(brandKnowledge, productInformation, skuName, batch)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout per batch
  
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
      throw new Error(`Batch ${batch} timed out. Try reducing Brand DNA/Product Information length.`)
    }
    throw fetchError
  }
}

function buildBatchPrompt(
  brandKnowledge?: any,
  productInformation?: string,
  skuName?: string,
  batch: number = 1
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

  if (batch === 1) {
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
    "headline": "stats intro (6-12 words)",
    "stat1_value": "stat (e.g., '78%')",
    "stat1_label": "outcome (uppercase, 6-10 words)",
    "stat2_value": "stat (e.g., '71%')",
    "stat2_label": "outcome (uppercase, 6-10 words)",
    "stat3_value": "stat (e.g., '69%')",
    "stat3_label": "outcome (uppercase, 6-10 words)",
    "disclaimer": "study context (10-20 words)"
  },
  "promo": {
    "headline": "promo headline (4-8 words)",
    "stat1_value": "stat (e.g., '47%')",
    "stat1_label": "benefit (uppercase, 4-8 words)",
    "stat2_value": "stat (e.g., '4X')",
    "stat2_label": "benefit (uppercase, 4-8 words)",
    "stat3_value": "stat (e.g., '144%')",
    "stat3_label": "benefit (uppercase, 4-8 words)",
    "badge": "offer (4-8 words)",
    "badgeNote": "hook (2-4 words)"
  },
  "bottle": {
    "headline": "headline (2-4 words)",
    "benefit1": "title (2-3 words)",
    "benefit1_detail": "detail (uppercase, 8-12 words)",
    "benefit2": "title (2-3 words)",
    "benefit2_detail": "detail (uppercase, 8-12 words)",
    "benefit3": "title (2-3 words)",
    "benefit3_detail": "detail (uppercase, 8-12 words)"
  }
}

Write conversational, authentic copy. Be specific and benefit-focused. Keep it simple and clear.`
  } else if (batch === 2) {
    // Batch 2: 7 extended layouts
    prompt += `Generate copy for these 7 layouts. Return valid JSON:

{
  "timeline": {
    "headline": "headline (2-5 words)",
    "milestone1_time": "time (e.g., '7 Days')",
    "milestone1_title": "benefit (8-15 words)",
    "milestone2_time": "time (e.g., '14 Days')",
    "milestone2_title": "benefit (8-15 words)",
    "milestone3_time": "time (e.g., '30 Days')",
    "milestone3_title": "benefit (8-15 words)"
  },
  "statement": {
    "statement": "bold question/statement (6-12 words)",
    "benefit1": "feature (2-4 words)",
    "benefit2": "feature (2-4 words)",
    "benefit3": "feature (2-4 words)",
    "cta": "CTA (uppercase, 4-8 words)"
  },
  "beforeAfter": {
    "headline": "headline (2-4 words)",
    "beforeLabel": "BEFORE",
    "beforeText": "problem (6-10 words)",
    "afterLabel": "AFTER",
    "afterText": "solution (6-10 words)"
  },
  "problemSolution": {
    "problemLabel": "THE PROBLEM",
    "problemText": "pain point (6-10 words)",
    "solutionLabel": "THE SOLUTION",
    "solutionText": "how product helps (6-10 words)"
  },
  "featureGrid": {
    "headline": "headline (3-5 words)",
    "feature1_icon": "emoji",
    "feature1_title": "title (2-3 words)",
    "feature1_desc": "description (4-6 words)",
    "feature2_icon": "emoji",
    "feature2_title": "title (2-3 words)",
    "feature2_desc": "description (4-6 words)",
    "feature3_icon": "emoji",
    "feature3_title": "title (2-3 words)",
    "feature3_desc": "description (4-6 words)",
    "feature4_icon": "emoji",
    "feature4_title": "title (2-3 words)",
    "feature4_desc": "description (4-6 words)"
  },
  "socialProof": {
    "headline": "headline (3-5 words)",
    "review1_rating": "★★★★★",
    "review1_quote": "quote (5-8 words)",
    "review1_name": "name (e.g., '- Sarah K.')",
    "review2_rating": "★★★★★",
    "review2_quote": "quote (5-8 words)",
    "review2_name": "name (e.g., '- Mike L.')",
    "review3_rating": "★★★★★",
    "review3_quote": "quote (5-8 words)",
    "review3_name": "name (e.g., '- Emma T.')"
  },
  "ingredientHero": {
    "ingredientName": "ingredient (uppercase, 1-3 words)",
    "tagline": "what it does (4-8 words)",
    "benefit1": "benefit (2-3 words)",
    "benefit2": "benefit (2-3 words)",
    "benefit3": "benefit (2-3 words)",
    "productBadge": "INSIDE"
  }
}

Write conversational, authentic copy. Be specific and benefit-focused. Keep it simple and clear.`
  }

  return prompt
}

