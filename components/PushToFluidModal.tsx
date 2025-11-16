'use client'

import { useState } from 'react'
import { Upload, Loader2, Check, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export interface LayoutOption {
  id: string
  name: string
  displayName: string
  ref: React.RefObject<HTMLDivElement | null>
  previewUrl?: string
}

export type FluidDestination = 'product_images' | 'company_media' | 'both'

interface PushToFluidModalProps {
  open: boolean
  onClose: () => void
  layouts: LayoutOption[]
  onPush: (selectedLayoutIds: string[]) => void
  isPushing: boolean
  isGeneratingPreviews?: boolean
  destination: FluidDestination
}

export function PushToFluidModal({ 
  open, 
  onClose, 
  layouts, 
  onPush,
  isPushing,
  isGeneratingPreviews = false,
  destination
}: PushToFluidModalProps) {
  const [selectedLayouts, setSelectedLayouts] = useState<Set<string>>(
    new Set(layouts.map(l => l.id)) // All selected by default
  )

  const toggleLayout = (layoutId: string) => {
    const newSelected = new Set(selectedLayouts)
    if (newSelected.has(layoutId)) {
      newSelected.delete(layoutId)
    } else {
      newSelected.add(layoutId)
    }
    setSelectedLayouts(newSelected)
  }

  const selectAll = () => {
    setSelectedLayouts(new Set(layouts.map(l => l.id)))
  }

  const deselectAll = () => {
    setSelectedLayouts(new Set())
  }

  const handlePush = () => {
    onPush(Array.from(selectedLayouts))
  }

  const selectedCount = selectedLayouts.size
  
  // Get display text for destination
  const getDestinationText = () => {
    switch (destination) {
      case 'product_images':
        return 'Product Images'
      case 'company_media':
        return 'Media Library'
      case 'both':
        return 'Product Images & Media Library'
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isPushing && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Push Layouts to Fluid
            {isGeneratingPreviews && (
              <Badge variant="secondary" className="ml-2">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Generating Previews
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isGeneratingPreviews 
              ? 'Generating layout previews... This may take a moment.'
              : `Select which layouts you want to upload to ${getDestinationText()}`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Quick Actions */}
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex gap-2">
            <Button
              onClick={selectAll}
              variant="outline"
              size="sm"
              disabled={isPushing}
            >
              Select All
            </Button>
            <Button
              onClick={deselectAll}
              variant="outline"
              size="sm"
              disabled={isPushing}
            >
              Deselect All
            </Button>
          </div>
          <Badge variant="secondary" className="text-sm">
            {selectedCount} of {layouts.length} selected
          </Badge>
        </div>

        {/* Layouts Grid */}
        <div className="flex-1 -mx-6 px-6 min-h-0">
          <ScrollArea className="h-full max-h-[500px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 pb-6 px-6">
              {layouts.map((layout) => {
              const isSelected = selectedLayouts.has(layout.id)
              
              return (
                <div
                  key={layout.id}
                  onClick={() => !isPushing && toggleLayout(layout.id)}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-2 bg-primary/5'
                      : 'border-border hover:border-primary/50 bg-card'
                  } ${isPushing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Preview */}
                  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden flex items-center justify-center">
                    {layout.previewUrl ? (
                      <img 
                        src={layout.previewUrl} 
                        alt={layout.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : isGeneratingPreviews ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">Generating preview...</p>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-muted to-muted-foreground/10">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg mb-2 mx-auto" />
                          <div className="text-xs text-muted-foreground font-medium">
                            {layout.displayName}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all shadow-lg ${
                      isSelected 
                        ? 'bg-white dark:bg-white border-primary scale-110' 
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-primary/50 group-hover:scale-105'
                    }`}>
                      {isSelected && (
                        <Check className="h-5 w-5 text-primary font-bold stroke-[3]" />
                      )}
                    </div>
                  </div>

                  {/* Layout Info */}
                  <div className="p-3 border-t">
                    <h4 className="text-sm font-semibold truncate">
                      {layout.displayName}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {layout.name}.png
                    </p>
                  </div>
                </div>
              )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedCount === 0 ? (
              'No layouts selected'
            ) : selectedCount === layouts.length ? (
              `All ${layouts.length} layouts will be uploaded`
            ) : (
              `${selectedCount} layout${selectedCount > 1 ? 's' : ''} will be uploaded`
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPushing}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handlePush}
              disabled={selectedCount === 0 || isPushing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPushing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading {selectedCount}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Push {selectedCount} to {getDestinationText()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

