'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Palette, Type, Image, Plug } from 'lucide-react'
import { brandService } from '@/lib/supabase'
import { Brand } from '@/types/brand'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  NameEditSheet, 
  ColorEditSheet, 
  FontEditSheet, 
  ImageEditSheet, 
  IntegrationEditSheet 
} from '@/components/brands/BrandEditSheets'

type ActiveSheet = 'name' | 'colors' | 'fonts' | 'images' | 'integrations' | null

export default function BrandEditPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = parseInt(params.id as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null)

  useEffect(() => {
    loadBrand()
  }, [brandId])

  // Load Google Font for preview
  useEffect(() => {
    if (brand?.fonts.family) {
      const existingLink = document.getElementById('brand-font-preview')
      if (existingLink) {
        existingLink.remove()
      }

      const link = document.createElement('link')
      link.id = 'brand-font-preview'
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${brand.fonts.family.replace(/ /g, '+')}:wght@400;600;700&display=swap`
      document.head.appendChild(link)
    }
  }, [brand?.fonts.family])

  async function loadBrand() {
    try {
      const brandData = await brandService.getById(brandId)
      if (brandData) setBrand(brandData)
    } catch (error) {
      console.error('Failed to load brand:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!brand) return
    
    setSaving(true)
    try {
      await brandService.update(brand.id!, brand)
      alert('Brand saved successfully!')
      router.push(`/brands/${brandId}`)
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save brand')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout currentBrandId={brandId}>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Edit DNA' }]} />
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-40 w-full" />
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
              <Palette className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Brand not found</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                This brand may have been deleted or doesn't exist.
              </p>
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
          { label: brand.name, href: `/brands/${brandId}` },
          { label: 'Edit DNA' }
        ]} 
      />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Brand DNA</h1>
              <p className="text-muted-foreground">
                Colors, fonts, and images that apply to ALL SKUs
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {/* Card-based Layout */}
          <div className="grid gap-6">
            {/* Brand Name & Knowledge Card */}
            <Card 
              onClick={() => setActiveSheet('name')} 
              className="cursor-pointer hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Brand name and knowledge
                    </p>
                    {brand.knowledge?.brandVoice && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-semibold mb-1">Voice:</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {brand.knowledge.brandVoice}
                        </p>
                      </div>
                    )}
                  </div>
                  <Palette className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>

            {/* Fonts Card */}
            <Card 
              onClick={() => setActiveSheet('fonts')} 
              className="cursor-pointer hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">Fonts</h3>
                    <div className="flex gap-8 items-center">
                      <div className="text-center">
                        <div 
                          className="text-6xl mb-2 font-bold" 
                          style={{ fontFamily: brand.fonts.family }}
                        >
                          Aa
                        </div>
                        <p className="text-sm font-medium">{brand.fonts.family}</p>
                      </div>
                    </div>
                  </div>
                  <Type className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>

            {/* Colors Card */}
            <Card 
              onClick={() => setActiveSheet('colors')} 
              className="cursor-pointer hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">Colors</h3>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(brand.colors).map(([key, color]) => (
                        <div key={key} className="flex flex-col items-center gap-2">
                          <div 
                            className="w-14 h-14 rounded-full border-2 border-gray-200 shadow-sm" 
                            style={{ backgroundColor: color }} 
                          />
                          <span className="text-xs font-mono text-muted-foreground">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Palette className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>

            {/* Images Card */}
            <Card 
              onClick={() => setActiveSheet('images')} 
              className="cursor-pointer hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">Brand Images</h3>
                    <div className="flex gap-4 flex-wrap">
                      {brand.images.logoHorizontal ? (
                        <div className="relative">
                          <img 
                            src={brand.images.logoHorizontal} 
                            alt="Logo"
                            className="h-16 max-w-[120px] object-contain border rounded p-2 bg-muted"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                            Logo
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 w-24 border-2 border-dashed rounded flex items-center justify-center text-xs text-muted-foreground bg-muted/50">
                          + Add logo
                        </div>
                      )}
                      {brand.images.backgroundHero && (
                        <div className="relative">
                          <img 
                            src={brand.images.backgroundHero} 
                            alt="Background"
                            className="h-16 w-24 object-cover border rounded"
                          />
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                            BG
                          </div>
                        </div>
                      )}
                      {!brand.images.logoHorizontal && !brand.images.backgroundHero && (
                        <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                      )}
                    </div>
                  </div>
                  <Image className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>

            {/* Integrations Card */}
            <Card 
              onClick={() => setActiveSheet('integrations')} 
              className="cursor-pointer hover:border-primary transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Integrations</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        {brand.fluidDam?.apiToken ? (
                          <span className="text-green-600 dark:text-green-400">✓ Fluid DAM connected</span>
                        ) : (
                          <span className="text-muted-foreground">Connect Fluid DAM</span>
                        )}
                      </p>
                      <p className="text-sm">
                        {brand.instagram?.accessToken ? (
                          <span className="text-green-600 dark:text-green-400">✓ Instagram connected</span>
                        ) : (
                          <span className="text-muted-foreground">Connect Instagram</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Plug className="h-5 w-5 text-muted-foreground ml-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Link href={`/brands/${brandId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Sheets */}
      {brand && (
        <>
          <NameEditSheet 
            open={activeSheet === 'name'} 
            onOpenChange={(open) => setActiveSheet(open ? 'name' : null)} 
            brand={brand}
            setBrand={setBrand}
          />
          <ColorEditSheet 
            open={activeSheet === 'colors'} 
            onOpenChange={(open) => setActiveSheet(open ? 'colors' : null)} 
            brand={brand}
            setBrand={setBrand}
          />
          <FontEditSheet 
            open={activeSheet === 'fonts'} 
            onOpenChange={(open) => setActiveSheet(open ? 'fonts' : null)} 
            brand={brand}
            setBrand={setBrand}
          />
          <ImageEditSheet 
            open={activeSheet === 'images'} 
            onOpenChange={(open) => setActiveSheet(open ? 'images' : null)} 
            brand={brand}
            setBrand={setBrand}
          />
          <IntegrationEditSheet 
            open={activeSheet === 'integrations'} 
            onOpenChange={(open) => setActiveSheet(open ? 'integrations' : null)} 
            brand={brand}
            setBrand={setBrand}
          />
        </>
      )}
    </AdminLayout>
  )
}
