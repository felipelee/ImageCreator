'use client'

import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { CustomElement } from '@/types/custom-element'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Image as ImageIcon, Palette, Type as TypeIcon, Dumbbell, Battery, HeartPulse, Zap, Brain, Shield, Leaf, Target, Activity } from 'lucide-react'

interface ElementConfigPanelProps {
  element: CustomElement
  brand: Brand
  sku: SKU
  onUpdateElement: (updates: Partial<CustomElement>) => void
}

export function ElementConfigPanel({
  element,
  brand,
  sku,
  onUpdateElement
}: ElementConfigPanelProps) {
  const handleContentChange = (key: string, value: any) => {
    onUpdateElement({
      content: {
        ...element.content,
        [key]: value
      }
    })
  }

  const handleStyleChange = (key: string, value: any) => {
    onUpdateElement({
      style: {
        ...element.style,
        [key]: value
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Element Configuration
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Configure content and styling for this element
        </p>
      </div>

      {/* Element Name */}
      <div className="space-y-2">
        <Label className="text-xs">Label</Label>
        <Input
          value={element.label}
          onChange={(e) => onUpdateElement({ label: e.target.value })}
          className="text-xs h-8"
          placeholder="Element name"
        />
      </div>

      <Separator />

      {/* Text Content (for text/badge elements) */}
      {(element.type === 'text' || element.type === 'badge') && (
        <div className="space-y-2">
          <Label className="text-xs flex items-center gap-1">
            <TypeIcon className="h-3 w-3" />
            Text Content
          </Label>
          <Textarea
            value={element.content.text || ''}
            onChange={(e) => handleContentChange('text', e.target.value)}
            className="text-xs resize-none"
            rows={element.type === 'text' ? 3 : 2}
            placeholder="Enter text..."
          />
        </div>
      )}

      {/* Image Source (for image elements) */}
      {element.type === 'image' && (
        <div className="space-y-3">
          <Label className="text-xs flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            Image Source
          </Label>
          
          {element.content.imageKey ? (
            <div className="space-y-2">
              <div className="border rounded p-2 bg-card">
                <img
                  src={sku.images[element.content.imageKey as keyof typeof sku.images] || brand?.images[element.content.imageKey as keyof typeof brand.images]}
                  alt="Preview"
                  className="w-full h-32 object-contain mb-2"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {element.content.imageKey}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => handleContentChange('imageKey', undefined)}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Select
                value="choose"
                onValueChange={(value) => {
                  if (value !== 'choose' && value !== 'upload') {
                    handleContentChange('imageKey', value)
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select existing image..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="choose" className="text-xs text-muted-foreground" disabled>
                    Choose from existing images...
                  </SelectItem>
                  
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground border-t mt-1">
                    PRODUCT IMAGES
                  </div>
                  {Object.entries(sku.images).filter(([_, value]) => value).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      <div className="flex items-center gap-2">
                        <img src={value} alt={key} className="w-8 h-8 object-contain rounded border" />
                        <span>{key}</span>
                      </div>
                    </SelectItem>
                  ))}
                  
                  {brand && Object.entries(brand.images).filter(([_, value]) => value).length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground border-t mt-1">
                        BRAND IMAGES
                      </div>
                      {Object.entries(brand.images).filter(([_, value]) => value).map(([key, value]) => (
                        <SelectItem key={key} value={key} className="text-xs">
                          <div className="flex items-center gap-2">
                            <img src={value} alt={key} className="w-8 h-8 object-contain rounded border" />
                            <span>{key}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-muted/20 px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3">
                <p className="font-medium mb-1">💡 Upload New Image Resource</p>
                <p>Go to the <strong>Images tab</strong> to upload a new image for this element. It will appear in "Custom Image Elements".</p>
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Colors</Label>
        
        {(element.type === 'text' || element.type === 'badge') && (
          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <Select
              value={element.style.textColor || 'primary'}
              onValueChange={(value) => handleStyleChange('textColor', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(brand.colors).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: value }} />
                      <span>{key}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(element.type === 'badge' || element.type === 'shape') && (
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <Select
              value={element.style.backgroundColor || 'primarySoft'}
              onValueChange={(value) => handleStyleChange('backgroundColor', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(brand.colors).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: value }} />
                      <span>{key}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Styling Options */}
      {(element.type === 'text' || element.type === 'badge') && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Typography</Label>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Font Size</Label>
                <Input
                  type="number"
                  value={element.style.fontSize || 22}
                  onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={String(element.style.fontWeight || 700)}
                  onValueChange={(value) => handleStyleChange('fontWeight', parseInt(value))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="400">Regular</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semibold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                    <SelectItem value="800">Extrabold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}

      {element.type === 'badge' && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Badge Style</Label>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Padding</Label>
                <Input
                  type="number"
                  value={element.style.padding || 14}
                  onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Border Radius</Label>
                <Input
                  type="number"
                  value={element.style.borderRadius || 28}
                  onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Options */}
      {element.type === 'image' && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs">Object Fit</Label>
            <Select
              value={element.style.objectFit || 'contain'}
              onValueChange={(value) => handleStyleChange('objectFit', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}

