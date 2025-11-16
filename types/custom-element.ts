// Custom Element Types - User-created dynamic elements

export type CustomElementType = 'text' | 'badge' | 'image' | 'shape'

export interface CustomElementContent {
  text?: string
  imageKey?: string // references brand.images or sku.images
  colorKey?: string // references brand.colors
}

export interface CustomElementStyle {
  fontSize?: number
  fontWeight?: number
  padding?: number
  borderRadius?: number
  backgroundColor?: string // color key reference
  textColor?: string // color key reference
  objectFit?: 'contain' | 'cover' | 'fill'
}

export interface CustomElement {
  id: string // unique ID like 'custom-badge-1'
  type: CustomElementType
  label: string // user-friendly name like "Promo Badge"
  
  // Position & dimensions
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  zIndex: number
  
  // Content (theme-aware)
  content: CustomElementContent
  
  // Styling
  style: CustomElementStyle
  
  // Metadata
  createdAt?: string
  locked?: boolean
  visible?: boolean
}

export interface SKUCustomElementOverrides {
  [elementId: string]: CustomElementContent
}

export interface LayoutCustomElements {
  [layoutKey: string]: CustomElement[]
}

