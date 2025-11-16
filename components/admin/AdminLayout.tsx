'use client'

import { ReactNode } from 'react'
import { IconSidebar } from './IconSidebar'
import { BrandSidebar } from './BrandSidebar'

interface AdminLayoutProps {
  children: ReactNode
  currentBrandId?: number
}

export function AdminLayout({ children, currentBrandId }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Icon-only sidebar (always visible) */}
      <IconSidebar />
      
      {/* Brand context sidebar (only when in brand context) */}
      {currentBrandId && <BrandSidebar currentBrandId={currentBrandId} />}
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

