import { FilterXSS, escapeAttrValue } from 'xss'
function isSafeUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false

  // Allow relative URLs.
  if (trimmed.startsWith('/')) return true

  // Allow in-page anchors.
  if (trimmed.startsWith('#')) return true

  // Allow common safe schemes.
  if (/^(https?:|mailto:|tel:|data:image\/)/i.test(trimmed)) return true

  return false
}

const xssFilter = new FilterXSS({
  whiteList: {
    a: ['href', 'target', 'rel'],
    p: [],
    br: [],
    strong: [],
    b: [],
    em: [],
    i: [],
    u: [],
    s: [],
    ul: [],
    ol: [],
    li: [],
    h1: [],
    h2: [],
    h3: [],
    blockquote: [],
    hr: [],
    code: [],
    pre: [],
    span: [],
    div: [],
    img: ['src', 'alt', 'data-notice-size', 'data-notice-width'],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
  onTagAttr(tag: string, name: string, value: string) {
    if (tag === 'a' && name === 'target') {
      // Only allow safe targets.
      if (value === '_blank') return 'target="_blank"'
      return ''
    }

    if (tag === 'a' && name === 'href') {
      // Prevent javascript: URLs while still allowing relative URLs.
      const trimmed = value.trim()
      if (!isSafeUrl(trimmed) || /^javascript:/i.test(trimmed)) return ''
      return `href="${escapeAttrValue(trimmed)}"`
    }

    if (tag === 'img' && name === 'src') {
      const trimmed = value.trim()
      if (!isSafeUrl(trimmed) || /^javascript:/i.test(trimmed)) return ''
      return `src="${escapeAttrValue(trimmed)}"`
    }

    if (tag === 'img' && name === 'data-notice-width') {
      const trimmed = value.trim()
      // Validate pattern: digits with optional decimal, followed by px or %
      const match = /^(\d+(?:\.\d+)?)(px|%)$/.exec(trimmed)
      if (!match) return ''

      const numValue = parseFloat(match[1])
      const unit = match[2]

      let finalValue = numValue
      if (unit === '%') {
        // Clamp percentage to [10, 100]
        finalValue = Math.max(10, Math.min(100, numValue))
      } else if (unit === 'px') {
        // Clamp pixels to [120, 1200]
        finalValue = Math.max(120, Math.min(1200, numValue))
      }

      return `data-notice-width="${escapeAttrValue(`${finalValue}${unit}`)}"`
    }

    // Disallow inline event handlers universally.
    if (/^on/i.test(name)) return ''

    return undefined
  },
  onTag(tag: string, html: string) {
    // Force rel on target=_blank links. This is a best-effort pass.
    if (tag === 'a' && /target\s*=\s*(['"])_blank\1/i.test(html) && !/\srel\s*=/i.test(html)) {
      return html.replace(/<a\b/i, '<a rel="noreferrer noopener"')
    }
    return undefined
  },
})

export function sanitizeNoticeHtml(html: string): string {
  return xssFilter.process(html)
}
