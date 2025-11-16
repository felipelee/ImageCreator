import { SKUPositionOverrides, ElementOverride, ElementPosition, LayoutMasterOverride } from '@/types/layout-editor'

/**
 * Resolve element position with override precedence:
 * 1. Start with spec default
 * 2. Apply master override if exists
 * 3. Apply SKU override if exists (highest priority)
 */
export function resolveElementPosition(
  layoutKey: string,
  elementKey: string,
  specPosition: ElementPosition,
  skuOverrides?: SKUPositionOverrides,
  masterOverrides?: LayoutMasterOverride[]
): ElementPosition {
  // Start with spec default
  let position = { ...specPosition }
  
  // Apply master override if exists
  if (masterOverrides) {
    const masterOverride = masterOverrides.find(
      override => override.layoutKey === layoutKey && override.elementKey === elementKey
    )
    if (masterOverride) {
      if (masterOverride.x !== undefined) position.x = masterOverride.x
      if (masterOverride.y !== undefined) position.y = masterOverride.y
      if (masterOverride.width !== undefined) position.width = masterOverride.width
      if (masterOverride.height !== undefined) position.height = masterOverride.height
      if (masterOverride.rotation !== undefined) position.rotation = masterOverride.rotation
      
      // Handle top/left aliases for x/y
      if (masterOverride.x !== undefined) position.left = masterOverride.x
      if (masterOverride.y !== undefined) position.top = masterOverride.y
    }
  }
  
  // Apply SKU override if exists (highest priority)
  if (skuOverrides) {
    const skuOverride = skuOverrides[layoutKey]?.[elementKey]
    if (skuOverride) {
      if (skuOverride.x !== undefined) {
        position.x = skuOverride.x
        position.left = skuOverride.x
      }
      if (skuOverride.y !== undefined) {
        position.y = skuOverride.y
        position.top = skuOverride.y
      }
      if (skuOverride.width !== undefined) position.width = skuOverride.width
      if (skuOverride.height !== undefined) position.height = skuOverride.height
      if (skuOverride.rotation !== undefined) position.rotation = skuOverride.rotation
      if (skuOverride.zIndex !== undefined) position.zIndex = skuOverride.zIndex
    }
  }
  
  return position
}

/**
 * Apply rotation transform to element style
 */
export function applyRotation(rotation?: number): string {
  if (!rotation || rotation === 0) return ''
  return `rotate(${rotation}deg)`
}

/**
 * Combine multiple transforms (rotation + existing transforms)
 */
export function combineTransforms(existingTransform?: string, rotation?: number): string {
  const transforms: string[] = []
  
  if (existingTransform && existingTransform !== 'none') {
    transforms.push(existingTransform)
  }
  
  if (rotation && rotation !== 0) {
    transforms.push(`rotate(${rotation}deg)`)
  }
  
  return transforms.length > 0 ? transforms.join(' ') : 'none'
}

/**
 * Snap value to grid
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Check if element has overrides
 */
export function hasOverride(
  layoutKey: string,
  elementKey: string,
  skuOverrides?: SKUPositionOverrides,
  masterOverrides?: LayoutMasterOverride[]
): boolean {
  const hasSKUOverride = !!skuOverrides?.[layoutKey]?.[elementKey]
  const hasMasterOverride = !!masterOverrides?.find(
    o => o.layoutKey === layoutKey && o.elementKey === elementKey
  )
  return hasSKUOverride || hasMasterOverride
}

/**
 * Get element bounds for rendering
 */
export function getElementBounds(position: ElementPosition) {
  return {
    x: position.x ?? position.left ?? 0,
    y: position.y ?? position.top ?? 0,
    width: position.width ?? 0,
    height: position.height ?? 0,
    rotation: position.rotation ?? 0
  }
}

/**
 * Calculate element center point
 */
export function getElementCenter(position: ElementPosition): { x: number; y: number } {
  const bounds = getElementBounds(position)
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2
  }
}

