// Layout Editor Types - Visual positioning system

export interface ElementPosition {
  x?: number
  y?: number
  top?: number
  left?: number
  width?: number
  height?: number
  rotation?: number
  zIndex?: number
}

export interface ElementOverride {
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  zIndex?: number
}

export interface LayoutOverrides {
  [elementKey: string]: ElementOverride
}

export interface SKUPositionOverrides {
  [layoutKey: string]: LayoutOverrides
}

export interface LayoutMasterOverride {
  id?: number
  layoutKey: string
  elementKey: string
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  createdAt?: string
  updatedAt?: string
}

export interface EditableElement {
  key: string
  label: string
  type: 'text' | 'image' | 'container' | 'background'
  position: ElementPosition
  locked?: boolean
  visible?: boolean
}

export interface VisualEditorState {
  mode: 'content' | 'visual'
  selectedElement: string | null
  hoveredElement: string | null
  snapToGrid: boolean
  gridSize: number
  showMeasurements: boolean
  history: LayoutOverrides[]
  historyIndex: number
}

