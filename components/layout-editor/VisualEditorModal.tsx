'use client'

import React, { useState, useEffect } from 'react'
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
import { AlignmentToolbar } from './AlignmentToolbar'
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
  onRestoreState?: (state: { positionOverrides: any; customElements: any[] }) => void
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
  onRestoreState,
  onSave,
  onCancel,
  hasChanges
}: VisualEditorModalProps) {
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [gridSize] = useState(5)
  const [activeTab, setActiveTab] = useState<'layers' | 'properties'>('layers')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0, elements: [] as string[] })
  const [layerOrder, setLayerOrder] = useState<LayerItem[]>(layers)
  const [selectedElements, setSelectedElements] = useState<string[]>(selectedElement ? [selectedElement] : [])
  const scale = 0.72
  const isUndoRedoOperation = React.useRef(false)
  
  // Undo/Redo using the hook
  const {
    state: editorState,
    pushState,
    undo: undoHook,
    redo: redoHook,
    canUndo,
    canRedo
  } = useUndoRedo(
    {
      positionOverrides: positionOverrides?.[layoutKey] || {},
      customElements: customElements || []
    },
    {
      maxHistory: 50,
      onStateChange: (state) => {
        // Only restore state if we're in an undo/redo operation
        if (isUndoRedoOperation.current && onRestoreState) {
          console.log('[Undo/Redo] Restoring state:', state)
          onRestoreState({
            positionOverrides: { [layoutKey]: state.positionOverrides },
            customElements: state.customElements
          })
          isUndoRedoOperation.current = false
        }
      }
    }
  )
  
  // Wrap undo/redo to mark as undo/redo operations
  const undo = () => {
    isUndoRedoOperation.current = true
    undoHook()
  }
  
  const redo = () => {
    isUndoRedoOperation.current = true
    redoHook()
  }
  
  // Save to history helper
  const saveToHistory = () => {
    pushState({
      positionOverrides: positionOverrides?.[layoutKey] || {},
      customElements: customElements || []
    })
  }
  
  // Update layer order when layers prop changes
  useEffect(() => {
    setLayerOrder(layers)
  }, [layers])
  
  // Sync selectedElements with selectedElement prop ONLY when not in multi-select mode
  // Use a ref to track if we initiated the change to avoid circular updates
  const isInternalUpdate = React.useRef(false)
  
  useEffect(() => {
    // Don't override if we already have multiple selections or if we initiated the change
    if (selectedElements.length > 1 || isInternalUpdate.current) {
      isInternalUpdate.current = false
      return
    }
    
    if (selectedElement) {
      setSelectedElements([selectedElement])
    } else {
      setSelectedElements([])
    }
  }, [selectedElement, selectedElements.length])
  
  // Multi-select handler
  const handleElementSelect = (elementKey: string | null, shiftKey: boolean = false) => {
    // Mark this as an internal update
    isInternalUpdate.current = true
    
    if (!elementKey) {
      // Clear selection
      setSelectedElements([])
      onSelectElement(null)
      return
    }
    
    if (shiftKey) {
      // Toggle element in selection
      setSelectedElements(prev => {
        if (prev.includes(elementKey)) {
          // Remove from selection
          const newSelection = prev.filter(k => k !== elementKey)
          // Only notify parent of the first element (for backward compatibility)
          onSelectElement(newSelection.length > 0 ? newSelection[0] : null)
          return newSelection
        } else {
          // Add to selection
          const newSelection = [...prev, elementKey]
          // Keep parent in sync with first element
          onSelectElement(prev.length > 0 ? prev[0] : elementKey)
          return newSelection
        }
      })
    } else {
      // Replace selection
      setSelectedElements([elementKey])
      onSelectElement(elementKey)
    }
  }
  
  // Select all elements
  const handleSelectAll = () => {
    isInternalUpdate.current = true
    const allElementKeys = layers.map(l => l.key)
    setSelectedElements(allElementKeys)
    if (allElementKeys.length > 0) {
      onSelectElement(allElementKeys[0])
    }
  }
  
  // Keyboard shortcuts for undo/redo and select all
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z or Ctrl+Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }
      
      // Cmd+Shift+Z or Ctrl+Y = Redo
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || ((e.ctrlKey) && e.key === 'y')) {
        e.preventDefault()
        redo()
        return
      }
      
      // Cmd+A or Ctrl+A = Select All
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        handleSelectAll()
        return
      }
      
      // Escape = Clear selection
      if (e.key === 'Escape') {
        e.preventDefault()
        handleElementSelect(null)
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, canUndo, canRedo, undo, redo])

  // Keyboard shortcuts for nudging (works with multiple elements)
  useEffect(() => {
    if (!open || selectedElements.length === 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElements.length === 0) return
      
      const step = e.shiftKey ? 10 : 1
      let deltaX = 0
      let deltaY = 0
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          deltaX = -step
          break
        case 'ArrowRight':
          e.preventDefault()
          deltaX = step
          break
        case 'ArrowUp':
          e.preventDefault()
          deltaY = -step
          break
        case 'ArrowDown':
          e.preventDefault()
          deltaY = step
          break
        default:
          return
      }
      
      // Move all selected elements
      selectedElements.forEach(elementKey => {
        const currentPos = positionOverrides?.[layoutKey]?.[elementKey]
        if (currentPos) {
          let newX = (currentPos.x || 0) + deltaX
          let newY = (currentPos.y || 0) + deltaY
          
          // Constrain to canvas
          newX = Math.max(0, Math.min(1080, newX))
          newY = Math.max(0, Math.min(1080, newY))
          
          onPositionChange(elementKey, { x: newX, y: newY })
        }
      })
      
      // Save to history after nudging
      setTimeout(saveToHistory, 100)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedElements, positionOverrides, layoutKey, onPositionChange])

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
    
    if (elementKey) {
      // Handle selection with shift key
      if (e.shiftKey) {
        handleElementSelect(elementKey, true)
        return
      }
      
      // If clicking on a selected element, start dragging all selected
      if (selectedElements.includes(elementKey)) {
        e.preventDefault()
        console.log('[Drag] Starting drag for selected elements:', selectedElements)
        setIsDragging(true)
        
        // Store initial positions for all selected elements
        const elementsData = selectedElements.map(key => {
          // Check if it's a custom element first
          if (key.startsWith('custom-')) {
            const customEl = customElements.find((el: any) => el.id === key)
            if (customEl) {
              return {
                key,
                x: customEl.x || 0,
                y: customEl.y || 0
              }
            }
          }
          
          // Check position overrides
          const pos = positionOverrides?.[layoutKey]?.[key]
          if (pos) {
            return {
              key,
              x: pos.x || 0,
              y: pos.y || 0
            }
          }
          
          // Fallback: Get from DOM
          const el = document.querySelector(`[data-element-key="${key}"]`)
          if (el) {
            const rect = el.getBoundingClientRect()
            const canvas = document.getElementById('visual-editor-canvas')
            const scaledDiv = canvas?.querySelector('div[style*="1080px"]') as HTMLElement
            const containerRect = scaledDiv?.getBoundingClientRect() || canvas?.getBoundingClientRect()
            
            if (containerRect) {
              return {
                key,
                x: (rect.left - containerRect.left) / scale,
                y: (rect.top - containerRect.top) / scale
              }
            }
          }
          
          return {
            key,
            x: 0,
            y: 0
          }
        })
        
        console.log('[Drag] Elements data:', elementsData)
        
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          elemX: 0,
          elemY: 0,
          elements: elementsData
        })
      } else {
        // Clicking on unselected element - select it
        handleElementSelect(elementKey, false)
      }
    }
  }

  // Handle drag move (supports multiple elements)
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      return
    }
    
    if (selectedElements.length === 0) {
      console.warn('[Drag Move] No elements selected')
      return
    }
    
    if (!dragStart.elements || dragStart.elements.length === 0) {
      console.warn('[Drag Move] No elements in dragStart:', dragStart)
      return
    }
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    const scaledDeltaX = deltaX / scale
    const scaledDeltaY = e.shiftKey ? 0 : deltaY / scale // Shift locks Y axis
    
    // Move all selected elements by the same delta
    console.log('[Drag Move] Moving', dragStart.elements.length, 'elements by delta:', { deltaX: scaledDeltaX, deltaY: scaledDeltaY })
    
    dragStart.elements.forEach((elemData: any) => {
      const newX = Math.max(0, Math.min(1080, elemData.x + scaledDeltaX))
      const newY = Math.max(0, Math.min(1080, elemData.y + scaledDeltaY))
      
      console.log(`[Drag Move] ${elemData.key}: from (${elemData.x}, ${elemData.y}) to (${newX}, ${newY})`)
      
      onPositionChange(elemData.key, { x: Math.round(newX), y: Math.round(newY) })
    })
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
              onClick={undo}
              disabled={!canUndo}
              className="h-8"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
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
            {selectedElements.length >= 2 && (
              <>
                <div className="h-4 w-px bg-border" />
                <AlignmentToolbar
                  selectedElements={selectedElements}
                  positionOverrides={positionOverrides}
                  layoutKey={layoutKey}
                  customElements={customElements}
                  onPositionChange={onPositionChange}
                  onSaveToHistory={saveToHistory}
                />
              </>
            )}
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
                  selectedElements={selectedElements}
                  onSelectElement={handleElementSelect}
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
                      if (selectedElements.includes(elementKey)) {
                        handleElementSelect(null)
                      }
                      // Delete from parent SKU state
                      onDeleteCustomElement(elementKey)
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="properties" className="p-4 m-0">
                {selectedElements.length > 1 ? (
                  <div className="space-y-3">
                    <div className="mb-3">
                      <h3 className="font-semibold text-sm">Multi-Selection</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedElements.length} elements selected
                      </p>
                    </div>
                    <AlignmentToolbar
                      selectedElements={selectedElements}
                      positionOverrides={positionOverrides}
                      layoutKey={layoutKey}
                      customElements={customElements}
                      onPositionChange={onPositionChange}
                      onSaveToHistory={saveToHistory}
                    />
                    <div className="text-xs text-muted-foreground space-y-1 p-2 bg-muted/20 rounded">
                      <p><strong>Tip:</strong> Use alignment tools to arrange elements</p>
                      <p>• Drag to move all selected elements together</p>
                      <p>• Arrow keys to nudge selection</p>
                    </div>
                  </div>
                ) : selectedElement ? (
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
                id="visual-editor-canvas"
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
                
                {/* Selection Overlays - Render INSIDE scaled container for correct positioning */}
                {selectedElements.map(elementKey => {
                  // Check if it's a custom element
                  const isCustom = elementKey.startsWith('custom-')
                  let elementData: any = null
                  
                  if (isCustom) {
                    // Get from custom elements array passed as prop
                    elementData = customElements.find((el: any) => el.id === elementKey)
                  } else {
                    // Get from position overrides
                    elementData = positionOverrides?.[layoutKey]?.[elementKey]
                  }
                  
                  // Always try to get actual DOM element for accurate positioning
                  const element = document.querySelector(`[data-element-key="${elementKey}"]`)
                  
                  if (!elementData && !element) {
                    return null
                  }
                  
                  // If we have the element in the DOM, use it to get position/size
                  if (element) {
                    const rect = element.getBoundingClientRect()
                    // Find the scaled container (the first child of canvas with 1080x1080 size)
                    const canvas = document.getElementById('visual-editor-canvas')
                    const scaledDiv = canvas?.querySelector('div[style*="1080px"]') as HTMLElement
                    const containerRect = scaledDiv?.getBoundingClientRect() || canvas?.getBoundingClientRect()
                    
                    // getBoundingClientRect returns screen pixels (after scaling AND transforms)
                    // Element position - scaled container position = position within scaled space (in screen pixels)
                    // Then divide by scale to get unscaled coordinates
                    const computedX = containerRect ? (rect.left - containerRect.left) / scale : 0
                    const computedY = containerRect ? (rect.top - containerRect.top) / scale : 0
                    const computedWidth = rect.width / scale
                    const computedHeight = rect.height / scale
                    
                    // Only show handles for single selection
                    const showHandles = selectedElements.length === 1
                    
                    return (
                      <SelectionOverlay
                        key={elementKey}
                        elementKey={elementKey}
                        position={{
                          x: computedX,  // Always use DOM position (accounts for transforms)
                          y: computedY
                        }}
                        size={{
                          width: computedWidth,   // Always use DOM size
                          height: computedHeight
                        }}
                        rotation={elementData?.rotation || 0}
                        scale={scale}
                        onPositionChange={showHandles ? (pos) => onPositionChange(elementKey, pos) : undefined}
                        onSizeChange={showHandles ? (size) => onSizeChange(elementKey, size) : undefined}
                        onRotationChange={showHandles ? (rot) => onRotationChange(elementKey, rot) : undefined}
                      />
                    )
                  }
                  
                  // Fallback: Only if we have elementData but no DOM element
                  if (elementData) {
                    const showHandles = selectedElements.length === 1
                    
                    return (
                      <SelectionOverlay
                        key={elementKey}
                        elementKey={elementKey}
                        position={{
                          x: elementData.x || 0,
                          y: elementData.y || 0
                        }}
                        size={{
                          width: elementData.width || 100,
                          height: elementData.height || 100
                        }}
                        rotation={elementData.rotation || 0}
                        scale={1}
                        onPositionChange={showHandles ? (pos) => onPositionChange(elementKey, pos) : undefined}
                        onSizeChange={showHandles ? (size) => onSizeChange(elementKey, size) : undefined}
                        onRotationChange={showHandles ? (rot) => onRotationChange(elementKey, rot) : undefined}
                      />
                    )
                  }
                  
                  return null
                })}
                
                {/* Grid Overlay - sibling to scaled div, needs scaled size */}
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

