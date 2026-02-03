import { NextRequest, NextResponse } from 'next/server'
import type { Notice } from '@/types/cloudflare'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { isSameOriginRequest, noStoreHeaders, sleep, timingSafeEqualString } from '@/lib/security'
import { sanitizeNoticeHtml } from '@/lib/sanitize'

function getDB(): D1Database {
  const { env } = getCloudflareContext()
  if (!env?.DB) {
    throw new Error('D1 database binding not found')
  }
  return env.DB
}

export async function GET(request: NextRequest) {
  try {
    const db = getDB()
    const { results } = await db
      .prepare('SELECT * FROM notices ORDER BY created_at DESC')
      .all<Notice>()

    // Defense-in-depth: sanitize on read to protect against legacy stored content.
    const sanitized = results.map((n) => ({
      ...n,
      content: sanitizeNoticeHtml(n.content),
    }))

    const res = NextResponse.json({ notices: sanitized })
    noStoreHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Failed to fetch notices:', error)
    const res = NextResponse.json(
      { error: 'Failed to fetch notices' },
      { status: 500 }
    )
    noStoreHeaders(res.headers)
    return res
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      const res = NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
      noStoreHeaders(res.headers)
      return res
    }

    let body: { title: string; content: string; password: string }
    try {
      body = await request.json() as { title: string; content: string; password: string }
    } catch {
      const res = NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
      noStoreHeaders(res.headers)
      return res
    }
    const { title, content, password } = body

    const { env } = getCloudflareContext()
    const ok = await timingSafeEqualString(password ?? '', env.ADMIN_PASSWORD)
    if (!ok) {
      await sleep(250)
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      noStoreHeaders(res.headers)
      return res
    }

    if (!title || !content) {
      const res = NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }

    const safeContent = sanitizeNoticeHtml(content)

    const db = getDB()
    const result = await db
      .prepare(
        'INSERT INTO notices (title, content, created_at, updated_at) VALUES (?, ?, datetime("now", "localtime"), datetime("now", "localtime"))'
      )
      .bind(title, safeContent)
      .run()

    const res = NextResponse.json(
      {
        id: result.meta?.last_row_id ?? 0,
        title,
        content: safeContent,
      },
      { status: 201 }
    )
    noStoreHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Failed to create notice:', error)
    const res = NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    )
    noStoreHeaders(res.headers)
    return res
  }
}
