'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Lock, Unlock, Type, Image as ImageIcon, Box, Circle, GripVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

interface LayerItem {
  key: string
  label: string
  type: 'text' | 'image' | 'container' | 'background'
  hasOverride?: boolean
  visible?: boolean
  locked?: boolean
  children?: LayerItem[]
}

interface LayersPanelProps {
  layers: LayerItem[]
  selectedElement: string | null
  selectedElements?: string[]
  onSelectElement: (elementKey: string, shiftKey?: boolean) => void
  onToggleVisibility?: (elementKey: string) => void
  onToggleLock?: (elementKey: string) => void
  onReorder?: (newOrder: LayerItem[]) => void
  onDeleteLayer?: (elementKey: string) => void
}

function SortableLayer({
  layer,
  depth = 0,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete
}: {
  layer: LayerItem
  depth?: number
  isSelected: boolean
  onSelect: (e?: React.MouseEvent) => void
  onToggleVisibility?: () => void
  onToggleLock?: () => void
  onDelete?: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: layer.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: `${8 + depth * 16}px`
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="h-3.5 w-3.5" />
      case 'image':
        return <ImageIcon className="h-3.5 w-3.5" />
      case 'container':
        return <Box className="h-3.5 w-3.5" />
      case 'background':
        return <Circle className="h-3.5 w-3.5" />
      default:
        return <Box className="h-3.5 w-3.5" />
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "group flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded text-sm transition-colors",
          isSelected && "bg-primary text-primary-foreground",
          !isSelected && "hover:bg-muted/50",
          layer.locked && "opacity-60"
        )}
        onClick={onSelect}
      >
        {/* Drag Handle */}
        <div 
          {...attributes}
          {...listeners}
          className={cn(
            "flex-shrink-0 cursor-grab active:cursor-grabbing",
            isSelected ? "text-primary-foreground" : "text-muted-foreground"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3" />
        </div>
        
        {/* Element Icon */}
        <div className={cn(
          "flex-shrink-0",
          isSelected ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {getIcon(layer.type)}
        </div>

        {/* Element Label */}
        <span className="flex-1 truncate text-xs font-medium">
          {layer.label}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-1">
          {layer.hasOverride && (
            <Badge 
              variant={isSelected ? "outline" : "secondary"} 
              className="h-4 px-1 text-[9px]"
            >
              ✓
            </Badge>
          )}

          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                isSelected && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onToggleVisibility()
              }}
            >
              {layer.visible === false ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* Lock Toggle */}
          {onToggleLock && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                layer.locked && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onToggleLock()
              }}
            >
              {layer.locked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* Delete Button (only for custom elements) */}
          {onDelete && layer.key.startsWith('custom-') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${layer.label}"?`)) {
                  onDelete()
                }
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function LayersPanel({
  layers,
  selectedElement,
  selectedElements = [],
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onReorder,
  onDeleteLayer
}: LayersPanelProps) {
  const [items, setItems] = useState(layers)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // Require 5px movement before drag starts (prevents accidental drags)
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.key === active.id)
      const newIndex = items.findIndex((item) => item.key === over.id)

      const newOrder = arrayMove(items, oldIndex, newIndex)
      setItems(newOrder)
      
      if (onReorder) {
        onReorder(newOrder)
      }
    }
  }

  // Update local items when layers prop changes
  useState(() => {
    setItems(layers)
  })
  
  const selectionSet = new Set(selectedElements.length > 0 ? selectedElements : selectedElement ? [selectedElement] : [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Layers</h3>
        <Badge variant="outline" className="text-xs">
          {selectedElements.length > 1 ? `${selectedElements.length} selected` : `${layers.length} elements`}
        </Badge>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(l => l.key)} strategy={verticalListSortingStrategy}>
              {items.map(layer => (
                <SortableLayer
                  key={layer.key}
                  layer={layer}
                  isSelected={selectionSet.has(layer.key)}
                  onSelect={(e?: React.MouseEvent) => onSelectElement(layer.key, e?.shiftKey)}
                  onToggleVisibility={onToggleVisibility ? () => onToggleVisibility(layer.key) : undefined}
                  onToggleLock={onToggleLock ? () => onToggleLock(layer.key) : undefined}
                  onDelete={onDeleteLayer ? () => onDeleteLayer(layer.key) : undefined}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 p-2 bg-muted/20 rounded">
        <p><strong>Tip:</strong> Click to select • Shift+click for multi-select</p>
        <p>• Drag handle: Reorder layers (z-index)</p>
        <p>• Eye icon: Toggle visibility</p>
        <p>• Lock icon: Lock position</p>
        <p>• ✓ badge: Modified position</p>
      </div>
    </div>
  )
}

