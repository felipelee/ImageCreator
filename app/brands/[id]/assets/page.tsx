'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Upload, Search, Grid, List, Download, Trash2, Edit3, 
  FolderOpen, Image as ImageIcon, Package, Settings, 
  BarChart, Copy, ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { Brand } from '@/types/brand'
import { BrandAsset, AssetType } from '@/types/brand-asset'
import { brandService } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { DragDropZone } from '@/components/DragDropZone'
import { ImageLightbox } from '@/components/ImageLightbox'

interface AllImages {
  brandImages: { key: string; url: string; type: string }[]
  skuImages: { skuId: number; skuName: string; key: string; url: string; type: string }[]
  assetLibrary: BrandAsset[]
}

export default function BrandAssetsPage() {
  const params = useParams()
  const brandId = parseInt(params.id as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [allImages, setAllImages] = useState<AllImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAssets, setSelectedAssets] = useState<Set<number>>(new Set())
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [lightboxAsset, setLightboxAsset] = useState<BrandAsset | null>(null)
  
  useEffect(() => {
    loadData()
  }, [brandId])

  // Filter and sort assets - MUST be before early returns to follow Rules of Hooks
  const filteredAndSortedAssets = React.useMemo(() => {
    if (!allImages?.assetLibrary) return []
    
    let filtered = allImages.assetLibrary
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.description?.toLowerCase().includes(searchLower) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        asset.folder?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'size':
          return (b.fileSize || 0) - (a.fileSize || 0)
        default:
          return 0
      }
    })
    
    return sorted
  }, [allImages?.assetLibrary, search, sortBy])
  
  async function loadData() {
    setLoading(true)
    try {
      const [brandData, imagesData] = await Promise.all([
        brandService.getById(brandId),
        fetch(`/api/brand-assets/all-images?brandId=${brandId}`).then(r => r.json())
      ])
      
      setBrand(brandData)
      setAllImages(imagesData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load assets')
    } finally {
      setLoading(false)
    }
  }
  
  async function handleUploadFiles(files: File[]) {
    if (files.length === 0) return
    
    setUploadingFiles(true)
    
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('brandId', brandId.toString())
        formData.append('assetType', 'other')
        formData.append('name', file.name)
        
        const response = await fetch('/api/brand-assets', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) throw new Error(`Failed to upload ${file.name}`)
      }
      
      toast.success(`Uploaded ${files.length} file(s)`)
      loadData()
      setUploadDialogOpen(false)
    } catch (error) {
      console.error('Failed to upload files:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFiles(false)
    }
  }
  
  async function handleDeleteAsset(assetId: number) {
    if (!confirm('Are you sure you want to delete this asset?')) return
    
    try {
      const response = await fetch(`/api/brand-assets?assetId=${assetId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete asset')
      
      toast.success('Asset deleted')
      loadData()
    } catch (error) {
      console.error('Failed to delete asset:', error)
      toast.error('Failed to delete asset')
    }
  }
  
  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }
  
  function toggleAssetSelection(assetId: number) {
    const newSet = new Set(selectedAssets)
    if (newSet.has(assetId)) {
      newSet.delete(assetId)
    } else {
      newSet.add(assetId)
    }
    setSelectedAssets(newSet)
  }
  
  function handleBulkDelete() {
    if (selectedAssets.size === 0) return
    if (!confirm(`Delete ${selectedAssets.size} asset(s)?`)) return
    
    Promise.all(
      Array.from(selectedAssets).map(id => 
        fetch(`/api/brand-assets?assetId=${id}`, { method: 'DELETE' })
      )
    ).then(() => {
      toast.success(`Deleted ${selectedAssets.size} asset(s)`)
      setSelectedAssets(new Set())
      loadData()
    }).catch(error => {
      console.error('Failed to bulk delete:', error)
      toast.error('Failed to delete some assets')
    })
  }
  
  if (loading) {
    return (
      <AdminLayout currentBrandId={brandId}>
        <PageHeader 
          breadcrumbs={[
            { label: 'All Brands', href: '/' },
            { label: 'Loading...' }
          ]} 
        />
        <div className="flex-1 p-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }
  
  if (!brand) {
    return (
      <AdminLayout currentBrandId={brandId}>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Not Found' }]} />
        <div className="flex-1 flex items-center justify-center">
          <p>Brand not found</p>
        </div>
      </AdminLayout>
    )
  }
  
  const totalAssets = (allImages?.brandImages.length || 0) + 
                      (allImages?.skuImages.length || 0) + 
                      (allImages?.assetLibrary.length || 0)
  
  const uniqueUrls = new Set([
    ...(allImages?.brandImages.map(i => i.url) || []),
    ...(allImages?.skuImages.map(i => i.url) || []),
    ...(allImages?.assetLibrary.map(i => i.fileUrl) || [])
  ])
  
  return (
    <AdminLayout currentBrandId={brandId}>
      <PageHeader 
        breadcrumbs={[
          { label: 'All Brands', href: '/' },
          { label: brand.name, href: `/brands/${brandId}` },
          { label: 'Assets' }
        ]} 
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {uniqueUrls.size} unique files
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Brand Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allImages?.brandImages.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Shared across SKUs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">SKU Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allImages?.skuImages.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Product-specific</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Asset Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allImages?.assetLibrary.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Reusable assets</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search by name, description, tags, or folder..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-lg"
            />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'date' | 'size')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="size">Largest First</SelectItem>
              </SelectContent>
            </Select>
            {search && (
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedAssets.length} result{filteredAndSortedAssets.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {selectedAssets.size > 0 && (
              <>
                <Badge variant="secondary">{selectedAssets.size} selected</Badge>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </>
            )}
            
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Assets
            </Button>
          </div>
        </div>
        
        {/* Asset Library Tab */}
        <Tabs defaultValue="library" className="w-full">
          <TabsList>
            <TabsTrigger value="library">
              Asset Library ({allImages?.assetLibrary.length || 0})
            </TabsTrigger>
            <TabsTrigger value="brand">
              Brand Images ({allImages?.brandImages.length || 0})
            </TabsTrigger>
            <TabsTrigger value="skus">
              SKU Images ({allImages?.skuImages.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="mt-6">
            {filteredAndSortedAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No assets found</p>
                <p className="text-sm text-muted-foreground">
                  {search ? 'Try adjusting your search' : 'Upload some assets to get started'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-5 gap-4">
                {filteredAndSortedAssets.map(asset => (
                  <div key={asset.id} className="group relative border rounded-lg overflow-hidden">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedAssets.has(asset.id)}
                        onCheckedChange={() => toggleAssetSelection(asset.id)}
                      />
                    </div>
                    <div 
                      className="aspect-square bg-muted flex items-center justify-center cursor-pointer"
                      onClick={() => setLightboxAsset(asset)}
                    >
                      <img
                        src={asset.thumbnailUrl || asset.fileUrl}
                        alt={asset.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="p-3 bg-background">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {asset.assetType}
                        </Badge>
                        {asset.folder && (
                          <Badge variant="outline" className="text-xs">
                            {asset.folder}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopyUrl(asset.fileUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(asset.fileUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteAsset(asset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedAssets.map(asset => (
                  <div key={asset.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedAssets.has(asset.id)}
                      onCheckedChange={() => toggleAssetSelection(asset.id)}
                    />
                    <div 
                      className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0 cursor-pointer"
                      onClick={() => setLightboxAsset(asset)}
                    >
                      <img
                        src={asset.thumbnailUrl || asset.fileUrl}
                        alt={asset.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{asset.name}</p>
                      {asset.description && (
                        <p className="text-sm text-muted-foreground truncate">{asset.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{asset.assetType}</Badge>
                        {asset.folder && <Badge variant="outline" className="text-xs">{asset.folder}</Badge>}
                        {asset.width && asset.height && (
                          <span className="text-xs text-muted-foreground">
                            {asset.width} × {asset.height}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyUrl(asset.fileUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(asset.fileUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="brand" className="mt-6">
            <div className="grid grid-cols-5 gap-4">
              {allImages?.brandImages.map((image, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={image.url}
                      alt={image.key}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-background">
                    <p className="text-sm font-medium truncate">{image.key}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleCopyUrl(image.url)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="skus" className="mt-6">
            <div className="space-y-6">
              {allImages && Object.entries(
                allImages.skuImages.reduce((acc, img) => {
                  if (!acc[img.skuId]) acc[img.skuId] = { skuName: img.skuName, images: [] }
                  acc[img.skuId].images.push(img)
                  return acc
                }, {} as Record<number, { skuName: string; images: typeof allImages.skuImages }>)
              ).map(([skuId, data]) => (
                <div key={skuId}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{data.skuName}</h3>
                    <Link href={`/brands/${brandId}/skus/${skuId}`}>
                      <Button variant="outline" size="sm">
                        View SKU
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {data.images.map((image, idx) => (
                      <div key={idx} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <img
                            src={image.url}
                            alt={image.key}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="p-2 bg-background">
                          <p className="text-xs font-medium truncate">{image.key}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Assets</DialogTitle>
            <DialogDescription>
              Upload images to your brand's asset library
            </DialogDescription>
          </DialogHeader>
          <DragDropZone
            onFilesSelected={handleUploadFiles}
            accept="image/*"
            maxFiles={20}
            maxSizeMB={10}
          />
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <ImageLightbox
        asset={lightboxAsset}
        open={!!lightboxAsset}
        onClose={() => setLightboxAsset(null)}
        onDelete={handleDeleteAsset}
        usageCount={0} // TODO: Track actual usage
      />
    </AdminLayout>
  )
}

