import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Fallback to global credentials if brand-specific ones aren't provided
const GLOBAL_FLUID_API_TOKEN = process.env.FLUID_API_TOKEN
const GLOBAL_FLUID_API_BASE_URL = process.env.FLUID_API_BASE_URL || 'https://myco.fluid.app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('per_page') || '50'
    const search = searchParams.get('search') || ''
    
    // Get brand-specific credentials from query params
    const brandApiToken = searchParams.get('apiToken')
    const brandBaseUrl = searchParams.get('baseUrl')

    // Use brand-specific credentials if provided, otherwise fall back to global
    const apiToken = brandApiToken || GLOBAL_FLUID_API_TOKEN
    const baseUrl = brandBaseUrl || GLOBAL_FLUID_API_BASE_URL

    if (!apiToken) {
      return NextResponse.json(
        { error: 'Fluid API token not configured for this brand' },
        { status: 500 }
      )
    }

    // Construct Fluid Products API URL
    // Based on Fluid docs: GET /api/products or /api/public/v2025-06/products
    let apiUrl = `${baseUrl}/api/products?page=${page}&per_page=${perPage}`
    if (search) {
      apiUrl += `&q=${encodeURIComponent(search)}`
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fluid Products API error:', errorText)
      return NextResponse.json(
        { error: `Fluid Products API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Transform Fluid API response to our format
    let products = []
    if (data.products && Array.isArray(data.products)) {
      products = data.products.map((item: any) => ({
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
        tags: item.tags || []
      }))
    } else if (Array.isArray(data)) {
      products = data.map((item: any) => ({
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
        tags: item.tags || []
      }))
    }
    
    return NextResponse.json({
      products,
      total: data.total || data.pagination?.total || products.length,
      page: parseInt(page),
      per_page: parseInt(perPage)
    })
  } catch (error: any) {
    console.error('Error fetching Fluid products:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

