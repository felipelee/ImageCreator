'use client'

import { useState, useEffect } from 'react'
import { Brand } from '@/types/brand'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadImage, STORAGE_BUCKETS } from '@/lib/supabase-storage'

// Popular Google Fonts
const GOOGLE_FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Open Sans', 
  'Lato', 'Raleway', 'Playfair Display', 'Merriweather', 
  'PT Sans', 'Ubuntu', 'Nunito', 'Quicksand', 'Work Sans',
  'DM Sans', 'Space Grotesk', 'Manrope', 'Plus Jakarta Sans',
  'Outfit', 'Sora', 'Lexend', 'Red Hat Display', 'Archivo',
  'Public Sans', 'Mulish', 'Karla', 'Source Sans 3', 'Rubik',
  'Bricolage Grotesque', 'Gloock', 'Gilda Display', 'Syncopate',
  'Voltaire', 'Spectral', 'Syne', 'Epilogue', 'Ultra',
  'Sanchez', 'Big Shoulders Display', 'Faculty Glyphic', 'Phudu',
  'Hubot Sans', 'Geist', 'Hanken Grotesk', 'Host Grotesk', 'Special Elite'
]

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: Brand
  setBrand: (brand: Brand) => void
}

// Name Edit Sheet
export function NameEditSheet({ open, onOpenChange, brand, setBrand }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Brand Name & Knowledge</SheetTitle>
              <SheetDescription>
                Edit your brand name and knowledge base for AI content generation
              </SheetDescription>
            </div>
            <Button onClick={() => onOpenChange(false)} size="sm">
              Save
            </Button>
          </div>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Brand Name */}
          <div>
            <Label htmlFor="brandName" className="text-sm font-semibold mb-2 block">
              Brand Name
            </Label>
            <Input
              id="brandName"
              type="text"
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              className="text-xl font-semibold h-12"
            />
          </div>

          {/* Brand Voice */}
          <div>
            <Label htmlFor="brandVoice" className="text-sm font-semibold mb-2 block">
              Brand Voice & Way of Talking
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Describe your brand's tone, style, and how you communicate
            </p>
            <Textarea
              id="brandVoice"
              value={brand.knowledge?.brandVoice || ''}
              onChange={(e) => setBrand({
                ...brand,
                knowledge: {
                  ...brand.knowledge,
                  brandVoice: e.target.value
                }
              })}
              placeholder="Example: Our brand speaks in a confident, science-backed tone..."
              className="min-h-[120px] font-mono text-sm"
            />
          </div>

          {/* Brand Information */}
          <div>
            <Label htmlFor="brandInfo" className="text-sm font-semibold mb-2 block">
              Brand Information & Context
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              General information about your brand, mission, values, target audience
            </p>
            <Textarea
              id="brandInfo"
              value={brand.knowledge?.information || ''}
              onChange={(e) => setBrand({
                ...brand,
                knowledge: {
                  ...brand.knowledge,
                  information: e.target.value
                }
              })}
              placeholder="Example: Premium supplement brand focused on peptides and longevity..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Color Edit Sheet
export function ColorEditSheet({ open, onOpenChange, brand, setBrand }: SheetProps) {
  function updateColor(colorKey: keyof Brand['colors'], value: string) {
    setBrand({
      ...brand,
      colors: {
        ...brand.colors,
        [colorKey]: value
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Color Palette</SheetTitle>
              <SheetDescription>
                10 theme colors that apply to ALL layouts for ALL SKUs
              </SheetDescription>
            </div>
            <Button onClick={() => onOpenChange(false)} size="sm">
              Save
            </Button>
          </div>
        </SheetHeader>
        
        <div className="py-6">
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
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Font Edit Sheet
export function FontEditSheet({ open, onOpenChange, brand, setBrand }: SheetProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load all Google Fonts when sheet opens
  useEffect(() => {
    if (open && !fontsLoaded) {
      // Create a single link that loads all fonts for the dropdown
      const existingLink = document.getElementById('google-fonts-all')
      if (existingLink) {
        existingLink.remove()
      }

      // Build the Google Fonts URL with all fonts
      const fontFamilies = GOOGLE_FONTS.map(font => 
        `family=${font.replace(/ /g, '+')}:wght@400;600;700`
      ).join('&')
      
      const link = document.createElement('link')
      link.id = 'google-fonts-all'
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?${fontFamilies}&display=swap`
      document.head.appendChild(link)

      // Mark fonts as loaded after a brief delay
      setTimeout(() => setFontsLoaded(true), 300)
    }
  }, [open, fontsLoaded])

  const handleFontChange = (fontFamily: string) => {
    setBrand({
      ...brand,
      fonts: {
        ...brand.fonts,
        family: fontFamily
      }
    })
  }

  // Filter fonts based on search query
  const filteredFonts = GOOGLE_FONTS.filter(font =>
    font.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <SheetTitle>Font Family</SheetTitle>
              <SheetDescription>
                Choose a Google Font for your brand typography
              </SheetDescription>
            </div>
            <Button onClick={() => onOpenChange(false)} size="sm">
              Save
            </Button>
          </div>
          <div className="mt-4">
            <Input
              type="text"
              placeholder="Search fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Font Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredFonts.length > 0 ? (
              filteredFonts.map((font) => (
                <div
                  key={font}
                  onClick={() => handleFontChange(font)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    hover:border-primary hover:shadow-md
                    ${brand.fonts.family === font 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border bg-background'
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center text-center gap-2">
                    <span 
                      className="text-5xl font-bold"
                      style={{ fontFamily: font }}
                    >
                      Aa
                    </span>
                    <span 
                      className="text-sm font-medium"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No fonts found matching "{searchQuery}"
              </div>
            )}
          </div>

          {fontsLoaded && (
            <p className="text-xs text-muted-foreground text-center">
              ✓ All Google Fonts loaded
            </p>
          )}

          {/* Large Preview of Selected Font */}
          <div 
            className="p-6 rounded-lg border-2"
            style={{ 
              backgroundColor: brand.colors.bg,
              fontFamily: brand.fonts.family
            }}
          >
            <p className="text-sm font-semibold mb-3 text-muted-foreground">
              Preview: {brand.fonts.family}
            </p>
            <p className="text-4xl font-bold mb-3" style={{ color: brand.colors.text }}>
              The quick brown fox
            </p>
            <p className="text-xl" style={{ color: brand.colors.textSecondary }}>
              jumps over the lazy dog
            </p>
            <p className="text-sm mt-4" style={{ color: brand.colors.textSecondary }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
              abcdefghijklmnopqrstuvwxyz<br/>
              0123456789
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Image Edit Sheet
export function ImageEditSheet({ open, onOpenChange, brand, setBrand }: SheetProps) {
  const [uploading, setUploading] = useState<string | null>(null)

  async function handleImageUpload(imageKey: keyof Brand['images'], file: File) {
    if (!brand.id) return
    
    setUploading(imageKey)
    try {
      // Show base64 preview while uploading
      const reader = new FileReader()
      reader.onloadend = () => {
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
    } finally {
      setUploading(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Brand Images</SheetTitle>
              <SheetDescription>
                Upload logos and backgrounds used across multiple layouts
              </SheetDescription>
            </div>
            <Button onClick={() => onOpenChange(false)} size="sm">
              Save
            </Button>
          </div>
        </SheetHeader>
        
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4">
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
                  <span className="text-sm text-gray-500">
                    {uploading === 'logoHorizontal' ? 'Uploading...' : 'Upload Logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading === 'logoHorizontal'}
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
                  <span className="text-sm text-gray-500">
                    {uploading === 'logoSquare' ? 'Uploading...' : 'Upload Logo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading === 'logoSquare'}
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
                  <span className="text-sm text-gray-500">
                    {uploading === 'backgroundHero' ? 'Uploading...' : 'Upload Background'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading === 'backgroundHero'}
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
                  <span className="text-sm text-gray-500">
                    {uploading === 'backgroundAlt' ? 'Uploading...' : 'Upload Background'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading === 'backgroundAlt'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Background (Benefits)</label>
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
                  <span className="text-sm text-gray-500">
                    {uploading === 'backgroundBenefits' ? 'Uploading...' : 'Upload Background'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading === 'backgroundBenefits'}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload('backgroundBenefits', file)
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Integration Edit Sheet
export function IntegrationEditSheet({ open, onOpenChange, brand, setBrand }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Integrations</SheetTitle>
              <SheetDescription>
                Configure Fluid DAM and Instagram credentials
              </SheetDescription>
            </div>
            <Button onClick={() => onOpenChange(false)} size="sm">
              Save
            </Button>
          </div>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Fluid DAM */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-semibold mb-2">Fluid DAM Integration</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Import products, browse DAM assets, and push generated images to Fluid
              </p>
            </div>

            <div>
              <Label htmlFor="fluidApiToken" className="text-sm font-semibold mb-2 block">
                Fluid API Token
              </Label>
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

            {brand.fluidDam?.apiToken && brand.fluidDam?.baseUrl && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-green-800 dark:text-green-200">
                  ✓ Fluid DAM is configured
                </p>
              </div>
            )}
          </div>

          {/* Instagram */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-semibold mb-2">Instagram Integration</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Connect your Instagram Business account to import media
              </p>
            </div>

            <div>
              <Label htmlFor="instagramToken" className="text-sm font-semibold mb-2 block">
                Instagram Access Token
              </Label>
              <Input
                id="instagramToken"
                type="password"
                value={brand.instagram?.accessToken || ''}
                onChange={(e) => setBrand({
                  ...brand,
                  instagram: {
                    ...brand.instagram,
                    accessToken: e.target.value
                  }
                })}
                placeholder="Enter your Instagram access token"
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="instagramUserId" className="text-sm font-semibold mb-2 block">
                Instagram User ID
              </Label>
              <Input
                id="instagramUserId"
                type="text"
                value={brand.instagram?.userId || ''}
                onChange={(e) => setBrand({
                  ...brand,
                  instagram: {
                    ...brand.instagram,
                    userId: e.target.value
                  }
                })}
                placeholder="Your Instagram Business account ID"
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="instagramUsername" className="text-sm font-semibold mb-2 block">
                Instagram Username
              </Label>
              <Input
                id="instagramUsername"
                type="text"
                value={brand.instagram?.username || ''}
                onChange={(e) => setBrand({
                  ...brand,
                  instagram: {
                    ...brand.instagram,
                    username: e.target.value
                  }
                })}
                placeholder="@yourbrand"
              />
            </div>

            {brand.instagram?.accessToken && brand.instagram?.userId && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs text-green-800 dark:text-green-200">
                  ✓ Instagram is configured
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

