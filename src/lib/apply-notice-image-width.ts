/**
 * Apply data-notice-width values to img elements at runtime.
 * Validates width values using the same rules as the sanitizer.
 */

export function applyNoticeImageWidths(container: HTMLElement | Document): void {
  const images = container.querySelectorAll('img[data-notice-width]')

  images.forEach((img) => {
    const width = (img as HTMLImageElement).getAttribute('data-notice-width')
    if (!width) return

    // Validate pattern: digits with optional decimal, followed by px or %
    const match = /^(\d+(?:\.\d+)?)(px|%)$/.exec(width)
    if (!match) return

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

    const validatedWidth = `${finalValue}${unit}`

    // Apply styles via DOM API
    ;(img as HTMLImageElement).style.width = validatedWidth
    ;(img as HTMLImageElement).style.maxWidth = '100%'
    ;(img as HTMLImageElement).style.height = 'auto'
  })
}
