import { notFound } from 'next/navigation'
import { LOCALES, isLocale, t } from '@/lib/i18n'
import { SiteHeader } from '@/components/switcher/site-header'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!isLocale(params.locale)) notFound()
  return (
    /*
     * lang on the localised subtree. The root layout owns <html> and cannot
     * see params.locale, so every /id/ page shipped lang="en" and Indonesian
     * prose was read aloud by an English synthesiser (WCAG 3.1.1). Assistive
     * tech honours lang on any ancestor, and scoping it here is also more
     * truthful than the document default: element names and chemical terms
     * stay international in both locales.
     */
    <div lang={params.locale} className="min-h-screen flex flex-col">
      {/*
       * Five nav links, two locale links and seventeen controls stand between
       * the top of the document and the first cell. Visible only on focus, so
       * it costs a sighted mouse user nothing.
       */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-30 focus:m-8 focus:rounded focus:border focus:border-ink focus:bg-paper focus:px-12 focus:py-8"
      >
        {t(params.locale, 'site.skipToTable')}
      </a>
      <SiteHeader locale={params.locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  )
}
