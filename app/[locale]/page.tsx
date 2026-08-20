import { redirect } from 'next/navigation'

export { generateStaticParams } from './layout'

export default function LocaleRoot({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/table`)
}
