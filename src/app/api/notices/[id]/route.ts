import { NextRequest, NextResponse } from 'next/server'
import type { Notice } from '@/types/cloudflare'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { isSameOriginRequest, noStoreHeaders, sleep, timingSafeEqualString } from '@/lib/security'
import { sanitizeNoticeHtml } from '@/lib/sanitize'
import { marked } from 'marked'

type NoticeFormat = 'html' | 'markdown'

function parseNoticeFormat(value: unknown): { ok: true; value: NoticeFormat } | { ok: false } {
  if (value === undefined || value === null || value === '') return { ok: true, value: 'html' }
  if (value === 'html' || value === 'markdown') return { ok: true, value }
  return { ok: false }
}

function readBodyString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

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

     const format: NoticeFormat = notice.format === 'markdown' ? 'markdown' : 'html'
     let renderedHtml = notice.content
     if (format === 'markdown' && notice.content_md?.trim()) {
       renderedHtml = await marked(notice.content_md)
     } else if (format === 'markdown' && !notice.content.trim().startsWith('<')) {
       // Fallback: markdown stored in content, needs rendering
       try {
         renderedHtml = await marked(notice.content)
       } catch (error) {
         console.error('Markdown fallback failed:', error)
         // Keep notice.content, already going through sanitize
       }
     }
     const res = NextResponse.json({
       notice: {
         ...notice,
         format,
         content_md: format === 'markdown' ? (notice.content_md ?? null) : null,
         content: sanitizeNoticeHtml(renderedHtml),
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
    let body: {
      title?: unknown
      content?: unknown
      content_md?: unknown
      format?: unknown
      password?: unknown
    }
    try {
      body = await request.json() as {
        title?: unknown
        content?: unknown
        content_md?: unknown
        format?: unknown
        password?: unknown
      }
    } catch {
      const res = NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }

    const title = readBodyString(body.title).trim()
    const content = readBodyString(body.content)
    const contentTrimmed = content.trim()
    const contentMd = readBodyString(body.content_md)
    const contentMdTrimmed = contentMd.trim()
    const password = readBodyString(body.password)

    const parsedFormat = parseNoticeFormat(body.format)
    if (!parsedFormat.ok) {
      const res = NextResponse.json({ error: 'Invalid format' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }
    const format = parsedFormat.value

    const { env } = getCloudflareContext()
    const ok = await timingSafeEqualString(password ?? '', env.ADMIN_PASSWORD)
    if (!ok) {
      await sleep(250)
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      noStoreHeaders(res.headers)
      return res
    }

    if (!title) {
      const res = NextResponse.json({ error: 'Title is required' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }

    if (format === 'html' && !contentTrimmed) {
      const res = NextResponse.json({ error: 'Content is required for html' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }

    if (format === 'markdown' && !contentMdTrimmed) {
      const res = NextResponse.json(
        { error: 'content_md is required for markdown' },
        { status: 400 }
      )
      noStoreHeaders(res.headers)
      return res
    }

    const safeContent = format === 'markdown'
      ? sanitizeNoticeHtml(await marked(contentMd))
      : sanitizeNoticeHtml(content)
    const safeContentMd = format === 'markdown' ? contentMd : null

    const db = getDB()
    await db
      .prepare(
        'UPDATE notices SET title = ?, content = ?, format = ?, content_md = ?, updated_at = datetime("now", "localtime") WHERE id = ?'
      )
      .bind(title, safeContent, format, safeContentMd, id)
      .run()

    const res = NextResponse.json({ id, title, content: safeContent, format, content_md: safeContentMd })
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
