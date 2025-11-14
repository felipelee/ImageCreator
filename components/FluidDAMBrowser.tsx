'use client'

import { useState, useEffect } from 'react'
import { Search, Image as ImageIcon, Loader2, X, Scissors } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface FluidAsset {
  id: number
  code: string
  name: string
  url: string
  thumbnail_url?: string
  media_type?: string
  file_size?: number
  width?: number
  height?: number
}

interface FluidDAMBrowserProps {
  open: boolean
  onClose: () => void
  onSelect: (assetUrl: string) => void
  title?: string
  enableBackgroundRemoval?: boolean
}

export function FluidDAMBrowser({ open, onClose, onSelect, title = 'Select Image from Fluid DAM', enableBackgroundRemoval = true }: FluidDAMBrowserProps) {
  const [assets, setAssets] = useState<FluidAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [removingBg, setRemovingBg] = useState<number | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<FluidAsset | null>(null)

  useEffect(() => {
    if (open) {
      fetchAssets()
    }
  }, [open, page, search])

  async function fetchAssets() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '24',
      })
      
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/fluid-dam/assets?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }

      const data = await response.json()
      
      // Assuming the API returns { assets: [], total: number, page: number }
      // Adjust based on actual Fluid API response structure
      if (data.assets) {
        setAssets(data.assets)
        setHasMore(data.assets.length >= 24)
      } else if (Array.isArray(data)) {
        setAssets(data)
        setHasMore(data.length >= 24)
      }
    } catch (error) {
      console.error('Error fetching Fluid DAM assets:', error)
      alert('Failed to load assets from Fluid DAM')
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(asset: FluidAsset) {
    if (enableBackgroundRemoval) {
      setSelectedAsset(asset)
    } else {
      onSelect(asset.url)
      onClose()
    }
  }

  function handleUseAsIs() {
    if (selectedAsset) {
      onSelect(selectedAsset.url)
      setSelectedAsset(null)
      onClose()
    }
  }

  async function handleRemoveBackground() {
    if (!selectedAsset) return
    
    setRemovingBg(selectedAsset.id)
    try {
      // Import background removal library dynamically (it's large)
      const { removeBackground } = await import('@imgly/background-removal')
      
      // Fetch the image
      const response = await fetch(selectedAsset.url)
      const blob = await response.blob()
      
      // Remove background using AI
      const result = await removeBackground(blob, {
        output: {
          format: 'image/png',
          quality: 0.95,
        }
      })
      
      // Convert result to data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        onSelect(reader.result as string)
        setSelectedAsset(null)
        setRemovingBg(null)
        onClose()
      }
      reader.readAsDataURL(result as Blob)
    } catch (error) {
      console.error('Failed to remove background:', error)
      alert('Failed to remove background. The image will be used as-is.')
      onSelect(selectedAsset.url)
      setSelectedAsset(null)
      setRemovingBg(null)
      onClose()
    }
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            Browse and select images from your Fluid Digital Asset Manager
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Assets Grid */}
          <ScrollArea className="h-[500px] pr-4">
            {loading && assets.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No assets found</p>
                <p className="text-sm text-muted-foreground">
                  {search ? 'Try a different search term' : 'Your Fluid DAM is empty'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleSelect(asset)}
                    className="group relative aspect-square rounded-lg border-2 border-border hover:border-primary overflow-hidden transition-all"
                  >
                    {asset.thumbnail_url || asset.url ? (
                      <img
                        src={asset.thumbnail_url || asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium px-2 text-center">
                        {asset.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Pagination */}
          {assets.length > 0 && (
            <div className="flex items-center justify-between border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Background Removal Confirmation */}
        {selectedAsset && enableBackgroundRemoval && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <img
                src={selectedAsset.thumbnail_url || selectedAsset.url}
                alt={selectedAsset.name}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold mb-2">{selectedAsset.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Do you want to remove the background from this image using AI?
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRemoveBackground}
                    disabled={removingBg !== null}
                    className="flex-1"
                  >
                    {removingBg === selectedAsset.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Removing Background...
                      </>
                    ) : (
                      <>
                        <Scissors className="mr-2 h-4 w-4" />
                        Remove Background
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleUseAsIs}
                    disabled={removingBg !== null}
                    className="flex-1"
                  >
                    Use As-Is
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedAsset(null)}
              className="w-full"
              disabled={removingBg !== null}
            >
              Choose Different Image
            </Button>
          </div>
        )}

        {!selectedAsset && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}

