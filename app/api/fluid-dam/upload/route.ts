import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Fallback to global credentials if brand-specific ones aren't provided
const GLOBAL_FLUID_API_TOKEN = process.env.FLUID_API_TOKEN
const GLOBAL_FLUID_API_BASE_URL = process.env.FLUID_API_BASE_URL || 'https://myco.fluid.app'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Get brand-specific credentials
    const brandApiToken = formData.get('apiToken') as string
    const brandBaseUrl = formData.get('baseUrl') as string
    
    // Use brand-specific credentials if provided, otherwise fall back to global
    const apiToken = brandApiToken || GLOBAL_FLUID_API_TOKEN
    const baseUrl = brandBaseUrl || GLOBAL_FLUID_API_BASE_URL

    console.log('[Fluid Upload API] Request received')
    console.log('[Fluid Upload API] Base URL:', baseUrl)

    if (!apiToken) {
      console.error('[Fluid Upload API] No API token found')
      return NextResponse.json(
        { error: 'Fluid API token not configured for this brand' },
        { status: 500 }
      )
    }

    // Get the image file/URL and metadata
    const imageFile = formData.get('file') as File | null
    const imageUrl = formData.get('imageUrl') as string | null // For company_media, we use a URL instead of file
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const productId = formData.get('productId') as string
    const variantId = formData.get('variantId') as string
    const position = formData.get('position') as string
    const uploadType = formData.get('uploadType') as string || 'product_image' // 'product_image', 'variant_image', or 'company_media'

    console.log('[Fluid Upload API] Upload type:', uploadType)
    console.log('[Fluid Upload API] Product ID:', productId)
    console.log('[Fluid Upload API] Variant ID:', variantId)
    console.log('[Fluid Upload API] Title:', title)
    console.log('[Fluid Upload API] Description:', description)
    console.log('[Fluid Upload API] Image URL:', imageUrl)
    console.log('[Fluid Upload API] Image file size:', imageFile?.size, 'bytes')

    // For company_media, we can use a URL directly
    let dataUrl: string
    if (uploadType === 'company_media' && imageUrl) {
      // Use the provided URL (from Supabase storage)
      dataUrl = imageUrl
      console.log('[Fluid Upload API] Using provided image URL for company media')
    } else if (imageFile) {
      // Convert image file to base64 for product/variant uploads
      const arrayBuffer = await imageFile.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      dataUrl = `data:${imageFile.type};base64,${base64}`
      console.log('[Fluid Upload API] Image converted to base64, length:', base64.length)
    } else {
      console.error('[Fluid Upload API] No image file or URL in request')
      return NextResponse.json(
        { error: 'No image file or URL provided' },
        { status: 400 }
      )
    }

    let apiUrl: string
    let requestBody: any

    if (uploadType === 'company_media') {
      // Step 1: Upload to Fluid DAM first to get a URL
      // Step 2: Use that URL to create Media Library entry
      
      if (!imageFile) {
        return NextResponse.json(
          { error: 'Image file required for company media upload' },
          { status: 400 }
        )
      }
      
      // Upload to Fluid DAM
      console.log('[Fluid Upload API] Step 1: Uploading file to Fluid DAM...')
      console.log('[Fluid Upload API] DAM URL:', `${baseUrl}/api/dam/assets`)
      console.log('[Fluid Upload API] File name:', imageFile.name)
      console.log('[Fluid Upload API] File size:', imageFile.size, 'bytes')
      console.log('[Fluid Upload API] File type:', imageFile.type)
      console.log('[Fluid Upload API] Title:', title)
      
      const damFormData = new FormData()
      damFormData.append('file', imageFile, imageFile.name)
      damFormData.append('name', title)
      damFormData.append('description', description || title)
      
      const damResponse = await fetch(`${baseUrl}/api/dam/assets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: damFormData,
      })
      
      console.log('[Fluid Upload API] DAM response status:', damResponse.status)

      if (!damResponse.ok) {
        const errorText = await damResponse.text()
        console.error('[Fluid Upload API] DAM upload failed')
        console.error('[Fluid Upload API] Status:', damResponse.status)
        console.error('[Fluid Upload API] Response:', errorText)
        
        // Try to parse error details
        let errorDetails = errorText
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = JSON.stringify(errorJson, null, 2)
          console.error('[Fluid Upload API] Error details:', errorJson)
        } catch (e) {
          // Not JSON
        }
        
        return NextResponse.json(
          { error: `Failed to upload to Fluid DAM: ${damResponse.status}`, details: errorText },
          { status: damResponse.status }
        )
      }

      const damAsset = await damResponse.json()
      console.log('[Fluid Upload API] DAM asset created:', damAsset)
      
      // Get the asset URL from DAM response
      const assetUrl = damAsset.image_url || damAsset.url || damAsset.public_url
      
      if (!assetUrl) {
        console.error('[Fluid Upload API] No URL in DAM response:', damAsset)
        return NextResponse.json(
          { error: 'DAM upload succeeded but no URL returned' },
          { status: 500 }
        )
      }
      
      console.log('[Fluid Upload API] Step 2: Creating Media Library entry with URL:', assetUrl)
      
      // Now create Media Library entry with the DAM URL
      apiUrl = `${baseUrl}/api/company/media`
      requestBody = {
        medium: {
          title: title,
          description: description || title,
          image_url: assetUrl, // Use the Fluid DAM URL
          media_type: 'share',
          active: true,
          kind: 'graphic'
        }
      }
      console.log('[Fluid Upload API] Creating Media Library entry')
    } else if (uploadType === 'variant_image' && variantId) {
      // Upload to Variant Images API
      // POST /api/company/v1/variants/{variant_id}/images
      apiUrl = `${baseUrl}/api/company/v1/variants/${variantId}/images`
      requestBody = {
        image_url: dataUrl,
        position: position ? parseInt(position) : undefined,
        alt_text: title || undefined
      }
      console.log('[Fluid Upload API] Uploading to variant:', variantId)
    } else if (productId) {
      // Upload to Product Images API
      // POST /api/company/v1/products/{product_id}/images
      apiUrl = `${baseUrl}/api/company/v1/products/${productId}/images`
      requestBody = {
        image_url: dataUrl,
        position: position ? parseInt(position) : undefined,
        alt_text: title || undefined
      }
      console.log('[Fluid Upload API] Uploading to product:', productId)
    } else {
      console.error('[Fluid Upload API] No product or variant ID provided')
      return NextResponse.json(
        { error: 'Product ID or Variant ID is required for product/variant uploads' },
        { status: 400 }
      )
    }

    console.log('[Fluid Upload API] Target URL:', apiUrl)
    if (requestBody) {
      console.log('[Fluid Upload API] Request body:', { ...requestBody, image_url: requestBody.image_url ? '[data omitted]' : undefined })
    }

    console.log('[Fluid Upload API] Sending request to Fluid...')
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('[Fluid Upload API] Response status:', response.status)
    console.log('[Fluid Upload API] Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Fluid Upload API] Error response:', errorText)
      
      // Try to parse error message
      let errorMessage = `Fluid API error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.message) {
          errorMessage = errorJson.message
        } else if (errorJson.error) {
          errorMessage = errorJson.error
        } else if (errorJson.errors) {
          errorMessage = JSON.stringify(errorJson.errors)
        }
      } catch (e) {
        // Use default error message
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('[Fluid Upload API] ✅ Success! Response:', result)
    
    const successMessage = uploadType === 'company_media' 
      ? 'Image successfully uploaded to Company Media Library'
      : uploadType === 'variant_image' 
        ? 'Image successfully uploaded to Fluid Variant'
        : 'Image successfully uploaded to Fluid Product'
    
    return NextResponse.json({
      success: true,
      image: result,
      message: successMessage
    })
  } catch (error: any) {
    console.error('[Fluid Upload API] ❌ Exception:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

