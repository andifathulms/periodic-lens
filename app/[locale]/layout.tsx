import { notFound } from 'next/navigation'
import { LOCALES, isLocale } from '@/lib/i18n'
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
    <div className="min-h-screen flex flex-col">
      <SiteHeader locale={params.locale} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
