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
    
    // Get brand-specific credentials from query params (passed from frontend)
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

    // Construct Fluid DAM API URL
    // Based on Fluid docs: GET /api/media for listing assets
    let apiUrl = `${baseUrl}/api/media?page=${page}&per_page=${perPage}`
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
      console.error('Fluid DAM API error:', errorText)
      return NextResponse.json(
        { error: `Fluid DAM API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Transform Fluid API response to our format
    // Fluid returns: { media: [...], pagination: {...} } or just an array
    let assets = []
    if (data.media && Array.isArray(data.media)) {
      assets = data.media
        .filter((item: any) => {
          // Only include images (filter out videos and PDFs)
          return item.image_url && (
            item.media_type === 'image' || 
            item.media_format?.match(/^image\//i) ||
            !item.video_url
          )
        })
        .map((item: any) => ({
          id: item.id,
          code: item.id?.toString() || '',
          name: item.title || item.name || 'Untitled',
          url: item.image_url,
          thumbnail_url: item.image_url,
          media_type: item.media_type,
          file_size: item.file_size,
          width: item.width,
          height: item.height
        }))
    } else if (Array.isArray(data)) {
      assets = data
        .filter((item: any) => {
          // Only include images (filter out videos and PDFs)
          return item.image_url && (
            item.media_type === 'image' || 
            item.media_format?.match(/^image\//i) ||
            !item.video_url
          )
        })
        .map((item: any) => ({
          id: item.id,
          code: item.id?.toString() || '',
          name: item.title || item.name || 'Untitled',
          url: item.image_url,
          thumbnail_url: item.image_url,
          media_type: item.media_type,
          file_size: item.file_size,
          width: item.width,
          height: item.height
        }))
    }
    
    return NextResponse.json({
      assets,
      total: data.total || data.pagination?.total || assets.length,
      page: parseInt(page),
      per_page: parseInt(perPage)
    })
  } catch (error: any) {
    console.error('Error fetching Fluid DAM assets:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

