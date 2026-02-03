import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: site.url,
      lastModified,
    },
    {
      url: `${site.url}/notices`,
      lastModified,
    },
  ]
}
