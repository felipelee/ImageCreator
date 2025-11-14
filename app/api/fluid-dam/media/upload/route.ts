import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs' // Need Node runtime for file handling

const GLOBAL_FLUID_API_TOKEN = process.env.FLUID_API_TOKEN
const GLOBAL_FLUID_API_BASE_URL = process.env.FLUID_API_BASE_URL || 'https://myco.fluid.app'

// Upload generated image back to Fluid DAM
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const productId = formData.get('productId') as string | null
    const brandApiToken = formData.get('apiToken') as string | null
    const brandBaseUrl = formData.get('baseUrl') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const apiToken = brandApiToken || GLOBAL_FLUID_API_TOKEN
    const baseUrl = brandBaseUrl || GLOBAL_FLUID_API_BASE_URL

    if (!apiToken) {
      return NextResponse.json(
        { error: 'Fluid API token not configured' },
        { status: 500 }
      )
    }

    // Create form data for Fluid API
    const fluidFormData = new FormData()
    fluidFormData.append('file', file)
    if (title) {
      fluidFormData.append('title', title)
    }
    if (productId) {
      fluidFormData.append('product_id', productId)
    }

    // Upload to Fluid DAM
    const apiUrl = `${baseUrl}/api/media`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      },
      body: fluidFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fluid Media Upload error:', errorText)
      return NextResponse.json(
        { error: `Failed to upload to Fluid: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      media: {
        id: data.id,
        url: data.image_url || data.url,
        title: data.title,
        mediaType: data.media_type,
        productId: data.product_id
      }
    })
  } catch (error: any) {
    console.error('Error uploading to Fluid:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

// Helper endpoint to attach existing media to a product
export async function PATCH(request: NextRequest) {
  try {
    const { mediaId, productId, apiToken: brandApiToken, baseUrl: brandBaseUrl } = await request.json()

    if (!mediaId || !productId) {
      return NextResponse.json(
        { error: 'mediaId and productId are required' },
        { status: 400 }
      )
    }

    const apiToken = brandApiToken || GLOBAL_FLUID_API_TOKEN
    const baseUrl = brandBaseUrl || GLOBAL_FLUID_API_BASE_URL

    if (!apiToken) {
      return NextResponse.json(
        { error: 'Fluid API token not configured' },
        { status: 500 }
      )
    }

    // Attach media to product
    const apiUrl = `${baseUrl}/api/products/${productId}/media`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_id: mediaId
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fluid Media Attach error:', errorText)
      return NextResponse.json(
        { error: `Failed to attach media to product: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Error attaching media to product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to attach media' },
      { status: 500 }
    )
  }
}

