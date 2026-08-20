import Link from 'next/link'
import { LOCALES, type Locale, t } from '@/lib/i18n'

const PAGES = ['table', 'build', 'layouts', 'indonesia', 'method'] as const

const NAV_KEYS: Record<(typeof PAGES)[number], string> = {
  table: 'nav.table',
  build: 'nav.build',
  layouts: 'nav.layouts',
  indonesia: 'nav.indonesia',
  method: 'nav.method',
}

/** No chrome competing with the table (DESIGN.md §6) — a rule and a row of links. */
export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto max-w-[1440px] px-16 py-12 flex flex-wrap items-baseline gap-16">
        <Link href={`/${locale}/table`} className="font-display text-22 font-semibold">
          {t(locale, 'site.name')}
        </Link>
        <nav className="flex flex-wrap gap-16 text-16">
          {PAGES.map((page) => (
            <Link key={page} href={`/${locale}/${page}`} className="hover:underline">
              {t(locale, NAV_KEYS[page])}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex gap-8 font-mono text-14 text-muted">
          {LOCALES.map((other) => (
            <Link
              key={other}
              href={`/${other}/table`}
              aria-current={other === locale ? 'true' : undefined}
              className={other === locale ? 'text-ink' : 'hover:text-ink'}
            >
              {other.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
