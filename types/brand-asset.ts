export type AssetType = 'badge' | 'ingredient' | 'icon' | 'background' | 'other'

export type AssetFolder = 
  | 'certifications' 
  | 'vitamins' 
  | 'minerals' 
  | 'herbs'
  | 'icons'
  | 'backgrounds'
  | 'textures'
  | 'other'

export interface BrandAsset {
  id: number
  brandId: number
  assetType: AssetType
  name: string
  description?: string
  fileUrl: string
  thumbnailUrl?: string
  folder?: string
  tags?: string[]
  fileSize?: number
  width?: number
  height?: number
  mimeType?: string
  createdAt: Date
  updatedAt: Date
}

export interface BrandAssetCreateInput {
  brandId: number
  assetType: AssetType
  name: string
  description?: string
  fileUrl: string
  thumbnailUrl?: string
  folder?: string
  tags?: string[]
  fileSize?: number
  width?: number
  height?: number
  mimeType?: string
}

export interface BrandAssetUpdateInput {
  name?: string
  description?: string
  folder?: string
  tags?: string[]
}

export interface BrandAssetFilters {
  brandId: number
  assetType?: AssetType
  folder?: string
  search?: string
  tags?: string[]
}

// For the asset browser/picker
export interface AssetBrowserProps {
  brandId: number
  assetType?: AssetType
  onSelect: (asset: BrandAsset) => void
  onClose: () => void
  allowUpload?: boolean
}

// For tracking usage across SKUs
export interface AssetUsage {
  assetId: number
  skuId: number
  skuName: string
  fieldName: string // e.g., 'badge1', 'ingredientA'
}

