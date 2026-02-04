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

export async function GET(request: NextRequest) {
  try {
    const db = getDB()
    const { results } = await db
      .prepare('SELECT * FROM notices ORDER BY created_at DESC')
      .all<Notice>()

     // Defense-in-depth: sanitize on read to protect against legacy stored content.
     const sanitized = await Promise.all(results.map(async (n) => {
       const format: NoticeFormat = n.format === 'markdown' ? 'markdown' : 'html'

       // For markdown notices, ALWAYS render via marked() to ensure HTML output
       let renderedHtml = n.content
       if (format === 'markdown') {
         const source = n.content_md?.trim() || n.content
         if (source.trim()) {
           try {
             renderedHtml = await marked(source)
           } catch (error) {
             console.error(`Markdown render failed for notice ${n.id}:`, error)
             // Last resort: escape and wrap in <pre> so it's at least visible
             renderedHtml = `<pre>${source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}</pre>`
           }
         } else {
           renderedHtml = ''
         }
       }

       return {
         ...n,
         format,
         content_md: format === 'markdown' ? (n.content_md ?? null) : null,
         content: sanitizeNoticeHtml(renderedHtml),
       }
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
      const res = NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
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
    const result = await db
      .prepare(
        'INSERT INTO notices (title, content, format, content_md, created_at, updated_at) VALUES (?, ?, ?, ?, datetime("now", "localtime"), datetime("now", "localtime"))'
      )
      .bind(title, safeContent, format, safeContentMd)
      .run()

    const res = NextResponse.json(
      {
        id: result.meta?.last_row_id ?? 0,
        title,
        content: safeContent,
        format,
        content_md: safeContentMd,
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
