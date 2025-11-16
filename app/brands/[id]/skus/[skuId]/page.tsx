'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Save, Eye, Sparkles, Package, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, X, Download, Loader2, Edit3, Move, Upload, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { brandService, skuService } from '@/lib/supabase'
import { uploadImage, STORAGE_BUCKETS } from '@/lib/supabase-storage'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ComparisonLayout } from '@/components/layouts/ComparisonLayout'
import { TestimonialLayout } from '@/components/layouts/TestimonialLayout'
import { BigStatLayout } from '@/components/layouts/BigStatLayout'
import { MultiStatsLayout} from '@/components/layouts/MultiStatsLayout'
import { PromoProductLayout } from '@/components/layouts/PromoProductLayout'
import { BottleListLayout } from '@/components/layouts/BottleListLayout'
import { TimelineLayout } from '@/components/layouts/TimelineLayout'
import { BeforeAfterLayout } from '@/components/layouts/BeforeAfterLayout'
import { FeatureGridLayout } from '@/components/layouts/FeatureGridLayout'
import { SocialProofLayout } from '@/components/layouts/SocialProofLayout'
import { generateColorVariations, applyColorVariation, ColorVariation } from '@/lib/color-variations'
import { renderLayout } from '@/lib/render-engine'
import { FluidDAMBrowser } from '@/components/FluidDAMBrowser'
import { ComparisonLayoutEditable } from '@/components/layouts/ComparisonLayoutEditable'
import { TestimonialLayoutEditable } from '@/components/layouts/TestimonialLayoutEditable'
import { BigStatLayoutEditable } from '@/components/layouts/BigStatLayoutEditable'
import { MultiStatsLayoutEditable } from '@/components/layouts/MultiStatsLayoutEditable'
import { PromoProductLayoutEditable } from '@/components/layouts/PromoProductLayoutEditable'
import { BottleListLayoutEditable } from '@/components/layouts/BottleListLayoutEditable'
import { TimelineLayoutEditable } from '@/components/layouts/TimelineLayoutEditable'
import { BeforeAfterLayoutEditable } from '@/components/layouts/BeforeAfterLayoutEditable'
import { FeatureGridLayoutEditable } from '@/components/layouts/FeatureGridLayoutEditable'
import { SocialProofLayoutEditable } from '@/components/layouts/SocialProofLayoutEditable'
import { VisualEditorModal } from '@/components/layout-editor/VisualEditorModal'
import { BenefitIconPicker } from '@/components/layout-editor/BenefitIconPicker'
import { PushToFluidModal, LayoutOption, FluidDestination } from '@/components/PushToFluidModal'
import { CustomElement as CustomElementType, CustomElementType as ElementType } from '@/types/custom-element'
import { getLayoutElements } from '@/lib/layout-element-definitions'
import JSZip from 'jszip'

export default function SKUEditorPage() {
  const params = useParams()
  const brandId = parseInt(params.id as string)
  const skuId = parseInt(params.skuId as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [sku, setSKU] = useState<SKU | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showProductInfo, setShowProductInfo] = useState(false)
  const [activeTab, setActiveTab] = useState<'copy' | 'images'>('copy')
  const [expandedLayout, setExpandedLayout] = useState<'compare' | 'testimonial' | 'bigStat' | 'multiStats' | 'promoProduct' | 'bottleList' | 'timeline' | 'beforeAfter' | 'featureGrid' | 'socialProof' | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [colorVariations, setColorVariations] = useState<ColorVariation[]>([])
  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0)
  const [previewBrand, setPreviewBrand] = useState<Brand | null>(null)
  const [rendering, setRendering] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png')
  const [uploadFormat, setUploadFormat] = useState<'png' | 'jpg' | 'webp'>('webp')
  const [damBrowserOpen, setDamBrowserOpen] = useState(false)
  const [damImageField, setDamImageField] = useState<string | null>(null)
  const [uploadingToFluid, setUploadingToFluid] = useState(false)
  const [pushToFluidModalOpen, setPushToFluidModalOpen] = useState(false)
  const [layoutPreviews, setLayoutPreviews] = useState<Record<string, string>>({})
  const [generatingPreviews, setGeneratingPreviews] = useState(false)
  const [fluidDestination, setFluidDestination] = useState<FluidDestination>('product_images')
  
  // Visual editor state
  const [visualEditorOpen, setVisualEditorOpen] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [visualEditorChanges, setVisualEditorChanges] = useState(false)

  // Refs for downloading
  const compareRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)
  const bigStatRef = useRef<HTMLDivElement>(null)
  const multiStatsRef = useRef<HTMLDivElement>(null)
  const promoProductRef = useRef<HTMLDivElement>(null)
  const bottleListRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const beforeAfterRef = useRef<HTMLDivElement>(null)
  const featureGridRef = useRef<HTMLDivElement>(null)
  const socialProofRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [brandId, skuId])

  // Debug: Log button visibility conditions
  useEffect(() => {
    if (brand && sku) {
      console.log('[Push to Fluid Debug]', {
        hasFluidMetadata: !!sku.fluidMetadata,
        productId: sku.fluidMetadata?.productId,
        hasBrandToken: !!brand.fluidDam?.apiToken,
        brandToken: brand.fluidDam?.apiToken ? '***exists***' : 'missing',
        baseUrl: brand.fluidDam?.baseUrl,
        buttonShouldShow: !!(sku.fluidMetadata?.productId && brand.fluidDam?.apiToken)
      })
    }
  }, [brand, sku])

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
        brandService.getById(brandId),
        skuService.getById(skuId)
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
        skuService.update(sku.id!, sku),
        brandService.update(brand.id!, brand)
      ])
      toast.success('Saved successfully!')
    } catch (error) {
      console.error('Failed to save:', error)
      toast.error('Failed to save. Please try again.')
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
      toast.error('Please ensure both brand and SKU data are loaded.')
      return
    }

    // Check if we have the necessary information
    if (!brand.knowledge?.brandVoice && !brand.knowledge?.information && !sku.productInformation) {
      toast.error('Please fill in Brand Knowledge or Product Information to enable AI generation.')
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

      toast.success('Content generated successfully! Review and adjust as needed.')
    } catch (error: any) {
      console.error('Error generating content:', error)
      toast.error(`Failed to generate content. Make sure OPENAI_API_KEY is set in your environment variables.`)
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
    if (!sku) return
    
    try {
      // Show loading state (use base64 preview while uploading)
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

      // Upload to Supabase Storage
      const path = `sku-${sku.id}/${imageKey}-${Date.now()}`
      const publicUrl = await uploadImage(STORAGE_BUCKETS.SKU_IMAGES, file, path)
      
      // Update with final cloud URL
      setSKU({
        ...sku,
        images: {
          ...sku.images,
          [imageKey]: publicUrl
        }
      })
      
      console.log('Image uploaded to cloud:', publicUrl)
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast.error('Failed to upload image. Using local preview.')
      // Fallback to base64 if upload fails
    }
  }

  function openFluidDAM(imageKey: keyof SKU['images']) {
    setDamImageField(imageKey)
    setDamBrowserOpen(true)
  }

  function handleFluidDAMSelect(assetUrl: string) {
    if (!sku || !damImageField) return
    
    setSKU({
      ...sku,
      images: {
        ...sku.images,
        [damImageField]: assetUrl
      }
    })
    
    setDamBrowserOpen(false)
    setDamImageField(null)
  }

  // Visual editor handlers
  function handleVisualPositionChange(elementKey: string, position: { x: number; y: number }) {
    if (!expandedLayout || !sku) return
    
    setVisualEditorChanges(true)
    
    // Check if it's a custom element
    if (elementKey.startsWith('custom-')) {
      const customElements = sku.customElements || {}
      const layoutElements = customElements[expandedLayout] || []
      const updatedElements = layoutElements.map(el =>
        el.id === elementKey ? { ...el, x: position.x, y: position.y } : el
      )
      
      setSKU({
        ...sku,
        customElements: {
          ...customElements,
          [expandedLayout]: updatedElements
        }
      })
    } else {
      // Regular element
      const currentOverrides = sku.positionOverrides || {}
      const layoutOverrides = currentOverrides[expandedLayout] || {}
      const elementOverride = layoutOverrides[elementKey] || {}
      
      setSKU({
        ...sku,
        positionOverrides: {
          ...currentOverrides,
          [expandedLayout]: {
            ...layoutOverrides,
            [elementKey]: {
              ...elementOverride,
              x: position.x,
              y: position.y
            }
          }
        }
      })
    }
  }

  function handleVisualSizeChange(elementKey: string, size: { width: number; height: number }) {
    if (!expandedLayout || !sku || !size) {
      console.log('[handleVisualSizeChange] Missing params:', { expandedLayout, sku: !!sku, size })
      return
    }
    
    setVisualEditorChanges(true)
    
    // Check if it's a custom element
    if (elementKey.startsWith('custom-')) {
      const customElements = sku.customElements || {}
      const layoutElements = customElements[expandedLayout] || []
      const updatedElements = layoutElements.map(el =>
        el.id === elementKey ? { ...el, width: size.width, height: size.height } : el
      )
      
      setSKU({
        ...sku,
        customElements: {
          ...customElements,
          [expandedLayout]: updatedElements
        }
      })
    } else {
      // Regular element
      const currentOverrides = sku.positionOverrides || {}
      const layoutOverrides = currentOverrides[expandedLayout] || {}
      const elementOverride = layoutOverrides[elementKey] || {}
      
      console.log('[handleVisualSizeChange] Updating:', { elementKey, size, elementOverride })
      
      setSKU({
        ...sku,
        positionOverrides: {
          ...currentOverrides,
          [expandedLayout]: {
            ...layoutOverrides,
            [elementKey]: {
              ...elementOverride,
              width: size.width,
              height: size.height
            }
          }
        }
      })
    }
  }

  function handleVisualRotationChange(elementKey: string, rotation: number) {
    if (!expandedLayout || !sku) return
    
    setVisualEditorChanges(true)
    
    // Check if it's a custom element
    if (elementKey.startsWith('custom-')) {
      const customElements = sku.customElements || {}
      const layoutElements = customElements[expandedLayout] || []
      const updatedElements = layoutElements.map(el =>
        el.id === elementKey ? { ...el, rotation } : el
      )
      
      setSKU({
        ...sku,
        customElements: {
          ...customElements,
          [expandedLayout]: updatedElements
        }
      })
    } else {
      // Regular element
      const currentOverrides = sku.positionOverrides || {}
      const layoutOverrides = currentOverrides[expandedLayout] || {}
      const elementOverride = layoutOverrides[elementKey] || {}
      
      setSKU({
        ...sku,
        positionOverrides: {
          ...currentOverrides,
          [expandedLayout]: {
            ...layoutOverrides,
            [elementKey]: {
              ...elementOverride,
              rotation
            }
          }
        }
      })
    }
  }

  function handleBenefitIconChange(benefitKey: string, icon: string) {
    if (!sku || !expandedLayout) return
    
    setVisualEditorChanges(true)
    
    // Update the icon in the SKU copy data
    const iconField = `${benefitKey}_icon`
    setSKU({
      ...sku,
      copy: {
        ...sku.copy,
        bottle: {
          ...sku.copy.bottle,
          [iconField]: icon
        }
      }
    })
  }

  function handleVisualEditorSave() {
    handleSave()
    setVisualEditorChanges(false)
  }

  function handleVisualEditorCancel() {
    // Reload data to discard changes
    loadData()
    setVisualEditorChanges(false)
    setSelectedElement(null)
  }

  function handleLayerReorder(newOrder: any[]) {
    if (!expandedLayout || !sku) return
    
    setVisualEditorChanges(true)
    
    // Update z-index for each element based on new order
    // Use high base number (100) to override spec defaults
    const currentOverrides = sku.positionOverrides || {}
    const layoutOverrides = currentOverrides[expandedLayout] || {}
    const updatedLayoutOverrides = { ...layoutOverrides }
    
    newOrder.forEach((layer, index) => {
      const elementOverride = layoutOverrides[layer.key] || {}
      const newZIndex = (index + 1) * 10 // Spacing of 10 between each layer for flexibility
      
      updatedLayoutOverrides[layer.key] = {
        ...elementOverride,
        // Ensure we have at least x and y so the override is valid
        x: elementOverride.x ?? 0,
        y: elementOverride.y ?? 0,
        zIndex: newZIndex
      }
    })
    
    setSKU({
      ...sku,
      positionOverrides: {
        ...currentOverrides,
        [expandedLayout]: updatedLayoutOverrides
      }
    })
    
    console.log('[Layer Reorder] Updated z-indexes:', newOrder.map((l, i) => `${l.key}: ${(i + 1) * 10}`))
  }

  function handleAddElement(type: ElementType) {
    if (!expandedLayout || !sku) return
    
    setVisualEditorChanges(true)
    
    // Generate unique ID
    const timestamp = Date.now()
    const elementId = `custom-${type}-${timestamp}`
    
    // Create new custom element
    const newElement: CustomElementType = {
      id: elementId,
      type,
      label: `Custom ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      x: 540, // Center of canvas
      y: 540,
      width: type === 'badge' ? 200 : type === 'text' ? 400 : 200,
      height: type === 'badge' ? 56 : type === 'text' ? 80 : 200,
      zIndex: 100, // High z-index to appear on top
      content: {
        text: type === 'text' || type === 'badge' ? 'Edit me' : undefined,
        colorKey: 'primary'
      },
      style: {
        fontSize: type === 'text' ? 48 : 22,
        fontWeight: 700,
        padding: type === 'badge' ? 14 : 0,
        borderRadius: type === 'badge' ? 28 : type === 'shape' ? 8 : 0,
        backgroundColor: type === 'badge' || type === 'shape' ? 'primarySoft' : undefined,
        textColor: type === 'text' || type === 'badge' ? 'primary' : undefined,
        objectFit: 'contain'
      },
      createdAt: new Date().toISOString()
    }
    
    // Add to SKU custom elements
    const currentElements = sku.customElements || {}
    const layoutElements = currentElements[expandedLayout] || []
    
    setSKU({
      ...sku,
      customElements: {
        ...currentElements,
        [expandedLayout]: [...layoutElements, newElement]
      }
    })
    
    // Auto-select the new element
    setSelectedElement(elementId)
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} element added!`, {
      description: 'Configure it in the right sidebar'
    })
    
    console.log('[Add Element] Created:', newElement)
  }

  function handleUpdateCustomElement(elementId: string, updates: Partial<CustomElementType>) {
    if (!expandedLayout || !sku) return
    
    setVisualEditorChanges(true)
    
    const customElements = sku.customElements || {}
    const layoutElements = customElements[expandedLayout] || []
    const updatedElements = layoutElements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    )
    
    setSKU({
      ...sku,
      customElements: {
        ...customElements,
        [expandedLayout]: updatedElements
      }
    })
    
    console.log('[Update Custom Element]:', elementId, updates)
  }

  function handleDeleteCustomElement(elementId: string) {
    if (!expandedLayout || !sku) return
    
    setVisualEditorChanges(true)
    
    const customElements = sku.customElements || {}
    const layoutElements = customElements[expandedLayout] || []
    const filteredElements = layoutElements.filter(el => el.id !== elementId)
    
    setSKU({
      ...sku,
      customElements: {
        ...customElements,
        [expandedLayout]: filteredElements
      }
    })
    
    toast.success('Element deleted')
    console.log('[Delete Custom Element]:', elementId)
  }

  function handleChangeBackgroundColor(colorKey: string) {
    if (!brand) return
    setVisualEditorChanges(true)
    
    // Update brand background color
    setBrand({
      ...brand,
      colors: {
        ...brand.colors,
        bg: brand.colors[colorKey as keyof typeof brand.colors] || brand.colors.bg
      }
    })
    
    console.log('[Background Color Changed]:', colorKey)
  }

  function handleChangeBackgroundImage(imageKey: string | undefined) {
    if (!expandedLayout || !sku) return
    setVisualEditorChanges(true)
    
    // Store background image choice in image overrides
    if (imageKey) {
      updateFieldImageMapping(expandedLayout, 'Background Image', imageKey)
    } else {
      // Remove background image
      const updated = { ...sku.imageOverrides }
      if (updated[expandedLayout]) {
        delete updated[expandedLayout]['Background Image']
      }
      setSKU({ ...sku, imageOverrides: updated })
    }
    
    console.log('[Background Image Changed]:', imageKey)
  }

  async function downloadAll() {
    if (!brand || !sku) return

    const layouts = [
      { name: 'Comparison', type: 'comparison', ref: compareRef },
      { name: 'Testimonial', type: 'testimonial', ref: testimonialRef },
      { name: 'BigStat', type: 'bigStat', ref: bigStatRef },
      { name: 'MultiStats', type: 'multiStats', ref: multiStatsRef },
      { name: 'PromoProduct', type: 'promoProduct', ref: promoProductRef },
      { name: 'BottleList', type: 'bottleList', ref: bottleListRef },
      { name: 'Timeline', type: 'timeline', ref: timelineRef },
      { name: 'BeforeAfter', type: 'beforeAfter', ref: beforeAfterRef },
      { name: 'FeatureGrid', type: 'featureGrid', ref: featureGridRef },
      { name: 'SocialProof', type: 'socialProof', ref: socialProofRef }
    ]

    setRendering(true)
    try {
      // Create a new ZIP file
      const zip = new JSZip()
      
      // Render and add each layout to the ZIP
      // Note: Using refs for html2canvas rendering for now
      // Satori will be used in production with proper image hosting
      let successCount = 0
      let failCount = 0
      
      for (const layout of layouts) {
        try {
          if (!layout.ref.current) {
            console.warn(`${layout.name} ref not available, skipping`)
            failCount++
            continue
          }
          
          console.log(`Rendering ${layout.name}...`)
          const { renderLayoutFromElement } = await import('@/lib/render-engine')
          const blob = await renderLayoutFromElement(layout.ref.current, {
            scale: 2,
            format: downloadFormat,
            quality: downloadFormat === 'jpg' ? 0.95 : undefined
          })
          
          console.log(`${layout.name} rendered successfully, blob size: ${blob.size}`)
          
          // Add the blob to the ZIP with a filename
          const filename = `${brand.name}_${sku.name}_${layout.name}.${downloadFormat}`
          zip.file(filename, blob)
          successCount++
        } catch (error) {
          console.error(`Failed to render ${layout.name}:`, error)
          failCount++
          // Continue with other layouts even if one fails
        }
      }
      
      console.log(`Rendering complete: ${successCount} succeeded, ${failCount} failed`)
      
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
        
      toast.success(`Downloaded ${successCount} of ${layouts.length} layouts!`, {
        description: 'ZIP file saved to your downloads folder'
      })
    } catch (error) {
      console.error('Failed to download all:', error)
      toast.error('Failed to download layouts', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setRendering(false)
    }
  }

  function getAvailableLayouts(): LayoutOption[] {
    return [
      { id: 'comparison', name: 'Comparison', displayName: 'Comparison: Ours vs Theirs', ref: compareRef },
      { id: 'testimonial', name: 'Testimonial', displayName: 'Testimonial: Photo + Quote', ref: testimonialRef },
      { id: 'bigStat', name: 'Big_Stat', displayName: 'Big Stat: Large Percentage', ref: bigStatRef },
      { id: 'multiStats', name: 'Multi_Stats', displayName: 'Multi Stats: 3 Statistics', ref: multiStatsRef },
      { id: 'promoProduct', name: 'Promo_Product', displayName: 'Promo Product', ref: promoProductRef },
      { id: 'bottleList', name: 'Bottle_List', displayName: 'Bottle List', ref: bottleListRef },
      { id: 'timeline', name: 'Timeline', displayName: 'Timeline', ref: timelineRef },
      { id: 'beforeAfter', name: 'Before_After', displayName: 'Before/After', ref: beforeAfterRef },
      { id: 'featureGrid', name: 'Feature_Grid', displayName: 'Feature Grid', ref: featureGridRef },
      { id: 'socialProof', name: 'Social_Proof', displayName: 'Social Proof', ref: socialProofRef },
    ]
  }

  async function uploadSingleLayoutToFluid(destination: 'product' | 'media' | 'both') {
    if (!expandedLayout || !brand || !sku) return
    
    const layoutRef = {
      compare: compareRef,
      testimonial: testimonialRef,
      bigStat: bigStatRef,
      multiStats: multiStatsRef,
      promoProduct: promoProductRef,
      bottleList: bottleListRef,
      timeline: timelineRef,
      beforeAfter: beforeAfterRef,
      featureGrid: featureGridRef,
      socialProof: socialProofRef
    }[expandedLayout]
    
    if (!layoutRef?.current) {
      toast.error('Layout not ready for upload')
      return
    }
    
    setUploadingToFluid(true)
    
    try {
      const layoutName = copyFieldsByLayout.find(l => l.layoutKey === expandedLayout)?.layoutName || expandedLayout
      
      const destinationText = destination === 'product' 
        ? 'Product Images' 
        : destination === 'media' 
          ? 'Media Library' 
          : 'Product Images & Media Library'
      
      toast.info(`Uploading to ${destinationText}...`, {
        description: `Processing ${layoutName}`
      })

      // Render the layout to a blob at high quality
      // Now sending actual files to Fluid (not base64), so we can use high quality!
      const { renderLayoutFromElement } = await import('@/lib/render-engine')
      const blob = await renderLayoutFromElement(layoutRef.current, {
        scale: 2,
        format: uploadFormat,
        quality: uploadFormat === 'jpg' ? 0.95 : uploadFormat === 'webp' ? 0.9 : undefined
      })
      
      // Create a File from the blob
      const mimeType = uploadFormat === 'png' ? 'image/png' : uploadFormat === 'jpg' ? 'image/jpeg' : 'image/webp'
      const filename = `${brand.name}_${sku.name}_${layoutName}.${uploadFormat}`
      const file = new File([blob], filename, { type: mimeType })
      
      // Handle different destinations
      const uploads = []
      
      if (destination === 'product' || destination === 'both') {
        // Upload to Fluid Product Images
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', `${sku.name} - ${layoutName}`)
        formData.append('description', `${sku.name} - ${layoutName}`)
        formData.append('apiToken', brand.fluidDam!.apiToken!)
        formData.append('baseUrl', brand.fluidDam!.baseUrl!)
        formData.append('productId', String(sku.fluidMetadata!.productId))
        formData.append('position', '1')
        formData.append('uploadType', 'product_image')
        
        uploads.push(
          fetch('/api/fluid-dam/upload', {
            method: 'POST',
            body: formData
          })
        )
      }
      
      if (destination === 'media' || destination === 'both') {
        // Generate AI title and description for Media Library
        let title = `${sku.name} - ${layoutName}`
        let description = title
        
        try {
          const metadataResponse = await fetch('/api/generate-media-metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              layoutName: expandedLayout,
              layoutDisplayName: layoutName,
              skuName: sku.name,
              productInfo: sku.productInformation
            })
          })
          
          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json()
            title = metadata.title
            description = metadata.description
            console.log('[Upload] Using AI-generated title:', title)
          } else {
            console.warn('[Upload] AI metadata generation failed, using default title')
          }
        } catch (error) {
          console.warn('[Upload] AI metadata generation unavailable (OpenAI API key not configured?), using default title')
        }
        
        // Upload to Fluid Company Media - send file directly
        const formData = new FormData()
        formData.append('file', file) // Send the actual file
        formData.append('title', title)
        formData.append('description', description)
        formData.append('apiToken', brand.fluidDam!.apiToken!)
        formData.append('baseUrl', brand.fluidDam!.baseUrl!)
        formData.append('uploadType', 'company_media')
        
        uploads.push(
          fetch('/api/fluid-dam/upload', {
            method: 'POST',
            body: formData
          })
        )
      }
      
      // Execute all uploads
      const responses = await Promise.all(uploads)
      
      // Check for errors
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json()
          console.error('[Upload] Fluid API error:', errorData)
          
          // Extract error message from various possible formats
          let errorMessage = 'Upload failed'
          if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.details) {
            try {
              const details = JSON.parse(errorData.details)
              if (details.medium) {
                errorMessage = `Fluid API error: ${JSON.stringify(details.medium)}`
              }
            } catch (e) {
              errorMessage = errorData.details
            }
          }
          
          throw new Error(errorMessage)
        }
      }
      
      toast.success(`Uploaded to ${destinationText}!`, {
        description: layoutName
      })
    } catch (error) {
      console.error('[Upload] Upload failed:', error)
      toast.error('Failed to upload to Fluid', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setUploadingToFluid(false)
    }
  }

  async function uploadToFluid(selectedLayoutIds: string[], destination: FluidDestination) {
    if (!brand || !sku) return
    
    setUploadingToFluid(true)
    setPushToFluidModalOpen(false) // Close modal
    
    try {
      const allLayouts = getAvailableLayouts()
      const layouts = allLayouts.filter(l => selectedLayoutIds.includes(l.id))
      
      let successCount = 0
      let failCount = 0
      
      // Handle "both" destination
      const destinations: ('product_images' | 'company_media')[] = 
        destination === 'both' 
          ? ['product_images', 'company_media'] 
          : [destination as 'product_images' | 'company_media']
      
      const targetName = destination === 'both' 
        ? 'Product Images & Media Library'
        : destination === 'company_media' 
          ? 'Media Library' 
          : 'Product Images'
          
      toast.info(`Uploading to Fluid ${targetName}...`, {
        description: `Processing ${layouts.length} layout${layouts.length > 1 ? 's' : ''}`
      })

      for (const layout of layouts) {
        try {
          console.log(`[Upload ${successCount + 1}/${layouts.length * destinations.length}] Processing ${layout.name}...`)
          
          if (!layout.ref.current) {
            console.warn(`${layout.name} ref not available, skipping`)
            continue
          }

          // Render the layout to a blob (once per layout)
          const { renderLayoutFromElement } = await import('@/lib/render-engine')
          const blob = await renderLayoutFromElement(layout.ref.current, {
            scale: 2,
            format: 'png',
            quality: 0.95
          })
          
          console.log(`[Upload] ${layout.name} rendered, size: ${blob.size} bytes`)
          
          // Upload to each destination
          for (const dest of destinations) {
            try {
              // Create a File from the blob
              const filename = `${brand.name}_${sku.name}_${layout.name}.png`
              const file = new File([blob], filename, { type: 'image/png' })
              
              // For Company Media, generate AI title and description
              let title = `${sku.name} - ${layout.name}`
              let description = title
              
              if (dest === 'company_media') {
                try {
                  console.log(`[Upload] Generating AI metadata for ${layout.name}...`)
                  const metadataResponse = await fetch('/api/generate-media-metadata', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      layoutName: layout.name,
                      layoutDisplayName: layout.displayName,
                      skuName: sku.name,
                      productInfo: sku.productInformation
                    })
                  })
                  
                  if (metadataResponse.ok) {
                    const metadata = await metadataResponse.json()
                    title = metadata.title
                    description = metadata.description
                    console.log(`[Upload] AI generated: "${title}"`)
                  }
                } catch (error) {
                  console.warn(`[Upload] Failed to generate AI metadata, using default:`, error)
                }
              }
              
              // Upload to Fluid
              const formData = new FormData()
              formData.append('file', file)
              formData.append('title', title)
              formData.append('description', description)
              formData.append('apiToken', brand.fluidDam!.apiToken!)
              formData.append('baseUrl', brand.fluidDam!.baseUrl!)
              
              if (dest === 'company_media') {
                formData.append('uploadType', 'company_media')
                console.log(`[Upload] Uploading to Company Media: "${title}"`)
              } else {
                formData.append('productId', String(sku.fluidMetadata!.productId))
                formData.append('position', String(successCount + 1))
                formData.append('uploadType', 'product_image')
                console.log(`[Upload] Uploading to product ${sku.fluidMetadata!.productId} images`)
              }
              
              console.log(`[Upload] Sending to /api/fluid-dam/upload...`)
              const response = await fetch('/api/fluid-dam/upload', {
                method: 'POST',
                body: formData
              })
              
              console.log(`[Upload] Response status: ${response.status}`)
              
              if (!response.ok) {
                const error = await response.json()
                console.error(`[Upload] Failed to upload ${layout.name} to ${dest}:`, error)
                failCount++
                continue
              }
              
              const result = await response.json()
              console.log(`[Upload] ✅ Success for ${layout.name} to ${dest}:`, result)
              successCount++
            } catch (error) {
              console.error(`[Upload] ❌ Error uploading ${layout.name} to ${dest}:`, error)
              failCount++
            }
          }
        } catch (error) {
          console.error(`[Upload] ❌ Error processing ${layout.name}:`, error)
          failCount++
        }
      }
      
      if (successCount > 0) {
        toast.success(`Uploaded ${successCount} image${successCount > 1 ? 's' : ''} to Fluid!`, {
          description: failCount > 0 
            ? `${failCount} upload${failCount > 1 ? 's' : ''} failed. Check console for details.`
            : destination === 'both'
              ? 'Images added to both destinations'
              : `Images added to ${destination === 'company_media' ? 'Media Library' : sku.fluidMetadata!.productTitle || 'product'}`
        })
      } else {
        toast.error('Upload failed', {
          description: 'No images were successfully uploaded. Check console for details.'
        })
      }
    } catch (error) {
      console.error('Failed to upload to Fluid:', error)
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setUploadingToFluid(false)
    }
  }

  async function generateLayoutPreviews() {
    if (!brand || !sku) return

    setGeneratingPreviews(true)
    const previews: Record<string, string> = {}
    
    try {
      const layouts = getAvailableLayouts()
      
      for (const layout of layouts) {
        if (layout.ref.current) {
          try {
            const { renderLayoutFromElement } = await import('@/lib/render-engine')
            const blob = await renderLayoutFromElement(layout.ref.current, {
              scale: 0.5, // Lower scale for previews (faster)
              format: 'jpg',
              quality: 0.7
            })
            
            // Convert blob to data URL for preview
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            
            previews[layout.id] = dataUrl
          } catch (error) {
            console.warn(`Failed to generate preview for ${layout.name}:`, error)
          }
        }
      }
      
      setLayoutPreviews(previews)
    } catch (error) {
      console.error('Failed to generate previews:', error)
    } finally {
      setGeneratingPreviews(false)
    }
  }

  async function handlePushToFluidClick(destination: FluidDestination) {
    if (!brand || !sku) return
    
    // Check if Fluid credentials are configured
    if (!brand.fluidDam?.apiToken || !brand.fluidDam?.baseUrl) {
      toast.error('Fluid not configured', {
        description: 'Please configure Fluid DAM credentials in brand settings first.'
      })
      return
    }
    
    // Check if we have Fluid product metadata (only for product_images destination)
    if (destination === 'product_images' && !sku.fluidMetadata?.productId) {
      toast.error('No Fluid product linked', {
        description: 'This SKU was not imported from Fluid. Please link it to a Fluid product first.'
      })
      return
    }

    // Set destination and open the selection modal
    setFluidDestination(destination)
    setPushToFluidModalOpen(true)
    
    // Generate previews in the background
    if (Object.keys(layoutPreviews).length === 0) {
      generateLayoutPreviews()
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
    
    const scale = 0.72
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
                {/* Edit Layout Button */}
                <Button
                  onClick={() => setVisualEditorOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  title="Edit layout"
                >
                  <Edit3 className="h-3 w-3 mr-1.5" />
                  <span className="text-xs">Edit Layout</span>
                </Button>
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
              {expandedLayout === 'bigStat' && <BigStatLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'multiStats' && <MultiStatsLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'promoProduct' && <PromoProductLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'bottleList' && <BottleListLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'timeline' && <TimelineLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'beforeAfter' && <BeforeAfterLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'featureGrid' && <FeatureGridLayout brand={displayBrand} sku={displaySKU} />}
              {expandedLayout === 'socialProof' && <SocialProofLayout brand={displayBrand} sku={displaySKU} />}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function openLayoutEditor(layoutKey: 'compare' | 'testimonial' | 'bigStat' | 'multiStats' | 'promoProduct' | 'bottleList' | 'timeline' | 'beforeAfter' | 'featureGrid' | 'socialProof') {
    setExpandedLayout(layoutKey)
    initializeColorVariations(layoutKey)
    setDrawerOpen(true)
    
    // Initialize position overrides with defaults from spec - ALWAYS do this to enable layer reordering
    if (sku && (layoutKey === 'compare' || layoutKey === 'testimonial' || layoutKey === 'bigStat' || layoutKey === 'multiStats' || layoutKey === 'promoProduct' || layoutKey === 'bottleList' || layoutKey === 'timeline' || layoutKey === 'beforeAfter' || layoutKey === 'featureGrid' || layoutKey === 'socialProof')) {
      const existing = sku.positionOverrides?.[layoutKey] || {}
      
      // Define all elements with their spec defaults per layout
      const layoutDefaults: Record<string, any> = {
        compare: {
          background: { x: 0, y: 0, width: 1080, height: 1350, zIndex: 0 },
          leftColumn: { x: 546, y: 164, width: 217, height: 847, zIndex: 1 },
          rightColumn: { x: 806, y: 164, width: 217, height: 847, zIndex: 1 },
          headline: { x: 56, y: 115, width: 470, height: 150, zIndex: 20 },
          row1: { x: 75, y: 436, width: 949, height: 80, zIndex: 20 },
          row2: { x: 75, y: 544, width: 949, height: 80, zIndex: 20 },
          row3: { x: 75, y: 652, width: 949, height: 80, zIndex: 20 },
          row4: { x: 75, y: 760, width: 949, height: 80, zIndex: 20 },
          leftImage: { x: 534, y: 64, width: 229, height: 229, zIndex: 30 },
          rightImage: { x: 815, y: 76, width: 200, height: 200, zIndex: 30 },
          leftLabel: { x: 655, y: 306, width: 200, height: 50, zIndex: 40 },
          rightLabel: { x: 915, y: 306, width: 200, height: 50, zIndex: 40 }
        },
        testimonial: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          quoteContainer: { x: 60, y: 680, width: 960, height: 280, zIndex: 20 },
          stars: { x: 60, y: 710, width: 960, height: 40, zIndex: 21 },
          quote: { x: 60, y: 770, width: 960, height: 104, zIndex: 21 },
          name: { x: 60, y: 889, width: 960, height: 40, zIndex: 21 },
          ctaStrip: { x: 0, y: 995, width: 1080, height: 85, zIndex: 10 },
          ctaText: { x: 540, y: 1036, width: 1080, height: 60, zIndex: 20 }
        },
        bigStat: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          statValue: { x: 540, y: 384, width: 1080, height: 300, zIndex: 20 },
          headline: { x: 540, y: 676, width: 729, height: 100, zIndex: 20 },
          ingredient1: { x: 26, y: 113, width: 409, height: 409, zIndex: 40 },
          ingredient2: { x: 496, y: -69, width: 627, height: 627, zIndex: 40 },
          ingredient3: { x: 26, y: 699, width: 395, height: 395, zIndex: 40 },
          ingredient4: { x: 564, y: 591, width: 611, height: 611, zIndex: 40 },
          label1: { x: 210, y: 310, width: 120, height: 40, zIndex: 50 },
          label2: { x: 725, y: 236, width: 170, height: 40, zIndex: 50 },
          label3: { x: 200, y: 980, width: 139, height: 40, zIndex: 50 },
          label4: { x: 782, y: 897, width: 195, height: 40, zIndex: 50 }
        },
        multiStats: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          headline: { x: 72, y: 103, width: 936, height: 100, zIndex: 20 },
          stat1: { x: 657, y: 285, width: 393, height: 184, zIndex: 20 },
          stat2: { x: 652, y: 549, width: 351, height: 184, zIndex: 20 },
          stat3: { x: 650, y: 796, width: 420, height: 184, zIndex: 20 },
          disclaimer: { x: 657, y: 1036, width: 395, height: 45, zIndex: 20 }
        },
        promoProduct: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          headline: { x: 80, y: 80, width: 656, height: 120, zIndex: 20 },
          statsContainer: { x: 80, y: 494, width: 400, height: 400, zIndex: 20 },
          productImage: { x: 489, y: 352, width: 632, height: 772, zIndex: 30 },
          badge: { x: 770, y: 60, width: 240, height: 240, zIndex: 40 },
          badgeText: { x: 890, y: 189, width: 200, height: 60, zIndex: 41 }
        },
        bottleList: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          headline: { x: 487, y: 135, width: 500, height: 207, zIndex: 20 },
          benefit1: { x: 487, y: 392, width: 500, height: 150, zIndex: 30 },
          benefit2: { x: 487, y: 592, width: 500, height: 150, zIndex: 30 },
          benefit3: { x: 487, y: 792, width: 500, height: 150, zIndex: 30 },
          productImage: { x: 155, y: 20, width: 377, height: 1154, rotation: 358, zIndex: 10 }
        },
        timeline: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 10 },
          headline: { x: 540, y: 61, width: 796, height: 96, zIndex: 30 },
          timelineLine: { x: 575, y: 355, width: 2, height: 296, zIndex: 20 },
          milestone1: { x: 487, y: 300, width: 518, height: 80, zIndex: 40 },
          milestone2: { x: 487, y: 460, width: 518, height: 80, zIndex: 50 },
          milestone3: { x: 487, y: 620, width: 518, height: 80, zIndex: 60 },
          productImage: { x: -67, y: 280, width: 632, height: 772, zIndex: 70 }
        },
        beforeAfter: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          headline: { x: 540, y: 80, width: 960, height: 120, zIndex: 20 },
          beforePanel: { x: 60, y: 240, width: 460, height: 590, zIndex: 20 },
          afterPanel: { x: 560, y: 240, width: 460, height: 590, zIndex: 20 },
          divider: { x: 538, y: 240, width: 4, height: 590, zIndex: 15 },
          productImage: { x: 340, y: 860, width: 400, height: 180, zIndex: 30 }
        },
        featureGrid: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          headline: { x: 60, y: 60, width: 960, height: 100, zIndex: 20 },
          productImage: { x: 140, y: 180, width: 800, height: 300, zIndex: 30 }
        },
        socialProof: {
          background: { x: 0, y: 0, width: 1080, height: 1080, zIndex: 0 },
          headline: { x: 60, y: 60, width: 960, height: 100, zIndex: 20 },
          productImage: { x: 390, y: 820, width: 300, height: 200, zIndex: 30 }
        }
      }
      
      const defaults = layoutDefaults[layoutKey]
      
      // Merge existing overrides with defaults (existing takes precedence)
      const mergedOverrides: any = {}
      Object.keys(defaults).forEach(key => {
        mergedOverrides[key] = {
          ...(defaults as any)[key],
          ...existing[key] // Existing overrides take precedence
        }
      })
      
      setSKU({
        ...sku,
        positionOverrides: {
          ...sku.positionOverrides,
          [layoutKey]: mergedOverrides
        }
      })
    }
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
        { type: 'icon', section: 'bottle', field: 'benefit1_icon', label: 'Benefit 1 Icon', benefitNumber: 1 },
        { section: 'bottle', field: 'benefit1', label: 'Benefit 1 Title', placeholder: 'Stronger muscles', colors: ['accent'] },
        { section: 'bottle', field: 'benefit1_detail', label: 'Benefit 1 Description', placeholder: 'SUPPORTS MUSCLE PROTEIN SYNTHESIS AND LEAN MUSCLE REPAIR', colors: ['textSecondary'] },
        { type: 'icon', section: 'bottle', field: 'benefit2_icon', label: 'Benefit 2 Icon', benefitNumber: 2 },
        { section: 'bottle', field: 'benefit2', label: 'Benefit 2 Title', placeholder: 'Faster recovery', colors: ['accent'] },
        { section: 'bottle', field: 'benefit2_detail', label: 'Benefit 2 Description', placeholder: 'SUPPORTS MUSCLE STRENGTH RECOVERY BETWEEN WORKOUTS', colors: ['textSecondary'] },
        { type: 'icon', section: 'bottle', field: 'benefit3_icon', label: 'Benefit 3 Icon', benefitNumber: 3 },
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
    {
      layoutName: 'Before/After: Transformation',
      layoutSize: '1080×1080',
      layoutKey: 'beforeAfter' as const,
      fields: [
        { type: 'background', colorKey: 'bg', label: 'Background Color' },
        { section: 'beforeAfter', field: 'headline', label: 'Headline', placeholder: 'The Transformation', colors: ['accent'] },
        { section: 'beforeAfter', field: 'beforeLabel', label: 'Before Label', placeholder: 'BEFORE', colors: ['textSecondary'] },
        { section: 'beforeAfter', field: 'beforeText', label: 'Before Description', placeholder: 'Feeling tired and sluggish throughout the day', type: 'textarea', colors: ['text'] },
        { section: 'beforeAfter', field: 'afterLabel', label: 'After Label', placeholder: 'AFTER', colors: ['accent'] },
        { section: 'beforeAfter', field: 'afterText', label: 'After Description', placeholder: 'Sustained energy and mental clarity all day long', type: 'textarea', colors: ['text'] },
        { type: 'background', colorKey: 'primarySoft', label: 'Divider Color' },
        { type: 'image', imageKey: 'productPrimary', label: 'Product Image', imageType: 'sku', variants: ['productPrimary', 'productAngle', 'productDetail'] },
      ]
    },
    {
      layoutName: 'Feature Grid: 4 Features',
      layoutSize: '1080×1080',
      layoutKey: 'featureGrid' as const,
      fields: [
        { type: 'background', colorKey: 'bg', label: 'Background Color' },
        { section: 'featureGrid', field: 'headline', label: 'Headline', placeholder: 'Why You\'ll Love It', colors: ['accent'] },
        { type: 'background', colorKey: 'bgAlt', label: 'Card Background' },
        { section: 'featureGrid', field: 'feature1_icon', label: 'Feature 1 Icon', placeholder: '⚡', colors: [] },
        { section: 'featureGrid', field: 'feature1_title', label: 'Feature 1 Title', placeholder: 'Fast Acting', colors: ['accent'] },
        { section: 'featureGrid', field: 'feature1_desc', label: 'Feature 1 Description', placeholder: 'Feel the difference in minutes', colors: ['text'] },
        { section: 'featureGrid', field: 'feature2_icon', label: 'Feature 2 Icon', placeholder: '🔬', colors: [] },
        { section: 'featureGrid', field: 'feature2_title', label: 'Feature 2 Title', placeholder: 'Science-Backed', colors: ['accent'] },
        { section: 'featureGrid', field: 'feature2_desc', label: 'Feature 2 Description', placeholder: 'Clinically proven ingredients', colors: ['text'] },
        { section: 'featureGrid', field: 'feature3_icon', label: 'Feature 3 Icon', placeholder: '🌱', colors: [] },
        { section: 'featureGrid', field: 'feature3_title', label: 'Feature 3 Title', placeholder: 'All Natural', colors: ['accent'] },
        { section: 'featureGrid', field: 'feature3_desc', label: 'Feature 3 Description', placeholder: 'No artificial ingredients', colors: ['text'] },
        { section: 'featureGrid', field: 'feature4_icon', label: 'Feature 4 Icon', placeholder: '✓', colors: [] },
        { section: 'featureGrid', field: 'feature4_title', label: 'Feature 4 Title', placeholder: 'Easy to Use', colors: ['accent'] },
        { section: 'featureGrid', field: 'feature4_desc', label: 'Feature 4 Description', placeholder: 'Simple daily routine', colors: ['text'] },
        { type: 'image', imageKey: 'productPrimary', label: 'Product Image', imageType: 'sku', variants: ['productPrimary', 'productAngle', 'productDetail'] },
      ]
    },
    {
      layoutName: 'Social Proof: Reviews',
      layoutSize: '1080×1080',
      layoutKey: 'socialProof' as const,
      fields: [
        { type: 'background', colorKey: 'bg', label: 'Background Color' },
        { section: 'socialProof', field: 'headline', label: 'Headline', placeholder: 'Real People. Real Results.', colors: ['accent'] },
        { type: 'background', colorKey: 'bgAlt', label: 'Review Card Background' },
        { section: 'socialProof', field: 'review1_rating', label: 'Review 1 Rating', placeholder: '★★★★★', colors: ['accent'] },
        { section: 'socialProof', field: 'review1_quote', label: 'Review 1 Quote', placeholder: 'Game changer! I feel amazing.', colors: ['text'] },
        { section: 'socialProof', field: 'review1_name', label: 'Review 1 Name', placeholder: '- Jessica M.', colors: ['textSecondary'] },
        { section: 'socialProof', field: 'review2_rating', label: 'Review 2 Rating', placeholder: '★★★★★', colors: ['accent'] },
        { section: 'socialProof', field: 'review2_quote', label: 'Review 2 Quote', placeholder: 'Best purchase I\'ve made all year.', colors: ['text'] },
        { section: 'socialProof', field: 'review2_name', label: 'Review 2 Name', placeholder: '- David L.', colors: ['textSecondary'] },
        { section: 'socialProof', field: 'review3_rating', label: 'Review 3 Rating', placeholder: '★★★★★', colors: ['accent'] },
        { section: 'socialProof', field: 'review3_quote', label: 'Review 3 Quote', placeholder: 'Actually works. No gimmicks.', colors: ['text'] },
        { section: 'socialProof', field: 'review3_name', label: 'Review 3 Name', placeholder: '- Sarah K.', colors: ['textSecondary'] },
        { type: 'image', imageKey: 'productPrimary', label: 'Product Image', imageType: 'sku', variants: ['productPrimary', 'productAngle', 'productDetail'] },
      ]
    },
  ]

  return (
    <AdminLayout currentBrandId={brandId}>
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
              {sku?.fluidMetadata?.productId && brand?.fluidDam?.apiToken && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      disabled={uploadingToFluid || rendering}
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      {uploadingToFluid ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Push to Fluid
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePushToFluidClick('product_images')}>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Push to Product Images
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePushToFluidClick('company_media')}>
                      <Layers className="mr-2 h-4 w-4" />
                      Push to Media Library
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handlePushToFluidClick('both')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Push to Both
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>Product Information</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowProductInfo(!showProductInfo)}
                            className="h-6 w-6 p-0"
                          >
                            {showProductInfo ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {!showProductInfo && (
                          <CardDescription className="mt-1.5">
                            {sku.productInformation ? (
                              <span className="text-sm">
                                {sku.productInformation.length > 100 
                                  ? `${sku.productInformation.substring(0, 100)}...` 
                                  : sku.productInformation}
                              </span>
                            ) : (
                              "Click to add product details for AI generation"
                            )}
                          </CardDescription>
                        )}
                        {showProductInfo && (
                          <CardDescription>Product-specific details, features, benefits, and context. This will be used by AI to generate content for this SKU's ads.</CardDescription>
                        )}
                      </div>
                      <Button
                        onClick={generateWithAI}
                        disabled={generating || (!brand?.knowledge?.brandVoice && !brand?.knowledge?.information && !sku.productInformation)}
                        size="lg"
                        className="shrink-0"
                      >
                        {generating ? (
                          <>
                            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            AI Generate All
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {showProductInfo && (
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
                  )}
                </Card>

                {/* Layout Cards Grid */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Layout Templates</h3>
                    <p className="text-sm text-muted-foreground mt-1">Click a layout to edit content and preview</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
                              {/* Live Preview Thumbnail - Responsive scaling with CSS zoom */}
                              <div className="w-full bg-muted/30 dark:bg-muted/10 overflow-hidden relative aspect-square flex items-center justify-center" style={{ isolation: 'isolate' }}>
                                <div 
                                  className="w-[1080px] h-[1080px] origin-center"
                                  style={{ 
                                    zoom: '0.33',
                                  }}
                                >
                                  {layout.layoutKey === 'compare' && <ComparisonLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'testimonial' && <TestimonialLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'bigStat' && <BigStatLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'multiStats' && <MultiStatsLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'promoProduct' && <PromoProductLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'bottleList' && <BottleListLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'timeline' && <TimelineLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'beforeAfter' && <BeforeAfterLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'featureGrid' && <FeatureGridLayout brand={brand} sku={layoutSKU} />}
                                  {layout.layoutKey === 'socialProof' && <SocialProofLayout brand={brand} sku={layoutSKU} />}
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
            
            {/* Custom Image Elements Section */}
            {(() => {
              const customImageElements = sku.customElements?.[expandedLayout]?.filter(el => el.type === 'image') || []
              if (customImageElements.length === 0) return null
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Image Elements</CardTitle>
                    <CardDescription>Images added via the visual editor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {customImageElements.map((customEl) => {
                        const imageKey = customEl.content.imageKey
                        const imageSrc = imageKey ? (brand?.images[imageKey as keyof typeof brand.images] || sku.images[imageKey as keyof typeof sku.images]) : undefined
                        
                        return (
                          <div key={customEl.id} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            <label className="block text-sm font-medium mb-2">
                              {customEl.label}
                            </label>
                            {imageSrc ? (
                              <div className="relative">
                                <img 
                                  src={imageSrc} 
                                  alt={customEl.label}
                                  className="w-full h-32 object-contain"
                                />
                                <button
                                  onClick={() => {
                                    // Remove image reference from custom element
                                    const updatedElements = customImageElements.map(el =>
                                      el.id === customEl.id ? { ...el, content: { ...el.content, imageKey: undefined } } : el
                                    )
                                    setSKU({
                                      ...sku,
                                      customElements: {
                                        ...sku.customElements,
                                        [expandedLayout]: [
                                          ...(sku.customElements?.[expandedLayout]?.filter(el => el.type !== 'image') || []),
                                          ...updatedElements
                                        ]
                                      }
                                    })
                                  }}
                                  className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <label className="cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary">
                                  <span className="text-sm text-muted-foreground">Upload File</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      
                                      try {
                                        // Upload to Supabase
                                        const path = `sku-${sku.id}/custom-${customEl.id}-${Date.now()}`
                                        const publicUrl = await uploadImage(STORAGE_BUCKETS.SKU_IMAGES, file, path)
                                        
                                        // Update custom element with image key
                                        const updatedElements = (sku.customElements?.statement || []).map(el =>
                                          el.id === customEl.id ? { ...el, content: { ...el.content, imageKey: 'customImage' } } : el
                                        )
                                        
                                        // Also store the URL in SKU images
                                        setSKU({
                                          ...sku,
                                          images: {
                                            ...sku.images,
                                            [`custom_${customEl.id}`]: publicUrl
                                          },
                                          customElements: {
                                            ...sku.customElements,
                                            [expandedLayout]: updatedElements
                                          }
                                        })
                                        
                                        toast.success('Image uploaded successfully!')
                                      } catch (error) {
                                        console.error('Failed to upload:', error)
                                        toast.error('Failed to upload image')
                                      }
                                    }}
                                  />
                                </label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    // TODO: Open DAM browser for custom element
                                    toast.info('DAM browser for custom elements coming soon!')
                                  }}
                                >
                                  <ImageIcon className="mr-2 h-4 w-4" />
                                  Browse DAM
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })()}
            
            {/* Product Images */}
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
                      <div className="space-y-2">
                        <label className="cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary">
                          <span className="text-sm text-muted-foreground">Upload File</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => openFluidDAM(key)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Browse DAM
                        </Button>
                      </div>
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
                      <div className="space-y-2">
                        <label className="cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary">
                          <span className="text-sm text-muted-foreground">Upload File</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => openFluidDAM(key)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Browse DAM
                        </Button>
                      </div>
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
                      <div className="space-y-2">
                        <label className="cursor-pointer flex flex-col items-center justify-center h-20 border-2 border-dashed border-muted-foreground/25 rounded-full hover:border-primary transition-colors">
                          <span className="text-xs text-muted-foreground">Upload File</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => openFluidDAM(key)}
                        >
                          <ImageIcon className="mr-1 h-3 w-3" />
                          Browse DAM
                        </Button>
                      </div>
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
                  <div className="space-y-3">
                    <label className="cursor-pointer flex flex-col items-center justify-center h-48 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary transition-colors">
                      <svg className="w-12 h-12 text-muted-foreground/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-muted-foreground font-medium">Upload File</span>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openFluidDAM('testimonialPhoto')}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Browse DAM
                    </Button>
                  </div>
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
                      <div className="space-y-2">
                        <label className="cursor-pointer flex flex-col items-center justify-center h-36 border-2 border-dashed border-muted-foreground/25 rounded hover:border-primary transition-colors">
                          <svg className="w-12 h-12 text-muted-foreground/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-muted-foreground font-medium">Upload File</span>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => openFluidDAM(key)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Browse DAM
                        </Button>
                      </div>
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
                      {/* Download Individual Layout */}
                      <Button
                        onClick={async () => {
                          if (!expandedLayout || !brand || !sku) return
                          
                          const layoutRef = {
                            compare: compareRef,
                            testimonial: testimonialRef,
                            bigStat: bigStatRef,
                            multiStats: multiStatsRef,
                            promoProduct: promoProductRef,
                            bottleList: bottleListRef,
                            timeline: timelineRef,
                            beforeAfter: beforeAfterRef,
                            featureGrid: featureGridRef,
                            socialProof: socialProofRef
                          }[expandedLayout]
                          
                          if (!layoutRef?.current) {
                            toast.error('Layout not ready for download')
                            return
                          }
                          
                          try {
                            setRendering(true)
                            const { renderLayoutFromElement } = await import('@/lib/render-engine')
                            const blob = await renderLayoutFromElement(layoutRef.current, {
                              scale: 2,
                              format: downloadFormat,
                              quality: downloadFormat === 'jpg' ? 0.95 : undefined
                            })
                            
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            const layoutName = copyFieldsByLayout.find(l => l.layoutKey === expandedLayout)?.layoutName || expandedLayout
                            a.download = `${brand.name}_${sku.name}_${layoutName}.${downloadFormat}`
                            a.click()
                            URL.revokeObjectURL(url)
                            
                            toast.success('Layout downloaded!', {
                              description: `${layoutName}.${downloadFormat}`
                            })
                          } catch (error) {
                            console.error('Download failed:', error)
                            toast.error('Failed to download layout')
                          } finally {
                            setRendering(false)
                          }
                        }}
                        variant="outline"
                        size="sm"
                        disabled={rendering}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {/* Send to Fluid Dropdown & Format Selector */}
                      {sku?.fluidMetadata?.productId && brand?.fluidDam?.apiToken && (
                        <>
                          <Select value={uploadFormat} onValueChange={(v) => setUploadFormat(v as 'png' | 'jpg' | 'webp')}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="webp">WebP</SelectItem>
                              <SelectItem value="png">PNG</SelectItem>
                              <SelectItem value="jpg">JPG</SelectItem>
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                      <Button
                                disabled={uploadingToFluid || rendering}
                        variant="outline"
                        size="sm"
                                className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                              >
                                {uploadingToFluid ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Send to Fluid
                                  </>
                                )}
                      </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => uploadSingleLayoutToFluid('product')}
                                disabled={uploadingToFluid || rendering}
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Product Images
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => uploadSingleLayoutToFluid('media')}
                                disabled={uploadingToFluid || rendering}
                              >
                                <Layers className="h-4 w-4 mr-2" />
                                Media Library
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => uploadSingleLayoutToFluid('both')}
                                disabled={uploadingToFluid || rendering}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Both Locations
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                            {/* Custom Element Content Fields */}
                            {sku.customElements?.[expandedLayout]?.filter(el => el.type === 'text' || el.type === 'badge').map((customEl) => (
                              <tr key={customEl.id} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 align-top">
                                  <Label className="text-sm font-medium">
                                    {customEl.label}
                                    <Badge variant="secondary" className="ml-2 text-[9px]">Custom</Badge>
                                  </Label>
                                </td>
                                <td className="px-4 py-3">
                                  <Input
                                    type="text"
                                    value={sku.customElementContent?.[customEl.id]?.text || customEl.content.text || ''}
                                    onChange={(e) => {
                                      setSKU({
                                        ...sku,
                                        customElementContent: {
                                          ...sku.customElementContent,
                                          [customEl.id]: {
                                            ...sku.customElementContent?.[customEl.id],
                                            text: e.target.value
                                          }
                                        }
                                      })
                                    }}
                                    className="text-sm"
                                    placeholder={customEl.type === 'badge' ? 'Badge text...' : 'Text content...'}
                                  />
                                </td>
                                <td className="px-4 py-3 align-top">
                                  <span className="text-xs text-muted-foreground">
                                    Edit in visual editor
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {copyFieldsByLayout
                              .find((l) => l.layoutKey === expandedLayout)
                              ?.fields.map((field, fieldIndex) => {
                                // Handle background color rows
                                if (field.type === 'background') {
                                  const defaultColorKey = field.colorKey
                                  const currentColorKey = getFieldColor(expandedLayout, field.label, defaultColorKey)
                                  // Use previewBrand colors if available (shows current variation)
                                  const displayBrand = previewBrand || brand
                                  const colorValue = displayBrand.colors[currentColorKey as keyof typeof displayBrand.colors]
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
                                            {Object.entries(displayBrand.colors).map(([key, value]) => (
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

                                // Handle icon picker fields
                                if (field.type === 'icon') {
                                  if (!field.section || !field.field) return null
                                  
                                  const section = sku.copy[field.section as keyof typeof sku.copy] as any
                                  const currentIcon = section?.[field.field] || 'dumbbell'
                                  const benefitNum = (field as any).benefitNumber || 1
                                  
                                  return (
                                    <tr key={fieldIndex} className="border-b hover:bg-muted/30 transition-colors">
                                      <td className="px-4 py-3 align-middle">
                                        <Label className="text-sm font-medium">{field.label}</Label>
                                      </td>
                                      <td className="px-4 py-3 align-middle">
                                        <BenefitIconPicker
                                          currentIcon={currentIcon}
                                          benefitNumber={benefitNum}
                                          onIconChange={(icon) => updateCopyField(field.section!, field.field!, icon)}
                                        />
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
                                            // Use previewBrand colors if available (shows current variation)
                                            const displayBrand = previewBrand || brand
                                            const colorValue = displayBrand.colors[currentColorKey as keyof typeof displayBrand.colors]
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
                                                  {Object.entries(displayBrand.colors).map(([key, value]) => (
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
            <div ref={beforeAfterRef}>
              <BeforeAfterLayout brand={brand} sku={sku} />
            </div>
            <div ref={featureGridRef}>
              <FeatureGridLayout brand={brand} sku={sku} />
            </div>
            <div ref={socialProofRef}>
              <SocialProofLayout brand={brand} sku={sku} />
            </div>
          </div>
        </div>
      </div>

      {/* Fluid DAM Browser */}
      <FluidDAMBrowser
        open={damBrowserOpen}
        onClose={() => setDamBrowserOpen(false)}
        onSelect={handleFluidDAMSelect}
        brandFluidDam={brand?.fluidDam}
      />

      {/* Push to Fluid Modal */}
      <PushToFluidModal
        open={pushToFluidModalOpen}
        onClose={() => setPushToFluidModalOpen(false)}
        layouts={getAvailableLayouts().map(layout => ({
          ...layout,
          previewUrl: layoutPreviews[layout.id]
        }))}
        onPush={(selectedLayoutIds) => uploadToFluid(selectedLayoutIds, fluidDestination)}
        isPushing={uploadingToFluid}
        isGeneratingPreviews={generatingPreviews}
        destination={fluidDestination}
      />

      {/* Visual Layout Editor Modal - Works for ALL layouts */}
      {expandedLayout && brand && sku && (() => {
        // Use same display values as the preview to ensure consistency
        const displayBrand = previewBrand || brand
        const displaySKU = getDisplaySKU(expandedLayout)
        
        return (
          <VisualEditorModal
            open={visualEditorOpen}
            onClose={() => {
              setVisualEditorOpen(false)
              setSelectedElement(null)
            }}
            layoutKey={expandedLayout}
            layoutName={copyFieldsByLayout.find(l => l.layoutKey === expandedLayout)?.layoutName || 'Layout'}
            layers={getLayoutElements(
              expandedLayout,
              displaySKU.customElements?.[expandedLayout] || [],
              displaySKU.positionOverrides?.[expandedLayout] || {}
            ).map(def => ({
              ...def,
              hasOverride: !!displaySKU.positionOverrides?.[expandedLayout]?.[def.key] || def.key.startsWith('custom-'),
              zIndex: displaySKU.positionOverrides?.[expandedLayout]?.[def.key]?.zIndex ?? def.defaultZIndex ?? 0
            }))}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            positionOverrides={displaySKU.positionOverrides}
            customElements={displaySKU.customElements?.[expandedLayout] || []}
            brand={brand}
            sku={sku}
            backgroundColorKey="bg"
            backgroundImageKey={getFieldImage(expandedLayout, 'Background Image', 'backgroundBenefits')}
            onPositionChange={handleVisualPositionChange}
            onSizeChange={handleVisualSizeChange}
            onRotationChange={handleVisualRotationChange}
            onUpdateCustomElement={handleUpdateCustomElement}
            onDeleteCustomElement={handleDeleteCustomElement}
            onChangeBackgroundColor={handleChangeBackgroundColor}
            onChangeBackgroundImage={handleChangeBackgroundImage}
            onLayerReorder={handleLayerReorder}
            onAddElement={handleAddElement}
            onBenefitIconChange={handleBenefitIconChange}
            onSave={handleVisualEditorSave}
            onCancel={handleVisualEditorCancel}
            hasChanges={visualEditorChanges}
          >
            <div
              style={{
                transform: 'scale(0.72)',
                transformOrigin: 'top left',
                width: '1080px',
                height: '1080px'
              }}
            >
              {/* Render appropriate layout based on expandedLayout */}
              {expandedLayout === 'compare' && (
                <ComparisonLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'testimonial' && (
                <TestimonialLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'bigStat' && (
                <BigStatLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'multiStats' && (
                <MultiStatsLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'promoProduct' && (
                <PromoProductLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'bottleList' && (
                <BottleListLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'timeline' && (
                <TimelineLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onPositionChange={handleVisualPositionChange}
                  onSizeChange={handleVisualSizeChange}
                  onRotationChange={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'beforeAfter' && (
                <BeforeAfterLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onElementDrag={handleVisualPositionChange}
                  onElementResize={handleVisualSizeChange}
                  onElementRotate={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'featureGrid' && (
                <FeatureGridLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onElementDrag={handleVisualPositionChange}
                  onElementResize={handleVisualSizeChange}
                  onElementRotate={handleVisualRotationChange}
                />
              )}
              {expandedLayout === 'socialProof' && (
                <SocialProofLayoutEditable
                  brand={displayBrand}
                  sku={displaySKU}
                  isEditMode={true}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onElementDrag={handleVisualPositionChange}
                  onElementResize={handleVisualSizeChange}
                  onElementRotate={handleVisualRotationChange}
                />
              )}
            </div>
          </VisualEditorModal>
        )
      })()}
    </AdminLayout>
  )
}

