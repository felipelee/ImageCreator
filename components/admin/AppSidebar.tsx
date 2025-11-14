'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Sparkles, 
  Home, 
  Package, 
  ChevronRight, 
  Plus,
  Settings,
  LayoutDashboard,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { brandService, skuService } from '@/lib/supabase'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

export function AppSidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [brands, setBrands] = useState<Brand[]>([])
  const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set())
  const [skusByBrand, setSkusByBrand] = useState<Map<number, SKU[]>>(new Map())

  useEffect(() => {
    loadBrands()
  }, [])

  async function loadBrands() {
    try {
      const allBrands = await brandService.getAll()
      setBrands(allBrands)

      // Load SKUs for each brand
      const skusMap = new Map<number, SKU[]>()
      for (const brand of allBrands) {
        const skus = await skuService.getByBrandId(brand.id!)
        skusMap.set(brand.id!, skus)
      }
      setSkusByBrand(skusMap)
    } catch (error) {
      console.error('Failed to load brands:', error)
    }
  }

  function toggleBrand(brandId: number) {
    setExpandedBrands(prev => {
      const next = new Set(prev)
      if (next.has(brandId)) {
        next.delete(brandId)
      } else {
        next.add(brandId)
      }
      return next
    })
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
      await brandService.create(newBrand)
      await loadBrands()
    } catch (error) {
      console.error('Failed to create brand:', error)
      alert('Failed to create brand. Please try again.')
    }
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Social Post Gen</span>
                  <span className="truncate text-xs">Brand Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  onClick={createNewBrand}
                  className="min-w-8 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                >
                  <Plus />
                  <span>New Brand</span>
                </SidebarMenuButton>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0"
                  asChild
                >
                  <Link href="/settings">
                    <Settings />
                    <span className="sr-only">Settings</span>
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link href="/">
                    <Home />
                    <span>All Brands</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Brands Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Brands</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {brands.map((brand) => {
                const isExpanded = expandedBrands.has(brand.id!)
                const skus = skusByBrand.get(brand.id!) || []
                const isActive = pathname.includes(`/brands/${brand.id}`)

                return (
                  <Collapsible
                    key={brand.id}
                    open={isExpanded}
                    onOpenChange={() => toggleBrand(brand.id!)}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive && !pathname.includes('/skus/')}>
                        <Link href={`/brands/${brand.id}`}>
                          <div 
                            className="size-4 rounded-full border border-sidebar-border" 
                            style={{ backgroundColor: brand.colors.primary }}
                          />
                          <span className="flex-1">{brand.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      {skus.length > 0 && (
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-6 w-6 p-0"
                          >
                            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      )}
                    </SidebarMenuItem>
                    {skus.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {skus.map((sku) => {
                            const skuActive = pathname.includes(`/skus/${sku.id}`)
                            return (
                              <SidebarMenuSubItem key={sku.id}>
                                <SidebarMenuSubButton asChild isActive={skuActive}>
                                  <Link href={`/brands/${brand.id}/skus/${sku.id}`}>
                                    <Package className="h-3 w-3" />
                                    <span>{sku.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={createNewBrand} className="w-full">
              <Plus />
              <span>New Brand</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Toggle Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

