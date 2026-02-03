import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin-8f3a9c2d4b1e'],
    },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
