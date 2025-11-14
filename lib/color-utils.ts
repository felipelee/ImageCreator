import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'

/**
 * Get the actual color value for a field, checking for SKU-level overrides first
 */
export function getFieldColorValue(
  brand: Brand,
  sku: SKU,
  layoutKey: string,
  fieldLabel: string,
  defaultColorKey: string
): string {
  // Check if this field has a color override
  const overriddenColorKey = sku.colorOverrides?.[layoutKey]?.[fieldLabel]
  const colorKeyToUse = overriddenColorKey || defaultColorKey
  
  // Return the actual hex value
  return brand.colors[colorKeyToUse as keyof typeof brand.colors] || brand.colors[defaultColorKey as keyof typeof brand.colors]
}

