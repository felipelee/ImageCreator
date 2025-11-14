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
  const [activeTab, setActiveTab] = useState<'copy' | 'images'>('copy')

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

  // Copy field definitions organized by layout
  const copyFields = [
    { section: 'hero1', field: 'headline', label: 'Hero / Headline', placeholder: 'YOUR HEADLINE HERE' },
    { section: 'hero1', field: 'subhead', label: 'Hero / Subhead', placeholder: 'Your subheadline or key benefit', type: 'textarea' },
    { section: 'hero1', field: 'offerBadge', label: 'Hero / Offer Badge', placeholder: '50% OFF\nFIRST ORDER', type: 'textarea' },
    
    { section: 'packHero', field: 'headline', label: 'Pack Hero / Headline', placeholder: 'PREMIUM QUALITY.\nPROVEN RESULTS.', type: 'textarea' },
    { section: 'packHero', field: 'subhead', label: 'Pack Hero / Subhead', placeholder: 'The difference you can feel' },
    
    { section: 'compare', field: 'headline', label: 'Comparison / Headline', placeholder: 'COMPARE THE DIFFERENCE', type: 'textarea' },
    { section: 'compare', field: 'leftLabel', label: 'Comparison / Left Label (Yours)', placeholder: 'Natural Peptides' },
    { section: 'compare', field: 'rightLabel', label: 'Comparison / Right Label (Theirs)', placeholder: 'Synthetic Alternatives' },
    { section: 'compare', field: 'row1_label', label: 'Comparison / Row 1', placeholder: 'No DIY math or mixing' },
    { section: 'compare', field: 'row2_label', label: 'Comparison / Row 2', placeholder: 'Plain-language instructions' },
    { section: 'compare', field: 'row3_label', label: 'Comparison / Row 3', placeholder: 'No research chemical loopholes' },
    { section: 'compare', field: 'row4_label', label: 'Comparison / Row 4', placeholder: 'Independent lab COAs you can verify' },
    
    { section: 'testimonial', field: 'quote', label: 'Testimonial / Quote', placeholder: 'This product has completely changed my life...', type: 'textarea' },
    { section: 'testimonial', field: 'name', label: 'Testimonial / Customer Name', placeholder: '- Customer Name' },
    { section: 'testimonial', field: 'ratingLabel', label: 'Testimonial / Rating', placeholder: '★★★★★' },
    { section: 'testimonial', field: 'ctaStrip', label: 'Testimonial / CTA Strip', placeholder: 'TRY FOR 50% OFF | USE CODE SAVE50' },
  ]

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
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
            <p className="mt-2 text-gray-600">Edit SKU content in table format</p>
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

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('copy')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'copy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Copy Fields
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'images'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Images
          </button>
        </div>

        {activeTab === 'copy' ? (
          /* Copy Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                    Field
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Content
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {copyFields.map((field, index) => {
                  const section = sku.copy[field.section as keyof typeof sku.copy] as any
                  const value = section?.[field.field] || ''
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {field.label}
                      </td>
                      <td className="px-6 py-4">
                        {field.type === 'textarea' ? (
                          <textarea
                            value={value}
                            onChange={(e) => updateCopyField(field.section, field.field, e.target.value)}
                            placeholder={field.placeholder}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateCopyField(field.section, field.field, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Images Grid */
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
              <div className="grid grid-cols-3 gap-4">
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
            </div>

            {/* Comparison Images */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Images</h2>
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
          </div>
        )}

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

