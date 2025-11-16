import { NextRequest, NextResponse } from 'next/server'
import { brandAssetService } from '@/lib/brand-asset-service'
import { BrandAssetFilters, AssetType } from '@/types/brand-asset'

/**
 * GET /api/brand-assets
 * Get brand assets with optional filtering
 * Query params: brandId, assetType, folder, search, tags
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
    
    const filters: BrandAssetFilters = {
      brandId: parseInt(brandId),
      assetType: searchParams.get('assetType') as AssetType | undefined,
      folder: searchParams.get('folder') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean)
    }
    
    const assets = await brandAssetService.getAssetsByBrand(filters)
    
    return NextResponse.json(assets)
  } catch (error) {
    console.error('GET /api/brand-assets error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand assets' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/brand-assets
 * Upload a new asset to the brand library
 * Expects multipart/form-data with file and metadata
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const brandId = formData.get('brandId') as string
    const assetType = formData.get('assetType') as AssetType
    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const folder = formData.get('folder') as string | null
    const tagsString = formData.get('tags') as string | null
    
    if (!file || !brandId || !assetType || !name) {
      return NextResponse.json(
        { error: 'file, brandId, assetType, and name are required' },
        { status: 400 }
      )
    }
    
    const tags = tagsString ? tagsString.split(',').filter(Boolean) : []
    
    const asset = await brandAssetService.uploadAssetToLibrary(file, {
      brandId: parseInt(brandId),
      assetType,
      name,
      description: description || undefined,
      folder: folder || undefined,
      tags: tags.length > 0 ? tags : undefined
    })
    
    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('POST /api/brand-assets error:', error)
    return NextResponse.json(
      { error: 'Failed to upload asset' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/brand-assets
 * Update asset metadata
 * Expects JSON body with assetId and update fields
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { assetId, ...updates } = body
    
    if (!assetId) {
      return NextResponse.json(
        { error: 'assetId is required' },
        { status: 400 }
      )
    }
    
    const asset = await brandAssetService.updateAssetMetadata(assetId, updates)
    
    return NextResponse.json(asset)
  } catch (error) {
    console.error('PATCH /api/brand-assets error:', error)
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/brand-assets
 * Delete an asset from the library
 * Query params: assetId
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const assetId = searchParams.get('assetId')
    
    if (!assetId) {
      return NextResponse.json(
        { error: 'assetId is required' },
        { status: 400 }
      )
    }
    
    await brandAssetService.deleteAsset(parseInt(assetId))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/brand-assets error:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    )
  }
}

