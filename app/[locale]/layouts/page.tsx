import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, isLocale, pageTitle, t } from '@/lib/i18n'
import { LayoutsView } from './layouts-view'

export { generateStaticParams } from '../layout'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  return { title: pageTitle(locale, 'nav.layouts') }
}

const COPY = {
  en: {
    intro:
      'Three arrangements of the same 118 elements. Nothing is added or removed between them — a layout is a set of positions, not a set of elements.',
    standard:
      'Standard. The familiar form, with the f-block lifted out into two footnote rows to keep the page a manageable width. That footnote is a printing decision, not a chemical one.',
    janet:
      'Left-step, after Charles Janet (1928). Rows end on a completed s subshell, so each row is exactly one turn of the filling rule. The blocks run f, d, p, s from the left, and the shape of the rule is much harder to miss than it is in the standard form.',
    spiral:
      'Spiral, after Theodor Benfey (1964). One continuous run from hydrogen to oganesson, each period a full turn. It gives up the tidy columns to keep the sequence unbroken.',
    closing:
      'They disagree about presentation and agree about chemistry. That is worth noticing: the standard table is how the field settled on organising the facts, not a fact itself.',
  },
  id: {
    intro:
      'Tiga penyusunan atas 118 unsur yang sama. Tidak ada yang ditambah atau dihilangkan di antaranya — tata letak adalah kumpulan posisi, bukan kumpulan unsur.',
    standard:
      'Standar. Bentuk yang familier, dengan blok f diangkat menjadi dua baris catatan kaki agar lebar halaman tetap terkelola. Catatan kaki itu keputusan pencetakan, bukan keputusan kimia.',
    janet:
      'Langkah kiri, mengikuti Charles Janet (1928). Setiap baris berakhir pada subkulit s yang penuh, sehingga satu baris tepat satu putaran aturan pengisian. Blok berurutan f, d, p, s dari kiri.',
    spiral:
      'Spiral, mengikuti Theodor Benfey (1964). Satu rangkaian utuh dari hidrogen sampai oganeson, setiap periode satu putaran penuh.',
    closing:
      'Ketiganya berbeda dalam penyajian dan sepakat dalam kimia. Tabel standar adalah cara bidang ini menyepakati penyusunan fakta, bukan faktanya sendiri.',
  },
} as const

export default function LayoutsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const copy = COPY[locale]
  return (
    <div className="mx-auto max-w-[1440px] px-16 py-24 flex flex-col gap-24">
      <header className="max-w-[70ch] flex flex-col gap-12">
        <h1 className="font-display text-page font-semibold">{t(locale, 'nav.layouts')}</h1>
        <p className="text-lead">{copy.intro}</p>
      </header>
      <LayoutsView locale={locale} />
      <section className="max-w-[70ch] flex flex-col gap-12 text-body">
        <p>{copy.standard}</p>
        <p>{copy.janet}</p>
        <p>{copy.spiral}</p>
        <p className="text-muted">{copy.closing}</p>
      </section>
    </div>
  )
}
