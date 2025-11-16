'use client'

import { useState, useEffect } from 'react'

interface SelectionOverlayProps {
  elementKey: string
  position: { x: number; y: number }
  size?: { width: number; height: number }
  rotation?: number
  scale: number
  onPositionChange: (pos: { x: number; y: number }) => void
  onSizeChange?: (size: { width: number; height: number }) => void
  onRotationChange?: (rotation: number) => void
}

export function SelectionOverlay({
  elementKey,
  position,
  size,
  rotation = 0,
  scale,
  onPositionChange,
  onSizeChange,
  onRotationChange
}: SelectionOverlayProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [resizeHandle, setResizeHandle] = useState('')
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [rotationStart, setRotationStart] = useState({ angle: 0, centerX: 0, centerY: 0 })

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    console.log('[SelectionOverlay] Resize start:', handle)
    if (!onSizeChange || !size) {
      console.log('[SelectionOverlay] Cannot resize - no handler or size')
      return
    }
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeHandle(handle)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
  }

  // Handle resizing
  useEffect(() => {
    if (!isResizing || !onSizeChange || !size) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      const scaledDeltaX = deltaX / scale
      const scaledDeltaY = deltaY / scale
      
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      let newX = position.x
      let newY = position.y
      let shouldUpdatePosition = false
      
      // Handle width changes
      if (resizeHandle.includes('e')) {
        newWidth = resizeStart.width + scaledDeltaX
      }
      if (resizeHandle.includes('w')) {
        newWidth = resizeStart.width - scaledDeltaX
        newX = position.x + scaledDeltaX
        shouldUpdatePosition = true
      }
      
      // Handle height changes - only update position for pure top/bottom resize
      if (resizeHandle.includes('s')) {
        newHeight = resizeStart.height + scaledDeltaY
      }
      if (resizeHandle.includes('n')) {
        newHeight = resizeStart.height - scaledDeltaY
        // Only move Y for single-direction resize (not corners)
        if (resizeHandle === 'n') {
          newY = position.y + scaledDeltaY
          shouldUpdatePosition = true
        }
      }
      
      // Constrain minimum size
      newWidth = Math.max(50, newWidth)
      newHeight = Math.max(20, newHeight)
      
      onSizeChange({ width: Math.round(newWidth), height: Math.round(newHeight) })
      
      // Only update position if we explicitly should (left/west or pure top/north resize)
      if (shouldUpdatePosition) {
        onPositionChange({ x: Math.round(newX), y: Math.round(newY) })
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
  }, [isResizing, resizeHandle, resizeStart, position, size, scale, onPositionChange, onSizeChange])

  // Handle rotation
  useEffect(() => {
    if (!isRotating || !onRotationChange || !size) return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate angle from center of element to mouse
      const mouseX = e.clientX
      const mouseY = e.clientY
      
      const deltaX = mouseX - rotationStart.centerX
      const deltaY = mouseY - rotationStart.centerY
      
      // Calculate angle in degrees
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      
      // Adjust to make 0° point up
      angle = angle + 90
      
      // Normalize to 0-360
      if (angle < 0) angle += 360
      
      // Snap to 15° increments if shift is held
      if (e.shiftKey) {
        angle = Math.round(angle / 15) * 15
      }
      
      console.log('[SelectionOverlay] Rotation:', Math.round(angle))
      onRotationChange(Math.round(angle))
    }

    const handleMouseUp = () => {
      setIsRotating(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isRotating, rotationStart, onRotationChange, size])

  if (!size || size.width === 0 || size.height === 0) {
    console.log('[SelectionOverlay] No size or zero size:', { elementKey, size })
    return null
  }

  console.log('[SelectionOverlay] Rendering for:', elementKey, { position, size, scale })

  const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
  
  const getHandlePosition = (handle: string): React.CSSProperties => {
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

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: `${position.y * scale}px`,
        left: `${position.x * scale}px`,
        width: `${size.width * scale}px`,
        height: `${size.height * scale}px`,
        border: '2px solid #3b82f6',
        zIndex: 10000
      }}
    >
      {/* Resize Handles */}
      {onSizeChange && handles.map(handle => (
        <div
          key={handle}
          onMouseDown={(e) => {
            console.log('[SelectionOverlay] Handle clicked:', handle)
            handleResizeStart(e, handle)
          }}
          className="pointer-events-auto hover:scale-125 transition-transform resize-handle"
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            backgroundColor: '#3b82f6',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: `${handle}-resize`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 1,
            ...getHandlePosition(handle)
          }}
          title={`Resize ${handle}`}
        />
      ))}

      {/* Rotation Handle */}
      {onRotationChange && size && (
        <div
          onMouseDown={(e) => {
            console.log('[SelectionOverlay] Rotation handle clicked')
            e.stopPropagation()
            e.preventDefault()
            setIsRotating(true)
            
            // Calculate center point of element
            const centerX = position.x + size.width / 2
            const centerY = position.y + size.height / 2
            
            setRotationStart({
              angle: rotation,
              centerX: centerX * scale,
              centerY: centerY * scale
            })
          }}
          className="pointer-events-auto hover:scale-110 transition-transform cursor-grab rotation-handle"
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '24px',
            height: '24px',
            backgroundColor: '#8b5cf6',
            border: '2px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 2px 6px rgba(139,92,246,0.4)',
            zIndex: 1
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
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}
      >
        {Math.round(position.x)}, {Math.round(position.y)}
        {size && ` • ${Math.round(size.width)}×${Math.round(size.height)}`}
        {rotation !== 0 && ` • ${Math.round(rotation)}°`}
      </div>
    </div>
  )
}

