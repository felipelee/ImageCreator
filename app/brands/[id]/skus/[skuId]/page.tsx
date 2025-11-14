'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Save, Eye, Sparkles, Package, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, X, Download, Loader2 } from 'lucide-react'
import { db } from '@/lib/db'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from '@/components/ui/drawer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ComparisonLayout } from '@/components/layouts/ComparisonLayout'
import { TestimonialLayout } from '@/components/layouts/TestimonialLayout'
import { BenefitsLayout } from '@/components/layouts/BenefitsLayout'
import { BigStatLayout } from '@/components/layouts/BigStatLayout'
import { MultiStatsLayout} from '@/components/layouts/MultiStatsLayout'
import { PromoProductLayout } from '@/components/layouts/PromoProductLayout'
import { BottleListLayout } from '@/components/layouts/BottleListLayout'
import { TimelineLayout } from '@/components/layouts/TimelineLayout'
import { generateColorVariations, applyColorVariation, ColorVariation } from '@/lib/color-variations'
import { renderLayout } from '@/lib/render-engine'

export default function SKUEditorPage() {
  const params = useParams()
  const brandId = parseInt(params.id as string)
  const skuId = parseInt(params.skuId as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [sku, setSKU] = useState<SKU | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'copy' | 'images'>('copy')
  const [expandedLayout, setExpandedLayout] = useState<'compare' | 'testimonial' | 'benefits' | 'bigStat' | 'multiStats' | 'promoProduct' | 'bottleList' | 'timeline' | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [colorVariations, setColorVariations] = useState<ColorVariation[]>([])
  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0)
  const [previewBrand, setPreviewBrand] = useState<Brand | null>(null)
  const [rendering, setRendering] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png')

  // Refs for downloading
  const compareRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const bigStatRef = useRef<HTMLDivElement>(null)
  const multiStatsRef = useRef<HTMLDivElement>(null)
  const promoProductRef = useRef<HTMLDivElement>(null)
  const bottleListRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [brandId, skuId])

  // Update preview brand when brand changes (but keep variations if active)
  useEffect(() => {
    if (!brand) return
    
    if (expandedLayout && colorVariations.length > 0 && currentVariationIndex < colorVariations.length) {
      // Re-apply current variation with updated brand
      const variation = colorVariations[currentVariationIndex]
      const modifiedBrand = applyColorVariation(brand, variation)
      setPreviewBrand(modifiedBrand)
    } else {
      setPreviewBrand(brand)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand])

  async function loadData() {
    try {
      const [brandData, skuData] = await Promise.all([
        db.brands.get(brandId),
        db.skus.get(skuId)
      ])
      
      if (brandData) {
        setBrand(brandData)
        setPreviewBrand(brandData)
      }
      if (skuData) setSKU(skuData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  function initializeColorVariations(layoutKey: string) {
    if (!brand) return
    
    const variations = generateColorVariations(brand, layoutKey)
    setColorVariations(variations)
    setCurrentVariationIndex(0)
    
    // Apply first variation
    if (variations.length > 0) {
      const modifiedBrand = applyColorVariation(brand, variations[0])
      setPreviewBrand(modifiedBrand)
    }
  }

  function shuffleColorVariation(direction: 'next' | 'prev' = 'next') {
    if (!brand || colorVariations.length === 0) return
    
    let newIndex: number
    if (direction === 'next') {
      newIndex = (currentVariationIndex + 1) % colorVariations.length
    } else {
      newIndex = currentVariationIndex === 0 ? colorVariations.length - 1 : currentVariationIndex - 1
    }
    
    setCurrentVariationIndex(newIndex)
    const variation = colorVariations[newIndex]
    const modifiedBrand = applyColorVariation(brand, variation)
    setPreviewBrand(modifiedBrand)
  }

  async function handleSave() {
    if (!sku || !brand) return
    
    setSaving(true)
    try {
      // Save both SKU and Brand (in case colors were changed)
      await Promise.all([
        db.skus.update(sku.id!, {
          ...sku,
          updatedAt: new Date()
        }),
        db.brands.update(brand.id!, {
          ...brand,
          updatedAt: new Date()
        })
      ])
      alert('Saved successfully!')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function updateBrandColor(colorKey: string, newValue: string) {
    if (!brand) return
    setBrand({
      ...brand,
      colors: {
        ...brand.colors,
        [colorKey]: newValue
      }
    })
  }

  function updateFieldColorMapping(layoutKey: string, fieldLabel: string, newColorKey: string) {
    if (!sku) return
    setSKU({
      ...sku,
      colorOverrides: {
        ...sku.colorOverrides,
        [layoutKey]: {
          ...(sku.colorOverrides?.[layoutKey] || {}),
          [fieldLabel]: newColorKey
        }
      }
    })
  }

  function getFieldColor(layoutKey: string, fieldLabel: string, defaultColorKey: string): string {
    return sku?.colorOverrides?.[layoutKey]?.[fieldLabel] || defaultColorKey
  }

  function updateFieldImageMapping(layoutKey: string, fieldLabel: string, newImageKey: string) {
    if (!sku) return
    setSKU({
      ...sku,
      imageOverrides: {
        ...sku.imageOverrides,
        [layoutKey]: {
          ...(sku.imageOverrides?.[layoutKey] || {}),
          [fieldLabel]: newImageKey
        }
      }
    })
  }

  function getFieldImage(layoutKey: string, fieldLabel: string, defaultImageKey: string): string {
    return sku?.imageOverrides?.[layoutKey]?.[fieldLabel] || defaultImageKey
  }

  function updateSKUField(field: keyof SKU, value: any) {
    if (!sku) return
    setSKU({ ...sku, [field]: value })
  }

  async function generateWithAI() {
    if (!sku || !brand) {
      alert('Please ensure both brand and SKU data are loaded.')
      return
    }

    // Check if we have the necessary information
    if (!brand.knowledge?.brandVoice && !brand.knowledge?.information && !sku.productInformation) {
      alert('Please fill in at least one of the following:\n- Brand Voice (in Brand DNA)\n- Brand Information (in Brand DNA)\n- Product Information (above)')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandKnowledge: brand.knowledge,
          productInformation: sku.productInformation,
          skuName: sku.name
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const data = await response.json()
      const generatedContent = data.content

      // Update SKU with generated content
      if (!sku) return

      setSKU({
        ...sku,
        copy: {
          ...sku.copy,
          ...generatedContent
        }
      })

      alert('Content generated successfully! Review and adjust as needed.')
    } catch (error: any) {
      console.error('Error generating content:', error)
      alert(`Failed to generate content: ${error.message || 'Unknown error'}\n\nMake sure OPENAI_API_KEY is set in your environment variables.`)
    } finally {
      setGenerating(false)
    }
  }

  function updateCopyField(section: string, field: string, value: string) {
    if (!sku) return
    setSKU({
      ...sku,
      copy: {
        ...sku.copy,
        [section]: {
          ...(sku.copy[section as keyof typeof sku.copy] || {}),
          [field]: value
        }
      }
    })
  }

  async function handleImageUpload(imageKey: keyof SKU['images'], file: File) {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (!sku) return
      setSKU({
        ...sku,
        images: {
          ...sku.images,
          [imageKey]: reader.result as string
        }
      })
    }
    reader.readAsDataURL(file)
  }

  async function downloadAll() {
    if (!brand || !sku) return

    const layouts = [
      { name: 'Comparison', ref: compareRef },
      { name: 'Testimonial', ref: testimonialRef },
      { name: 'Benefits', ref: benefitsRef },
      { name: 'BigStat', ref: bigStatRef },
      { name: 'MultiStats', ref: multiStatsRef },
      { name: 'PromoProduct', ref: promoProductRef },
      { name: 'BottleList', ref: bottleListRef },
      { name: 'Timeline', ref: timelineRef }
    ]

    setRendering(true)
    try {
      for (const layout of layouts) {
        if (!layout.ref.current) continue
        
        const blob = await renderLayout(layout.ref.current, {
          scale: 2,
          format: downloadFormat,
          quality: downloadFormat === 'jpg' ? 0.95 : undefined
        })
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${brand.name}_${sku.name}_${layout.name}.${downloadFormat}`
        a.click()
        URL.revokeObjectURL(url)
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      alert(`All 8 layouts downloaded as ${downloadFormat.toUpperCase()}!`)
    } catch (error) {
      console.error('Failed to download all:', error)
      alert('Failed to download some layouts')
    } finally {
      setRendering(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Loading...' }]} />
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
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
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">SKU not found</CardTitle>
              <CardDescription className="mb-4">
                This SKU may have been deleted or doesn't exist.
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

  // Apply image overrides to SKU
  function getDisplaySKU(layoutKey: string | null): SKU {
    if (!sku || !layoutKey) return sku
    
    const imageOverridesForLayout = sku.imageOverrides?.[layoutKey] || {}
    const updatedImages = { ...sku.images }
    
    // Apply image overrides - map field labels to actual image keys
    Object.entries(imageOverridesForLayout).forEach(([fieldLabel, newImageKey]) => {
      // Find the field to get the original imageKey
      const field = copyFieldsByLayout
        .find(l => l.layoutKey === layoutKey)
        ?.fields.find(f => f.label === fieldLabel)
      
      if (field && field.type === 'image') {
        const originalKey = field.imageKey as keyof typeof sku.images
        const images = field.imageType === 'brand' ? brand.images : sku.images
        const newImageValue = images[newImageKey as keyof typeof images]
        if (newImageValue) {
          updatedImages[originalKey] = newImageValue
        }
      }
    })
    
    return { ...sku, images: updatedImages }
  }

  // Render preview based on selected layout
  function renderPreview() {
    if (!brand || !sku || !expandedLayout) return null
    
    // Use previewBrand if available (for color variations), otherwise use brand
    const displayBrand = previewBrand || brand
    const displaySKU = getDisplaySKU(expandedLayout)
    
    const scale = 0.28
    const layoutName = copyFieldsByLayout.find(l => l.layoutKey === expandedLayout)?.layoutName || 'Layout'
    const currentVariation = colorVariations[currentVariationIndex]
    
    return (
      <div className="sticky top-8">
        <div className="bg-card rounded-xl border shadow-lg overflow-hidden">
          {/* Preview Header */}
          <div className="px-4 py-3 border-b bg-muted/50 dark:bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold">Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                {colorVariations.length > 0 && (
                  <>
                    <Button
                      onClick={() => shuffleColorVariation('prev')}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      title="Previous color variation"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <div className="text-xs text-muted-foreground min-w-[120px] text-center">
                      {currentVariation?.name || 'Default'}
                      <span className="text-muted-foreground/60 ml-1">
                        ({currentVariationIndex + 1}/{colorVariations.length})
                      </span>
                    </div>
                    <Button
                      onClick={() => shuffleColorVariation('next')}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      title="Next color variation"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </>
                )}
                <Badge variant="secondary" className="text-xs">Real-time</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{layoutName}</p>
              {currentVariation && (
                <p className="text-xs text-muted-foreground italic">{currentVariation.description}</p>
              )}
            </div>
          </div>
          
          {/* Preview Canvas */}
          <div className="p-6 bg-muted/30 dark:bg-muted/10">
            <div 
              style={{ 
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '1080px',
                height: '1080px',
              }}
              className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-border"
            >
              {expandedLayout === 'compare' && <ComparisonLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'testimonial' && <TestimonialLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'benefits' && <BenefitsLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'bigStat' && <BigStatLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'multiStats' && <MultiStatsLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'promoProduct' && <PromoProductLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'bottleList' && <BottleListLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'timeline' && <TimelineLayout brand={displayBrand} sku={displaySKU} />}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function openLayoutEditor(layoutKey: 'compare' | 'testimonial' | 'benefits' | 'bigStat' | 'multiStats' | 'promoProduct' | 'bottleList' | 'timeline') {
    setExpandedLayout(layoutKey)
    initializeColorVariations(layoutKey)
    setDrawerOpen(true)
  }

  function closeLayoutEditor() {
    setDrawerOpen(false)
    // Small delay before clearing to allow drawer animation to complete
    setTimeout(() => {
      setExpandedLayout(null)
      setPreviewBrand(brand)
      setColorVariations([])
    }, 300)
  }

  // Clean SVG icons for each layout type
  function getLayoutIcon(layoutKey: string) {
    const iconMap: Record<string, JSX.Element> = {
      'compare': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      'testimonial': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      'benefits': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'bigStat': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      'multiStats': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'promoProduct': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      'bottleList': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      'timeline': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return iconMap[layoutKey] || (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }

  // Copy field definitions organized by layout with sections
  const copyFieldsByLayout = [
    {
      layoutName: 'Comparison: Ours vs Theirs',
      layoutSize: '1080×1080',
      layoutKey: 'compare' as const,
      fields: [
        { type: 'background', colorKey: 'bg', label: 'Background Color' },
        { section: 'compare', field: 'headline', label: 'Headline', placeholder: 'COMPARE THE DIFFERENCE', type: 'textarea', colors: ['text'] },
        { section: 'compare', field: 'leftLabel', label: 'Left Label (Your Product)', placeholder: 'Natural Peptides', colors: ['bg', 'accent'] },
        { section: 'compare', field: 'rightLabel', label: 'Right Label (Their Product)', placeholder: 'Synthetic Alternatives', colors: ['textSecondary', 'bgAlt'] },
        { section: 'compare', field: 'row1_label', label: 'Row 1 Feature', placeholder: 'No DIY math or mixing', colors: ['text'] },
        { section: 'compare', field: 'row2_label', label: 'Row 2 Feature', placeholder: 'Plain-language instructions', colors: ['text'] },
        { section: 'compare', field: 'row3_label', label: 'Row 3 Feature', placeholder: 'No research chemical loopholes', colors: ['text'] },
        { section: 'compare', field: 'row4_label', label: 'Row 4 Feature', placeholder: 'Independent lab COAs you can verify', colors: ['text'] },
      ]
    },
    {
      layoutName: 'Testimonial: Photo + Quote',
      layoutSize: '1080×1080',
      layoutKey: 'testimonial' as const,
      fields: [
        { type: 'image', imageKey: 'testimonialPhoto', label: 'Background Photo', imageType: 'sku' },
        { type: 'background', colorKey: 'bg', label: 'Quote Panel Color' },
        { section: 'testimonial', field: 'quote', label: 'Quote', placeholder: 'This product has completely changed my life...', type: 'textarea', colors: ['text'] },
        { section: 'testimonial', field: 'name', label: 'Customer Name', placeholder: '- Customer Name', colors: ['text'] },
        { section: 'testimonial', field: 'ratingLabel', label: 'Rating', placeholder: '★★★★★', colors: ['accent'] },
        { section: 'testimonial', field: 'ctaStrip', label: 'CTA Strip', placeholder: 'TRY FOR 50% OFF | USE CODE SAVE50', colors: ['accent'] },
      ]
    },
    {
      layoutName: 'Benefits: Pack + Callouts',
      layoutSize: '1080×1080',
      layoutKey: 'benefits' as const,
      fields: [
        { type: 'image', imageKey: 'backgroundBenefits', label: 'Background Image', imageType: 'brand' },
        { section: 'benefits', field: 'headline', label: 'Headline', placeholder: 'Train Harder, Bounce Back Faster', type: 'textarea', colors: ['primary'] },
        { section: 'benefits', field: 'bullet1', label: 'Benefit 1 (Top Left)', placeholder: '54% better overall performance*', colors: ['primary', 'bgAlt'] },
        { section: 'benefits', field: 'bullet2', label: 'Benefit 2 (Top Right)', placeholder: '47% less muscle fatigue*', colors: ['primary', 'bgAlt'] },
        { section: 'benefits', field: 'bullet3', label: 'Benefit 3 (Bottom Right)', placeholder: '4X more muscle protein synthesis*', colors: ['primary', 'bgAlt'] },
        { section: 'benefits', field: 'bullet4', label: 'Benefit 4 (Bottom Left)', placeholder: '144% stronger strength recovery vs whey*', colors: ['primary', 'bgAlt'] },
      ]
    },
    {
      layoutName: 'Big Stat: Large Percentage',
      layoutSize: '1080×1080',
      layoutKey: 'bigStat' as const,
      fields: [
        { type: 'background', colorKey: 'bgAlt', label: 'Background Color' },
        { section: 'stat97', field: 'value', label: 'Stat Value', placeholder: '100%', colors: ['accent'] },
        { section: 'stat97', field: 'headline', label: 'Headline', placeholder: 'Naturally sourced Bioactive Precision Peptides™', type: 'textarea', colors: ['accent'] },
        { section: 'stat97', field: 'ingredient1', label: 'Ingredient 1 (Top Left)', placeholder: 'Citric Acid', colors: ['accent'] },
        { section: 'stat97', field: 'ingredient2', label: 'Ingredient 2 (Top Right)', placeholder: 'Pomelo Extract', colors: ['accent'] },
        { section: 'stat97', field: 'ingredient3', label: 'Ingredient 3 (Bottom Left)', placeholder: 'L-Theanine', colors: ['accent'] },
        { section: 'stat97', field: 'ingredient4', label: 'Ingredient 4 (Bottom Right)', placeholder: 'Methylcobalamin', colors: ['accent'] },
      ]
    },
    {
      layoutName: 'Multi Stats: Three Metrics',
      layoutSize: '1080×1080',
      layoutKey: 'multiStats' as const,
      fields: [
        { type: 'image', imageKey: 'lifestyleMultiStats', label: 'Background Image (Lifestyle)', imageType: 'sku' },
        { section: 'stats', field: 'headline', label: 'Headline', placeholder: 'People who take Make Wellness peptides are:', type: 'textarea', colors: ['bg'] },
        { section: 'stats', field: 'stat1_value', label: 'Stat 1 Value', placeholder: '78%', colors: ['bg'] },
        { section: 'stats', field: 'stat1_label', label: 'Stat 1 Label', placeholder: 'MORE LIKELY TO WAKE UP ACTUALLY RESTED', colors: ['bg'] },
        { section: 'stats', field: 'stat2_value', label: 'Stat 2 Value', placeholder: '71%', colors: ['bg'] },
        { section: 'stats', field: 'stat2_label', label: 'Stat 2 Label', placeholder: 'MORE LIKELY TO FEEL IN CONTROL OF CRAVINGS', colors: ['bg'] },
        { section: 'stats', field: 'stat3_value', label: 'Stat 3 Value', placeholder: '69%', colors: ['bg'] },
        { section: 'stats', field: 'stat3_label', label: 'Stat 3 Label', placeholder: 'MORE LIKELY TO FEEL STEADY, ALL-DAY ENERGY', colors: ['bg'] },
        { section: 'stats', field: 'disclaimer', label: 'Disclaimer', placeholder: '*Based on a 60-day study showing benefits from daily use.', colors: [] },
      ]
    },
    {
      layoutName: 'Product Promo with Badge',
      layoutSize: '1080×1080',
      layoutKey: 'promoProduct' as const,
      fields: [
        { type: 'background', colorKey: 'bg', label: 'Background Color' },
        { section: 'promo', field: 'headline', label: 'Headline', placeholder: 'Peptide fuel. Not another pre-workout.', type: 'textarea', colors: ['accent'] },
        { section: 'promo', field: 'stat1_value', label: 'Stat 1 Value', placeholder: '47%', colors: ['accent'] },
        { section: 'promo', field: 'stat1_label', label: 'Stat 1 Label', placeholder: 'LESS MUSCLE FATIGUE*', colors: ['accent'] },
        { section: 'promo', field: 'stat2_value', label: 'Stat 2 Value', placeholder: '4X', colors: ['accent'] },
        { section: 'promo', field: 'stat2_label', label: 'Stat 2 Label', placeholder: 'MORE MUSCLE PROTEIN SYNTHESIS THAN WHEY*', colors: ['accent'] },
        { section: 'promo', field: 'stat3_value', label: 'Stat 3 Value', placeholder: '144%', colors: ['accent'] },
        { section: 'promo', field: 'stat3_label', label: 'Stat 3 Label', placeholder: 'BETTER STRENGTH RECOVERY VS WHEY*', colors: ['accent'] },
        { section: 'promo', field: 'badgeNote', label: 'Badge Note', placeholder: 'First Time Order?', colors: [] },
        { section: 'promo', field: 'badge', label: 'Badge Text', placeholder: 'Unlock 10% OFF at checkout', colors: [] },
        { type: 'image', imageKey: 'promoBadge', label: 'Promo Badge Image', imageType: 'brand' },
        { type: 'image', imageKey: 'productAngle', label: 'Product Image (Angle)', imageType: 'sku', variants: ['productPrimary', 'productAngle', 'productDetail'] },
      ]
    },
    {
      layoutName: 'Bottle List: Hand Holding Product',
      layoutSize: '1080×1080',
      layoutKey: 'bottleList' as const,
      fields: [
        { type: 'background', colorKey: 'bg', label: 'Background Color' },
        { section: 'bottle', field: 'headline', label: 'Headline', placeholder: 'Stronger, Longer', colors: ['accent'] },
        { section: 'bottle', field: 'benefit1', label: 'Benefit 1 Title', placeholder: 'Stronger muscles', colors: ['accent'] },
        { section: 'bottle', field: 'benefit1_detail', label: 'Benefit 1 Description', placeholder: 'SUPPORTS MUSCLE PROTEIN SYNTHESIS AND LEAN MUSCLE REPAIR', colors: ['textSecondary'] },
        { section: 'bottle', field: 'benefit2', label: 'Benefit 2 Title', placeholder: 'Faster recovery', colors: ['accent'] },
        { section: 'bottle', field: 'benefit2_detail', label: 'Benefit 2 Description', placeholder: 'SUPPORTS MUSCLE STRENGTH RECOVERY BETWEEN WORKOUTS', colors: ['textSecondary'] },
        { section: 'bottle', field: 'benefit3', label: 'Benefit 3 Title', placeholder: 'Healthy aging', colors: ['accent'] },
        { section: 'bottle', field: 'benefit3_detail', label: 'Benefit 3 Description', placeholder: 'HELPS MAINTAIN NAD+ LEVELS TO SUPPORT LONG-TERM MUSCLE FUNCTION', colors: ['textSecondary'] },
        { type: 'image', imageKey: 'lifestyleA', label: 'Hand Holding Product Image', imageType: 'sku', variants: ['lifestyleA', 'lifestyleB', 'lifestyleC'] },
      ]
    },
    {
      layoutName: 'Timeline: Journey',
      layoutSize: '1080×1080',
      layoutKey: 'timeline' as const,
      fields: [
        { type: 'image', imageKey: 'lifestyleTimeline', label: 'Background Image (Lifestyle)', imageType: 'sku' },
        { section: 'timeline', field: 'headline', label: 'Headline', placeholder: 'Feel the change', colors: [] },
        { section: 'timeline', field: 'milestone1_time', label: 'Milestone 1 Time', placeholder: '7 Days', colors: [] },
        { section: 'timeline', field: 'milestone1_title', label: 'Milestone 1 Title', placeholder: 'Smoother, more stable energy during the day', colors: [] },
        { section: 'timeline', field: 'milestone2_time', label: 'Milestone 2 Time', placeholder: '7 Days', colors: [] },
        { section: 'timeline', field: 'milestone2_title', label: 'Milestone 2 Title', placeholder: 'Smoother, more stable energy during the day', colors: [] },
        { section: 'timeline', field: 'milestone3_time', label: 'Milestone 3 Time', placeholder: '7 Days', colors: [] },
        { section: 'timeline', field: 'milestone3_title', label: 'Milestone 3 Title', placeholder: 'Smoother, more stable energy during the day', colors: [] },
        { type: 'image', imageKey: 'productAngle', label: 'Product Image (Angle)', imageType: 'sku', variants: ['productPrimary', 'productAngle', 'productDetail'] },
      ]
    },
  ]

  return (
    <AdminLayout>
      <PageHeader 
        breadcrumbs={[
          { label: 'All Brands', href: '/' },
          { label: brand.name, href: `/brands/${brandId}` },
          { label: sku.name }
        ]} 
      />
      <div className="flex-1 p-6">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-8">
              <Input
                type="text"
                value={sku.name}
                onChange={(e) => updateSKUField('name', e.target.value)}
                className="text-2xl font-semibold border-0 shadow-none p-0 h-auto focus-visible:ring-0"
              />
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-muted-foreground">Edit content for this SKU</span>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live preview active</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={downloadFormat} onValueChange={(v) => setDownloadFormat(v as 'png' | 'jpg' | 'webp')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={downloadAll} 
                disabled={rendering}
                variant="outline"
              >
                {rendering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download All (8)
                  </>
                )}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href={`/brands/${brandId}/skus/${skuId}/preview`}>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Full Preview
                </Button>
              </Link>
            </div>
          </div>

          {/* shadcn Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'copy' | 'images')}>
            <TabsList className="bg-card border shadow-sm">
              <TabsTrigger value="copy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="mr-2 h-4 w-4" />
                Copy Fields
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ImageIcon className="mr-2 h-4 w-4" />
                Images
              </TabsTrigger>
            </TabsList>

            <TabsContent value="copy" className="mt-6">
              <div className="space-y-6">
                {/* Product Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>Product-specific details, features, benefits, and context. This will be used by AI to generate content for this SKU's ads.</CardDescription>
                      </div>
                      <Button
                        onClick={generateWithAI}
                        disabled={generating || (!brand?.knowledge?.brandVoice && !brand?.knowledge?.information && !sku.productInformation)}
                        size="lg"
                        className="ml-4"
                      >
                        {generating ? (
                          <>
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={sku.productInformation || ''}
                      onChange={(e) => updateSKUField('productInformation', e.target.value)}
                      placeholder="Example: This is our Collagen Peptide supplement. Key benefits: supports skin elasticity, joint health, and hair strength. Contains 20g of hydrolyzed collagen per serving. Third-party tested for purity. Suitable for daily use. Target audience: adults 25-65 looking for anti-aging and wellness support..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                    {(!brand?.knowledge?.brandVoice && !brand?.knowledge?.information && !sku.productInformation) && (
                      <p className="text-xs text-amber-600 mt-2">
                        ⚠️ Fill in Brand Knowledge (in Brand DNA) or Product Information above to enable AI generation
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Layout Cards Grid */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Layout Templates</h3>
                    <p className="text-sm text-muted-foreground mt-1">Click a layout to edit content and preview</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {copyFieldsByLayout.map((layout) => {
                      const layoutSKU = getDisplaySKU(layout.layoutKey)
                      return (
                        <Card 
                          key={layout.layoutKey}
                          className="cursor-pointer transition-all hover:shadow-xl hover:scale-[1.01] hover:border-primary/50 group overflow-hidden"
                          onClick={() => openLayoutEditor(layout.layoutKey)}
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              {/* Live Preview Thumbnail */}
                              <div className="aspect-square bg-muted/30 dark:bg-muted/10 overflow-hidden relative">
                                <div 
                                  style={{ 
                                    transform: 'scale(0.24)',
                                    transformOrigin: 'top left',
                                    width: '1080px',
                                    height: '1080px',
                                  }}
                                  className="absolute top-0 left-0"
                                >
                                  {layout.layoutKey === 'compare' && <ComparisonLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'testimonial' && <TestimonialLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'benefits' && <BenefitsLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'bigStat' && <BigStatLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'multiStats' && <MultiStatsLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'promoProduct' && <PromoProductLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'bottleList' && <BottleListLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'timeline' && <TimelineLayout brand={brand} sku={layoutSKU} />}
                                </div>
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                    Click to edit
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Card Footer */}
                            <div className="p-4 border-t bg-card">
                              <p className="text-sm font-semibold leading-tight mb-2">{layout.layoutName}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-normal py-0 h-4">
                                  {layout.layoutSize}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {layout.fields.length} fields
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="images" className="mt-6">
              <div className="space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {(['productPrimary', 'productAngle', 'productDetail'] as const).map((key) => (
                  <div key={key} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">
                      {key.replace('product', '')}
                    </label>
                    {sku.images[key] ? (
                      <div className="relative">
                        <img 
                          src={sku.images[key]} 
                          alt={key}
                          className="w-full h-32 object-contain"
                        />
                        <button
                          onClick={() => {
                            setSKU({
                              ...sku,
                              images: { ...sku.images, [key]: undefined }
                            })
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary">
                        <span className="text-sm text-muted-foreground">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(key, file)
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>

            {/* Comparison Images */}
            <Card>
              <CardHeader>
                <CardTitle>Comparison Images</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {(['comparisonOurs', 'comparisonTheirs'] as const).map((key) => (
                  <div key={key} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {key === 'comparisonOurs' ? 'Your Product' : 'Their Product'}
                    </label>
                    {sku.images[key] ? (
                      <div className="relative">
                        <img 
                          src={sku.images[key]} 
                          alt={key}
                          className="w-full h-32 object-contain rounded-full"
                        />
                        <button
                          onClick={() => {
                            setSKU({
                              ...sku,
                              images: { ...sku.images, [key]: undefined }
                            })
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary">
                        <span className="text-sm text-muted-foreground">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(key, file)
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>

            {/* Ingredient Images */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredient Images (Circular)</CardTitle>
                <CardDescription>Used in Big Stat layout - will be displayed as circles</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {(['ingredientA', 'ingredientB', 'ingredientC', 'ingredientD'] as const).map((key, index) => (
                  <div key={key} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ingredient {String.fromCharCode(65 + index)}
                    </label>
                    {sku.images[key] ? (
                      <div className="relative">
                        <img 
                          src={sku.images[key]} 
                          alt={key}
                          className="w-full h-24 object-cover rounded-full"
                        />
                        <button
                          onClick={() => {
                            setSKU({
                              ...sku,
                              images: { ...sku.images, [key]: undefined }
                            })
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded-full hover:border-primary transition-colors">
                        <span className="text-xs text-muted-foreground">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(key, file)
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>

            {/* Testimonial Image */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonial Image</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Testimonial Photo (Full Background)
                </label>
                {sku.images.testimonialPhoto ? (
                  <div className="relative">
                    <img 
                      src={sku.images.testimonialPhoto} 
                      alt="Testimonial"
                      className="w-full h-64 object-cover rounded"
                    />
                    <button
                      onClick={() => {
                        setSKU({
                          ...sku,
                          images: { ...sku.images, testimonialPhoto: undefined }
                        })
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 text-sm rounded font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary transition-colors">
                    <svg className="w-12 h-12 text-muted-foreground/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-muted-foreground font-medium">Upload Client Photo</span>
                    <span className="text-xs text-muted-foreground/60 mt-1">Lifestyle photo with customer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('testimonialPhoto', file)
                      }}
                    />
                  </label>
                )}
              </div>
              </CardContent>
            </Card>

            {/* Lifestyle Images */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Images</CardTitle>
                <CardDescription>Used in Bottle List, Timeline, Multi Stats, and other layouts - hand holding product, in-use, styled shots, background images</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {(['lifestyleA', 'lifestyleB', 'lifestyleC', 'lifestyleTimeline', 'lifestyleMultiStats'] as const).map((key, index) => (
                  <div key={key} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {index === 0 ? 'Hand Holding Product' : index === 1 ? 'In Use' : index === 2 ? 'Styled Shot' : index === 3 ? 'Timeline Background' : 'Multi Stats Background'}
                    </label>
                    {sku.images[key] ? (
                      <div className="relative">
                        <img 
                          src={sku.images[key]} 
                          alt={key}
                          className="w-full h-48 object-contain rounded"
                        />
                        <button
                          onClick={() => {
                            setSKU({
                              ...sku,
                              images: { ...sku.images, [key]: undefined }
                            })
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-48 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary transition-colors">
                        <svg className="w-12 h-12 text-muted-foreground/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-muted-foreground font-medium">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(key, file)
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Layout Editor Drawer */}
          <Drawer open={drawerOpen} onOpenChange={(open) => !open && closeLayoutEditor()}>
            <DrawerContent className="max-h-[90vh]">
              <div className="overflow-auto">
                <DrawerHeader className="border-b sticky top-0 bg-background z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        {expandedLayout && getLayoutIcon(expandedLayout)}
                      </div>
                      <div>
                        <DrawerTitle>
                          {expandedLayout && copyFieldsByLayout.find(l => l.layoutKey === expandedLayout)?.layoutName}
                        </DrawerTitle>
                        <DrawerDescription>
                          Edit content and customize colors • Changes update in real-time
                        </DrawerDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {colorVariations.length > 0 && (
                        <>
                          <Button
                            onClick={() => shuffleColorVariation('prev')}
                            variant="outline"
                            size="sm"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <div className="text-xs text-muted-foreground min-w-[140px] text-center">
                            <div className="font-medium">{colorVariations[currentVariationIndex]?.name || 'Default'}</div>
                            <div className="text-[10px]">
                              {currentVariationIndex + 1} of {colorVariations.length}
                            </div>
                          </div>
                          <Button
                            onClick={() => shuffleColorVariation('next')}
                            variant="outline"
                            size="sm"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        size="sm"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Close
                        </Button>
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerHeader>

                <div className="grid grid-cols-2 gap-6 p-6">
                  {/* Left: Preview */}
                  <div className="sticky top-6 h-fit">
                    {renderPreview()}
                  </div>

                  {/* Right: Edit Fields - Table Layout */}
                  <div>
                    {expandedLayout && (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase w-1/4">
                                Field
                              </th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                                Content
                              </th>
                              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase w-48">
                                Theme Colors
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {copyFieldsByLayout
                              .find((l) => l.layoutKey === expandedLayout)
                              ?.fields.map((field, fieldIndex) => {
                                // Handle background color rows
                                if (field.type === 'background') {
                                  const defaultColorKey = field.colorKey
                                  const currentColorKey = getFieldColor(expandedLayout, field.label, defaultColorKey)
                                  const colorValue = brand.colors[currentColorKey as keyof typeof brand.colors]
                                  const isOverridden = currentColorKey !== defaultColorKey

                                  return (
                                    <tr key={fieldIndex} className="border-b hover:bg-muted/30 transition-colors">
                                      <td className="px-4 py-3 align-middle">
                                        <Label className="text-sm font-medium">{field.label}</Label>
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        <span className="text-xs text-muted-foreground">Select theme color →</span>
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        <Select
                                          value={currentColorKey}
                                          onValueChange={(newColor) => updateFieldColorMapping(expandedLayout, field.label, newColor)}
                                        >
                                          <SelectTrigger className="h-9">
                                            <div className="flex items-center gap-2">
                                              <div
                                                className="w-4 h-4 rounded border flex-shrink-0"
                                                style={{ backgroundColor: colorValue }}
                                              />
                                              <span className="text-xs">{currentColorKey}</span>
                                              {isOverridden && (
                                                <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-auto">
                                                  Custom
                                                </Badge>
                                              )}
                                            </div>
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Object.entries(brand.colors).map(([key, value]) => (
                                              <SelectItem key={key} value={key}>
                                                <div className="flex items-center gap-2">
                                                  <div
                                                    className="w-4 h-4 rounded border"
                                                    style={{ backgroundColor: value }}
                                                  />
                                                  <span className="text-xs">{key}</span>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </td>
                                    </tr>
                                  )
                                }

                                // Handle image rows
                                if (field.type === 'image') {
                                  const currentImageKey = getFieldImage(expandedLayout, field.label, field.imageKey)
                                  const imageSource = field.imageType === 'brand'
                                    ? brand.images[currentImageKey as keyof typeof brand.images]
                                    : sku.images[currentImageKey as keyof typeof sku.images]
                                  
                                  // Get all available images based on type
                                  const availableImages = field.imageType === 'brand'
                                    ? Object.entries(brand.images).filter(([_, value]) => value)
                                    : Object.entries(sku.images).filter(([_, value]) => value)
                                  
                                  const isOverridden = currentImageKey !== field.imageKey

                                  return (
                                    <tr key={fieldIndex} className="border-b hover:bg-muted/30 transition-colors">
                                      <td className="px-4 py-3 align-middle">
                                        <Label className="text-sm font-medium">{field.label}</Label>
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        {availableImages.length > 0 ? (
                                          <Select
                                            value={currentImageKey}
                                            onValueChange={(newImageKey) => updateFieldImageMapping(expandedLayout, field.label, newImageKey)}
                                          >
                                            <SelectTrigger className="h-auto py-2">
                                              <div className="flex items-center gap-2">
                                                {imageSource ? (
                                                  <img
                                                    src={imageSource}
                                                    alt={currentImageKey}
                                                    className="w-12 h-12 object-cover rounded border flex-shrink-0"
                                                  />
                                                ) : (
                                                  <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center flex-shrink-0">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                  </div>
                                                )}
                                                <div className="flex-1 text-left">
                                                  <div className="text-xs font-medium">{currentImageKey}</div>
                                                  <div className="text-[10px] text-muted-foreground">
                                                    {field.imageType === 'brand' ? 'Brand' : 'SKU'} • 
                                                    {isOverridden && ' Custom'}
                                                    {!isOverridden && ' Default'}
                                                  </div>
                                                </div>
                                              </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                              {availableImages.map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                  <div className="flex items-center gap-2">
                                                    <img
                                                      src={value}
                                                      alt={key}
                                                      className="w-10 h-10 object-cover rounded border"
                                                    />
                                                    <div>
                                                      <div className="text-xs font-medium">{key}</div>
                                                      <div className="text-[10px] text-muted-foreground">
                                                        {field.imageType === 'brand' ? 'Brand' : 'SKU'}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        ) : (
                                          <div className="text-xs text-muted-foreground">No images uploaded</div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        <span className="text-xs text-muted-foreground">—</span>
                                      </td>
                                    </tr>
                                  )
                                }

                                // Handle regular copy fields
                                const section = sku.copy[field.section as keyof typeof sku.copy] as any
                                const value = section?.[field.field] || ''

                                return (
                                  <tr key={fieldIndex} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 align-top">
                                      <Label className="text-sm font-medium">{field.label}</Label>
                                    </td>
                                    <td className="px-4 py-3">
                                      {field.type === 'textarea' ? (
                                        <Textarea
                                          value={value}
                                          onChange={(e) => updateCopyField(field.section, field.field, e.target.value)}
                                          placeholder={field.placeholder}
                                          rows={2}
                                          className="resize-none text-sm"
                                        />
                                      ) : (
                                        <Input
                                          type="text"
                                          value={value}
                                          onChange={(e) => updateCopyField(field.section, field.field, e.target.value)}
                                          placeholder={field.placeholder}
                                          className="text-sm"
                                        />
                                      )}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                      {field.colors && field.colors.length > 0 ? (
                                        <div className="space-y-2">
                                          {field.colors.map((defaultColorKey, colorIndex) => {
                                            const currentColorKey = getFieldColor(expandedLayout, field.label, defaultColorKey)
                                            const colorValue = brand.colors[currentColorKey as keyof typeof brand.colors]
                                            const isOverridden = currentColorKey !== defaultColorKey

                                            return (
                                              <Select
                                                key={colorIndex}
                                                value={currentColorKey}
                                                onValueChange={(newColor) =>
                                                  updateFieldColorMapping(expandedLayout, field.label, newColor)
                                                }
                                              >
                                                <SelectTrigger className="h-8">
                                                  <div className="flex items-center gap-2">
                                                    <div
                                                      className="w-3.5 h-3.5 rounded border flex-shrink-0"
                                                      style={{ backgroundColor: colorValue }}
                                                    />
                                                    <span className="text-xs">{currentColorKey}</span>
                                                    {isOverridden && (
                                                      <Badge variant="secondary" className="text-[10px] h-3.5 px-1 ml-auto">
                                                        ✓
                                                      </Badge>
                                                    )}
                                                  </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Object.entries(brand.colors).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                      <div className="flex items-center gap-2">
                                                        <div
                                                          className="w-3.5 h-3.5 rounded border"
                                                          style={{ backgroundColor: value }}
                                                        />
                                                        <span className="text-xs">{key}</span>
                                                      </div>
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            )
                                          })}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-muted-foreground">—</span>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>

          {/* Hidden render targets for downloads */}
          <div className="fixed -left-[10000px] -top-[10000px] pointer-events-none">
            <div ref={compareRef}>
              <ComparisonLayout brand={brand} sku={sku} />
            </div>
            <div ref={testimonialRef}>
              <TestimonialLayout brand={brand} sku={sku} />
            </div>
            <div ref={benefitsRef}>
              <BenefitsLayout brand={brand} sku={sku} />
            </div>
            <div ref={bigStatRef}>
              <BigStatLayout brand={brand} sku={sku} />
            </div>
            <div ref={multiStatsRef}>
              <MultiStatsLayout brand={brand} sku={sku} />
            </div>
            <div ref={promoProductRef}>
              <PromoProductLayout brand={brand} sku={sku} />
            </div>
            <div ref={bottleListRef}>
              <BottleListLayout brand={brand} sku={sku} />
            </div>
            <div ref={timelineRef}>
              <TimelineLayout brand={brand} sku={sku} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

