import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { isSameOriginRequest, noStoreHeaders, randomHex, sleep, timingSafeEqualString } from '@/lib/security'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

function getR2(): R2Bucket {
  const { env } = getCloudflareContext()
  if (!env?.IMAGES) {
    throw new Error('R2 bucket binding not found')
  }
  return env.IMAGES
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      const res = NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
      noStoreHeaders(res.headers)
      return res
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const password = formData.get('password') as string | null

    const { env } = getCloudflareContext()
    const ok = await timingSafeEqualString(password ?? '', env.ADMIN_PASSWORD)
    if (!ok) {
      await sleep(250)
      const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      noStoreHeaders(res.headers)
      return res
    }

    if (!file) {
      const res = NextResponse.json({ error: 'No file provided' }, { status: 400 })
      noStoreHeaders(res.headers)
      return res
    }

    if (file.size > MAX_FILE_SIZE) {
      const res = NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      )
      noStoreHeaders(res.headers)
      return res
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      const res = NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
      noStoreHeaders(res.headers)
      return res
    }

    const timestamp = Date.now()
    const randomStr = randomHex(12)

    const mimeExt = (() => {
      switch (file.type) {
        case 'image/jpeg':
          return 'jpg'
        case 'image/png':
          return 'png'
        case 'image/gif':
          return 'gif'
        case 'image/webp':
          return 'webp'
        default:
          return 'bin'
      }
    })()

    const filename = `notices/${timestamp}-${randomStr}.${mimeExt}`

    const r2 = getR2()
    const arrayBuffer = await file.arrayBuffer()
    
    await r2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const publicUrl = `${request.nextUrl.origin}/api/images/${encodeURIComponent(filename)}`

    const res = NextResponse.json({
      url: publicUrl,
      filename,
    })
    noStoreHeaders(res.headers)
    return res
  } catch (error) {
    console.error('Upload error:', error)
    const res = NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
    noStoreHeaders(res.headers)
    return res
  }
}
