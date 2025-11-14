'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import { brandService, skuService } from '@/lib/supabase'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TestimonialLayout } from '@/components/layouts/TestimonialLayout'
import { ComparisonLayout } from '@/components/layouts/ComparisonLayout'
import { BenefitsLayout } from '@/components/layouts/BenefitsLayout'
import { BigStatLayout } from '@/components/layouts/BigStatLayout'
import { MultiStatsLayout } from '@/components/layouts/MultiStatsLayout'
import { PromoProductLayout } from '@/components/layouts/PromoProductLayout'
import { BottleListLayout } from '@/components/layouts/BottleListLayout'
import { TimelineLayout } from '@/components/layouts/TimelineLayout'
import { PriceComparisonLayout } from '@/components/layouts/PriceComparisonLayout'
import { StatementLayout } from '@/components/layouts/StatementLayout'
import { renderLayout } from '@/lib/render-engine'
import JSZip from 'jszip'

export default function PreviewPage() {
  const params = useParams()
  const brandId = parseInt(params.id as string)
  const skuId = parseInt(params.skuId as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [sku, setSKU] = useState<SKU | null>(null)
  const [loading, setLoading] = useState(true)
  const [rendering, setRendering] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png')

  const testimonialRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const bigStatRef = useRef<HTMLDivElement>(null)
  const multiStatsRef = useRef<HTMLDivElement>(null)
  const promoProductRef = useRef<HTMLDivElement>(null)
  const bottleListRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const priceComparisonRef = useRef<HTMLDivElement>(null)
  const statementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [brandId, skuId])

  async function loadData() {
    try {
      const [brandData, skuData] = await Promise.all([
        brandService.getById(brandId),
        skuService.getById(skuId)
      ])
      
      if (brandData) setBrand(brandData)
      if (skuData) setSKU(skuData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function downloadLayout(layoutName: string, layoutType: string, format: 'png' | 'jpg' | 'webp') {
    if (!brand || !sku) return
    
    setRendering(true)
    try {
      const blob = await renderLayout(layoutType, brand, sku, { 
        scale: 2, 
        format: format,
        quality: format === 'jpg' ? 0.95 : undefined
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brand?.name}_${sku?.name}_${layoutName}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to render:', error)
      alert('Failed to render layout')
    } finally {
      setRendering(false)
    }
  }

  async function downloadAll() {
    if (!brand || !sku) return

    const layouts = [
      { name: 'Testimonial', type: 'testimonial' },
      { name: 'Comparison', type: 'comparison' },
      { name: 'Benefits', type: 'benefits' },
      { name: 'BigStat', type: 'bigStat' },
      { name: 'MultiStats', type: 'multiStats' },
      { name: 'PromoProduct', type: 'promoProduct' },
      { name: 'BottleList', type: 'bottleList' },
      { name: 'Timeline', type: 'timeline' },
      { name: 'PriceComparison', type: 'priceComparison' },
      { name: 'Statement', type: 'statement' }
    ]

    setRendering(true)
    try {
      // Create a new ZIP file
      const zip = new JSZip()
      
      // Render and add each layout to the ZIP using the new API
      for (const layout of layouts) {
        try {
          const blob = await renderLayout(layout.type, brand, sku, {
            scale: 2,
            format: downloadFormat,
            quality: downloadFormat === 'jpg' ? 0.95 : undefined
          })
          
          // Add the blob to the ZIP with a filename
          const filename = `${brand.name}_${sku.name}_${layout.name}.${downloadFormat}`
          zip.file(filename, blob)
        } catch (error) {
          console.error(`Failed to render ${layout.name}:`, error)
          // Continue with other layouts even if one fails
        }
      }
      
      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })
      
      // Download the ZIP file
      const url = URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
      a.download = `${brand.name}_${sku.name}_All_Layouts.zip`
        a.click()
        URL.revokeObjectURL(url)
        
      alert(`All 10 layouts downloaded as a ZIP file!`)
    } catch (error) {
      console.error('Failed to download all:', error)
      alert('Failed to download layouts. Please try again.')
    } finally {
      setRendering(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Loading...', href: '#' }, { label: 'Preview' }]} />
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-48" />
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    )
  }

  if (!brand || !sku) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Not Found' }]} />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Download className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Preview not available</CardTitle>
              <CardDescription className="mb-4">
                Could not load brand or SKU data
              </CardDescription>
              <Link href={`/brands/${brandId}`}>
                <Button>Back to Brand</Button>
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
          { label: sku.name, href: `/brands/${brandId}/skus/${skuId}` },
          { label: 'Preview' }
        ]} 
      />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{brand.name} - {sku.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary">9 of 19 layouts</Badge>
                <span className="text-sm text-muted-foreground">Full preview mode</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Export:</span>
              <Select value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'png' | 'jpg' | 'webp')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">
                    <div className="flex items-center justify-between w-full">
                      <span>PNG</span>
                      <span className="text-xs text-muted-foreground ml-4">Lossless</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="jpg">
                    <div className="flex items-center justify-between w-full">
                      <span>JPG</span>
                      <span className="text-xs text-muted-foreground ml-4">Smaller</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="webp">
                    <div className="flex items-center justify-between w-full">
                      <span>WebP</span>
                      <span className="text-xs text-muted-foreground ml-4">Best</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={downloadAll}
                disabled={rendering}
              >
                {rendering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download All (9)
                  </>
                )}
              </Button>
            </div>
          </div>

        <div className="space-y-6">
          {/* Testimonial Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Testimonial: Photo + Quote</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('Testimonial', testimonialRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={testimonialRef}>
                  <TestimonialLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Comparison: Ours vs Theirs</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('Comparison', comparisonRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={comparisonRef}>
                  <ComparisonLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Benefits: Pack + Callouts</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('Benefits', benefitsRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={benefitsRef}>
                  <BenefitsLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Big Stat Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Big Stat: Large Percentage</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('BigStat', bigStatRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={bigStatRef}>
                  <BigStatLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi Stats Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Multi Stats: Three Metrics</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('MultiStats', multiStatsRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={multiStatsRef}>
                  <MultiStatsLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo Product Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Promo with Badge</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('PromoProduct', promoProductRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={promoProductRef}>
                  <PromoProductLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottle List Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bottle List: Hand Holding Product</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('BottleList', bottleListRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={bottleListRef}>
                  <BottleListLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Timeline: Journey</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('Timeline', timelineRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={timelineRef}>
                  <TimelineLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Comparison Layout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price Comparison: Value vs Competition</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">1080×1080</Badge>
                  </CardDescription>
                </div>
                <Button onClick={() => downloadLayout('PriceComparison', priceComparisonRef, downloadFormat)} disabled={rendering} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {rendering ? 'Rendering...' : 'Download'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={priceComparisonRef}>
                  <PriceComparisonLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statement Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Statement</CardTitle>
              <CardDescription>Bold question with product and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center rounded-lg overflow-hidden border bg-muted/30">
                <div ref={statementRef}>
                  <StatementLayout brand={brand} sku={sku} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <Badge variant="secondary">
            10 of 19 layouts implemented • 9 more coming soon
          </Badge>
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}

