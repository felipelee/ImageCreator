import { NextRequest, NextResponse } from 'next/server'
import { layoutService } from '@/lib/layout-service'

// GET /api/admin/layouts/stats - Get layout statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await layoutService.getStats()
    
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error fetching layout stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layout stats', details: error.message },
      { status: 500 }
    )
  }
}

