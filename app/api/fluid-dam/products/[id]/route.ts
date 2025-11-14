import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const GLOBAL_FLUID_API_TOKEN = process.env.FLUID_API_TOKEN
const GLOBAL_FLUID_API_BASE_URL = process.env.FLUID_API_BASE_URL || 'https://myco.fluid.app'

// Get a single product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const brandApiToken = searchParams.get('apiToken')
    const brandBaseUrl = searchParams.get('baseUrl')

    const apiToken = brandApiToken || GLOBAL_FLUID_API_TOKEN
    const baseUrl = brandBaseUrl || GLOBAL_FLUID_API_BASE_URL

    if (!apiToken) {
      return NextResponse.json(
        { error: 'Fluid API token not configured' },
        { status: 500 }
      )
    }

    // Try by ID first, then by slug if ID fails
    const apiUrl = `${baseUrl}/api/products/${params.id}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Try public API with slug
      const publicUrl = `${baseUrl}/api/public/v2025-06/products/${params.id}`
      const publicResponse = await fetch(publicUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!publicResponse.ok) {
        const errorText = await publicResponse.text()
        console.error('Fluid Product API error:', errorText)
        return NextResponse.json(
          { error: `Product not found: ${params.id}` },
          { status: 404 }
        )
      }

      const publicData = await publicResponse.json()
      return NextResponse.json(transformProduct(publicData))
    }

    const data = await response.json()
    return NextResponse.json(transformProduct(data))
  } catch (error: any) {
    console.error('Error fetching Fluid product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

function transformProduct(item: any) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title || item.name,
    sku: item.sku || item.variants?.[0]?.sku,
    description: item.description || item.body_html,
    price: item.price || item.variants?.[0]?.price,
    currency: item.currency,
    images: item.images || [],
    mainImage: item.image_url || item.images?.[0]?.url,
    variants: item.variants || [],
    metadata: item.metadata || {},
    collections: item.collections || [],
    tags: item.tags || [],
    // Additional details that might be useful
    inventory: item.inventory,
    weight: item.weight,
    dimensions: item.dimensions,
    shipping: item.shipping
  }
}

