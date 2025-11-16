'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft, Code, FileText, Edit3, Maximize2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { LayoutTemplate } from '@/types/layout-template'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { VisualEditorModal } from '@/components/layout-editor/VisualEditorModal'
import { getLayoutElements } from '@/lib/layout-element-definitions'

// Import layout specs (source of truth)
import { COMPARISON_SPEC } from '@/lib/layouts/specs/comparison-spec'
import { BIG_STAT_SPEC } from '@/lib/layouts/specs/big-stat-spec'
import { MULTI_STATS_SPEC } from '@/lib/layouts/specs/multi-stats-spec'
import { TESTIMONIAL_SPEC } from '@/lib/layouts/specs/testimonial-spec'
import { SOCIAL_PROOF_SPEC } from '@/lib/layouts/specs/social-proof-spec'
import { PROMO_PRODUCT_SPEC } from '@/lib/layouts/specs/promo-product-spec'
import { BOTTLE_LIST_SPEC } from '@/lib/layouts/specs/bottle-list-spec'
import { TIMELINE_SPEC } from '@/lib/layouts/specs/timeline-spec'
import { FEATURE_GRID_SPEC } from '@/lib/layouts/specs/feature-grid-spec'
import { PRICE_COMPARISON_SPEC } from '@/lib/layouts/specs/price-comparison-spec'
import { HERO_SPEC } from '@/lib/layouts/specs/hero-spec'
import { PACK_HERO_SPEC } from '@/lib/layouts/specs/pack-hero-spec'

// Import editable layout components
import { ComparisonLayoutEditable } from '@/components/layouts/ComparisonLayoutEditable'
import { TestimonialLayoutEditable } from '@/components/layouts/TestimonialLayoutEditable'
import { BigStatLayoutEditable } from '@/components/layouts/BigStatLayoutEditable'
import { MultiStatsLayoutEditable } from '@/components/layouts/MultiStatsLayoutEditable'
import { PromoProductLayoutEditable } from '@/components/layouts/PromoProductLayoutEditable'
import { BottleListLayoutEditable } from '@/components/layouts/BottleListLayoutEditable'
import { TimelineLayoutEditable } from '@/components/layouts/TimelineLayoutEditable'
import { FeatureGridLayoutEditable } from '@/components/layouts/FeatureGridLayoutEditable'
import { SocialProofLayoutEditable } from '@/components/layouts/SocialProofLayoutEditable'

// Sample brand and SKU data for editing
const SAMPLE_BRAND: Brand = {
  id: 1,
  name: 'Sample Brand',
  colors: {
    bg: '#F9F7F2',
    bgAlt: '#EAE0D6',
    primary: '#161716',
    primarySoft: '#DCE0D2',
    accent: '#323429',
    text: '#161716',
    textSecondary: '#6C6C6C',
    badge: '#EAD7F3',
    check: '#00B140',
    cross: '#D44B3E'
  },
  fonts: {
    family: 'Inter',
    sizes: { display: 300, h1: 72, h2: 48, body: 32, overline: 24, cta: 36, badge: 32 },
    weights: { display: 700, h1: 700, h2: 700, body: 400, overline: 600, cta: 700, badge: 700 },
    lineHeights: { display: 1.0, h1: 1.0, h2: 1.1, body: 1.4, overline: 1.2, cta: 1.1, badge: 1.4 },
    letterSpacing: { display: -14, h1: -2, h2: -1, body: 0, overline: 1, cta: 0.5, badge: 0 }
  },
  images: {},
  createdAt: new Date(),
  updatedAt: new Date()
}

const getSampleCopyForLayout = (layoutKey: string) => {
  const allCopy = {
    compare: {
      headline: 'Better Choice',
      leftLabel: 'Ours',
      rightLabel: 'Theirs',
      row1_label: 'Natural',
      row2_label: 'Effective',
      row3_label: 'Safe',
      row4_label: 'Tested'
    },
    testimonial: {
      quote: 'Amazing product!',
      name: 'Jane Doe',
      ratingLabel: '⭐⭐⭐⭐⭐',
      ctaStrip: 'Try Now'
    },
    stat97: {
      value: '97%',
      headline: 'Customer Satisfaction',
      ingredient1: 'Quality',
      ingredient2: 'Fresh',
      ingredient3: 'Pure',
      ingredient4: 'Natural'
    },
    stats: {
      headline: 'Proven Results',
      stat1_value: '78%',
      stat1_label: 'Better',
      stat2_value: '71%',
      stat2_label: 'Faster',
      stat3_value: '69%',
      stat3_label: 'Stronger',
      disclaimer: '*Results vary'
    },
    promo: {
      headline: 'Limited Offer',
      stat1_value: '50%',
      stat1_label: 'Off',
      stat2_value: '100+',
      stat2_label: 'Reviews',
      stat3_value: '24h',
      stat3_label: 'Shipping',
      badge: 'Sale',
      badgeNote: 'Today Only'
    },
    bottle: {
      headline: 'Premium Quality',
      benefit1: 'Strong',
      benefit1_detail: 'BUILDS MUSCLE',
      benefit2: 'Fast',
      benefit2_detail: 'QUICK RECOVERY',
      benefit3: 'Pure',
      benefit3_detail: 'ALL NATURAL'
    },
    timeline: {
      headline: 'Your Journey',
      subhead: '90 days to results',
      milestone1_time: 'Day 1',
      milestone1_title: 'Start',
      milestone1_detail: 'Begin journey',
      milestone2_time: 'Day 30',
      milestone2_title: 'Progress',
      milestone2_detail: 'See changes',
      milestone3_time: 'Day 90',
      milestone3_title: 'Results',
      milestone3_detail: 'Full effect'
    },
    featureGrid: {
      headline: 'Key Features',
      feature1_icon: 'Zap',
      feature1_title: 'Fast Acting',
      feature1_desc: 'Quick results',
      feature2_icon: 'Shield',
      feature2_title: 'Safe',
      feature2_desc: 'Tested formula',
      feature3_icon: 'Leaf',
      feature3_title: 'Natural',
      feature3_desc: 'Pure ingredients',
      feature4_icon: 'Heart',
      feature4_title: 'Healthy',
      feature4_desc: 'Good for you'
    },
    socialProof: {
      headline: 'What They Say',
      review1_rating: '5',
      review1_quote: 'Amazing!',
      review1_name: 'John',
      review2_rating: '5',
      review2_quote: 'Love it',
      review2_name: 'Mary',
      review3_rating: '5',
      review3_quote: 'Best ever',
      review3_name: 'Tom'
    }
  }
  
  return {
    ...allCopy,
    [layoutKey]: allCopy[layoutKey as keyof typeof allCopy] || {}
  }
}

// Map layout keys to their spec files (source of truth)
const SPEC_MAP: Record<string, any> = {
  comparison: COMPARISON_SPEC,
  compare: COMPARISON_SPEC,
  stat97: BIG_STAT_SPEC,
  bigStat: BIG_STAT_SPEC,
  stats: MULTI_STATS_SPEC,
  multiStats: MULTI_STATS_SPEC,
  testimonial: TESTIMONIAL_SPEC,
  socialProof: SOCIAL_PROOF_SPEC,
  promoProduct: PROMO_PRODUCT_SPEC,
  bottleList: BOTTLE_LIST_SPEC,
  timeline: TIMELINE_SPEC,
  featureGrid: FEATURE_GRID_SPEC,
  priceComparison: PRICE_COMPARISON_SPEC,
  hero: HERO_SPEC,
  packHero: PACK_HERO_SPEC
}

export default function LayoutEditorPage() {
  const params = useParams()
  const router = useRouter()
  const layoutKey = params.key as string
  
  const [layout, setLayout] = useState<LayoutTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'visual' | 'metadata' | 'spec'>('visual')
  
  // Visual editor state
  const [visualEditorOpen, setVisualEditorOpen] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [specJson, setSpecJson] = useState('')
  const [copyTemplateJson, setCopyTemplateJson] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  // Working spec for visual editing (will update specJson on save)
  const [workingSpec, setWorkingSpec] = useState<any>(null)
  const [originalSpec, setOriginalSpec] = useState<any>(null)

  // Create editable SKU with sample copy
  const [editableSKU, setEditableSKU] = useState<SKU>({
    id: 1,
    brandId: 1,
    name: 'Sample Product',
    copy: getSampleCopyForLayout(layoutKey),
    images: {},
    createdAt: new Date(),
    updatedAt: new Date()
  })

  useEffect(() => {
    loadLayout()
  }, [layoutKey])

  useEffect(() => {
    // Update sample SKU when layoutKey changes
    setEditableSKU(prev => ({
      ...prev,
      copy: getSampleCopyForLayout(layoutKey)
    }))
  }, [layoutKey])

  async function loadLayout() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/layouts/${layoutKey}`)
      
      if (!res.ok) {
        toast.error('Layout not found')
        router.push('/admin/layouts')
        return
      }
      
      const data = await res.json()
      setLayout(data)
      
      // Load spec from code (source of truth), not from database
      const codeSpec = SPEC_MAP[layoutKey] || SPEC_MAP[data.key]
      
      if (!codeSpec) {
        toast.error(`No spec found for layout: ${layoutKey}`)
        console.warn(`Available specs:`, Object.keys(SPEC_MAP))
      }
      
      // Populate form with database metadata
      setName(data.name)
      setDescription(data.description || '')
      setCategory(data.category)
      setEnabled(data.enabled)
      
      // Use spec from code, not database
      setSpecJson(JSON.stringify(codeSpec, null, 2))
      setWorkingSpec(JSON.parse(JSON.stringify(codeSpec))) // Deep clone
      setOriginalSpec(JSON.parse(JSON.stringify(codeSpec))) // Deep clone
      
      setCopyTemplateJson(data.copyTemplate ? JSON.stringify(data.copyTemplate, null, 2) : '')
      setThumbnailUrl(data.thumbnailUrl || '')
    } catch (error) {
      console.error('Failed to load layout:', error)
      toast.error('Failed to load layout')
    } finally {
      setLoading(false)
    }
  }

  // Helper to convert spec format (top/left) to visual editor format (x/y)
  const convertSpecToEditorFormat = (spec: any) => {
    if (!spec || !spec.elements) return {}
    
    const converted: Record<string, any> = {}
    Object.keys(spec.elements).forEach(key => {
      const el = spec.elements[key]
      converted[key] = {
        ...el,
        x: el.left ?? el.x ?? 0,
        y: el.top ?? el.y ?? 0,
        width: el.width ?? 100,
        height: el.height ?? 100,
        rotation: el.rotation ?? 0
      }
    })
    
    console.log('[Admin Layout Editor] Converted spec elements:', Object.keys(converted))
    return converted
  }

  // Visual editor handlers - modify the spec directly
  const handleVisualPositionChange = (elementKey: string, position: { x: number; y: number }) => {
    if (!workingSpec || !workingSpec.elements[elementKey]) return
    
    setWorkingSpec((prev: any) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          top: position.y,
          left: position.x
        }
      }
    }))
  }

  const handleVisualSizeChange = (elementKey: string, size: { width: number; height: number }) => {
    if (!workingSpec || !workingSpec.elements[elementKey]) return
    
    setWorkingSpec((prev: any) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          width: size.width,
          height: size.height
        }
      }
    }))
  }

  const handleVisualRotationChange = (elementKey: string, rotation: number) => {
    if (!workingSpec || !workingSpec.elements[elementKey]) return
    
    setWorkingSpec((prev: any) => ({
      ...prev,
      elements: {
        ...prev.elements,
        [elementKey]: {
          ...prev.elements[elementKey],
          rotation
        }
      }
    }))
  }

  const handleSaveVisualChanges = () => {
    // Update specJson from workingSpec
    setSpecJson(JSON.stringify(workingSpec, null, 2))
    setHasChanges(true)
    toast.success('Visual changes applied to spec')
  }

  const handleCancelVisualChanges = () => {
    // Reload spec from original
    setWorkingSpec(JSON.parse(JSON.stringify(originalSpec)))
  }

  const handleExportSpec = async () => {
    try {
      const specToExport = workingSpec || JSON.parse(specJson)
      const formattedSpec = JSON.stringify(specToExport, null, 2)
      
      await navigator.clipboard.writeText(formattedSpec)
      toast.success('Spec copied to clipboard! Paste into the -spec.ts file and deploy.')
    } catch (error) {
      console.error('Failed to copy spec:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      
      // Validate JSON
      let spec, copyTemplate
      try {
        spec = JSON.parse(specJson)
      } catch (e) {
        toast.error('Invalid spec JSON')
        setActiveTab('spec')
        return
      }
      
      if (copyTemplateJson) {
        try {
          copyTemplate = JSON.parse(copyTemplateJson)
        } catch (e) {
          toast.error('Invalid copy template JSON')
          setActiveTab('spec')
          return
        }
      }
      
      const res = await fetch(`/api/admin/layouts/${layoutKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category,
          enabled,
          spec,
          copyTemplate,
          thumbnailUrl
        })
      })
      
      if (res.ok) {
        toast.success('Layout saved successfully')
        setHasChanges(false)
        loadLayout()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to save layout')
      }
    } catch (error) {
      console.error('Failed to save layout:', error)
      toast.error('Failed to save layout')
    } finally {
      setSaving(false)
    }
  }

  const renderEditableLayout = () => {
    const commonProps = {
      brand: SAMPLE_BRAND,
      sku: editableSKU,
      isEditMode: true,
      selectedElement,
      onSelectElement: setSelectedElement,
      onPositionChange: handleVisualPositionChange,
      onSizeChange: handleVisualSizeChange,
      onRotationChange: handleVisualRotationChange
    }

    const layoutComponents: Record<string, JSX.Element> = {
      comparison: <ComparisonLayoutEditable {...commonProps} />,
      testimonial: <TestimonialLayoutEditable {...commonProps} />,
      bigStat: <BigStatLayoutEditable {...commonProps} />,
      multiStats: <MultiStatsLayoutEditable {...commonProps} />,
      promoProduct: <PromoProductLayoutEditable {...commonProps} />,
      bottleList: <BottleListLayoutEditable {...commonProps} />,
      timeline: <TimelineLayoutEditable {...commonProps} />,
      featureGrid: <FeatureGridLayoutEditable {...commonProps} />,
      socialProof: <SocialProofLayoutEditable {...commonProps} />,
    }

    return layoutComponents[layoutKey] || (
      <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Visual editor not available for this layout type</p>
      </div>
    )
  }

  const renderPreviewLayout = () => {
    const commonProps = {
      brand: SAMPLE_BRAND,
      sku: editableSKU,
      isEditMode: false,
      selectedElement: null,
      onSelectElement: () => {},
      onPositionChange: () => {},
      onSizeChange: () => {},
      onRotationChange: () => {}
    }

    const layoutComponents: Record<string, JSX.Element> = {
      comparison: <ComparisonLayoutEditable {...commonProps} />,
      testimonial: <TestimonialLayoutEditable {...commonProps} />,
      bigStat: <BigStatLayoutEditable {...commonProps} />,
      multiStats: <MultiStatsLayoutEditable {...commonProps} />,
      promoProduct: <PromoProductLayoutEditable {...commonProps} />,
      bottleList: <BottleListLayoutEditable {...commonProps} />,
      timeline: <TimelineLayoutEditable {...commonProps} />,
      featureGrid: <FeatureGridLayoutEditable {...commonProps} />,
      socialProof: <SocialProofLayoutEditable {...commonProps} />,
    }

    return layoutComponents[layoutKey] || null
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    )
  }

  if (!layout) {
    return null
  }

  return (
    <AdminLayout>
      <PageHeader
        title={`Edit Layout: ${layout.name}`}
        description={`Editing master template for ${layout.key}`}
        breadcrumbs={[
          { label: 'Layouts', href: '/admin/layouts' },
          { label: layout.name }
        ]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/layouts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={handleExportSpec}>
              <Copy className="h-4 w-4 mr-2" />
              Export Spec
            </Button>
            {hasChanges && (
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="visual">
            <Edit3 className="h-4 w-4 mr-2" />
            Visual Editor
          </TabsTrigger>
          <TabsTrigger value="metadata">
            <FileText className="h-4 w-4 mr-2" />
            Metadata
          </TabsTrigger>
          <TabsTrigger value="spec">
            <Code className="h-4 w-4 mr-2" />
            JSON
          </TabsTrigger>
        </TabsList>

        {/* Visual Editor Tab */}
        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle>Visual Layout Editor</CardTitle>
                  <CardDescription>
                    Edit element positions, sizes, and properties using the full drag-and-drop editor
                  </CardDescription>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950 px-3 py-2 rounded border border-amber-200 dark:border-amber-900">
                    <Code className="h-3 w-3" />
                    <span>Specs are loaded from code. Use "Export Spec" to update the .ts file.</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => setVisualEditorOpen(true)}
                  className="gap-2"
                >
                  <Maximize2 className="h-5 w-5" />
                  Open Visual Editor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Canvas Size</p>
                    <p className="text-2xl font-bold">
                      {workingSpec?.canvas?.width || 1080} × {workingSpec?.canvas?.height || 1080}px
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Elements</p>
                    <p className="text-2xl font-bold">
                      {workingSpec?.elements ? Object.keys(workingSpec.elements).length : 0}
                    </p>
                  </div>
                </div>

                {/* Layout Preview */}
                <div className="flex justify-center p-8 bg-muted/10 rounded-lg">
                  <div className="scale-[0.4] origin-top">
                    {renderPreviewLayout()}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="text-blue-600 dark:text-blue-400">
                    <Edit3 className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Pro Tip:</strong> The visual editor provides full drag-and-drop, resize handles, layers panel, undo/redo, and more.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the layout's name, description, and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="key">Layout Key</Label>
                  <Input id="key" value={layout.key} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">
                    The unique identifier (cannot be changed)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setHasChanges(true)
                    }}
                    placeholder="e.g., Bottle List"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setHasChanges(true)
                  }}
                  placeholder="Describe what this layout is used for..."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={category} 
                    onValueChange={(val) => {
                      setCategory(val)
                      setHasChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                      <SelectItem value="stats">Stats</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="social-proof">Social Proof</SelectItem>
                      <SelectItem value="timeline">Timeline</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enabled">Status</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="enabled"
                      checked={enabled}
                      onCheckedChange={(checked) => {
                        setEnabled(checked)
                        setHasChanges(true)
                      }}
                    />
                    <Label htmlFor="enabled" className="cursor-pointer">
                      {enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={thumbnailUrl}
                  onChange={(e) => {
                    setThumbnailUrl(e.target.value)
                    setHasChanges(true)
                  }}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Optional: URL to a preview image of this layout
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spec Tab */}
        <TabsContent value="spec" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Specification (JSON)</CardTitle>
              <CardDescription>
                Define element positions, sizes, and styles. Changes affect all SKUs using this layout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spec">Spec JSON</Label>
                <Textarea
                  id="spec"
                  value={specJson}
                  onChange={(e) => {
                    setSpecJson(e.target.value)
                    setHasChanges(true)
                    try {
                      const parsed = JSON.parse(e.target.value)
                      setWorkingSpec(parsed)
                    } catch (e) {
                      // Invalid JSON, don't update working spec
                    }
                  }}
                  className="font-mono text-sm"
                  rows={20}
                />
                <p className="text-xs text-muted-foreground">
                  Defines canvas size and element properties (position, size, color, font, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyTemplate">Copy Template JSON (Optional)</Label>
                <Textarea
                  id="copyTemplate"
                  value={copyTemplateJson}
                  onChange={(e) => {
                    setCopyTemplateJson(e.target.value)
                    setHasChanges(true)
                  }}
                  className="font-mono text-sm"
                  rows={10}
                  placeholder='{"sectionKey": {"fieldKey": {"label": "...", "type": "text"}}}'
                />
                <p className="text-xs text-muted-foreground">
                  Defines what copy fields are required for this layout
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-blue-600 dark:text-blue-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                About Master Layouts
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This is the master template that all brands and SKUs inherit from. 
                When users edit layouts in the SKU editor using the visual editor, 
                their changes are saved as overrides that don't affect this master template.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Editor Modal */}
      {layout && visualEditorOpen && workingSpec && (
        <VisualEditorModal
          open={visualEditorOpen}
          onClose={() => {
            setVisualEditorOpen(false)
            setSelectedElement(null)
          }}
          layoutKey={layoutKey}
          layoutName={layout.name}
          layers={getLayoutElements(layoutKey, [], convertSpecToEditorFormat(workingSpec)).filter((layer) => {
            // Only show layers that actually exist in the spec AND are positioned elements
            const elementKey = layer.key
            const specElement = workingSpec.elements?.[elementKey]
            
            // Must exist in spec
            if (!specElement) return false
            
            // Must have a type (text, image, rectangle, container, etc.) - excludes style definitions
            if (!specElement.type) return false
            
            // Must have position properties (x/y or top/left)
            // Check for horizontal position (x or left)
            const hasHorizontalPosition = specElement.x !== undefined || specElement.left !== undefined
            // Check for vertical position (y or top)
            const hasVerticalPosition = specElement.y !== undefined || specElement.top !== undefined
            
            // Must have BOTH horizontal AND vertical positioning to be a positioned element
            return hasHorizontalPosition && hasVerticalPosition
          })}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          positionOverrides={{
            [layoutKey]: convertSpecToEditorFormat(workingSpec)
          }}
          customElements={[]}
          brand={SAMPLE_BRAND}
          sku={editableSKU}
          backgroundColorKey="bg"
          onPositionChange={handleVisualPositionChange}
          onSizeChange={handleVisualSizeChange}
          onRotationChange={handleVisualRotationChange}
          onSave={handleSaveVisualChanges}
          onCancel={handleCancelVisualChanges}
          hasChanges={false}
        >
          {renderEditableLayout()}
        </VisualEditorModal>
      )}
    </AdminLayout>
  )
}
