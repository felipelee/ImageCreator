'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit3, Eye, Save, X } from 'lucide-react'
import { ElementToolbar } from './ElementToolbar'
import { SKUPositionOverrides } from '@/types/layout-editor'
import { hasOverride } from '@/lib/layout-utils'

interface VisualLayoutEditorProps {
  layoutKey: string
  layoutName: string
  children: React.ReactNode
  skuPositionOverrides?: SKUPositionOverrides
  onSaveOverrides: (layoutKey: string, overrides: any) => void
}

export function VisualLayoutEditor({
  layoutKey,
  layoutName,
  children,
  skuPositionOverrides,
  onSaveOverrides
}: VisualLayoutEditorProps) {
  const [isVisualMode, setIsVisualMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [gridSize] = useState(5)
  const [hasChanges, setHasChanges] = useState(false)
  const [localOverrides, setLocalOverrides] = useState<any>({})

  // Load existing overrides
  useEffect(() => {
    if (skuPositionOverrides?.[layoutKey]) {
      setLocalOverrides(skuPositionOverrides[layoutKey])
    }
  }, [layoutKey, skuPositionOverrides])

  const toggleVisualMode = () => {
    setIsVisualMode(!isVisualMode)
    setSelectedElement(null)
  }

  const handlePositionChange = (elementKey: string, position: { x: number; y: number }) => {
    setLocalOverrides((prev: any) => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        x: position.x,
        y: position.y
      }
    }))
    setHasChanges(true)
  }

  const handleSizeChange = (elementKey: string, size: { width: number; height: number }) => {
    setLocalOverrides((prev: any) => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        width: size.width,
        height: size.height
      }
    }))
    setHasChanges(true)
  }

  const handleRotationChange = (elementKey: string, rotation: number) => {
    setLocalOverrides((prev: any) => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        rotation
      }
    }))
    setHasChanges(true)
  }

  const handleReset = (elementKey: string) => {
    setLocalOverrides((prev: any) => {
      const updated = { ...prev }
      delete updated[elementKey]
      return updated
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    onSaveOverrides(layoutKey, localOverrides)
    setHasChanges(false)
  }

  const handleCancel = () => {
    // Reload from props
    if (skuPositionOverrides?.[layoutKey]) {
      setLocalOverrides(skuPositionOverrides[layoutKey])
    } else {
      setLocalOverrides({})
    }
    setHasChanges(false)
    setIsVisualMode(false)
  }

  return (
    <div className="relative">
      {/* Mode Toggle Header */}
      <div className="mb-3 flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{layoutName}</span>
          {isVisualMode ? (
            <Badge variant="default" className="text-xs">
              <Edit3 className="h-3 w-3 mr-1" />
              Visual Edit Mode
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Preview Mode
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-8"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="h-8"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Layout
              </Button>
            </>
          )}
          <Button
            variant={isVisualMode ? "default" : "outline"}
            size="sm"
            onClick={toggleVisualMode}
            className="h-8"
          >
            {isVisualMode ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Preview Mode
              </>
            ) : (
              <>
                <Edit3 className="h-3 w-3 mr-1" />
                Edit Layout
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor UI */}
      <div className="grid grid-cols-[300px_1fr] gap-4">
        {/* Left Sidebar - Controls */}
        {isVisualMode && selectedElement && (
          <div className="space-y-3">
            <ElementToolbar
              elementKey={selectedElement}
              elementLabel={selectedElement}
              position={localOverrides[selectedElement] || { x: 0, y: 0 }}
              size={localOverrides[selectedElement] ? {
                width: localOverrides[selectedElement].width || 0,
                height: localOverrides[selectedElement].height || 0
              } : undefined}
              rotation={localOverrides[selectedElement]?.rotation || 0}
              snapEnabled={snapEnabled}
              gridSize={gridSize}
              hasOverride={!!localOverrides[selectedElement]}
              onPositionChange={(pos) => handlePositionChange(selectedElement, pos)}
              onSizeChange={(size) => handleSizeChange(selectedElement, size)}
              onRotationChange={(rot) => handleRotationChange(selectedElement, rot)}
              onSnapToggle={() => setSnapEnabled(!snapEnabled)}
              onReset={() => handleReset(selectedElement)}
            />
            
            {/* Instructions */}
            <div className="p-3 bg-muted/30 rounded-lg border text-xs text-muted-foreground space-y-1">
              <p><strong>Tip:</strong> Click elements to select them</p>
              <p>Drag to move • Handles to resize</p>
              <p>Hold Shift to constrain movement</p>
              <p>Hold Alt to disable snap-to-grid</p>
            </div>
          </div>
        )}

        {/* Right Side - Canvas */}
        <div className={isVisualMode ? 'col-span-1' : 'col-span-2'}>
          <div
            className="relative"
            style={{
              userSelect: isVisualMode ? 'none' : 'auto'
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Helper Grid Overlay */}
      {isVisualMode && snapEnabled && (
        <div
          className="pointer-events-none absolute inset-0 editor-grid"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`
          }}
        />
      )}
    </div>
  )
}

