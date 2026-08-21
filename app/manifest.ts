import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE, t } from '@/lib/i18n'

/**
 * Installable to a home screen. The app is a static export with no runtime
 * network, so once it is loaded it already works offline — the manifest just
 * lets a phone treat it that way.
 *
 * Name and description come from the dictionary the pages render, like every
 * other piece of metadata here, so they cannot drift from the site.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: t(DEFAULT_LOCALE, 'site.name'),
    short_name: t(DEFAULT_LOCALE, 'site.name'),
    description: t(DEFAULT_LOCALE, 'site.tagline'),
    start_url: `${BASE}/${DEFAULT_LOCALE}/table/`,
    scope: `${BASE}/`,
    display: 'standalone',
    /* The brand tile is ink; the app's ground is paper. The splash uses the
       ground the app actually opens on. */
    background_color: '#F7F6F2',
    theme_color: '#1C1A18',
    icons: [
      { src: `${BASE}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${BASE}/icon-512.png`, sizes: '512x512', type: 'image/png' },
      {
        src: `${BASE}/icon-maskable-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
