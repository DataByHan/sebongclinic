import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

function getR2(): R2Bucket {
  const { env } = getCloudflareContext()
  if (!env?.IMAGES) {
    throw new Error('R2 bucket binding not found')
  }
  return env.IMAGES
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string[] } }
) {
  try {
    const { key } = params
    const objectKey = key.join('/')

    // Restrict reads to the notices/ prefix and block path traversal attempts.
    if (!objectKey.startsWith('notices/') || objectKey.includes('..')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

     const r2 = getR2()
    const object = await r2.get(objectKey)

    if (!object) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    const contentType = object.httpMetadata?.contentType ?? 'application/octet-stream'
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Failed to fetch image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}
