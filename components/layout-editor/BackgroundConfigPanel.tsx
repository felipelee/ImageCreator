'use client'

import { Brand } from '@/types/brand'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Palette, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackgroundConfigPanelProps {
  brand: Brand
  currentColorKey?: string
  currentImageKey?: string
  onChangeColor: (colorKey: string) => void
  onChangeImage: (imageKey: string | undefined) => void
}

export function BackgroundConfigPanel({
  brand,
  currentColorKey = 'bg',
  currentImageKey,
  onChangeColor,
  onChangeImage
}: BackgroundConfigPanelProps) {
  const hasImage = !!currentImageKey

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Background Settings
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Configure background color or image from brand assets
        </p>
      </div>

      {/* Background Type Toggle */}
      <div className="space-y-2">
        <Label className="text-xs">Background Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!hasImage ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => onChangeImage(undefined)}
          >
            <Palette className="h-3 w-3 mr-1" />
            Solid Color
          </Button>
          <Button
            variant={hasImage ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              // Auto-select first available brand image
              const firstImage = Object.keys(brand.images).find(key => brand.images[key as keyof typeof brand.images])
              if (firstImage) {
                onChangeImage(firstImage)
              }
            }}
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            Image
          </Button>
        </div>
      </div>

      <Separator />

      {/* Color Picker (for solid backgrounds) */}
      {!hasImage && (
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Background Color
          </Label>
          <Select
            value={currentColorKey}
            onValueChange={onChangeColor}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(brand.colors).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: value }} />
                    <div>
                      <div className="font-medium">{key}</div>
                      <div className="text-[10px] text-muted-foreground">{value}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Preview */}
          <div className="border rounded p-4 mt-2" style={{ backgroundColor: brand.colors[currentColorKey as keyof typeof brand.colors] }}>
            <p className="text-xs text-center" style={{ 
              color: currentColorKey.includes('bg') ? brand.colors.text : brand.colors.bg 
            }}>
              Preview
            </p>
          </div>
        </div>
      )}

      {/* Image Picker (for image backgrounds) */}
      {hasImage && (
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            Background Image
          </Label>
          <Select
            value={currentImageKey || 'none'}
            onValueChange={(value) => onChangeImage(value === 'none' ? undefined : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select image..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">No image</SelectItem>
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground border-t mt-1">
                BRAND IMAGES
              </div>
              {Object.entries(brand.images).filter(([_, value]) => value).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-xs">
                  <div className="flex items-center gap-2">
                    <img src={value} alt={key} className="w-10 h-10 object-cover rounded border" />
                    <span>{key}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preview */}
          {currentImageKey && brand.images[currentImageKey as keyof typeof brand.images] && (
            <div className="border rounded p-2 bg-card mt-2">
              <img
                src={brand.images[currentImageKey as keyof typeof brand.images]}
                alt="Background preview"
                className="w-full h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3">
        <p className="font-medium mb-1">💡 Theme Powered</p>
        <p>All colors and images come from your brand settings, keeping designs consistent.</p>
      </div>
    </div>
  )
}

