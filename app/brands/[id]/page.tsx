'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Plus, Copy, Package, Download } from 'lucide-react'
import { brandService, skuService } from '@/lib/supabase'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FluidProductBrowser } from '@/components/FluidProductBrowser'

export default function BrandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = parseInt(params.id as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [skus, setSkus] = useState<SKU[]>([])
  const [loading, setLoading] = useState(true)
  const [productBrowserOpen, setProductBrowserOpen] = useState(false)

  useEffect(() => {
    loadBrandData()
  }, [brandId])

  async function loadBrandData() {
    try {
      const brandData = await brandService.getById(brandId)
      if (brandData) {
        setBrand(brandData)
        const skuData = await skuService.getByBrandId(brandId)
        setSkus(skuData)
      }
    } catch (error) {
      console.error('Failed to load brand:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createNewSKU() {
    if (!brand) return

    try {
      const newSKU: Omit<SKU, 'id' | 'createdAt' | 'updatedAt'> = {
        brandId: brand.id!,
        name: `SKU ${skus.length + 1}`,
        copy: {},
        images: {}
      }
      
      const created = await skuService.create(newSKU)
      console.log('Created SKU with ID:', created.id)
      router.push(`/brands/${brandId}/skus/${created.id}`)
    } catch (error) {
      console.error('Failed to create SKU:', error)
      alert('Failed to create SKU. Please try again.')
    }
  }

  async function duplicateSKU(skuToDuplicate: SKU, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!brand) return

    try {
      // Create a deep copy of the SKU data
      const duplicatedSKU: Omit<SKU, 'id' | 'createdAt' | 'updatedAt'> = {
        brandId: brand.id!,
        name: `${skuToDuplicate.name} (Copy)`,
        copy: JSON.parse(JSON.stringify(skuToDuplicate.copy || {})), // Deep clone copy
        images: JSON.parse(JSON.stringify(skuToDuplicate.images || {})), // Deep clone images
        productInformation: skuToDuplicate.productInformation,
        colorOverrides: skuToDuplicate.colorOverrides ? JSON.parse(JSON.stringify(skuToDuplicate.colorOverrides)) : undefined
      }
      
      const created = await skuService.create(duplicatedSKU)
      console.log('Duplicated SKU with ID:', created.id)
      
      // Reload SKUs to show the new one
      await loadBrandData()
      
      // Navigate to the new SKU
      router.push(`/brands/${brandId}/skus/${created.id}`)
    } catch (error) {
      console.error('Failed to duplicate SKU:', error)
      alert('Failed to duplicate SKU')
    }
  }

  async function handleProductImport(product: any) {
    if (!brand) return

    try {
      // Create SKU from Fluid product
      const newSKU: Omit<SKU, 'id' | 'createdAt' | 'updatedAt'> = {
        brandId: brand.id!,
        name: product.title,
        productInformation: product.description || `SKU: ${product.sku}\nPrice: ${product.currency || '$'}${product.price}`,
        copy: {},
        images: {
          productPrimary: product.mainImage,
          // Map additional images if available
          ...(product.images?.[1]?.url && { productAngle: product.images[1].url }),
          ...(product.images?.[2]?.url && { productDetail: product.images[2].url }),
        },
        // Save Fluid metadata for future uploads
        fluidMetadata: {
          productId: product.id,
          variantId: product.variants?.[0]?.id, // Save first variant ID if available
          productSlug: product.slug,
          productTitle: product.title
        }
      }
      
      const created = await skuService.create(newSKU)
      console.log('Created SKU from Fluid product:', created.id)
      
      // Reload SKUs to show the new one
      await loadBrandData()
      
      // Navigate to the new SKU
      router.push(`/brands/${brandId}/skus/${created.id}`)
    } catch (error) {
      console.error('Failed to import product:', error)
      alert('Failed to import product from Fluid')
    }
  }

  if (loading) {
    return (
      <AdminLayout currentBrandId={brandId}>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Loading...' }]} />
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  if (!brand) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Not Found' }]} />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Brand not found</CardTitle>
              <CardDescription className="mb-4">
                This brand may have been deleted or doesn't exist.
              </CardDescription>
              <Link href="/">
                <Button>Go to All Brands</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentBrandId={brandId}>
      <PageHeader 
        breadcrumbs={[
          { label: 'All Brands', href: '/' },
          { label: brand.name }
        ]} 
      />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{brand.name}</h1>
          <p className="text-muted-foreground">
            {skus.length} SKU{skus.length !== 1 ? 's' : ''} • {skus.length * 14} layouts available
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Brand DNA</CardTitle>
              <Link href={`/brands/${brandId}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
            <CardDescription>
              Colors, typography, and design system for this brand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Color Palette</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(brand.colors).slice(0, 8).map(([key, color]) => (
                    <div 
                      key={key}
                      className="group relative"
                    >
                      <div
                        className="w-12 h-12 rounded-md border shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={`${key}: ${color}`}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Typography</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Font Family</span>
                    <span className="font-medium">{brand.fonts.family}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-muted-foreground">Text Styles</span>
                    <Badge variant="secondary">{Object.keys(brand.fonts.sizes).length} styles</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>SKUs</CardTitle>
                <CardDescription>
                  Product variations with unique copy and images
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setProductBrowserOpen(true)} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Import from Fluid
                </Button>
                <Button onClick={createNewSKU} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add SKU
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {skus.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-lg mb-2">No SKUs yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first SKU to start generating posts
                </CardDescription>
                <Button onClick={createNewSKU}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First SKU
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skus.map((sku) => (
                  <Card 
                    key={sku.id}
                    className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50 relative"
                  >
                    <Link href={`/brands/${brandId}/skus/${sku.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {sku.name}
                          </CardTitle>
                          {sku.images.productPrimary && (
                            <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img 
                                src={sku.images.productPrimary} 
                                alt={sku.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(sku.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary">14 layouts</Badge>
                        </div>
                      </CardContent>
                    </Link>
                    <Button
                      onClick={(e) => duplicateSKU(sku, e)}
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Duplicate SKU"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fluid Product Browser */}
      <FluidProductBrowser
        open={productBrowserOpen}
        onClose={() => setProductBrowserOpen(false)}
        onSelect={handleProductImport}
        brandFluidDam={brand?.fluidDam}
      />
    </AdminLayout>
  )
}

