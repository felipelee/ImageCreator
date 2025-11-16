import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { layoutName, layoutDisplayName, skuName, productInfo } = await request.json()

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    const prompt = `Generate a title and description for a marketing image.

Layout Type: ${layoutDisplayName}
Product/SKU: ${skuName}
${productInfo ? `Product Info: ${productInfo}` : ''}

Generate:
1. A concise, descriptive title (max 60 characters) that would be good for DAM organization
2. A detailed description (2-3 sentences) explaining what this image is for and its marketing purpose

Respond in JSON format:
{
  "title": "your title here",
  "description": "your description here"
}`

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
            content: 'You are an expert at creating descriptive titles and metadata for marketing assets. Return ONLY valid JSON, no markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI')
    }
    
    const metadata = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({
      title: metadata.title,
      description: metadata.description
    })
  } catch (error: any) {
    console.error('Error generating media metadata:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate metadata' },
      { status: 500 }
    )
  }
}

