import { getRequestContext } from '@cloudflare/next-on-pages'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sebong2025'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

function getR2(request: NextRequest): R2Bucket {
  try {
    return getRequestContext().env.IMAGES
  } catch {
    const env = (request as any).env as { IMAGES?: R2Bucket }
    if (!env?.IMAGES) {
      throw new Error('R2 bucket binding not found')
    }
    return env.IMAGES
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const password = formData.get('password') as string | null

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).slice(2)

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

    const r2 = getR2(request)
    const arrayBuffer = await file.arrayBuffer()
    
    await r2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const publicUrl = `${request.nextUrl.origin}/api/images/${encodeURIComponent(filename)}`

    return NextResponse.json({
      url: publicUrl,
      filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
