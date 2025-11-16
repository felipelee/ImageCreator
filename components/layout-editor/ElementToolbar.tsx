'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Grid3x3, 
  Minus, 
  Plus, 
  RotateCcw, 
  Move, 
  Maximize2,
  RotateCw,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  Lock,
  Unlock
} from 'lucide-react'

interface ElementToolbarProps {
  elementKey: string
  elementLabel: string
  position: { x: number; y: number }
  size?: { width: number; height: number }
  rotation?: number
  snapEnabled: boolean
  gridSize: number
  hasOverride: boolean
  onPositionChange: (pos: { x: number; y: number }) => void
  onSizeChange?: (size: { width: number; height: number }) => void
  onRotationChange?: (rotation: number) => void
  onSnapToggle: () => void
  onReset: () => void
  onLockToggle?: () => void
  isLocked?: boolean
}

export function ElementToolbar({
  elementKey,
  elementLabel,
  position,
  size,
  rotation = 0,
  snapEnabled,
  gridSize,
  hasOverride,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onSnapToggle,
  onReset,
  onLockToggle,
  isLocked = false
}: ElementToolbarProps) {
  const [localX, setLocalX] = useState(Math.round(position.x))
  const [localY, setLocalY] = useState(Math.round(position.y))
  const [localWidth, setLocalWidth] = useState(size?.width ? Math.round(size.width) : 0)
  const [localHeight, setLocalHeight] = useState(size?.height ? Math.round(size.height) : 0)
  const [localRotation, setLocalRotation] = useState(Math.round(rotation))

  // Update local state when props change
  useState(() => {
    setLocalX(Math.round(position.x))
    setLocalY(Math.round(position.y))
    if (size) {
      setLocalWidth(Math.round(size.width))
      setLocalHeight(Math.round(size.height))
    }
    setLocalRotation(Math.round(rotation))
  })

  const handleXChange = (value: number) => {
    setLocalX(value)
    onPositionChange({ x: value, y: position.y })
  }

  const handleYChange = (value: number) => {
    setLocalY(value)
    onPositionChange({ x: position.x, y: value })
  }

  const handleWidthChange = (value: number) => {
    if (!onSizeChange || !size) return
    setLocalWidth(value)
    onSizeChange({ width: value, height: size.height })
  }

  const handleHeightChange = (value: number) => {
    if (!onSizeChange || !size) return
    setLocalHeight(value)
    onSizeChange({ width: size.width, height: value })
  }

  const handleRotationInputChange = (value: number) => {
    if (!onRotationChange) return
    setLocalRotation(value)
    onRotationChange(value)
  }

  return (
    <div className="bg-card border rounded-lg p-3 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{elementLabel}</span>
          {hasOverride && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
              Modified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onLockToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLockToggle}
              className="h-7 w-7 p-0"
              title={isLocked ? "Unlock element" : "Lock element"}
            >
              {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs"
            title="Reset to default"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <Separator className="mb-3" />

      {/* Position Controls */}
      <div className="space-y-2 mb-3">
        <Label className="text-xs font-semibold text-muted-foreground">Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">X</Label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleXChange(localX - 1)}
                className="h-7 w-7 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={localX}
                onChange={(e) => handleXChange(parseInt(e.target.value) || 0)}
                className="h-7 text-xs text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleXChange(localX + 1)}
                className="h-7 w-7 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Y</Label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleYChange(localY - 1)}
                className="h-7 w-7 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={localY}
                onChange={(e) => handleYChange(parseInt(e.target.value) || 0)}
                className="h-7 text-xs text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleYChange(localY + 1)}
                className="h-7 w-7 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Size Controls */}
      {onSizeChange && size && (
        <div className="space-y-2 mb-3">
          <Label className="text-xs font-semibold text-muted-foreground">Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWidthChange(localWidth - 1)}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={localWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="h-7 text-xs text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWidthChange(localWidth + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHeightChange(localHeight - 1)}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={localHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="h-7 text-xs text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHeightChange(localHeight + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rotation Control */}
      {onRotationChange && (
        <div className="space-y-2 mb-3">
          <Label className="text-xs font-semibold text-muted-foreground">Rotation</Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotationInputChange(localRotation - 15)}
              className="h-7 w-7 p-0"
              title="Rotate -15°"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={localRotation}
              onChange={(e) => handleRotationInputChange(parseInt(e.target.value) || 0)}
              className="h-7 text-xs text-center"
              placeholder="0°"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotationInputChange(localRotation + 15)}
              className="h-7 w-7 p-0"
              title="Rotate +15°"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRotationInputChange(0)}
              className="h-7 px-2 text-xs"
              title="Reset rotation"
            >
              0°
            </Button>
          </div>
        </div>
      )}

      <Separator className="mb-3" />

      {/* Tools */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">Tools</Label>
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant={snapEnabled ? "default" : "outline"}
            size="sm"
            onClick={onSnapToggle}
            className="h-7 text-xs justify-start"
          >
            <Grid3x3 className="h-3 w-3 mr-1" />
            Snap ({gridSize}px)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPositionChange({ x: 540 - (size?.width || 0) / 2, y: position.y })
            }}
            className="h-7 text-xs justify-start"
            title="Center horizontally"
          >
            <AlignHorizontalJustifyCenter className="h-3 w-3 mr-1" />
            Center X
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPositionChange({ x: position.x, y: 540 - (size?.height || 0) / 2 })
            }}
            className="h-7 text-xs justify-start"
            title="Center vertically"
          >
            <AlignVerticalJustifyCenter className="h-3 w-3 mr-1" />
            Center Y
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onPositionChange({ 
                x: 540 - (size?.width || 0) / 2, 
                y: 540 - (size?.height || 0) / 2 
              })
            }}
            className="h-7 text-xs justify-start"
            title="Center both"
          >
            <Maximize2 className="h-3 w-3 mr-1" />
            Center All
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-3 pt-2 border-t">
        <p className="text-[10px] text-muted-foreground">
          <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">↑↓←→</kbd> Move • 
          <kbd className="px-1 py-0.5 bg-muted rounded text-[9px] ml-1">Shift+↑↓←→</kbd> Move 10px
        </p>
      </div>
    </div>
  )
}

