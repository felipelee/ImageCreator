'use client'

import { useState, useEffect } from 'react'
import { Search, Package, Loader2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FluidProduct {
  id: string | number
  slug: string
  title: string
  sku?: string
  description?: string
  price?: number
  currency?: string
  images: Array<{ url: string; alt?: string }>
  mainImage?: string
  variants?: Array<{
    id: string | number
    sku: string
    title: string
    price: number
    inventory?: number
  }>
  metadata?: Record<string, any>
  collections?: Array<{ id: string; name: string }>
  tags?: string[]
}

interface FluidProductBrowserProps {
  open: boolean
  onClose: () => void
  onSelect: (product: FluidProduct) => void
  brandFluidDam?: {
    apiToken?: string
    baseUrl?: string
  }
}

export function FluidProductBrowser({ open, onClose, onSelect, brandFluidDam }: FluidProductBrowserProps) {
  const [products, setProducts] = useState<FluidProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<FluidProduct | null>(null)

  const perPage = 20

  useEffect(() => {
    if (open) {
      fetchProducts()
    }
  }, [open, page, searchQuery])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      // Add brand-specific credentials if available
      if (brandFluidDam?.apiToken) {
        params.append('apiToken', brandFluidDam.apiToken)
      }
      if (brandFluidDam?.baseUrl) {
        params.append('baseUrl', brandFluidDam.baseUrl)
      }

      const response = await fetch(`/api/fluid-dam/products?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err.message || 'Failed to load products from Fluid')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(value: string) {
    setSearchQuery(value)
    setPage(1)
  }

  function handleSelectProduct(product: FluidProduct) {
    setSelectedProduct(product)
  }

  function handleConfirmSelection() {
    if (selectedProduct) {
      onSelect(selectedProduct)
      onClose()
      // Reset state
      setSelectedProduct(null)
      setSearchQuery('')
      setPage(1)
    }
  }

  function handleClose() {
    onClose()
    setSelectedProduct(null)
    setSearchQuery('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Import Product from Fluid
          </DialogTitle>
          <DialogDescription>
            Select a product from your Fluid catalog to import as a SKU
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name, SKU, or tag..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={() => handleSearch('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Make sure your Fluid API credentials are configured in Brand settings.
            </p>
          </div>
        )}

        {/* Products Grid */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No products found matching your search' : 'No products available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
              {products.map((product) => {
                const isSelected = selectedProduct?.id === product.id
                const imageUrl = product.mainImage || product.images?.[0]?.url

                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`group relative border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {/* Image */}
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="p-3 bg-card text-left">
                      <h4 className="text-sm font-semibold line-clamp-2 mb-1">{product.title}</h4>
                      {product.sku && (
                        <Badge variant="outline" className="text-xs mb-2">
                          SKU: {product.sku}
                        </Badge>
                      )}
                      {product.price && (
                        <p className="text-xs text-muted-foreground">
                          {product.currency || '$'}{product.price}
                        </p>
                      )}
                      {product.variants && product.variants.length > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {product.variants.length} variants
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({total} products)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {selectedProduct && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium">{selectedProduct.title}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedProduct}
            >
              <Check className="h-4 w-4 mr-2" />
              Import Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

