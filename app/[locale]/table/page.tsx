import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n'
import { TableView } from './table-view'

export { generateStaticParams } from '../layout'

export default function TablePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <TableView locale={params.locale} />
}
