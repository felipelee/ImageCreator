'use client'

import { Button } from '@/components/ui/button'
import { 
  AlignLeft, 
  AlignRight, 
  AlignCenterHorizontal, 
  AlignCenterVertical,
  AlignStartVertical,
  AlignEndVertical,
  MoveHorizontal,
  MoveVertical
} from 'lucide-react'

interface AlignmentToolbarProps {
  selectedElements: string[]
  positionOverrides: any
  layoutKey: string
  customElements?: any[]
  onPositionChange: (elementKey: string, position: { x: number; y: number }) => void
  onSaveToHistory: () => void
}

export function AlignmentToolbar({
  selectedElements,
  positionOverrides,
  layoutKey,
  customElements = [],
  onPositionChange,
  onSaveToHistory
}: AlignmentToolbarProps) {
  if (selectedElements.length < 2) {
    return null
  }

  const getElementBounds = (elementKey: string) => {
    // Check if it's a custom element
    if (elementKey.startsWith('custom-')) {
      const customEl = customElements.find((el: any) => el.id === elementKey)
      if (customEl) {
        console.log(`[getElementBounds] ${elementKey} from customElements:`, customEl)
        return {
          x: customEl.x || 0,
          y: customEl.y || 0,
          width: customEl.width || 100,
          height: customEl.height || 100,
          right: (customEl.x || 0) + (customEl.width || 100),
          bottom: (customEl.y || 0) + (customEl.height || 100),
          centerX: (customEl.x || 0) + (customEl.width || 100) / 2,
          centerY: (customEl.y || 0) + (customEl.height || 100) / 2
        }
      }
    }
    
    // Check position overrides
    const pos = positionOverrides?.[layoutKey]?.[elementKey]
    if (pos) {
      console.log(`[getElementBounds] ${elementKey} from positionOverrides:`, pos)
      return {
        x: pos.x || 0,
        y: pos.y || 0,
        width: pos.width || 100,
        height: pos.height || 100,
        right: (pos.x || 0) + (pos.width || 100),
        bottom: (pos.y || 0) + (pos.height || 100),
        centerX: (pos.x || 0) + (pos.width || 100) / 2,
        centerY: (pos.y || 0) + (pos.height || 100) / 2
      }
    }
    
    // Fallback: Get from DOM
    const element = document.querySelector(`[data-element-key="${elementKey}"]`)
    if (element) {
      const rect = element.getBoundingClientRect()
      const canvas = document.getElementById('visual-editor-canvas')
      const scaledDiv = canvas?.querySelector('div[style*="1080px"]') as HTMLElement
      const containerRect = scaledDiv?.getBoundingClientRect() || canvas?.getBoundingClientRect()
      const scale = 0.72 // Match the scale from VisualEditorModal
      
      if (containerRect) {
        const x = (rect.left - containerRect.left) / scale
        const y = (rect.top - containerRect.top) / scale
        const width = rect.width / scale
        const height = rect.height / scale
        
        console.log(`[getElementBounds] ${elementKey} from DOM:`, { x, y, width, height })
        
        return {
          x,
          y,
          width,
          height,
          right: x + width,
          bottom: y + height,
          centerX: x + width / 2,
          centerY: y + height / 2
        }
      }
    }
    
    console.warn(`[getElementBounds] ${elementKey} - No bounds found!`)
    return null
  }

  const alignLeft = () => {
    console.log('[Align Left] CLICKED! Selected elements:', selectedElements)
    const bounds = selectedElements.map(getElementBounds).filter(Boolean)
    console.log('[Align Left] Bounds:', bounds)
    if (bounds.length === 0) {
      console.warn('[Align Left] No bounds found for elements:', selectedElements)
      return
    }
    
    const leftmost = Math.min(...bounds.map(b => b!.x))
    console.log('[Align Left] Aligning to x:', leftmost)
    
    selectedElements.forEach(elementKey => {
      const current = getElementBounds(elementKey)
      if (current) {
        console.log(`[Align Left] Moving ${elementKey} from x:${current.x} to x:${leftmost}`)
        onPositionChange(elementKey, { x: leftmost, y: current.y })
      }
    })
    
    setTimeout(onSaveToHistory, 100)
  }

  const alignRight = () => {
    const bounds = selectedElements.map(getElementBounds).filter(Boolean)
    if (bounds.length === 0) return
    
    const rightmost = Math.max(...bounds.map(b => b!.right))
    
    selectedElements.forEach(elementKey => {
      const current = getElementBounds(elementKey)
      if (current) {
        const newX = rightmost - current.width
        onPositionChange(elementKey, { x: newX, y: current.y })
      }
    })
    
    setTimeout(onSaveToHistory, 100)
  }

  const alignTop = () => {
    const bounds = selectedElements.map(getElementBounds).filter(Boolean)
    if (bounds.length === 0) return
    
    const topmost = Math.min(...bounds.map(b => b!.y))
    
    selectedElements.forEach(elementKey => {
      const current = getElementBounds(elementKey)
      if (current) {
        onPositionChange(elementKey, { x: current.x, y: topmost })
      }
    })
    
    setTimeout(onSaveToHistory, 100)
  }

  const alignBottom = () => {
    const bounds = selectedElements.map(getElementBounds).filter(Boolean)
    if (bounds.length === 0) return
    
    const bottommost = Math.max(...bounds.map(b => b!.bottom))
    
    selectedElements.forEach(elementKey => {
      const current = getElementBounds(elementKey)
      if (current) {
        const newY = bottommost - current.height
        onPositionChange(elementKey, { x: current.x, y: newY })
      }
    })
    
    setTimeout(onSaveToHistory, 100)
  }

  const alignCenterHorizontal = () => {
    const bounds = selectedElements.map(getElementBounds).filter(Boolean)
    if (bounds.length === 0) return
    
    const avgCenterX = bounds.reduce((sum, b) => sum + b!.centerX, 0) / bounds.length
    
    selectedElements.forEach(elementKey => {
      const current = getElementBounds(elementKey)
      if (current) {
        const newX = avgCenterX - current.width / 2
        onPositionChange(elementKey, { x: newX, y: current.y })
      }
    })
    
    setTimeout(onSaveToHistory, 100)
  }

  const alignCenterVertical = () => {
    const bounds = selectedElements.map(getElementBounds).filter(Boolean)
    if (bounds.length === 0) return
    
    const avgCenterY = bounds.reduce((sum, b) => sum + b!.centerY, 0) / bounds.length
    
    selectedElements.forEach(elementKey => {
      const current = getElementBounds(elementKey)
      if (current) {
        const newY = avgCenterY - current.height / 2
        onPositionChange(elementKey, { x: current.x, y: newY })
      }
    })
    
    setTimeout(onSaveToHistory, 100)
  }

  const distributeHorizontal = () => {
    const bounds = selectedElements.map((key, idx) => ({ key, ...getElementBounds(key)!, idx }))
      .filter(b => b.x !== undefined)
      .sort((a, b) => a.x - b.x)
    
    if (bounds.length < 3) return
    
    const first = bounds[0]
    const last = bounds[bounds.length - 1]
    const totalSpace = last.x - (first.x + first.width)
    const gap = totalSpace / (bounds.length - 1)
    
    for (let i = 1; i < bounds.length - 1; i++) {
      const newX = first.x + first.width + gap * i
      onPositionChange(bounds[i].key, { x: newX, y: bounds[i].y })
    }
    
    setTimeout(onSaveToHistory, 100)
  }

  const distributeVertical = () => {
    const bounds = selectedElements.map((key, idx) => ({ key, ...getElementBounds(key)!, idx }))
      .filter(b => b.y !== undefined)
      .sort((a, b) => a.y - b.y)
    
    if (bounds.length < 3) return
    
    const first = bounds[0]
    const last = bounds[bounds.length - 1]
    const totalSpace = last.y - (first.y + first.height)
    const gap = totalSpace / (bounds.length - 1)
    
    for (let i = 1; i < bounds.length - 1; i++) {
      const newY = first.y + first.height + gap * i
      onPositionChange(bounds[i].key, { x: bounds[i].x, y: newY })
    }
    
    setTimeout(onSaveToHistory, 100)
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg border">
      <span className="text-xs font-medium text-muted-foreground mr-2">
        {selectedElements.length} selected
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={alignLeft}
        className="h-7 w-7 p-0"
        title="Align Left"
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={alignCenterHorizontal}
        className="h-7 w-7 p-0"
        title="Align Center Horizontal"
      >
        <AlignCenterHorizontal className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={alignRight}
        className="h-7 w-7 p-0"
        title="Align Right"
      >
        <AlignRight className="h-3.5 w-3.5" />
      </Button>
      
      <div className="w-px h-4 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={alignTop}
        className="h-7 w-7 p-0"
        title="Align Top"
      >
        <AlignStartVertical className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={alignCenterVertical}
        className="h-7 w-7 p-0"
        title="Align Center Vertical"
      >
        <AlignCenterVertical className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={alignBottom}
        className="h-7 w-7 p-0"
        title="Align Bottom"
      >
        <AlignEndVertical className="h-3.5 w-3.5" />
      </Button>
      
      {selectedElements.length >= 3 && (
        <>
          <div className="w-px h-4 bg-border mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={distributeHorizontal}
            className="h-7 px-2"
            title="Distribute Horizontal"
          >
            <MoveHorizontal className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">H</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={distributeVertical}
            className="h-7 px-2"
            title="Distribute Vertical"
          >
            <MoveVertical className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">V</span>
          </Button>
        </>
      )}
    </div>
  )
}

