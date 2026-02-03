import { NextRequest, NextResponse } from 'next/server'
import type { Notice } from '@/types/cloudflare'

export const runtime = 'edge'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sebong2025'

function getDB(request: NextRequest): D1Database {
  const env = (request as any).env as { DB: D1Database }
  return env.DB
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
    const body = await request.json() as { title: string; content: string; password: string }
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
      .prepare('INSERT INTO notices (title, content) VALUES (?, ?)')
      .bind(title, content)
      .run()

    return NextResponse.json(
      {
        id: result.meta.last_row_id,
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
