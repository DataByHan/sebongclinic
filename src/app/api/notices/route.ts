import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextRequest, NextResponse } from 'next/server'
import type { Notice } from '@/types/cloudflare'

export const runtime = 'edge'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sebong2025'

function getDB(request: NextRequest): D1Database {
  try {
    return getRequestContext().env.DB
  } catch {
    const env = (request as any).env as { DB?: D1Database }
    if (!env?.DB) {
      throw new Error('D1 database binding not found')
    }
    return env.DB
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getDB(request)
    const { results } = await db
      .prepare('SELECT * FROM notices ORDER BY created_at DESC')
      .all<Notice>()

    return NextResponse.json({ notices: results })
  } catch (error) {
    console.error('Failed to fetch notices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: { title: string; content: string; password: string }
    try {
      body = await request.json() as { title: string; content: string; password: string }
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
    const { title, content, password } = body

    if (password !== ADMIN_PASSWORD) {
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

    const db = getDB(request)
    const result = await db
      .prepare(
        'INSERT INTO notices (title, content, created_at, updated_at) VALUES (?, ?, datetime("now", "localtime"), datetime("now", "localtime"))'
      )
      .bind(title, content)
      .run()

    return NextResponse.json(
      {
        id: result.meta?.last_row_id ?? 0,
        title,
        content,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create notice:', error)
    return NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    )
  }
}
