'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, LOCALE_NAMES, type Locale, t } from '@/lib/i18n'

const PAGES = ['table', 'build', 'layouts', 'indonesia', 'method'] as const

const NAV_KEYS: Record<(typeof PAGES)[number], string> = {
  table: 'nav.table',
  build: 'nav.build',
  layouts: 'nav.layouts',
  indonesia: 'nav.indonesia',
  method: 'nav.method',
}

/**
 * No chrome competing with the table (DESIGN.md §6) — a rule and a row of
 * links. The wordmark is separated from the nav by its own spacing step and
 * carries the display face, so five links do not read as six siblings, and the
 * current page is marked in weight and rule as well as in aria-current: "where
 * am I" is the second question a reader has, after "what is this".
 */
export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? ''
  const segment = pathname.split('/').filter(Boolean)[1] ?? 'table'

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-baseline gap-x-16 gap-y-8 px-16 py-12">
        <Link
          href={`/${locale}/table`}
          className="font-display text-title font-semibold mr-16"
        >
          {t(locale, 'site.name')}
        </Link>
        {/* No aria-label: it is the only nav in the document, and naming it
            after the site announced "Periodic Lens navigation". */}
        <nav className="flex flex-wrap gap-16 text-body">
          {PAGES.map((page) => {
            const current = page === segment
            return (
              <Link
                key={page}
                href={`/${locale}/${page}`}
                aria-current={current ? 'page' : undefined}
                className={
                  current
                    ? 'font-semibold underline decoration-2 underline-offset-8'
                    : 'text-muted hover:text-ink hover:underline hover:underline-offset-8'
                }
              >
                {t(locale, NAV_KEYS[page])}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex gap-8 font-mono text-micro">
          {LOCALES.map((other) => {
            const current = other === locale
            return (
              <Link
                key={other}
                href={`/${other}/${segment}`}
                aria-current={current ? 'page' : undefined}
                /*
                 * The visible label stays two letters; the accessible name is
                 * the language, tagged with its own lang so a synthesiser
                 * pronounces "Bahasa Indonesia" as Indonesian rather than
                 * reading it in the surrounding voice.
                 */
                lang={other}
                aria-label={LOCALE_NAMES[other]}
                /* Not colour alone — the current locale is underlined too. */
                className={
                  current
                    ? 'text-ink font-semibold underline underline-offset-4'
                    : 'text-muted hover:text-ink'
                }
              >
                <span aria-hidden>{other.toUpperCase()}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
