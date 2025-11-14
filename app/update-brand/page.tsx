'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBrand1DNA } from '@/lib/update-brand-dna'

export default function UpdateBrandPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Updating...')

  useEffect(() => {
    async function update() {
      const success = await updateBrand1DNA()
      if (success) {
        setStatus('✓ Brand 1 updated successfully!')
        setTimeout(() => {
          router.push('/brands/1')
        }, 1500)
      } else {
        setStatus('✗ Failed to update Brand 1')
      }
    }
    update()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg p-12 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{status}</h1>
        {status.includes('✓') && (
          <p className="text-gray-600">Redirecting to Brand 1...</p>
        )}
      </div>
    </div>
  )
}

