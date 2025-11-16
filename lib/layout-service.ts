import { supabase } from './supabase'
import { 
  LayoutTemplate, 
  LayoutTemplateInput, 
  LayoutSpec, 
  LayoutFilter,
  LayoutStats,
  LayoutCategory 
} from '@/types/layout-template'

// Import hardcoded specs as fallbacks
import { BOTTLE_LIST_SPEC } from './layouts/specs/bottle-list-spec'
import { COMPARISON_SPEC } from './layouts/specs/comparison-spec'
import { TESTIMONIAL_SPEC } from './layouts/specs/testimonial-spec'
import { BIG_STAT_SPEC } from './layouts/specs/big-stat-spec'
import { MULTI_STATS_SPEC } from './layouts/specs/multi-stats-spec'
import { PROMO_PRODUCT_SPEC } from './layouts/specs/promo-product-spec'
import { TIMELINE_SPEC } from './layouts/specs/timeline-spec'
import { BEFORE_AFTER_SPEC } from './layouts/specs/before-after-spec'
import { FEATURE_GRID_SPEC } from './layouts/specs/feature-grid-spec'
import { SOCIAL_PROOF_SPEC } from './layouts/specs/social-proof-spec'
import { PRICE_COMPARISON_SPEC } from './layouts/specs/price-comparison-spec'

// Database interface
interface DatabaseLayoutTemplate {
  id: number
  key: string
  name: string
  description: string | null
  category: string
  enabled: boolean
  spec: any
  thumbnail_url: string | null
  copy_template: any | null
  created_at: string
  updated_at: string
}

// In-memory cache
let layoutCache: LayoutTemplate[] | null = null
let cacheTimestamp: number | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Hardcoded fallback specs
const FALLBACK_SPECS: Record<string, LayoutSpec> = {
  bottleList: BOTTLE_LIST_SPEC,
  comparison: COMPARISON_SPEC,
  testimonial: TESTIMONIAL_SPEC,
  bigStat: BIG_STAT_SPEC,
  multiStats: MULTI_STATS_SPEC,
  promoProduct: PROMO_PRODUCT_SPEC,
  timeline: TIMELINE_SPEC,
  beforeAfter: BEFORE_AFTER_SPEC,
  featureGrid: FEATURE_GRID_SPEC,
  socialProof: SOCIAL_PROOF_SPEC,
  priceComparison: PRICE_COMPARISON_SPEC
}

// Convert database record to app format
function dbToLayoutTemplate(db: DatabaseLayoutTemplate): LayoutTemplate {
  return {
    id: db.id,
    key: db.key,
    name: db.name,
    description: db.description || undefined,
    category: db.category as LayoutCategory,
    enabled: db.enabled,
    spec: db.spec,
    thumbnailUrl: db.thumbnail_url || undefined,
    copyTemplate: db.copy_template || undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at)
  }
}

// Convert app format to database record
function layoutTemplateToDb(template: LayoutTemplateInput): Partial<DatabaseLayoutTemplate> {
  return {
    key: template.key,
    name: template.name,
    description: template.description || null,
    category: template.category,
    enabled: template.enabled ?? true,
    spec: template.spec,
    thumbnail_url: template.thumbnailUrl || null,
    copy_template: template.copyTemplate || null
  }
}

// Clear cache
function clearCache() {
  layoutCache = null
  cacheTimestamp = null
}

// Check if cache is valid
function isCacheValid(): boolean {
  if (!layoutCache || !cacheTimestamp) return false
  return Date.now() - cacheTimestamp < CACHE_TTL
}

// Layout service
export const layoutService = {
  /**
   * Get all layout templates
   */
  async getAll(): Promise<LayoutTemplate[]> {
    // Return cache if valid
    if (isCacheValid() && layoutCache) {
      return layoutCache
    }

    try {
      const { data, error } = await supabase
        .from('layout_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })
      
      if (error) throw error
      
      const templates = (data as DatabaseLayoutTemplate[]).map(dbToLayoutTemplate)
      
      // Update cache
      layoutCache = templates
      cacheTimestamp = Date.now()
      
      return templates
    } catch (error) {
      console.error('Failed to load layout templates from database:', error)
      
      // Return empty array on error (fallbacks will be used at spec level)
      return []
    }
  },

  /**
   * Get layout templates filtered by criteria
   */
  async getFiltered(filter: LayoutFilter): Promise<LayoutTemplate[]> {
    const all = await this.getAll()
    
    return all.filter(template => {
      if (filter.enabled !== undefined && template.enabled !== filter.enabled) {
        return false
      }
      
      if (filter.category && template.category !== filter.category) {
        return false
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const matchesName = template.name.toLowerCase().includes(searchLower)
        const matchesDesc = template.description?.toLowerCase().includes(searchLower)
        const matchesKey = template.key.toLowerCase().includes(searchLower)
        
        if (!matchesName && !matchesDesc && !matchesKey) {
          return false
        }
      }
      
      return true
    })
  },

  /**
   * Get only enabled layout templates
   */
  async getEnabled(): Promise<LayoutTemplate[]> {
    return this.getFiltered({ enabled: true })
  },

  /**
   * Get a single layout template by key
   */
  async getByKey(key: string): Promise<LayoutTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('layout_templates')
        .select('*')
        .eq('key', key)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      
      return dbToLayoutTemplate(data as DatabaseLayoutTemplate)
    } catch (error) {
      console.error(`Failed to load layout template "${key}":`, error)
      return null
    }
  },

  /**
   * Get a single layout template by ID
   */
  async getById(id: number): Promise<LayoutTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('layout_templates')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }
      
      return dbToLayoutTemplate(data as DatabaseLayoutTemplate)
    } catch (error) {
      console.error(`Failed to load layout template #${id}:`, error)
      return null
    }
  },

  /**
   * Get layout spec with fallback to hardcoded spec
   */
  async getSpec(key: string): Promise<LayoutSpec | null> {
    const template = await this.getByKey(key)
    
    if (template && template.spec) {
      return template.spec
    }
    
    // Fallback to hardcoded spec
    if (FALLBACK_SPECS[key]) {
      console.log(`Using fallback spec for layout "${key}"`)
      return FALLBACK_SPECS[key]
    }
    
    console.warn(`No spec found for layout "${key}"`)
    return null
  },

  /**
   * Create a new layout template
   */
  async create(template: LayoutTemplateInput): Promise<LayoutTemplate> {
    const { data, error } = await supabase
      .from('layout_templates')
      .insert([layoutTemplateToDb(template)])
      .select()
      .single()
    
    if (error) throw error
    
    // Clear cache
    clearCache()
    
    return dbToLayoutTemplate(data as DatabaseLayoutTemplate)
  },

  /**
   * Update an existing layout template
   */
  async update(key: string, updates: Partial<LayoutTemplateInput>): Promise<LayoutTemplate> {
    const { data, error } = await supabase
      .from('layout_templates')
      .update(layoutTemplateToDb(updates as LayoutTemplateInput))
      .eq('key', key)
      .select()
      .single()
    
    if (error) throw error
    
    // Clear cache
    clearCache()
    
    return dbToLayoutTemplate(data as DatabaseLayoutTemplate)
  },

  /**
   * Delete a layout template
   */
  async delete(key: string): Promise<void> {
    const { error } = await supabase
      .from('layout_templates')
      .delete()
      .eq('key', key)
    
    if (error) throw error
    
    // Clear cache
    clearCache()
  },

  /**
   * Toggle enabled status
   */
  async toggleEnabled(key: string): Promise<LayoutTemplate> {
    const template = await this.getByKey(key)
    if (!template) throw new Error(`Layout template "${key}" not found`)
    
    return this.update(key, { enabled: !template.enabled })
  },

  /**
   * Duplicate a layout template with new key
   */
  async duplicate(key: string, newKey: string, newName: string): Promise<LayoutTemplate> {
    const original = await this.getByKey(key)
    if (!original) throw new Error(`Layout template "${key}" not found`)
    
    const duplicate: LayoutTemplateInput = {
      key: newKey,
      name: newName,
      description: original.description ? `Copy of ${original.description}` : undefined,
      category: original.category,
      enabled: false, // Start disabled
      spec: JSON.parse(JSON.stringify(original.spec)), // Deep copy
      copyTemplate: original.copyTemplate ? JSON.parse(JSON.stringify(original.copyTemplate)) : undefined
    }
    
    return this.create(duplicate)
  },

  /**
   * Get statistics about layouts
   */
  async getStats(): Promise<LayoutStats> {
    const all = await this.getAll()
    
    const stats: LayoutStats = {
      total: all.length,
      enabled: all.filter(t => t.enabled).length,
      disabled: all.filter(t => !t.enabled).length,
      byCategory: {} as Record<LayoutCategory, number>
    }
    
    // Count by category
    all.forEach(template => {
      const cat = template.category as LayoutCategory
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1
    })
    
    return stats
  },

  /**
   * Clear the in-memory cache (useful for testing)
   */
  clearCache() {
    clearCache()
  }
}

