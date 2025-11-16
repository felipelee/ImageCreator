'use client'

import { X, Download, Copy, ExternalLink, Trash2, Calendar, HardDrive, Maximize2 } from 'lucide-react'
import { BrandAsset } from '@/types/brand-asset'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface ImageLightboxProps {
  asset: BrandAsset | null
  open: boolean
  onClose: () => void
  onDelete?: (assetId: number) => void
  usageCount?: number
}

export function ImageLightbox({ asset, open, onClose, onDelete, usageCount = 0 }: ImageLightboxProps) {
  if (!asset) return null

  function handleCopyUrl() {
    navigator.clipboard.writeText(asset.fileUrl)
    toast.success('URL copied to clipboard')
  }

  function handleDownload() {
    const link = document.createElement('a')
    link.href = asset.fileUrl
    link.download = asset.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Download started')
  }

  function handleDelete() {
    if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      onDelete?.(asset.id)
      onClose()
    }
  }

  const formattedDate = new Date(asset.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const fileSizeKB = asset.fileSize ? (asset.fileSize / 1024).toFixed(1) : '?'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* Image Preview - Left Side */}
          <div className="flex-1 bg-muted flex items-center justify-center relative">
            <img
              src={asset.fileUrl}
              alt={asset.name}
              className="max-w-full max-h-full object-contain p-8"
            />
            
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4">
              <Button variant="secondary" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          {/* Metadata Sidebar - Right Side */}
          <div className="w-96 bg-background border-l flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-2 break-words">{asset.name}</h2>
              {asset.description && (
                <p className="text-sm text-muted-foreground">{asset.description}</p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex-1 p-6 space-y-6 overflow-auto">
              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-sm font-medium mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="justify-start"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(asset.fileUrl, '_blank')}
                    className="justify-start"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="justify-start text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              {/* Type & Folder */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Organization</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{asset.assetType}</Badge>
                  {asset.folder && <Badge variant="outline">{asset.folder}</Badge>}
                </div>
              </div>

              {/* Tags */}
              {asset.tags && asset.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="space-y-3">
                <p className="text-sm font-medium">File Information</p>
                
                {asset.width && asset.height && (
                  <div className="flex items-start gap-2 text-sm">
                    <Maximize2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Dimensions</p>
                      <p className="text-muted-foreground">{asset.width} × {asset.height} px</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">File Size</p>
                    <p className="text-muted-foreground">{fileSizeKB} KB</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Uploaded</p>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>

                {asset.mimeType && (
                  <div className="text-sm">
                    <p className="font-medium">Type</p>
                    <p className="text-muted-foreground">{asset.mimeType}</p>
                  </div>
                )}
              </div>

              {/* Usage */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Usage</p>
                <p className="text-sm text-muted-foreground">
                  Used in {usageCount} SKU{usageCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

