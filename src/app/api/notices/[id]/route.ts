import { NextRequest, NextResponse } from 'next/server'
import type { Notice } from '@/types/cloudflare'
import { getCloudflareContext } from '@opennextjs/cloudflare'

function getDB(): D1Database {
  const { env } = getCloudflareContext()
  if (!env?.DB) {
    throw new Error('D1 database binding not found')
  }
  return env.DB
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
     const db = getDB()
    const notice = await db
      .prepare('SELECT * FROM notices WHERE id = ?')
      .bind(id)
      .first<Notice>()

    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ notice })
  } catch (error) {
    console.error('Failed to fetch notice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notice' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json() as { title: string; content: string; password: string }
    const { title, content, password } = body

    const { env } = getCloudflareContext()
    if (password !== env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const db = getDB()
    await db
      .prepare(
        'UPDATE notices SET title = ?, content = ?, updated_at = datetime("now", "localtime") WHERE id = ?'
      )
      .bind(title, content, id)
      .run()

    return NextResponse.json({ id, title, content })
  } catch (error) {
    console.error('Failed to update notice:', error)
    return NextResponse.json(
      { error: 'Failed to update notice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json() as { password: string }
    const { password } = body

    const { env } = getCloudflareContext()
    if (password !== env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = getDB()
    await db
      .prepare('DELETE FROM notices WHERE id = ?')
      .bind(id)
      .run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete notice:', error)
    return NextResponse.json(
      { error: 'Failed to delete notice' },
      { status: 500 }
    )
  }
}
