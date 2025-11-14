import { createClient } from '@supabase/supabase-js'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using fallback mode.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database types
export interface DatabaseBrand {
  id: number
  name: string
  colors: Brand['colors']
  fonts: Brand['fonts']
  images: Brand['images']
  knowledge?: Brand['knowledge']
  fluid_dam?: Brand['fluidDam']
  created_at: string
  updated_at: string
}

export interface DatabaseSKU {
  id: number
  brand_id: number
  name: string
  color_overrides?: SKU['colorOverrides']
  image_overrides?: SKU['imageOverrides']
  copy: SKU['copy']
  images: SKU['images']
  product_information?: string
  created_at: string
  updated_at: string
}

// Helper to convert database format to app format
export const dbBrandToBrand = (dbBrand: DatabaseBrand): Brand => ({
  id: dbBrand.id,
  name: dbBrand.name,
  colors: dbBrand.colors,
  fonts: dbBrand.fonts,
  images: dbBrand.images,
  knowledge: dbBrand.knowledge,
  fluidDam: dbBrand.fluid_dam,
  createdAt: new Date(dbBrand.created_at),
  updatedAt: new Date(dbBrand.updated_at)
})

export const brandToDbBrand = (brand: Brand): Partial<DatabaseBrand> => ({
  name: brand.name,
  colors: brand.colors,
  fonts: brand.fonts,
  images: brand.images,
  knowledge: brand.knowledge,
  fluid_dam: brand.fluidDam
})

export const dbSKUToSKU = (dbSKU: DatabaseSKU): SKU => ({
  id: dbSKU.id,
  brandId: dbSKU.brand_id,
  name: dbSKU.name,
  colorOverrides: dbSKU.color_overrides,
  imageOverrides: dbSKU.image_overrides,
  copy: dbSKU.copy,
  images: dbSKU.images,
  productInformation: dbSKU.product_information,
  createdAt: new Date(dbSKU.created_at),
  updatedAt: new Date(dbSKU.updated_at)
})

export const skuToDbSKU = (sku: SKU): Partial<DatabaseSKU> => ({
  brand_id: sku.brandId,
  name: sku.name,
  color_overrides: sku.colorOverrides,
  image_overrides: sku.imageOverrides,
  copy: sku.copy,
  images: sku.images,
  product_information: sku.productInformation
})

// Brand operations
export const brandService = {
  async getAll(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data as DatabaseBrand[]).map(dbBrandToBrand)
  },

  async getById(id: number): Promise<Brand | null> {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return dbBrandToBrand(data as DatabaseBrand)
  },

  async create(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .insert([brandToDbBrand(brand as Brand)])
      .select()
      .single()
    
    if (error) throw error
    return dbBrandToBrand(data as DatabaseBrand)
  },

  async update(id: number, updates: Partial<Brand>): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update(brandToDbBrand(updates as Brand))
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return dbBrandToBrand(data as DatabaseBrand)
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// SKU operations
export const skuService = {
  async getAll(): Promise<SKU[]> {
    const { data, error } = await supabase
      .from('skus')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data as DatabaseSKU[]).map(dbSKUToSKU)
  },

  async getById(id: number): Promise<SKU | null> {
    const { data, error } = await supabase
      .from('skus')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return dbSKUToSKU(data as DatabaseSKU)
  },

  async getByBrandId(brandId: number): Promise<SKU[]> {
    const { data, error } = await supabase
      .from('skus')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data as DatabaseSKU[]).map(dbSKUToSKU)
  },

  async create(sku: Omit<SKU, 'id' | 'createdAt' | 'updatedAt'>): Promise<SKU> {
    const { data, error } = await supabase
      .from('skus')
      .insert([skuToDbSKU(sku as SKU)])
      .select()
      .single()
    
    if (error) throw error
    return dbSKUToSKU(data as DatabaseSKU)
  },

  async update(id: number, updates: Partial<SKU>): Promise<SKU> {
    const { data, error } = await supabase
      .from('skus')
      .update(skuToDbSKU(updates as SKU))
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return dbSKUToSKU(data as DatabaseSKU)
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('skus')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

