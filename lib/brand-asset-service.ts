import { supabase } from './supabase'
import { uploadImage, STORAGE_BUCKETS } from './supabase-storage'
import { 
  BrandAsset, 
  BrandAssetCreateInput, 
  BrandAssetUpdateInput, 
  BrandAssetFilters,
  AssetUsage
} from '@/types/brand-asset'
import { SKU } from '@/types/sku'
import { Brand } from '@/types/brand'

/**
 * Brand Asset Service
 * Manages reusable brand assets (badges, ingredients, icons, backgrounds)
 */

// Convert database row to BrandAsset type
function mapDatabaseRowToAsset(row: any): BrandAsset {
  return {
    id: row.id,
    brandId: row.brand_id,
    assetType: row.asset_type,
    name: row.name,
    description: row.description,
    fileUrl: row.file_url,
    thumbnailUrl: row.thumbnail_url,
    folder: row.folder,
    tags: row.tags || [],
    fileSize: row.file_size,
    width: row.width,
    height: row.height,
    mimeType: row.mime_type,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  }
}

/**
 * Upload a file to storage and save it to the brand assets library
 */
export async function uploadAssetToLibrary(
  file: File,
  metadata: Omit<BrandAssetCreateInput, 'fileUrl' | 'thumbnailUrl' | 'fileSize' | 'width' | 'height' | 'mimeType'>
): Promise<BrandAsset> {
  try {
    // Upload file to Supabase storage
    const path = `brand-${metadata.brandId}/${metadata.assetType}-${Date.now()}-${file.name}`
    const publicUrl = await uploadImage(STORAGE_BUCKETS.BRAND_IMAGES, file, path)
    
    // Get image dimensions
    const dimensions = await getImageDimensions(file)
    
    // Create asset record in database
    const assetData: BrandAssetCreateInput = {
      ...metadata,
      fileUrl: publicUrl,
      fileSize: file.size,
      width: dimensions.width,
      height: dimensions.height,
      mimeType: file.type
    }
    
    const { data, error } = await supabase
      .from('brand_assets')
      .insert({
        brand_id: assetData.brandId,
        asset_type: assetData.assetType,
        name: assetData.name,
        description: assetData.description,
        file_url: assetData.fileUrl,
        thumbnail_url: assetData.thumbnailUrl,
        folder: assetData.folder,
        tags: assetData.tags,
        file_size: assetData.fileSize,
        width: assetData.width,
        height: assetData.height,
        mime_type: assetData.mimeType
      })
      .select()
      .single()
    
    if (error) throw error
    
    return mapDatabaseRowToAsset(data)
  } catch (error) {
    console.error('Failed to upload asset to library:', error)
    throw error
  }
}

/**
 * Get all assets for a brand with optional filters
 */
export async function getAssetsByBrand(filters: BrandAssetFilters): Promise<BrandAsset[]> {
  try {
    let query = supabase
      .from('brand_assets')
      .select('*')
      .eq('brand_id', filters.brandId)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (filters.assetType) {
      query = query.eq('asset_type', filters.assetType)
    }
    
    if (filters.folder) {
      query = query.eq('folder', filters.folder)
    }
    
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return data ? data.map(mapDatabaseRowToAsset) : []
  } catch (error) {
    console.error('Failed to get brand assets:', error)
    throw error
  }
}

/**
 * Get a single asset by ID
 */
export async function getAssetById(assetId: number): Promise<BrandAsset | null> {
  try {
    const { data, error } = await supabase
      .from('brand_assets')
      .select('*')
      .eq('id', assetId)
      .single()
    
    if (error) throw error
    
    return data ? mapDatabaseRowToAsset(data) : null
  } catch (error) {
    console.error('Failed to get asset:', error)
    return null
  }
}

/**
 * Update asset metadata (name, description, folder, tags)
 */
export async function updateAssetMetadata(
  assetId: number,
  updates: BrandAssetUpdateInput
): Promise<BrandAsset> {
  try {
    const { data, error } = await supabase
      .from('brand_assets')
      .update({
        name: updates.name,
        description: updates.description,
        folder: updates.folder,
        tags: updates.tags
      })
      .eq('id', assetId)
      .select()
      .single()
    
    if (error) throw error
    
    return mapDatabaseRowToAsset(data)
  } catch (error) {
    console.error('Failed to update asset metadata:', error)
    throw error
  }
}

/**
 * Delete an asset from the library
 * Note: This does not delete the actual file from storage to prevent breaking existing SKUs
 */
export async function deleteAsset(assetId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('brand_assets')
      .delete()
      .eq('id', assetId)
    
    if (error) throw error
  } catch (error) {
    console.error('Failed to delete asset:', error)
    throw error
  }
}

/**
 * Get all unique folders for a brand
 */
export async function getBrandFolders(brandId: number): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('brand_assets')
      .select('folder')
      .eq('brand_id', brandId)
      .not('folder', 'is', null)
    
    if (error) throw error
    
    // Extract unique folders
    const folders = data
      ? [...new Set(data.map(row => row.folder).filter(Boolean))]
      : []
    
    return folders
  } catch (error) {
    console.error('Failed to get brand folders:', error)
    return []
  }
}

/**
 * Find where an asset is being used across SKUs
 */
export async function findAssetUsage(
  brandId: number,
  assetUrl: string
): Promise<AssetUsage[]> {
  try {
    // Get all SKUs for the brand
    const { data: skus, error } = await supabase
      .from('skus')
      .select('id, name, images')
      .eq('brand_id', brandId)
    
    if (error) throw error
    if (!skus) return []
    
    const usage: AssetUsage[] = []
    
    // Check each SKU's images for the asset URL
    skus.forEach((sku: any) => {
      if (sku.images) {
        Object.entries(sku.images).forEach(([fieldName, url]) => {
          if (url === assetUrl) {
            usage.push({
              assetId: 0, // We don't have the asset ID in this context
              skuId: sku.id,
              skuName: sku.name,
              fieldName
            })
          }
        })
      }
    })
    
    return usage
  } catch (error) {
    console.error('Failed to find asset usage:', error)
    return []
  }
}

/**
 * Get all images used across a brand (SKUs + brand images + brand assets)
 * Returns a unified view for the asset manager page
 */
export async function getAllBrandImages(brandId: number): Promise<{
  brandImages: { key: string; url: string; type: string }[]
  skuImages: { skuId: number; skuName: string; key: string; url: string; type: string }[]
  assetLibrary: BrandAsset[]
}> {
  try {
    // Get brand record
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('images')
      .eq('id', brandId)
      .single()
    
    if (brandError) throw brandError
    
    // Get all SKUs for the brand
    const { data: skuData, error: skuError } = await supabase
      .from('skus')
      .select('id, name, images')
      .eq('brand_id', brandId)
    
    if (skuError) throw skuError
    
    // Get brand assets
    const assetLibrary = await getAssetsByBrand({ brandId })
    
    // Process brand images
    const brandImages = brandData?.images 
      ? Object.entries(brandData.images)
          .filter(([_, url]) => url)
          .map(([key, url]) => ({
            key,
            url: url as string,
            type: 'brand'
          }))
      : []
    
    // Process SKU images
    const skuImages: { skuId: number; skuName: string; key: string; url: string; type: string }[] = []
    if (skuData) {
      skuData.forEach((sku: any) => {
        if (sku.images) {
          Object.entries(sku.images).forEach(([key, url]) => {
            if (url) {
              skuImages.push({
                skuId: sku.id,
                skuName: sku.name,
                key,
                url: url as string,
                type: 'sku'
              })
            }
          })
        }
      })
    }
    
    return {
      brandImages,
      skuImages,
      assetLibrary
    }
  } catch (error) {
    console.error('Failed to get all brand images:', error)
    throw error
  }
}

/**
 * Helper function to get image dimensions from a file
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// Export service object for cleaner imports
export const brandAssetService = {
  uploadAssetToLibrary,
  getAssetsByBrand,
  getAssetById,
  updateAssetMetadata,
  deleteAsset,
  getBrandFolders,
  findAssetUsage,
  getAllBrandImages
}

