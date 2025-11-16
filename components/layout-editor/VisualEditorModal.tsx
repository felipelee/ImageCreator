'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Save, X, Eye, Grid3x3, Undo2, Redo2, Code } from 'lucide-react'
import { toast } from 'sonner'
import { useUndoRedo } from '@/hooks/use-undo-redo'
import { ElementToolbar } from './ElementToolbar'
import { LayersPanel } from './LayersPanel'
import { SelectionOverlay } from './SelectionOverlay'
import { AddElementMenu } from './AddElementMenu'
import { ElementConfigPanel } from './ElementConfigPanel'
import { BackgroundConfigPanel } from './BackgroundConfigPanel'
import { BenefitIconPicker } from './BenefitIconPicker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CustomElementType, CustomElement as CustomElementDef } from '@/types/custom-element'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'

interface LayerItem {
  key: string
  label: string
  type: 'text' | 'image' | 'container' | 'background'
  hasOverride?: boolean
  visible?: boolean
  locked?: boolean
}

interface VisualEditorModalProps {
  open: boolean
  onClose: () => void
  layoutKey: string
  layoutName: string
  layers: LayerItem[]
  children: React.ReactNode
  selectedElement: string | null
  onSelectElement: (elementKey: string | null) => void
  positionOverrides?: any
  customElements?: any[]
  brand: Brand
  sku: SKU
  backgroundColorKey?: string
  backgroundImageKey?: string
  onPositionChange: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange: (elementKey: string, rotation: number) => void
  onUpdateCustomElement?: (elementId: string, updates: Partial<CustomElementDef>) => void
  onDeleteCustomElement?: (elementId: string) => void
  onChangeBackgroundColor?: (colorKey: string) => void
  onChangeBackgroundImage?: (imageKey: string | undefined) => void
  onLayerReorder?: (newOrder: LayerItem[]) => void
  onAddElement?: (type: CustomElementType) => void
  onBenefitIconChange?: (benefitKey: string, icon: string) => void
  onSave: () => void
  onCancel: () => void
  hasChanges: boolean
}

export function VisualEditorModal({
  open,
  onClose,
  layoutKey,
  layoutName,
  layers,
  children,
  selectedElement,
  onSelectElement,
  positionOverrides,
  customElements = [],
  brand,
  sku,
  backgroundColorKey = 'bg',
  backgroundImageKey,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onUpdateCustomElement,
  onDeleteCustomElement,
  onChangeBackgroundColor,
  onChangeBackgroundImage,
  onLayerReorder,
  onAddElement,
  onBenefitIconChange,
  onSave,
  onCancel,
  hasChanges
}: VisualEditorModalProps) {
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [gridSize] = useState(5)
  const [activeTab, setActiveTab] = useState<'layers' | 'properties'>('layers')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0 })
  const [layerOrder, setLayerOrder] = useState<LayerItem[]>(layers)
  const scale = 0.72
  
  // Track state changes for undo/redo
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])
  const [lastSavedState, setLastSavedState] = useState<any>(null)
  
  const canUndo = undoStack.length > 0
  const canRedo = redoStack.length > 0
  
  // Save current state to undo stack
  const saveToHistory = () => {
    const currentState = {
      positionOverrides: positionOverrides?.[layoutKey] || {},
      customElements: customElements || []
    }
    
    setUndoStack(prev => [...prev.slice(-49), currentState]) // Keep last 50
    setRedoStack([]) // Clear redo stack on new action
    setLastSavedState(currentState)
  }
  
  // Undo function
  const performUndo = () => {
    if (!canUndo) return
    
    const currentState = {
      positionOverrides: positionOverrides?.[layoutKey] || {},
      customElements: customElements || []
    }
    
    const previousState = undoStack[undoStack.length - 1]
    
    // Move current to redo stack
    setRedoStack(prev => [...prev, currentState])
    setUndoStack(prev => prev.slice(0, -1))
    
    // Apply previous state
    console.log('[Undo] Restoring state:', previousState)
    // Note: This needs parent component to restore the state
    // For now, we'll just log - full implementation needs state restoration callback
  }
  
  // Redo function
  const performRedo = () => {
    if (!canRedo) return
    
    const currentState = {
      positionOverrides: positionOverrides?.[layoutKey] || {},
      customElements: customElements || []
    }
    
    const nextState = redoStack[redoStack.length - 1]
    
    // Move current to undo stack
    setUndoStack(prev => [...prev, currentState])
    setRedoStack(prev => prev.slice(0, -1))
    
    // Apply next state
    console.log('[Redo] Restoring state:', nextState)
    // Note: This needs parent component to restore the state
  }
  
  // Update layer order when layers prop changes
  useEffect(() => {
    setLayerOrder(layers)
  }, [layers])
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z or Ctrl+Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        performUndo()
      }
      
      // Cmd+Shift+Z or Ctrl+Y = Redo
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || ((e.ctrlKey) && e.key === 'y')) {
        e.preventDefault()
        performRedo()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, canUndo, canRedo, performUndo, performRedo])

  // Keyboard shortcuts for nudging
  useEffect(() => {
    if (!open || !selectedElement) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElement) return
      
      const currentPos = positionOverrides?.[layoutKey]?.[selectedElement]
      if (!currentPos) return
      
      const step = e.shiftKey ? 10 : 1
      let newX = currentPos.x || 0
      let newY = currentPos.y || 0
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          newX -= step
          break
        case 'ArrowRight':
          e.preventDefault()
          newX += step
          break
        case 'ArrowUp':
          e.preventDefault()
          newY -= step
          break
        case 'ArrowDown':
          e.preventDefault()
          newY += step
          break
        default:
          return
      }
      
      // Constrain to canvas
      newX = Math.max(0, Math.min(1080, newX))
      newY = Math.max(0, Math.min(1080, newY))
      
      onPositionChange(selectedElement, { x: newX, y: newY })
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedElement, positionOverrides, layoutKey, onPositionChange])

  // Handle drag start
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Don't start drag if clicking on handles
    if (target.closest('.resize-handle') || target.closest('.rotation-handle')) {
      return
    }
    
    // Look up the DOM tree to find element with data-element-key
    let elementKey = target.getAttribute('data-element-key')
    if (!elementKey) {
      const editableParent = target.closest('[data-element-key]') as HTMLElement
      if (editableParent) {
        elementKey = editableParent.getAttribute('data-element-key')
      }
    }
    
    if (elementKey && selectedElement === elementKey) {
      e.preventDefault()
      console.log('[Drag] Starting drag for:', elementKey)
      setIsDragging(true)
      const currentPos = positionOverrides?.[layoutKey]?.[elementKey]
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elemX: currentPos?.x || 0,
        elemY: currentPos?.y || 0
      })
    }
  }

  // Handle drag move
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    const scaledDeltaX = deltaX / scale
    const scaledDeltaY = e.shiftKey ? 0 : deltaY / scale // Shift locks Y axis
    
    let newX = dragStart.elemX + scaledDeltaX
    let newY = dragStart.elemY + scaledDeltaY
    
    // Snap to grid
    if (snapEnabled && !e.altKey) {
      newX = Math.round(newX / gridSize) * gridSize
      newY = Math.round(newY / gridSize) * gridSize
    }
    
    // Constrain to canvas
    newX = Math.max(0, Math.min(1080, newX))
    newY = Math.max(0, Math.min(1080, newY))
    
    onPositionChange(selectedElement, { x: Math.round(newX), y: Math.round(newY) })
  }

  // Handle drag end - save to history
  const handleCanvasMouseUp = () => {
    if (isDragging) {
      // Push current state to undo history
      saveToHistory()
    }
    setIsDragging(false)
  }

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Discard them?')) {
        onCancel()
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0 gap-0">
        <DialogTitle className="sr-only">{layoutName} - Visual Editor</DialogTitle>
        <DialogDescription className="sr-only">
          Visual editor for adjusting element positions, sizes, and rotation
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <h2 className="text-lg font-semibold">{layoutName}</h2>
              <p className="text-xs text-muted-foreground">
                Visual Editor • Click elements to select, drag to move, use handles to resize
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={performUndo}
              disabled={!canUndo}
              className="h-8"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={performRedo}
              disabled={!canRedo}
              className="h-8"
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button
              variant={snapEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setSnapEnabled(!snapEnabled)}
              className="h-8"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Snap ({gridSize}px)
            </Button>
            {onAddElement && (
              <>
                <div className="h-4 w-px bg-border" />
                <AddElementMenu onAddElement={onAddElement} />
              </>
            )}
            <div className="h-4 w-px bg-border" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export current positions as JSON
                const positionsData = {
                  layoutKey,
                  positionOverrides: positionOverrides?.[layoutKey] || {},
                  customElements: customElements || []
                }
                
                const json = JSON.stringify(positionsData, null, 2)
                
                // Copy to clipboard
                navigator.clipboard.writeText(json).then(() => {
                  toast.success('Positions copied to clipboard!', {
                    description: 'Paste this JSON to share exact element positions'
                  })
                })
                
                // Also log to console for easy viewing
                console.log('=== LAYOUT POSITIONS JSON ===')
                console.log(json)
                console.log('============================')
              }}
              className="h-8"
              title="Export positions as JSON"
            >
              <Code className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            {hasChanges && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onCancel()
                    onClose()
                  }}
                  className="h-8"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onSave()
                    onClose()
                  }}
                  className="h-8"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & Close
                </Button>
              </>
            )}
            {!hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="h-8"
              >
                <Eye className="h-4 w-4 mr-2" />
                Done
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(95vh-73px)] overflow-hidden">
          {/* Left Sidebar - Layers & Controls */}
          <div className="w-[340px] border-r bg-muted/20 overflow-auto">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'layers' | 'properties')} className="h-full">
              <div className="p-4 border-b bg-background sticky top-0 z-10">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
                  <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="layers" className="p-4 m-0">
                <LayersPanel
                  layers={layerOrder}
                  selectedElement={selectedElement}
                  onSelectElement={onSelectElement}
                  onReorder={(newOrder) => {
                    setLayerOrder(newOrder)
                    if (onLayerReorder) {
                      onLayerReorder(newOrder)
                    }
                  }}
                  onDeleteLayer={(elementKey) => {
                    if (elementKey.startsWith('custom-') && onDeleteCustomElement) {
                      // Remove from layer order
                      setLayerOrder(prev => prev.filter(l => l.key !== elementKey))
                      // Deselect if this was selected
                      if (selectedElement === elementKey) {
                        onSelectElement(null)
                      }
                      // Delete from parent SKU state
                      onDeleteCustomElement(elementKey)
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="properties" className="p-4 m-0">
                {selectedElement ? (
                  <div className="space-y-3">
                    <ElementToolbar
                      elementKey={selectedElement}
                      elementLabel={layers.find(l => l.key === selectedElement)?.label || selectedElement}
                      position={{
                        x: positionOverrides?.[layoutKey]?.[selectedElement]?.x || 0,
                        y: positionOverrides?.[layoutKey]?.[selectedElement]?.y || 0
                      }}
                      size={positionOverrides?.[layoutKey]?.[selectedElement]?.width ? {
                        width: positionOverrides[layoutKey][selectedElement].width || 0,
                        height: positionOverrides[layoutKey][selectedElement].height || 0
                      } : undefined}
                      rotation={positionOverrides?.[layoutKey]?.[selectedElement]?.rotation || 0}
                      snapEnabled={snapEnabled}
                      gridSize={gridSize}
                      hasOverride={!!positionOverrides?.[layoutKey]?.[selectedElement]}
                      onPositionChange={(pos) => onPositionChange(selectedElement, pos)}
                      onSizeChange={(size) => onSizeChange(selectedElement, size)}
                      onRotationChange={(rot) => onRotationChange(selectedElement, rot)}
                      onSnapToggle={() => setSnapEnabled(!snapEnabled)}
                      onReset={() => {
                        // Reset handled by parent
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Eye className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-2">No Element Selected</p>
                    <p className="text-xs text-muted-foreground">
                      Select an element from the Layers panel or click on the canvas.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 bg-muted/10 overflow-auto">
            <div 
              className="relative"
              style={{
                cursor: isDragging ? 'grabbing' : 'default',
                userSelect: 'none',
                position: 'relative'
              }}
            >
              <div
                onClick={() => onSelectElement(null)}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                style={{
                  position: 'relative'
                }}
              >
                {children}
              </div>
              
              {/* Selection Overlay with Handles - Inside scaled container */}
              {selectedElement && (() => {
                // Check if it's a custom element
                const isCustom = selectedElement.startsWith('custom-')
                let elementData: any = null
                
                if (isCustom) {
                  // Get from custom elements array passed as prop
                  elementData = customElements.find((el: any) => el.id === selectedElement)
                  console.log('[SelectionOverlay] Custom element data:', elementData)
                } else {
                  // Get from position overrides
                  elementData = positionOverrides?.[layoutKey]?.[selectedElement]
                }
                
                // Always try to get actual DOM element for accurate positioning
                const element = document.querySelector(`[data-element-key="${selectedElement}"]`)
                
                if (!elementData && !element) {
                  return null
                }
                
                // Use DOM rect for accurate position (accounts for transforms)
                if (element && elementData) {
                  const rect = element.getBoundingClientRect()
                  
                  // Use override data for position (what user set)
                  // Use DOM rect for size (actual rendered size)
                  const computedWidth = rect.width / scale
                  const computedHeight = rect.height / scale
                  
                  return (
                    <SelectionOverlay
                      elementKey={selectedElement}
                      position={{
                        x: elementData.x || 0,
                        y: elementData.y || 0
                      }}
                      size={{
                        width: elementData.width || computedWidth,
                        height: elementData.height || computedHeight
                      }}
                      rotation={elementData.rotation || 0}
                      scale={scale}
                      onPositionChange={(pos) => onPositionChange(selectedElement, pos)}
                      onSizeChange={(size) => onSizeChange(selectedElement, size)}
                      onRotationChange={(rot) => onRotationChange(selectedElement, rot)}
                    />
                  )
                }
                
                // Fallback to position override data
                return (
                  <SelectionOverlay
                    elementKey={selectedElement}
                    position={{
                      x: elementData.x || 0,
                      y: elementData.y || 0
                    }}
                    size={{
                      width: elementData.width || 100,
                      height: elementData.height || 100
                    }}
                    rotation={elementData.rotation || 0}
                    scale={scale}
                    onPositionChange={(pos) => onPositionChange(selectedElement, pos)}
                    onSizeChange={(size) => onSizeChange(selectedElement, size)}
                    onRotationChange={(rot) => onRotationChange(selectedElement, rot)}
                  />
                )
              })()}
              
              {/* Grid Overlay */}
              {snapEnabled && (
                <div
                  className="pointer-events-none absolute inset-0 editor-grid"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar - Config or Instructions */}
          <div className="w-[300px] border-l bg-muted/20 p-4 overflow-auto">
            {selectedElement ? (
              selectedElement.startsWith('custom-') && customElements.find((el: any) => el.id === selectedElement) ? (
                <ElementConfigPanel
                  element={customElements.find((el: any) => el.id === selectedElement)!}
                  brand={brand}
                  sku={sku}
                  onUpdateElement={(updates) => {
                    if (onUpdateCustomElement) {
                      onUpdateCustomElement(selectedElement, updates)
                    }
                  }}
                />
              ) : selectedElement === 'background' && onChangeBackgroundColor && onChangeBackgroundImage ? (
                <BackgroundConfigPanel
                  brand={brand}
                  currentColorKey={backgroundColorKey}
                  currentImageKey={backgroundImageKey}
                  onChangeColor={onChangeBackgroundColor}
                  onChangeImage={onChangeBackgroundImage}
                />
              ) : layoutKey === 'bottleList' && selectedElement?.startsWith('benefit') && onBenefitIconChange ? (
                <BenefitIconPicker
                  currentIcon={
                    selectedElement === 'benefit1' ? (sku.copy.bottle?.benefit1_icon || 'dumbbell') :
                    selectedElement === 'benefit2' ? (sku.copy.bottle?.benefit2_icon || 'battery') :
                    (sku.copy.bottle?.benefit3_icon || 'heart-pulse')
                  }
                  benefitNumber={parseInt(selectedElement.replace('benefit', ''))}
                  onIconChange={(icon) => onBenefitIconChange(selectedElement, icon)}
                />
              ) : (
                <div className="space-y-3">
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm">Element Properties</h3>
                    <p className="text-xs text-muted-foreground">
                      {layers.find(l => l.key === selectedElement)?.label}
                    </p>
                  </div>
                  <ElementToolbar
                    elementKey={selectedElement}
                    elementLabel={layers.find(l => l.key === selectedElement)?.label || selectedElement}
                    position={{
                      x: positionOverrides?.[layoutKey]?.[selectedElement]?.x || 0,
                      y: positionOverrides?.[layoutKey]?.[selectedElement]?.y || 0
                    }}
                    size={positionOverrides?.[layoutKey]?.[selectedElement]?.width ? {
                      width: positionOverrides[layoutKey][selectedElement].width || 0,
                      height: positionOverrides[layoutKey][selectedElement].height || 0
                    } : undefined}
                    rotation={positionOverrides?.[layoutKey]?.[selectedElement]?.rotation || 0}
                    snapEnabled={snapEnabled}
                    gridSize={gridSize}
                    hasOverride={!!positionOverrides?.[layoutKey]?.[selectedElement]}
                    onPositionChange={(pos) => onPositionChange(selectedElement, pos)}
                    onSizeChange={(size) => onSizeChange(selectedElement, size)}
                    onRotationChange={(rot) => onRotationChange(selectedElement, rot)}
                    onSnapToggle={() => setSnapEnabled(!snapEnabled)}
                    onReset={() => {
                      // Reset handled by parent
                    }}
                  />
                </div>
              )
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Visual Editor</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Adjust element positions, sizes, and rotation for this specific SKU.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold mb-1">Selection</h4>
                    <p className="text-muted-foreground">Click any element to select it</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Moving</h4>
                    <p className="text-muted-foreground">• Drag selected element</p>
                    <p className="text-muted-foreground">• Hold Shift to lock axis</p>
                    <p className="text-muted-foreground">• Arrow keys for 1px nudge</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Resizing</h4>
                    <p className="text-muted-foreground">• Drag blue circle handles</p>
                    <p className="text-muted-foreground">• Hold Shift for aspect ratio</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Rotation</h4>
                    <p className="text-muted-foreground">• Drag purple circle at top</p>
                    <p className="text-muted-foreground">• Or use rotation input</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Grid</h4>
                    <p className="text-muted-foreground">• Snap-to-grid: {gridSize}px</p>
                    <p className="text-muted-foreground">• Hold Alt to disable snap</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {hasChanges ? '● Unsaved Changes' : '✓ All Saved'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

