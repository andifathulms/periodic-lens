import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n'
import { routeMetadata } from '@/lib/i18n/metadata'
import { TableView } from './table-view'

export { generateStaticParams } from '../layout'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  return routeMetadata(locale, 'table')
}

export default function TablePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <TableView locale={params.locale} />
}
