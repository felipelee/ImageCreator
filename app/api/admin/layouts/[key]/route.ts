import { NextRequest, NextResponse } from 'next/server'
import { layoutService } from '@/lib/layout-service'
import { LayoutTemplateInput } from '@/types/layout-template'

// GET /api/admin/layouts/[key] - Get single layout
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const layout = await layoutService.getByKey(key)
    
    if (!layout) {
      return NextResponse.json(
        { error: `Layout "${key}" not found` },
        { status: 404 }
      )
    }
    
    return NextResponse.json(layout)
  } catch (error: any) {
    console.error(`Error fetching layout "${key}":`, error)
    return NextResponse.json(
      { error: 'Failed to fetch layout', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/admin/layouts/[key] - Update layout
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const body = await request.json()
    
    // Check if layout exists
    const existing = await layoutService.getByKey(key)
    if (!existing) {
      return NextResponse.json(
        { error: `Layout "${key}" not found` },
        { status: 404 }
      )
    }
    
    const updates: Partial<LayoutTemplateInput> = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.category !== undefined) updates.category = body.category
    if (body.enabled !== undefined) updates.enabled = body.enabled
    if (body.spec !== undefined) updates.spec = body.spec
    if (body.thumbnailUrl !== undefined) updates.thumbnailUrl = body.thumbnailUrl
    if (body.copyTemplate !== undefined) updates.copyTemplate = body.copyTemplate
    
    const updated = await layoutService.update(key, updates)
    
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error(`Error updating layout:`, error)
    return NextResponse.json(
      { error: 'Failed to update layout', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/layouts/[key] - Delete layout
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    
    // Check if layout exists
    const existing = await layoutService.getByKey(key)
    if (!existing) {
      return NextResponse.json(
        { error: `Layout "${key}" not found` },
        { status: 404 }
      )
    }
    
    await layoutService.delete(key)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error deleting layout:`, error)
    return NextResponse.json(
      { error: 'Failed to delete layout', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/layouts/[key] - Partial updates (like toggle enabled)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const body = await request.json()
    
    // Check if layout exists
    const existing = await layoutService.getByKey(key)
    if (!existing) {
      return NextResponse.json(
        { error: `Layout "${key}" not found` },
        { status: 404 }
      )
    }
    
    // Handle toggle enabled
    if (body.action === 'toggleEnabled') {
      const updated = await layoutService.toggleEnabled(key)
      return NextResponse.json(updated)
    }
    
    // Handle duplicate
    if (body.action === 'duplicate') {
      if (!body.newKey || !body.newName) {
        return NextResponse.json(
          { error: 'Missing required fields for duplicate: newKey, newName' },
          { status: 400 }
        )
      }
      
      const duplicated = await layoutService.duplicate(key, body.newKey, body.newName)
      return NextResponse.json(duplicated, { status: 201 })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error(`Error patching layout:`, error)
    return NextResponse.json(
      { error: 'Failed to patch layout', details: error.message },
      { status: 500 }
    )
  }
}

