import type { MetadataRoute } from 'next'
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n'
import { ROUTES } from '@/lib/i18n/metadata'

/**
 * Every page, in both locales, cross-linked by language.
 *
 * Generated from the same route list the metadata uses, so a page cannot exist
 * without appearing here or appear here without existing. There was no sitemap
 * and no robots.txt before this, and the site root was an error shell — a
 * crawler arriving at the top had nothing to follow.
 */
const SITE = 'https://andifathulms.github.io'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE}${BASE}/${locale}/${route}/`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((other) => [other, `${SITE}${BASE}/${other}/${route}/`]),
          ),
          'x-default': `${SITE}${BASE}/${DEFAULT_LOCALE}/${route}/`,
        },
      },
    })),
  )
}
