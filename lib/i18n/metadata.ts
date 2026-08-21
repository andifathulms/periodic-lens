import type { Metadata } from 'next'
import { LOCALES, DEFAULT_LOCALE, type Locale, pageTitle, t } from './index'

/**
 * Page metadata, derived from the dictionary the pages render.
 *
 * Nothing here is hand-written prose. A description typed separately from the
 * page drifts from it, and a description that contradicts the page is worse
 * than none — so every string below is a key that some component also renders,
 * and changing the page copy changes the metadata with it.
 *
 * Before this existed, all fourteen routes shipped one identical English
 * description and no canonical, hreflang, Open Graph or Twitter tags at all,
 * so a shared link previewed as a bare URL and the Indonesian pages described
 * themselves in English.
 */
const SITE = 'https://andifathulms.github.io'
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'

/**
 * Which dictionary key describes each route — and in every case it is a key
 * that route's own page also renders, so the description is the page's opening
 * sentence rather than a summary of it written somewhere else.
 */
const DESCRIPTION_KEYS = {
  table: 'site.lead',
  build: 'build.lead',
  layouts: 'layouts.intro',
  indonesia: 'indonesia.intro',
  method: 'site.tagline',
} as const

export type Route = keyof typeof DESCRIPTION_KEYS

/** The route list, shared with the sitemap so the two cannot disagree. */
export const ROUTES = Object.keys(DESCRIPTION_KEYS) as readonly Route[]

export function routeMetadata(locale: Locale, route: Route): Metadata {
  const path = `${BASE}/${locale}/${route}/`
  /* The table is the landing page, so it takes the bare site name. */
  const title = pageTitle(locale, route === 'table' ? undefined : `nav.${route}`)
  const description = t(locale, DESCRIPTION_KEYS[route])

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE}${path}`,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((other) => [other, `${SITE}${BASE}/${other}/${route}/`]),
        ),
        'x-default': `${SITE}${BASE}/${DEFAULT_LOCALE}/${route}/`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: t(locale, 'site.name'),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url: `${SITE}${path}`,
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
