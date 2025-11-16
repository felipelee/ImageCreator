'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Package, Plus, Palette, ChevronDown, Check, Download, Sparkles, Trash2, MoreVertical, FolderOpen } from 'lucide-react'
import { brandService, skuService } from '@/lib/supabase'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { FluidProductBrowser } from '@/components/FluidProductBrowser'

interface BrandSidebarProps {
  currentBrandId?: number
}

export function BrandSidebar({ currentBrandId }: BrandSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null)
  const [skus, setSkus] = useState<SKU[]>([])
  const [loading, setLoading] = useState(true)
  const [productBrowserOpen, setProductBrowserOpen] = useState(false)
  const [skuToDelete, setSkuToDelete] = useState<SKU | null>(null)

  useEffect(() => {
    loadData()
  }, [currentBrandId])

  async function loadData() {
    setLoading(true)
    try {
      // Load all brands for the dropdown
      const allBrands = await brandService.getAll()
      setBrands(allBrands)

      // If we have a current brand, load its data
      if (currentBrandId) {
        const brand = await brandService.getById(currentBrandId)
        setCurrentBrand(brand)
        
        if (brand) {
          const brandSkus = await skuService.getByBrandId(currentBrandId)
          setSkus(brandSkus)
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createNewBrand() {
    try {
      const newBrand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'> = {
        name: `Brand ${brands.length + 1}`,
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
        images: {}
      }
      
      const created = await brandService.create(newBrand)
      router.push(`/brands/${created.id}`)
    } catch (error) {
      console.error('Failed to create brand:', error)
      alert('Failed to create brand. Please try again.')
    }
  }

  async function createNewSKU() {
    if (!currentBrand) return

    try {
      const newSKU: Omit<SKU, 'id' | 'createdAt' | 'updatedAt'> = {
        brandId: currentBrand.id!,
        name: `SKU ${skus.length + 1}`,
        copy: {},
        images: {}
      }
      
      const created = await skuService.create(newSKU)
      router.push(`/brands/${currentBrandId}/skus/${created.id}`)
    } catch (error) {
      console.error('Failed to create SKU:', error)
      alert('Failed to create SKU. Please try again.')
    }
  }

  async function handleProductImport(product: any) {
    if (!currentBrand) return

    try {
      // Create SKU from Fluid product
      const newSKU: Omit<SKU, 'id' | 'createdAt' | 'updatedAt'> = {
        brandId: currentBrand.id!,
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
      await loadData()
      
      // Navigate to the new SKU
      router.push(`/brands/${currentBrandId}/skus/${created.id}`)
    } catch (error) {
      console.error('Failed to import product:', error)
      alert('Failed to import product from Fluid')
    }
  }

  async function deleteSKU() {
    if (!skuToDelete) return

    try {
      await skuService.delete(skuToDelete.id!)
      
      // If we're currently viewing this SKU, navigate away
      if (pathname.includes(`/skus/${skuToDelete.id}`)) {
        router.push(`/brands/${currentBrandId}`)
      }
      
      // Reload SKUs
      await loadData()
      setSkuToDelete(null)
    } catch (error) {
      console.error('Failed to delete SKU:', error)
      alert('Failed to delete SKU. Please try again.')
    }
  }

  function switchBrand(brandId: number) {
    router.push(`/brands/${brandId}`)
  }

  if (loading && currentBrandId) {
    return (
      <div className="flex h-screen w-64 flex-col border-r bg-background">
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (!currentBrandId || !currentBrand) {
    return null
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Brand Switcher */}
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="h-4 w-4 rounded-full border flex-shrink-0"
                  style={{ backgroundColor: currentBrand.colors.primary }}
                />
                <span className="truncate">{currentBrand.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            {brands.map((brand) => (
              <DropdownMenuItem
                key={brand.id}
                onClick={() => switchBrand(brand.id!)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: brand.colors.primary }}
                  />
                  <span>{brand.name}</span>
                </div>
                {brand.id === currentBrandId && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={createNewBrand}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Brand</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Brand DNA & Assets Links */}
      <div className="p-4 border-b space-y-1">
        <Link href={`/brands/${currentBrandId}/edit`}>
          <Button
            variant={pathname.includes('/edit') && !pathname.includes('/assets') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Palette className="mr-2 h-4 w-4" />
            <span>Brand DNA</span>
          </Button>
        </Link>
        <Link href={`/brands/${currentBrandId}/assets`}>
          <Button
            variant={pathname.includes('/assets') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Assets</span>
          </Button>
        </Link>
      </div>

      {/* SKUs List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground">SKUs</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={createNewSKU}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create from Scratch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProductBrowserOpen(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Import from Fluid
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          {skus.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">No SKUs yet</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-3 w-3" />
                    Add SKU
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={createNewSKU}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create from Scratch
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setProductBrowserOpen(true)}>
                    <Download className="mr-2 h-4 w-4" />
                    Import from Fluid
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <nav className="space-y-1 pb-4">
              {skus.map((sku) => {
                const isActive = pathname.includes(`/skus/${sku.id}`)
                return (
                  <div key={sku.id} className="group relative">
                    <Link href={`/brands/${currentBrandId}/skus/${sku.id}`}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2 h-auto py-2 px-2 pr-10"
                      >
                        {sku.images?.productPrimary ? (
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img 
                              src={sku.images.productPrimary} 
                              alt={sku.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="truncate text-sm font-medium flex-1 text-left">
                          {sku.name}
                        </span>
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSkuToDelete(sku)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete SKU
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </nav>
          )}
        </ScrollArea>
      </div>

      {/* New SKU Button with Dropdown */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              New SKU
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuItem onClick={createNewSKU}>
              <Sparkles className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">Create from Scratch</div>
                <div className="text-xs text-muted-foreground">Start with a blank SKU</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setProductBrowserOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">Import from Fluid</div>
                <div className="text-xs text-muted-foreground">Sync product data</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Fluid Product Browser */}
      <FluidProductBrowser
        open={productBrowserOpen}
        onClose={() => setProductBrowserOpen(false)}
        onSelect={handleProductImport}
        brandFluidDam={currentBrand?.fluidDam}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!skuToDelete} onOpenChange={() => setSkuToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete SKU?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{skuToDelete?.name}</strong>? 
              This will permanently delete the SKU and all of its generated layouts. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSKU}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

