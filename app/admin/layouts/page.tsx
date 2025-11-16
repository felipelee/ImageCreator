'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Grid3x3, List, Eye, Edit, Copy, Trash2, Power, PowerOff } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { LayoutTemplate, LayoutStats } from '@/types/layout-template'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Import layout components for preview rendering
import { ComparisonLayout } from '@/components/layouts/ComparisonLayout'
import { TestimonialLayout } from '@/components/layouts/TestimonialLayout'
import { BigStatLayout } from '@/components/layouts/BigStatLayout'
import { MultiStatsLayout } from '@/components/layouts/MultiStatsLayout'
import { PromoProductLayout } from '@/components/layouts/PromoProductLayout'
import { BottleListLayout } from '@/components/layouts/BottleListLayout'
import { TimelineLayout } from '@/components/layouts/TimelineLayout'
import { BeforeAfterLayout } from '@/components/layouts/BeforeAfterLayout'
import { FeatureGridLayout } from '@/components/layouts/FeatureGridLayout'
import { SocialProofLayout } from '@/components/layouts/SocialProofLayout'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'

// Sample brand and SKU data for previews
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

const SAMPLE_SKU: SKU = {
  id: 1,
  brandId: 1,
  name: 'Sample Product',
  copy: {
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
    beforeAfter: {
      headline: 'Real Results',
      beforeLabel: 'Before',
      beforeText: 'Tired and weak',
      afterLabel: 'After',
      afterText: 'Strong and energized'
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
  },
  images: {},
  createdAt: new Date(),
  updatedAt: new Date()
}

export default function LayoutsPage() {
  const router = useRouter()
  const [layouts, setLayouts] = useState<LayoutTemplate[]>([])
  const [stats, setStats] = useState<LayoutStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [enabledFilter, setEnabledFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [layoutToDelete, setLayoutToDelete] = useState<LayoutTemplate | null>(null)

  useEffect(() => {
    loadData()
  }, [categoryFilter, enabledFilter])

  async function loadData() {
    try {
      setLoading(true)
      
      // Build query params
      const params = new URLSearchParams()
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
      if (enabledFilter !== 'all') params.set('enabled', enabledFilter)
      
      // Load layouts
      const layoutsRes = await fetch(`/api/admin/layouts?${params}`)
      if (layoutsRes.ok) {
        const layoutsData = await layoutsRes.json()
        setLayouts(layoutsData)
      }
      
      // Load stats
      const statsRes = await fetch('/api/admin/layouts/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to load layouts:', error)
      toast.error('Failed to load layouts')
    } finally {
      setLoading(false)
    }
  }

  async function toggleEnabled(layout: LayoutTemplate) {
    try {
      const res = await fetch(`/api/admin/layouts/${layout.key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleEnabled' })
      })
      
      if (res.ok) {
        toast.success(`Layout ${layout.enabled ? 'disabled' : 'enabled'}`)
        loadData()
      } else {
        throw new Error('Failed to toggle layout')
      }
    } catch (error) {
      console.error('Failed to toggle layout:', error)
      toast.error('Failed to toggle layout')
    }
  }

  async function duplicateLayout(layout: LayoutTemplate) {
    const newKey = `${layout.key}_copy_${Date.now()}`
    const newName = `${layout.name} (Copy)`
    
    try {
      const res = await fetch(`/api/admin/layouts/${layout.key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', newKey, newName })
      })
      
      if (res.ok) {
        toast.success('Layout duplicated')
        loadData()
      } else {
        throw new Error('Failed to duplicate layout')
      }
    } catch (error) {
      console.error('Failed to duplicate layout:', error)
      toast.error('Failed to duplicate layout')
    }
  }

  async function deleteLayout(layout: LayoutTemplate) {
    try {
      const res = await fetch(`/api/admin/layouts/${layout.key}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        toast.success('Layout deleted')
        setDeleteDialogOpen(false)
        setLayoutToDelete(null)
        loadData()
      } else {
        throw new Error('Failed to delete layout')
      }
    } catch (error) {
      console.error('Failed to delete layout:', error)
      toast.error('Failed to delete layout')
    }
  }

  const filteredLayouts = layouts.filter(layout => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      layout.name.toLowerCase().includes(term) ||
      layout.key.toLowerCase().includes(term) ||
      layout.description?.toLowerCase().includes(term)
    )
  })

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'product': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'testimonial': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'comparison': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'stats': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'promotional': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      'educational': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      'social-proof': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'timeline': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    }
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  const renderLayoutPreview = (layout: LayoutTemplate) => {
    const layoutKey = layout.key
    const commonProps = { brand: SAMPLE_BRAND, sku: SAMPLE_SKU }

    const layoutComponents: Record<string, JSX.Element> = {
      comparison: <ComparisonLayout {...commonProps} />,
      testimonial: <TestimonialLayout {...commonProps} />,
      bigStat: <BigStatLayout {...commonProps} />,
      multiStats: <MultiStatsLayout {...commonProps} />,
      promoProduct: <PromoProductLayout {...commonProps} />,
      bottleList: <BottleListLayout {...commonProps} />,
      timeline: <TimelineLayout {...commonProps} />,
      beforeAfter: <BeforeAfterLayout {...commonProps} />,
      featureGrid: <FeatureGridLayout {...commonProps} />,
      socialProof: <SocialProofLayout {...commonProps} />,
    }

    return layoutComponents[layoutKey] || null
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Layout Management"
        description="Manage master layout templates for all brands"
        action={
          <Button onClick={() => router.push('/admin/layouts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Layout
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Layouts</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Enabled</CardDescription>
                <CardTitle className="text-3xl text-green-600">{stats.enabled}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Disabled</CardDescription>
                <CardTitle className="text-3xl text-gray-400">{stats.disabled}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Categories</CardDescription>
                <CardTitle className="text-3xl">{Object.keys(stats.byCategory).length}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search layouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="stats">Stats</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="social-proof">Social Proof</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={enabledFilter} onValueChange={setEnabledFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Layouts Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredLayouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No layouts found</p>
              <Button className="mt-4" onClick={() => router.push('/admin/layouts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Layout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredLayouts.map((layout) => (
              <Card key={layout.key} className={!layout.enabled ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {layout.name}
                        {!layout.enabled && (
                          <Badge variant="secondary" className="text-xs">
                            Disabled
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">{layout.key}</CardDescription>
                    </div>
                    <Badge className={getCategoryBadgeColor(layout.category)}>
                      {layout.category}
                    </Badge>
                  </div>
                  {layout.description && (
                    <p className="text-sm text-muted-foreground mt-2">{layout.description}</p>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {layout.thumbnailUrl ? (
                      <img
                        src={layout.thumbnailUrl}
                        alt={layout.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full scale-[0.15] origin-top-left">
                        {renderLayoutPreview(layout)}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/layouts/${layout.key}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEnabled(layout)}
                  >
                    {layout.enabled ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateLayout(layout)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLayoutToDelete(layout)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Layout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{layoutToDelete?.name}"? This action cannot be undone.
              SKUs using this layout will still render using the fallback spec.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLayoutToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => layoutToDelete && deleteLayout(layoutToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}

