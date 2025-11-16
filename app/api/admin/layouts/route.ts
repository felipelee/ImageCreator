import { NextRequest, NextResponse } from 'next/server'
import { layoutService } from '@/lib/layout-service'
import { LayoutTemplateInput } from '@/types/layout-template'

// GET /api/admin/layouts - List all layouts with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const enabled = searchParams.get('enabled')
    const search = searchParams.get('search') || undefined
    
    const filter: any = { search }
    if (category) filter.category = category
    if (enabled !== null) filter.enabled = enabled === 'true'
    
    const layouts = await layoutService.getFiltered(filter)
    
    return NextResponse.json(layouts)
  } catch (error: any) {
    console.error('Error fetching layouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch layouts', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/layouts - Create new layout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.key || !body.name || !body.category || !body.spec) {
      return NextResponse.json(
        { error: 'Missing required fields: key, name, category, spec' },
        { status: 400 }
      )
    }
    
    // Check if key already exists
    const existing = await layoutService.getByKey(body.key)
    if (existing) {
      return NextResponse.json(
        { error: `Layout with key "${body.key}" already exists` },
        { status: 409 }
      )
    }
    
    const template: LayoutTemplateInput = {
      key: body.key,
      name: body.name,
      description: body.description,
      category: body.category,
      enabled: body.enabled ?? true,
      spec: body.spec,
      thumbnailUrl: body.thumbnailUrl,
      copyTemplate: body.copyTemplate
    }
    
    const created = await layoutService.create(template)
    
    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error('Error creating layout:', error)
    return NextResponse.json(
      { error: 'Failed to create layout', details: error.message },
      { status: 500 }
    )
  }
}

