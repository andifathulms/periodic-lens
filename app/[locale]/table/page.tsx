import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, isLocale, pageTitle } from '@/lib/i18n'
import { TableView } from './table-view'

export { generateStaticParams } from '../layout'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  return { title: pageTitle(locale) }
}

export default function TablePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <TableView locale={params.locale} />
}
