'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Brand } from '@/types/brand'
import { SKU } from '@/types/sku'

export default function SKUEditorPage() {
  const params = useParams()
  const brandId = parseInt(params.id as string)
  const skuId = parseInt(params.skuId as string)
  
  const [brand, setBrand] = useState<Brand | null>(null)
  const [sku, setSKU] = useState<SKU | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [brandId, skuId])

  async function loadData() {
    try {
      const [brandData, skuData] = await Promise.all([
        db.brands.get(brandId),
        db.skus.get(skuId)
      ])
      
      if (brandData) setBrand(brandData)
      if (skuData) setSKU(skuData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!sku) return
    
    setSaving(true)
    try {
      await db.skus.update(sku.id!, {
        ...sku,
        updatedAt: new Date()
      })
      alert('Saved successfully!')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function updateSKUField(field: keyof SKU, value: any) {
    if (!sku) return
    setSKU({ ...sku, [field]: value })
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!brand || !sku) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">SKU not found</h2>
          <Link href={`/brands/${brandId}`} className="text-blue-600 hover:text-blue-700">
            ← Back to brand
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <Link href={`/brands/${brandId}`} className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← Back to {brand.name}
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <input
              type="text"
              value={sku.name}
              onChange={(e) => updateSKUField('name', e.target.value)}
              className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-2 text-gray-600">Edit SKU details and copy for all 19 layouts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href={`/brands/${brandId}/skus/${skuId}/preview`}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Preview Layouts
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Images Section */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {(['productPrimary', 'productAngle', 'productDetail'] as const).map((key) => (
                <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                      <span className="text-sm text-gray-500">Upload</span>
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
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Comparison Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {(['comparisonOurs', 'comparisonTheirs'] as const).map((key) => (
                <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label className="cursor-pointer flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded hover:border-blue-500">
                      <span className="text-sm text-gray-500">Upload</span>
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
          </div>

          {/* Hero1 Copy Section */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Layout Copy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                <input
                  type="text"
                  value={sku.copy.hero1?.headline || ''}
                  onChange={(e) => updateCopyField('hero1', 'headline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="YOUR HEADLINE HERE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subhead</label>
                <textarea
                  value={sku.copy.hero1?.subhead || ''}
                  onChange={(e) => updateCopyField('hero1', 'subhead', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Your subheadline or key benefit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Badge</label>
                <textarea
                  value={sku.copy.hero1?.offerBadge || ''}
                  onChange={(e) => updateCopyField('hero1', 'offerBadge', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="50% OFF\nFIRST ORDER"
                />
              </div>
            </div>
          </div>

          {/* Pack Hero Copy Section */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pack Hero Layout Copy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                <textarea
                  value={sku.copy.packHero?.headline || ''}
                  onChange={(e) => updateCopyField('packHero', 'headline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="PREMIUM QUALITY.\nPROVEN RESULTS."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subhead</label>
                <input
                  type="text"
                  value={sku.copy.packHero?.subhead || ''}
                  onChange={(e) => updateCopyField('packHero', 'subhead', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="The difference you can feel"
                />
              </div>
            </div>
          </div>

          {/* Comparison Copy Section */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Layout Copy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                <textarea
                  value={sku.copy.compare?.headline || ''}
                  onChange={(e) => updateCopyField('compare', 'headline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="COMPARE THE DIFFERENCE"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Left Label (Your Product)</label>
                  <input
                    type="text"
                    value={sku.copy.compare?.leftLabel || ''}
                    onChange={(e) => updateCopyField('compare', 'leftLabel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Natural Peptides"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Right Label (Their Product)</label>
                  <input
                    type="text"
                    value={sku.copy.compare?.rightLabel || ''}
                    onChange={(e) => updateCopyField('compare', 'rightLabel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Synthetic Alternatives"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Row 1 Feature</label>
                <input
                  type="text"
                  value={sku.copy.compare?.row1_label || ''}
                  onChange={(e) => updateCopyField('compare', 'row1_label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No DIY math or mixing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Row 2 Feature</label>
                <input
                  type="text"
                  value={sku.copy.compare?.row2_label || ''}
                  onChange={(e) => updateCopyField('compare', 'row2_label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Plain-language instructions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Row 3 Feature</label>
                <input
                  type="text"
                  value={sku.copy.compare?.row3_label || ''}
                  onChange={(e) => updateCopyField('compare', 'row3_label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No research chemical loopholes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Row 4 Feature (Optional)</label>
                <input
                  type="text"
                  value={sku.copy.compare?.row4_label || ''}
                  onChange={(e) => updateCopyField('compare', 'row4_label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Independent lab COAs you can verify"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Copy Section */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Testimonial Layout Copy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                <textarea
                  value={sku.copy.testimonial?.quote || ''}
                  onChange={(e) => updateCopyField('testimonial', 'quote', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="This product has completely changed my life..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={sku.copy.testimonial?.name || ''}
                  onChange={(e) => updateCopyField('testimonial', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="- Customer Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input
                  type="text"
                  value={sku.copy.testimonial?.ratingLabel || ''}
                  onChange={(e) => updateCopyField('testimonial', 'ratingLabel', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="★★★★★"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Strip</label>
                <input
                  type="text"
                  value={sku.copy.testimonial?.ctaStrip || ''}
                  onChange={(e) => updateCopyField('testimonial', 'ctaStrip', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="TRY FOR 50% OFF | USE CODE SAVE50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

