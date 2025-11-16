'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Sparkles, X, Upload, Palette } from 'lucide-react'
import { brandService } from '@/lib/supabase'
import { uploadImage, STORAGE_BUCKETS } from '@/lib/supabase-storage'
import { Brand } from '@/types/brand'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function BrandEditPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = parseInt(params.id as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generatingSchemes, setGeneratingSchemes] = useState(false)
  const [colorSchemes, setColorSchemes] = useState<Array<{ name: string; description: string; colors: Brand['colors'] }>>([])
  const [selectedSchemeIndex, setSelectedSchemeIndex] = useState<number | null>(null)

  useEffect(() => {
    loadBrand()
  }, [brandId])

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

  function updateColor(colorKey: keyof Brand['colors'], value: string) {
    if (!brand) return
    setBrand({
      ...brand,
      colors: {
        ...brand.colors,
        [colorKey]: value
      }
    })
  }

  function updateFontSize(key: keyof Brand['fonts']['sizes'], value: number) {
    if (!brand) return
    setBrand({
      ...brand,
      fonts: {
        ...brand.fonts,
        sizes: {
          ...brand.fonts.sizes,
          [key]: value
        }
      }
    })
  }

  function updateFontWeight(key: keyof Brand['fonts']['weights'], value: number) {
    if (!brand) return
    setBrand({
      ...brand,
      fonts: {
        ...brand.fonts,
        weights: {
          ...brand.fonts.weights,
          [key]: value
        }
      }
    })
  }

  function updateFontFamily(value: string) {
    if (!brand) return
    setBrand({
      ...brand,
      fonts: {
        ...brand.fonts,
        family: value
      }
    })
  }

  async function handleImageUpload(imageKey: keyof Brand['images'], file: File) {
    if (!brand) return
    
    try {
      // Show loading state (use base64 preview while uploading)
    const reader = new FileReader()
    reader.onloadend = () => {
      if (!brand) return
      setBrand({
        ...brand,
        images: {
          ...brand.images,
          [imageKey]: reader.result as string
        }
      })
    }
    reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const path = `brand-${brand.id}/${imageKey}-${Date.now()}`
      const publicUrl = await uploadImage(STORAGE_BUCKETS.BRAND_IMAGES, file, path)
      
      // Update with final cloud URL
      setBrand({
        ...brand,
        images: {
          ...brand.images,
          [imageKey]: publicUrl
        }
      })
      
      console.log('Image uploaded to cloud:', publicUrl)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Using local preview.')
      // Fallback to base64 if upload fails
    }
  }

  async function generateColorSchemes() {
    if (!brand) return

    setGeneratingSchemes(true)
    try {
      const response = await fetch('/api/generate-color-schemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandKnowledge: brand.knowledge,
          brandName: brand.name,
          currentColors: brand.colors
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate color schemes')
      }

      const data = await response.json()
      setColorSchemes(data.schemes)
      setSelectedSchemeIndex(0) // Select first scheme by default
    } catch (error: any) {
      console.error('Error generating color schemes:', error)
      alert(`Failed to generate color schemes: ${error.message || 'Unknown error'}`)
    } finally {
      setGeneratingSchemes(false)
    }
  }

  function applyColorScheme(schemeIndex: number) {
    if (!brand || !colorSchemes[schemeIndex]) return
    
    const scheme = colorSchemes[schemeIndex]
    setBrand({
      ...brand,
      colors: { ...scheme.colors }
    })
    setSelectedSchemeIndex(schemeIndex)
  }

  function previewColorScheme(schemeIndex: number) {
    if (!brand || !colorSchemes[schemeIndex]) return
    
    const scheme = colorSchemes[schemeIndex]
    setBrand({
      ...brand,
      colors: { ...scheme.colors }
    })
    setSelectedSchemeIndex(schemeIndex)
  }

  if (loading) {
    return (
      <AdminLayout currentBrandId={brandId}>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Edit DNA' }]} />
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

  if (!brand) {
    return (
      <AdminLayout>
        <PageHeader breadcrumbs={[{ label: 'All Brands', href: '/' }, { label: 'Not Found' }]} />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Palette className="h-12 w-12 text-muted-foreground mb-4" />
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
          { label: brand.name, href: `/brands/${brandId}` },
          { label: 'Edit DNA' }
        ]} 
      />
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Brand DNA</h1>
              <p className="text-muted-foreground">
                Colors, fonts, and images that apply to ALL SKUs
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Brand DNA'}
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="design">Typography & Images</TabsTrigger>
              <TabsTrigger value="content">Integrations</TabsTrigger>
            </TabsList>

            {/* Tab 1: Overview */}
            <TabsContent value="overview" className="space-y-6">
              {/* Brand Name */}
              <Card>
            <CardHeader>
              <CardTitle>Brand Name</CardTitle>
              <CardDescription>The name of your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="text-2xl font-semibold h-12"
              />
            </CardContent>
          </Card>

          {/* Brand Knowledge */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Knowledge</CardTitle>
              <CardDescription>Information about your brand's voice and context. This will be used by AI to generate content for all SKUs.</CardDescription>
            </CardHeader>
            <CardContent>
            
            <div className="space-y-6">
              {/* Brand Voice */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Brand Voice & Way of Talking
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Describe your brand's tone, style, and how you communicate. Examples: "Casual and friendly", "Professional and authoritative", "Playful and energetic"
                </p>
                <Textarea
                  value={brand.knowledge?.brandVoice || ''}
                  onChange={(e) => setBrand({
                    ...brand,
                    knowledge: {
                      ...brand.knowledge,
                      brandVoice: e.target.value
                    }
                  })}
                  placeholder="Example: Our brand speaks in a confident, science-backed tone. We use clear, direct language without jargon. We're friendly but professional, focusing on real results and benefits..."
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              {/* Brand Information */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Brand Information & Context
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  General information about your brand, mission, values, target audience, and any important context. Think of this like a Claude project knowledge base.
                </p>
                <Textarea
                  value={brand.knowledge?.information || ''}
                  onChange={(e) => setBrand({
                    ...brand,
                    knowledge: {
                      ...brand.knowledge,
                      information: e.target.value
                    }
                  })}
                  placeholder="Example: Make Wellness is a premium supplement brand focused on peptides and longevity. Our target audience is health-conscious adults aged 30-55 who value science-backed products. We emphasize quality, transparency, and real results..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </div>
            </CardContent>
          </Card>
            </TabsContent>

            {/* Tab 2: Colors */}
            <TabsContent value="colors" className="space-y-6">
          {/* Color Palette */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Color Palette</CardTitle>
                  <CardDescription>10 theme colors that apply to ALL layouts for ALL SKUs</CardDescription>
                </div>
                <Button
                  onClick={generateColorSchemes}
                  disabled={generatingSchemes || !brand.knowledge}
                  variant="outline"
                >
                  {generatingSchemes ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Schemes
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>

            {/* AI Generated Color Schemes */}
            {colorSchemes.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">AI Generated Color Schemes</h3>
                    <p className="text-xs text-gray-600 mt-1">Click a scheme to preview, then apply to use it</p>
                  </div>
                  <Button
                    onClick={() => {
                      setColorSchemes([])
                      setSelectedSchemeIndex(null)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {colorSchemes.map((scheme, index) => (
                    <div
                      key={index}
                      onClick={() => previewColorScheme(index)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSchemeIndex === index
                          ? 'border-purple-500 bg-white shadow-md'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-900">{scheme.name}</span>
                        {selectedSchemeIndex === index && (
                          <span className="text-xs text-purple-600">✓ Previewing</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{scheme.description}</p>
                      <div className="grid grid-cols-5 gap-1">
                        {Object.entries(scheme.colors).slice(0, 5).map(([key, color]) => (
                          <div
                            key={key}
                            className="w-full aspect-square rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={`${key}: ${color}`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-1 mt-1">
                        {Object.entries(scheme.colors).slice(5).map(([key, color]) => (
                          <div
                            key={key}
                            className="w-full aspect-square rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={`${key}: ${color}`}
                          />
                        ))}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          applyColorScheme(index)
                        }}
                        size="sm"
                        className="w-full mt-2 text-xs"
                        variant={selectedSchemeIndex === index ? "default" : "outline"}
                      >
                        {selectedSchemeIndex === index ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!brand.knowledge && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  💡 Fill in Brand Knowledge (above) to enable AI color scheme generation
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(brand.colors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-lg border hover:border-gray-300 transition-colors">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key as keyof Brand['colors'], e.target.value)}
                    className="w-12 h-12 rounded-md cursor-pointer border-2"
                  />
                  <div className="flex-grow">
                    <Label className="text-xs font-semibold mb-2 block">{key}</Label>
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) => updateColor(key as keyof Brand['colors'], e.target.value)}
                      className="font-mono text-xs h-8"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
            </CardContent>
          </Card>
            </TabsContent>

            {/* Tab 3: Typography & Images */}
            <TabsContent value="design" className="space-y-6">
          {/* Typography System */}
          <Card>
            <CardHeader>
              <CardTitle>Typography System</CardTitle>
              <CardDescription>Font settings apply to ALL layouts for ALL SKUs</CardDescription>
            </CardHeader>
            <CardContent>
            
            {/* Font Family */}
            <div className="mb-6">
              <Label className="mb-2 block">Font Family</Label>
              <Select value={brand.fonts.family} onValueChange={updateFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter (Default)</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Raleway">Raleway</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">Used across all text in all layouts</p>
            </div>
            
            <Separator className="my-6" />

            {/* Font Sizes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Font Sizes (pixels)</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(brand.fonts.sizes).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs">
                      {key.toUpperCase()} - {key === 'display' ? 'Giant Text' : ['h1', 'h2'].includes(key) ? 'Headlines' : key === 'body' ? 'Body Text' : key === 'overline' ? 'Labels' : key === 'badge' ? 'Badges' : 'CTA Buttons'}
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="12"
                        max="320"
                        value={value}
                        onChange={(e) => updateFontSize(key as keyof Brand['fonts']['sizes'], parseInt(e.target.value))}
                        className="flex-grow"
                      />
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => updateFontSize(key as keyof Brand['fonts']['sizes'], parseInt(e.target.value))}
                        className="w-20 text-center font-mono h-8 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />

            {/* Font Weights */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Font Weights</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(brand.fonts.weights).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs">{key.toUpperCase()}</Label>
                    <Select 
                      value={value.toString()} 
                      onValueChange={(v) => updateFontWeight(key as keyof Brand['fonts']['weights'], parseInt(v))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Regular (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semi Bold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                        <SelectItem value="800">Extra Bold (800)</SelectItem>
                        <SelectItem value="900">Black (900)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Brand Images */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Images</CardTitle>
              <CardDescription>Upload logos and backgrounds used across multiple layouts</CardDescription>
            </CardHeader>
            <CardContent>
            
            <div className="grid grid-cols-3 gap-6">
              {/* Logo Horizontal */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Horizontal)</label>
                {brand.images.logoHorizontal ? (
                  <div className="relative">
                    <img 
                      src={brand.images.logoHorizontal} 
                      alt="Logo Horizontal"
                      className="w-full h-24 object-contain bg-gray-100 rounded"
                    />
                    <button
                      onClick={() => setBrand({
                        ...brand,
                        images: { ...brand.images, logoHorizontal: undefined }
                      })}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                    <span className="text-sm text-gray-500">Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('logoHorizontal', file)
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Logo Square */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Square)</label>
                {brand.images.logoSquare ? (
                  <div className="relative">
                    <img 
                      src={brand.images.logoSquare} 
                      alt="Logo Square"
                      className="w-full h-24 object-contain bg-gray-100 rounded"
                    />
                    <button
                      onClick={() => setBrand({
                        ...brand,
                        images: { ...brand.images, logoSquare: undefined }
                      })}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                    <span className="text-sm text-gray-500">Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('logoSquare', file)
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Background Hero */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background (Hero)</label>
                {brand.images.backgroundHero ? (
                  <div className="relative">
                    <img 
                      src={brand.images.backgroundHero} 
                      alt="Background Hero"
                      className="w-full h-32 object-cover bg-gray-100 rounded"
                    />
                    <button
                      onClick={() => setBrand({
                        ...brand,
                        images: { ...brand.images, backgroundHero: undefined }
                      })}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                    <span className="text-sm text-gray-500">Upload Background</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('backgroundHero', file)
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Background Alt */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background (Alt)</label>
                {brand.images.backgroundAlt ? (
                  <div className="relative">
                    <img 
                      src={brand.images.backgroundAlt} 
                      alt="Background Alt"
                      className="w-full h-32 object-cover bg-gray-100 rounded"
                    />
                    <button
                      onClick={() => setBrand({
                        ...brand,
                        images: { ...brand.images, backgroundAlt: undefined }
                      })}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                    <span className="text-sm text-gray-500">Upload Background</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('backgroundAlt', file)
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Background Benefits */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background (Benefits/Badges)</label>
                {brand.images.backgroundBenefits ? (
                  <div className="relative">
                    <img 
                      src={brand.images.backgroundBenefits} 
                      alt="Background Benefits"
                      className="w-full h-32 object-cover bg-gray-100 rounded"
                    />
                    <button
                      onClick={() => setBrand({
                        ...brand,
                        images: { ...brand.images, backgroundBenefits: undefined }
                      })}
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                    <span className="text-sm text-gray-500">Upload Background</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload('backgroundBenefits', file)
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Typography Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Typography Preview</CardTitle>
              <CardDescription>See how your fonts look with your colors</CardDescription>
            </CardHeader>
            <CardContent>
            <div 
              className="space-y-4 p-6 rounded-lg"
              style={{ 
                backgroundColor: brand.colors.bg,
                fontFamily: brand.fonts.family
              }}
            >
              <p style={{ 
                fontSize: `${brand.fonts.sizes.h1}px`, 
                fontWeight: brand.fonts.weights.h1,
                color: brand.colors.text,
                lineHeight: brand.fonts.lineHeights.h1,
                margin: 0
              }}>
                H1 Headline Text
              </p>
              <p style={{ 
                fontSize: `${brand.fonts.sizes.h2}px`, 
                fontWeight: brand.fonts.weights.h2,
                color: brand.colors.text,
                lineHeight: brand.fonts.lineHeights.h2,
                margin: 0
              }}>
                H2 Secondary Headline
              </p>
              <p style={{ 
                fontSize: `${brand.fonts.sizes.body}px`, 
                fontWeight: brand.fonts.weights.body,
                color: brand.colors.textSecondary,
                lineHeight: brand.fonts.lineHeights.body,
                margin: 0
              }}>
                Body text for descriptions and longer content that needs to be readable.
              </p>
              <p style={{ 
                fontSize: `${brand.fonts.sizes.overline}px`, 
                fontWeight: brand.fonts.weights.overline,
                color: brand.colors.textSecondary,
                lineHeight: brand.fonts.lineHeights.overline,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: 0
              }}>
                Overline Label Text
              </p>
              <p style={{ 
                fontSize: `${brand.fonts.sizes.cta}px`, 
                fontWeight: brand.fonts.weights.cta,
                color: brand.colors.bg,
                backgroundColor: brand.colors.primary,
                padding: '12px 24px',
                borderRadius: '8px',
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0
              }}>
                Call to Action Button
              </p>
            </div>
            </CardContent>
          </Card>
            </TabsContent>

            {/* Tab 4: Integrations */}
            <TabsContent value="content" className="space-y-6">
          {/* Fluid DAM Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Fluid DAM Integration</CardTitle>
              <CardDescription>
                Configure Fluid DAM credentials to import products and push generated images back to Fluid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">What is this?</h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• <strong>Import Products:</strong> Browse and import products from your Fluid catalog</li>
                    <li>• <strong>Use DAM Assets:</strong> Pull images from Fluid DAM for your SKU layouts</li>
                    <li>• <strong>Push to Fluid:</strong> Upload generated marketing images back to Fluid product pages</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fluidApiToken" className="text-sm font-semibold mb-2 block">
                      Fluid API Token
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your Fluid API token for authentication. Find this in your Fluid settings.
                    </p>
                    <Input
                      id="fluidApiToken"
                      type="password"
                      value={brand.fluidDam?.apiToken || ''}
                      onChange={(e) => setBrand({
                        ...brand,
                        fluidDam: {
                          ...brand.fluidDam,
                          apiToken: e.target.value
                        }
                      })}
                      placeholder="Enter your Fluid API token"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fluidBaseUrl" className="text-sm font-semibold mb-2 block">
                      Fluid Base URL
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your Fluid instance URL (e.g., https://yourbrand.fluid.app)
                    </p>
                    <Input
                      id="fluidBaseUrl"
                      type="url"
                      value={brand.fluidDam?.baseUrl || ''}
                      onChange={(e) => setBrand({
                        ...brand,
                        fluidDam: {
                          ...brand.fluidDam,
                          baseUrl: e.target.value
                        }
                      })}
                      placeholder="https://yourbrand.fluid.app"
                      className="font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fluidSubdomain" className="text-sm font-semibold mb-2 block">
                      Fluid Subdomain (Optional)
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your Fluid subdomain (e.g., "yourbrand" from yourbrand.fluid.app)
                    </p>
                    <Input
                      id="fluidSubdomain"
                      type="text"
                      value={brand.fluidDam?.subdomain || ''}
                      onChange={(e) => setBrand({
                        ...brand,
                        fluidDam: {
                          ...brand.fluidDam,
                          subdomain: e.target.value
                        }
                      })}
                      placeholder="yourbrand"
                      className="font-mono"
                    />
                  </div>
                </div>

                {brand.fluidDam?.apiToken && brand.fluidDam?.baseUrl && (
                  <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs text-green-800 dark:text-green-200">
                      ✓ Fluid DAM is configured! You can now:
                    </p>
                    <ul className="text-xs text-green-700 dark:text-green-300 mt-1 ml-4">
                      <li>• Import products from Fluid on the brand page</li>
                      <li>• Browse DAM assets when editing SKU images</li>
                      <li>• Push generated images to Fluid product pages</li>
                    </ul>
                  </div>
                )}

                {(!brand.fluidDam?.apiToken || !brand.fluidDam?.baseUrl) && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      💡 Both API Token and Base URL are required to enable Fluid integration
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-6">
            <Link href={`/brands/${brandId}`}>
              <Button variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

