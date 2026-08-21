import type { Metadata } from 'next'
import { IBM_Plex_Mono, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

/* DESIGN.md §7 — self-hosted via next/font, so there is no runtime request. */
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'

/*
 * Document defaults. Per-route title, description, canonical, hreflang and
 * social tags are generated in lib/i18n/metadata from the copy each page
 * renders; what stays here is what does not vary by route.
 *
 * The icon set is the "Tangga" mark from the brand kit — three blocks in a
 * growing staircase, which is the table's own silhouette. SVG first for
 * browsers that take it, a 32px PNG behind it, and 180px for an iOS home
 * screen.
 */
export const metadata: Metadata = {
  title: 'Periodic Lens',
  description:
    'An interactive periodic table that explains the shape of the table and shows Indonesia’s share of world production per element.',
  /*
   * No `manifest` key here on purpose. app/manifest.ts is a file convention:
   * Next emits its own <link rel="manifest"> and ignores whatever this says,
   * so a value here would be dead config that reads as if it were doing
   * something. The href it emits omits the basePath and 404s on Pages, which
   * postbuild repairs — see scripts/postbuild.mjs.
   */
  icons: {
    icon: [
      { url: `${BASE}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${BASE}/icon-32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: `${BASE}/icon-180.png`, sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink font-body antialiased">{children}</body>
    </html>
  )
}
