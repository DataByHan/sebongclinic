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
      const res = NextResponse.json({ error: 'Notice not found' }, { status: 404 })
      noStoreHeaders(res.headers)
      return res
    }

    const res = NextResponse.json({
      notice: {
        ...notice,
        content: sanitizeNoticeHtml(notice.content),
      },
    })
    noStoreHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Failed to fetch notice:', error)
    const res = NextResponse.json(
      { error: 'Failed to fetch notice' },
      { status: 500 }
    )
    noStoreHeaders(res.headers)
    return res
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isSameOriginRequest(request)) {
      const res = NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
      noStoreHeaders(res.headers)
      return res
    }

    const { id } = params
    let body: { title: string; content: string; password: string }
    try {
      body = await request.json() as { title: string; content: string; password: string }
    } catch {
      const res = NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
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
    await db
      .prepare(
        'UPDATE notices SET title = ?, content = ?, updated_at = datetime("now", "localtime") WHERE id = ?'
      )
      .bind(title, safeContent, id)
      .run()

    const res = NextResponse.json({ id, title, content: safeContent })
    noStoreHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Failed to update notice:', error)
    const res = NextResponse.json(
      { error: 'Failed to update notice' },
      { status: 500 }
    )
    noStoreHeaders(res.headers)
    return res
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isSameOriginRequest(request)) {
      const res = NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
      noStoreHeaders(res.headers)
      return res
    }

    const { id } = params
    let body: { password: string }
    try {
      body = await request.json() as { password: string }
    } catch {
      const res = NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }
    const { password } = body

    const { env } = getCloudflareContext()
    const ok = await timingSafeEqualString(password ?? '', env.ADMIN_PASSWORD)
    if (!ok) {
      await sleep(250)
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      noStoreHeaders(res.headers)
      return res
    }

    const db = getDB()
    await db
      .prepare('DELETE FROM notices WHERE id = ?')
      .bind(id)
      .run()

    const res = NextResponse.json({ success: true })
    noStoreHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Failed to delete notice:', error)
    const res = NextResponse.json(
      { error: 'Failed to delete notice' },
      { status: 500 }
    )
    noStoreHeaders(res.headers)
    return res
  }
}
