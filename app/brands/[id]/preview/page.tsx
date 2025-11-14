'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Eye } from 'lucide-react'
import { db } from '@/lib/db'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function BrandPreviewPage() {
  const params = useParams()
  const brandId = parseInt(params.id as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [skus, setSkus] = useState<SKU[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [brandId])

  async function loadData() {
    try {
      const [brandData, skuData] = await Promise.all([
        db.brands.get(brandId),
        db.skus.where('brandId').equals(brandId).toArray()
      ])
      
      if (brandData) setBrand(brandData)
      setSkus(skuData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Preview' }]} />
        <div className="flex-1 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
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
              <Link href="/">
                <Button>Go to All Brands</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  if (skus.length === 0) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: brand.name, href: `/brands/${brandId}` }, { label: 'Preview' }]} />
        <div className="flex-1 p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="text-2xl mb-2">No SKUs to Preview</CardTitle>
              <CardDescription className="mb-6">
                Create at least one SKU to preview layouts
              </CardDescription>
              <Link href={`/brands/${brandId}`}>
                <Button>Add First SKU</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <PageHeader 
        breadcrumbs={[
          { label: 'All Brands', href: '/' },
          { label: brand.name, href: `/brands/${brandId}` },
          { label: 'Preview' }
        ]} 
      />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{brand.name} - All SKUs</h1>
            <p className="text-muted-foreground">
              {skus.length} SKU{skus.length !== 1 ? 's' : ''} • Click any SKU to preview its layouts
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skus.map((sku) => (
              <Link key={sku.id} href={`/brands/${brandId}/skus/${sku.id}/preview`}>
                <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {sku.name}
                      </CardTitle>
                      {sku.images.productPrimary && (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img 
                            src={sku.images.productPrimary} 
                            alt={sku.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {sku.copy.hero1?.headline || 'No headline set'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Eye className="h-4 w-4" />
                      <span>View Layouts →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">💡 Tip: Brand DNA</CardTitle>
              <CardDescription className="text-blue-800">
                All SKUs inherit this brand's colors and fonts. Change the brand DNA to update all layouts at once!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/brands/${brandId}/edit`}>
                <Button>Edit Brand DNA</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

