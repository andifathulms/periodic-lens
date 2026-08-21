import type { MetadataRoute } from 'next'

/**
 * Nothing is disallowed — there is no private area, no search endpoint and no
 * duplicate content to keep out. This file exists to point at the sitemap,
 * which is the part that was missing.
 */
const SITE = 'https://andifathulms.github.io'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE}${BASE}/sitemap.xml`,
  }
}
