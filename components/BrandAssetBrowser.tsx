'use client'

import React, { useState, useEffect } from 'react'
import { X, Search, Upload, FolderOpen, Image as ImageIcon, Grid, List, Layers, ChevronRight } from 'lucide-react'
import { BrandAsset, AssetType } from '@/types/brand-asset'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { DragDropZone } from '@/components/DragDropZone'

interface BrandAssetBrowserProps {
  open: boolean
  onClose: () => void
  brandId: number
  assetType?: AssetType
  onSelect: (asset: BrandAsset) => void
  onUploadNew?: (file: File) => void
  allowUpload?: boolean
}

const FOLDER_OPTIONS = [
  { value: 'all', label: 'All Folders' },
  { value: 'certifications', label: 'Certifications' },
  { value: 'vitamins', label: 'Vitamins' },
  { value: 'minerals', label: 'Minerals' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'icons', label: 'Icons' },
  { value: 'backgrounds', label: 'Backgrounds' },
  { value: 'textures', label: 'Textures' },
  { value: 'other', label: 'Other' }
]

const ASSET_TYPE_OPTIONS: { value: AssetType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'badge', label: 'Badges' },
  { value: 'ingredient', label: 'Ingredients' },
  { value: 'icon', label: 'Icons' },
  { value: 'background', label: 'Backgrounds' },
  { value: 'other', label: 'Other' }
]

interface CombinedAsset {
  id: string // Unique ID for React keys
  name: string
  url: string
  source: 'library' | 'brand' | 'sku'
  assetType?: string
  folder?: string
  tags?: string[]
  width?: number
  height?: number
  skuName?: string // For SKU images
}

export function BrandAssetBrowser({
  open,
  onClose,
  brandId,
  assetType,
  onSelect,
  onUploadNew,
  allowUpload = true
}: BrandAssetBrowserProps) {
  const [assets, setAssets] = useState<CombinedAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>(assetType || 'all')
  const [selectedSource, setSelectedSource] = useState<'all' | 'brand' | 'library' | string>('all') // string = skuId
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('grid')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null) // For folder drill-down

  useEffect(() => {
    if (open) {
      loadAssets()
      setExpandedFolder(null) // Reset to folder view when opening
    }
  }, [open, brandId, selectedFolder, selectedType])
  
  // Reset expanded folder when switching view modes or changing filters
  useEffect(() => {
    setExpandedFolder(null)
  }, [viewMode, selectedSource, selectedType])

  async function loadAssets() {
    setLoading(true)
    try {
      console.log('[BrandAssetBrowser] Fetching all images for brand:', brandId)
      
      const response = await fetch(`/api/brand-assets/all-images?brandId=${brandId}`)
      
      console.log('[BrandAssetBrowser] Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[BrandAssetBrowser] Error response:', errorText)
        throw new Error('Failed to load assets')
      }
      
      const data = await response.json()
      console.log('[BrandAssetBrowser] Loaded data:', data)
      
      // Combine all images into a unified format
      const combinedAssets: CombinedAsset[] = []
      
      // Add brand images
      if (data.brandImages) {
        data.brandImages.forEach((img: any) => {
          combinedAssets.push({
            id: `brand-${img.key}`,
            name: img.key,
            url: img.url,
            source: 'brand',
            assetType: 'background',
            folder: 'brand-assets'
          })
        })
      }
      
      // Add SKU images
      if (data.skuImages) {
        data.skuImages.forEach((img: any) => {
          const assetType = img.key.startsWith('badge') ? 'badge' 
            : img.key.startsWith('ingredient') ? 'ingredient'
            : img.key.startsWith('background') ? 'background'
            : 'other'
            
          combinedAssets.push({
            id: `sku-${img.skuId}-${img.key}`,
            name: img.key,
            url: img.url,
            source: 'sku',
            assetType,
            skuName: img.skuName
          })
        })
      }
      
      // Add brand asset library
      if (data.assetLibrary) {
        data.assetLibrary.forEach((asset: BrandAsset) => {
          combinedAssets.push({
            id: `library-${asset.id}`,
            name: asset.name,
            url: asset.fileUrl,
            source: 'library',
            assetType: asset.assetType,
            folder: asset.folder,
            tags: asset.tags,
            width: asset.width,
            height: asset.height
          })
        })
      }
      
      console.log('[BrandAssetBrowser] Combined assets:', combinedAssets.length, 'total')
      setAssets(combinedAssets)
    } catch (error) {
      console.error('[BrandAssetBrowser] Failed to load assets:', error)
      toast.error('Failed to load assets')
      setAssets([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    console.log('[BrandAssetBrowser] Manual search triggered:', search)
    loadAssets()
  }

  // Trigger search when search input changes (debounced effect)
  useEffect(() => {
    if (!open) return
    
    const timeoutId = setTimeout(() => {
      if (search) {
        console.log('[BrandAssetBrowser] Auto-search triggered:', search)
        loadAssets()
      }
    }, 500) // 500ms debounce
    
    return () => clearTimeout(timeoutId)
  }, [search])

  function handleSelectAsset(asset: CombinedAsset) {
    // Convert combined asset to BrandAsset format for compatibility
    const brandAsset: BrandAsset = {
      id: 0, // Not used when just selecting URL
      brandId,
      assetType: (asset.assetType as AssetType) || 'other',
      name: asset.name,
      fileUrl: asset.url,
      folder: asset.folder,
      tags: asset.tags,
      width: asset.width,
      height: asset.height,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    onSelect(brandAsset)
    onClose()
  }

  async function handleFilesUpload(files: File[]) {
    if (!onUploadNew || files.length === 0) return
    
    // Upload first file for now (we can enhance to handle multiple later)
    onUploadNew(files[0])
    onClose()
  }

  // Apply client-side filtering
  const filteredAssets = assets.filter(asset => {
    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      const matchesSearch = 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.folder?.toLowerCase().includes(searchLower) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        asset.skuName?.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }
    
    // Type filter
    if (selectedType !== 'all' && asset.assetType !== selectedType) {
      return false
    }
    
    // Folder filter
    if (selectedFolder !== 'all' && asset.folder !== selectedFolder) {
      return false
    }
    
    // Source filter
    if (selectedSource !== 'all') {
      if (selectedSource === 'brand' && asset.source !== 'brand') return false
      if (selectedSource === 'library' && asset.source !== 'library') return false
      // SKU-specific filter (selectedSource is skuId)
      if (!['all', 'brand', 'library'].includes(selectedSource)) {
        const skuId = selectedSource.replace('sku-', '')
        if (!asset.id.includes(`-${skuId}-`)) return false
      }
    }
    
    return true
  })
  
  // Get unique SKUs for filtering
  const availableSkus = React.useMemo(() => {
    const skuMap = new Map<string, string>()
    assets.forEach(asset => {
      if (asset.source === 'sku' && asset.skuName) {
        const skuId = asset.id.split('-')[1] // Extract SKU ID from id like "sku-1-ingredientA"
        skuMap.set(skuId, asset.skuName)
      }
    })
    return Array.from(skuMap.entries()).map(([id, name]) => ({ id, name }))
  }, [assets])
  
  // Group assets by SKU for grouped view
  const groupedAssets = React.useMemo(() => {
    const groups: Record<string, CombinedAsset[]> = {
      'brand': [],
      'library': []
    }
    
    filteredAssets.forEach(asset => {
      if (asset.source === 'brand') {
        groups['brand'].push(asset)
      } else if (asset.source === 'library') {
        groups['library'].push(asset)
      } else if (asset.source === 'sku' && asset.skuName) {
        if (!groups[asset.skuName]) {
          groups[asset.skuName] = []
        }
        groups[asset.skuName].push(asset)
      }
    })
    
    return groups
  }, [filteredAssets])

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Select from Brand Library</DrawerTitle>
          <DrawerDescription>
            Choose from brand images, SKU images, or asset library • {filteredAssets.length} available
          </DrawerDescription>
        </DrawerHeader>

        <Tabs defaultValue="library" className="w-full px-4 pb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">
              All Images ({filteredAssets.length})
            </TabsTrigger>
            {allowUpload && <TabsTrigger value="upload">Upload New</TabsTrigger>}
          </TabsList>

          <TabsContent value="library" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 flex items-center gap-2 min-w-[200px]">
                <Input
                  placeholder="Search assets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
              </div>
              
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="library">Library Only</SelectItem>
                  <SelectItem value="brand">Brand Only</SelectItem>
                  {availableSkus.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        By SKU
                      </div>
                      {availableSkus.map(sku => (
                        <SelectItem key={sku.id} value={`sku-${sku.id}`}>
                          {sku.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as AssetType | 'all')}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grouped' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grouped')}
                  title="Grouped by SKU"
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Assets Grid/List */}
            <ScrollArea className="h-[60vh] border rounded-md p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading assets...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No assets found</p>
                  <p className="text-sm text-muted-foreground">Try uploading some assets to your library</p>
                </div>
              ) : viewMode === 'grouped' ? (
                expandedFolder ? (
                  // Drilled-down view - showing images from selected folder
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedFolder(null)}
                      className="mb-2"
                    >
                      ← Back to Folders
                    </Button>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="font-semibold text-lg">
                        {expandedFolder === 'brand' ? '🏢 Brand Images' : 
                         expandedFolder === 'library' ? '📚 Asset Library' : 
                         `📦 ${expandedFolder}`}
                      </h3>
                      <Badge variant="secondary">
                        {groupedAssets[expandedFolder]?.length || 0} images
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {groupedAssets[expandedFolder]?.map(asset => (
                        <div
                          key={asset.id}
                          className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handleSelectAsset(asset)}
                        >
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="p-2 bg-background">
                            <p className="text-sm font-medium truncate">{asset.name}</p>
                            {asset.assetType && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {asset.assetType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Folder overview - show folders as cards (like photo stacks)
                  <div className="grid grid-cols-5 gap-3 py-2">
                    {Object.entries(groupedAssets).map(([groupName, groupAssets]) => {
                      if (groupAssets.length === 0) return null
                      
                      // Get first 3 images for stacked preview
                      const previewImages = groupAssets.slice(0, 3)
                      
                      return (
                        <div
                          key={groupName}
                          className="group cursor-pointer"
                          onClick={() => setExpandedFolder(groupName)}
                        >
                          {/* Photo stack effect */}
                          <div className="relative mb-2">
                            {previewImages.map((asset, idx) => (
                              <div
                                key={idx}
                                className="absolute inset-0 bg-muted rounded-md border border-background shadow-sm overflow-hidden transition-transform group-hover:shadow-md"
                                style={{
                                  transform: `translateY(${idx * 4}px) translateX(${idx * 2}px) rotate(${idx * 1.5}deg)`,
                                  zIndex: 10 - idx
                                }}
                              >
                                <img
                                  src={asset.url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {/* Base card for aspect ratio */}
                            <div className="aspect-square opacity-0"></div>
                          </div>
                          
                          {/* Folder info */}
                          <div className="mt-4 space-y-0.5 px-0.5">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-xs truncate">
                                {groupName === 'brand' ? '🏢 Brand' : 
                                 groupName === 'library' ? '📚 Library' : 
                                 `📦 ${groupName}`}
                              </h3>
                              <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {groupAssets.length} image{groupAssets.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-4 gap-4">
                  {filteredAssets.map(asset => (
                    <div
                      key={asset.id}
                      className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="p-2 bg-background">
                        <p className="text-sm font-medium truncate">{asset.name}</p>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <Badge 
                            variant={asset.source === 'library' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {asset.source === 'library' ? 'Library' : asset.source === 'brand' ? 'Brand' : 'SKU'}
                          </Badge>
                          {asset.assetType && (
                            <Badge variant="outline" className="text-xs">
                              {asset.assetType}
                            </Badge>
                          )}
                          {asset.skuName && (
                            <Badge variant="outline" className="text-xs">
                              {asset.skuName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAssets.map(asset => (
                    <div
                      key={asset.id}
                      className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{asset.name}</p>
                        {asset.skuName && (
                          <p className="text-sm text-muted-foreground truncate">From: {asset.skuName}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={asset.source === 'library' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {asset.source === 'library' ? 'Library' : asset.source === 'brand' ? 'Brand' : 'SKU'}
                          </Badge>
                          {asset.assetType && (
                            <Badge variant="outline" className="text-xs">
                              {asset.assetType}
                            </Badge>
                          )}
                          {asset.width && asset.height && (
                            <span className="text-xs text-muted-foreground">
                              {asset.width} × {asset.height}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {allowUpload && (
            <TabsContent value="upload" className="space-y-4 mt-4">
              <DragDropZone
                onFilesSelected={handleFilesUpload}
                accept="image/*"
                maxFiles={10}
                maxSizeMB={10}
              />
            </TabsContent>
          )}
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}

