// Layout Template Types - Master layout management system

// Layout specification - describes how elements are positioned and styled
export interface LayoutSpec {
  canvas: {
    width: number
    height: number
  }
  elements: {
    [elementKey: string]: LayoutElement
  }
}

// Individual layout element definition
export interface LayoutElement {
  type: 'text' | 'image' | 'container' | 'rectangle' | 'background'
  position?: 'absolute' | 'relative'
  top?: number
  left?: number
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  zIndex?: number
  
  // Text-specific
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  copyKey?: string
  
  // Image-specific
  imageKey?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  
  // Background-specific
  backgroundColor?: string
  backgroundImage?: string
  opacity?: number
  
  // Container-specific
  gap?: number
  flexDirection?: 'row' | 'column'
  alignItems?: 'flex-start' | 'center' | 'flex-end'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
  
  // Nested styles for complex elements (like benefits with icons)
  [key: string]: any
}

// Copy template - defines what copy fields the layout needs
export interface CopyTemplate {
  [sectionKey: string]: {
    [fieldKey: string]: {
      label: string
      type: 'text' | 'textarea' | 'number'
      placeholder?: string
      required?: boolean
      maxLength?: number
    }
  }
}

// Full layout template as stored in database
export interface LayoutTemplate {
  id?: number
  key: string
  name: string
  description?: string
  category: string
  enabled: boolean
  spec: LayoutSpec
  thumbnailUrl?: string
  copyTemplate?: CopyTemplate
  createdAt?: Date
  updatedAt?: Date
}

// Layout category types
export type LayoutCategory = 
  | 'product'
  | 'testimonial'
  | 'comparison'
  | 'stats'
  | 'promotional'
  | 'educational'
  | 'social-proof'
  | 'timeline'
  | 'other'

// Layout template for creation/update (without DB fields)
export interface LayoutTemplateInput {
  key: string
  name: string
  description?: string
  category: LayoutCategory
  enabled?: boolean
  spec: LayoutSpec
  thumbnailUrl?: string
  copyTemplate?: CopyTemplate
}

// Layout gallery filter options
export interface LayoutFilter {
  category?: LayoutCategory
  enabled?: boolean
  search?: string
}

// Layout statistics
export interface LayoutStats {
  total: number
  enabled: number
  disabled: number
  byCategory: Record<LayoutCategory, number>
}

