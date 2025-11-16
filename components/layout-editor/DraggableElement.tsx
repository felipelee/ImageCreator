'use client'

import { useState, useRef, useEffect } from 'react'
import { snapToGrid } from '@/lib/layout-utils'

interface DraggableElementProps {
  id: string
  elementKey: string
  children: React.ReactNode
  position: { x: number; y: number }
  size?: { width?: number; height?: number }
  rotation?: number
  isSelected: boolean
  isEditMode: boolean
  snapEnabled?: boolean
  gridSize?: number
  onSelect: (elementKey: string) => void
  onPositionChange: (elementKey: string, position: { x: number; y: number }) => void
  onSizeChange?: (elementKey: string, size: { width: number; height: number }) => void
  onRotationChange?: (elementKey: string, rotation: number) => void
  locked?: boolean
}

export function DraggableElement({
  id,
  elementKey,
  children,
  position,
  size,
  rotation = 0,
  isSelected,
  isEditMode,
  snapEnabled = true,
  gridSize = 5,
  onSelect,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  locked = false
}: DraggableElementProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, handle: '' })
  const elementRef = useRef<HTMLDivElement>(null)

  // Handle element selection
  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode || locked) return
    e.stopPropagation()
    onSelect(elementKey)
  }

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode || !isSelected || locked) return
    
    // Don't drag if clicking on a resize handle
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return
    if ((e.target as HTMLElement).classList.contains('rotation-handle')) return
    
    e.stopPropagation()
    e.preventDefault()
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elemX: position.x,
      elemY: position.y
    })
  }

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      
      // Scale delta by zoom level (0.72 scale in preview for statement layout)
      const scale = 0.72
      const scaledDeltaX = deltaX / scale
      const scaledDeltaY = e.shiftKey ? 0 : deltaY / scale // Shift constrains to X axis
      
      let newX = dragStart.elemX + scaledDeltaX
      let newY = dragStart.elemY + scaledDeltaY
      
      // Snap to grid
      if (snapEnabled && !e.altKey) {
        newX = snapToGrid(newX, gridSize)
        newY = snapToGrid(newY, gridSize)
      }
      
      // Constrain to canvas
      newX = Math.max(0, Math.min(1080 - (size?.width || 0), newX))
      newY = Math.max(0, Math.min(1080 - (size?.height || 0), newY))
      
      onPositionChange(elementKey, { x: Math.round(newX), y: Math.round(newY) })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, position, elementKey, onPositionChange, snapEnabled, gridSize, size])

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (!isEditMode || !isSelected || locked || !onSizeChange) return
    
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size?.width || 0,
      height: size?.height || 0,
      handle
    })
  }

  // Handle resizing
  useEffect(() => {
    if (!isResizing || !onSizeChange) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      const scale = 0.72 // Match preview scale
      
      const scaledDeltaX = deltaX / scale
      const scaledDeltaY = deltaY / scale
      
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      let newX = position.x
      let newY = position.y
      
      // Calculate new dimensions based on handle
      if (resizeStart.handle.includes('e')) {
        newWidth = resizeStart.width + scaledDeltaX
      }
      if (resizeStart.handle.includes('w')) {
        newWidth = resizeStart.width - scaledDeltaX
        newX = position.x + scaledDeltaX
      }
      if (resizeStart.handle.includes('s')) {
        newHeight = resizeStart.height + scaledDeltaY
      }
      if (resizeStart.handle.includes('n')) {
        newHeight = resizeStart.height - scaledDeltaY
        newY = position.y + scaledDeltaY
      }
      
      // Maintain aspect ratio with Shift
      if (e.shiftKey && resizeStart.width > 0 && resizeStart.height > 0) {
        const aspectRatio = resizeStart.width / resizeStart.height
        newHeight = newWidth / aspectRatio
      }
      
      // Snap to grid
      if (snapEnabled && !e.altKey) {
        newWidth = snapToGrid(newWidth, gridSize)
        newHeight = snapToGrid(newHeight, gridSize)
      }
      
      // Constrain minimum size
      newWidth = Math.max(50, newWidth)
      newHeight = Math.max(20, newHeight)
      
      onSizeChange(elementKey, { width: Math.round(newWidth), height: Math.round(newHeight) })
      
      // Update position if resizing from top or left
      if (resizeStart.handle.includes('w') || resizeStart.handle.includes('n')) {
        onPositionChange(elementKey, { x: Math.round(newX), y: Math.round(newY) })
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeStart, position, elementKey, onPositionChange, onSizeChange, snapEnabled, gridSize, size])

  if (!isEditMode) {
    // Normal rendering mode - just show children
    return <>{children}</>
  }

  // Edit mode - wrap with interactive controls
  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        cursor: locked ? 'not-allowed' : (isDragging ? 'grabbing' : (isSelected ? 'grab' : 'pointer')),
        outline: isSelected ? '2px solid #3b82f6' : (locked ? '1px dashed #9ca3af' : 'none'),
        outlineOffset: '2px',
        pointerEvents: isEditMode ? 'auto' : 'none'
      }}
      className="draggable-element"
    >
      {children}
      
      {/* Selection Overlay */}
      {isSelected && !locked && (
        <>
          {/* Resize Handles */}
          {onSizeChange && (
            <>
              {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(handle => (
                <div
                  key={handle}
                  className="resize-handle"
                  onMouseDown={(e) => handleResizeStart(e, handle)}
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#3b82f6',
                    border: '1px solid white',
                    borderRadius: '50%',
                    cursor: `${handle}-resize`,
                    zIndex: 1000,
                    ...getHandlePosition(handle)
                  }}
                />
              ))}
            </>
          )}
          
          {/* Rotation Handle */}
          {onRotationChange && (
            <div
              className="rotation-handle"
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '20px',
                backgroundColor: '#8b5cf6',
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'grab',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'white',
                fontWeight: 'bold'
              }}
              title="Drag to rotate"
            >
              ↻
            </div>
          )}
          
          {/* Position Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: '0',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: '600',
              zIndex: 1000,
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            {Math.round(position.x)}, {Math.round(position.y)}
            {size?.width && ` • ${Math.round(size.width)}×${Math.round(size.height)}`}
            {rotation !== 0 && ` • ${Math.round(rotation)}°`}
          </div>
        </>
      )}
    </div>
  )
}

// Helper: Get position for resize handle
function getHandlePosition(handle: string): React.CSSProperties {
  const positions: Record<string, React.CSSProperties> = {
    nw: { top: '-4px', left: '-4px' },
    n: { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
    ne: { top: '-4px', right: '-4px' },
    e: { top: '50%', right: '-4px', transform: 'translateY(-50%)' },
    se: { bottom: '-4px', right: '-4px' },
    s: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
    sw: { bottom: '-4px', left: '-4px' },
    w: { top: '50%', left: '-4px', transform: 'translateY(-50%)' }
  }
  return positions[handle] || {}
}

