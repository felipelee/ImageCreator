import { NextRequest, NextResponse } from 'next/server'
import { brandAssetService } from '@/lib/brand-asset-service'

/**
 * GET /api/brand-assets/all-images
 * Get all images for a brand (brand images, SKU images, and asset library)
 * Query params: brandId
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brandId = searchParams.get('brandId')
    
    if (!brandId) {
      return NextResponse.json(
        { error: 'brandId is required' },
        { status: 400 }
      )
    }
    
    const allImages = await brandAssetService.getAllBrandImages(parseInt(brandId))
    
    return NextResponse.json(allImages)
  } catch (error) {
    console.error('GET /api/brand-assets/all-images error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch all brand images' },
      { status: 500 }
    )
  }
}

