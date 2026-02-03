export async function sha256Bytes(input: string): Promise<Uint8Array> {
  const encoded = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return new Uint8Array(digest)
}

export function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  const maxLen = Math.max(a.length, b.length)
  let diff = a.length === b.length ? 0 : 1

  for (let i = 0; i < maxLen; i += 1) {
    const av = i < a.length ? a[i] : 0
    const bv = i < b.length ? b[i] : 0
    diff |= av ^ bv
  }

  return diff === 0
}

export async function timingSafeEqualString(a: string, b: string): Promise<boolean> {
  // Hash first to keep compare length constant (32 bytes).
  const [ha, hb] = await Promise.all([sha256Bytes(a), sha256Bytes(b)])
  return timingSafeEqualBytes(ha, hb)
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('Origin')
  // Some non-browser clients omit Origin. For sensitive endpoints, caller should decide whether to require it.
  if (!origin) return true

  try {
    const url = new URL(request.url)
    return origin === url.origin
  } catch {
    return false
  }
}

export function noStoreHeaders(headers: Headers): Headers {
  headers.set('Cache-Control', 'no-store')
  return headers
}

export function randomHex(bytes = 16): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function sleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}
