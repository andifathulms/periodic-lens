import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ELEMENTS, USGS_EDITION } from '@/lib/elements/data'
import { DEFAULT_LOCALE, isLocale, pageTitle, t, term } from '@/lib/i18n'

export { generateStaticParams } from '../layout'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  return { title: pageTitle(locale, 'nav.indonesia') }
}

/**
 * PRD.md §4 and invariant 11.
 *
 * The lens shows mine production share, dated and staged, and stops. There is
 * no commentary on mining policy, downstream processing, or environmental
 * impact here, in either direction, in either locale — that is a deliberate
 * boundary, and the copy scan in data:validate enforces it.
 */
const COPY = {
  en: {
    intro:
      'Indonesia is a major producer of several elements. This page states its share of world production, per element, with the edition and the reporting stage attached to every figure.',
    reads:
      'Read these carefully. Production is not reserves and not consumption; a country can produce an element it does not use, and hold reserves it does not mine.',
    stage:
      'Stage matters. A mined figure counts ore at the mine; a refined figure counts metal after processing. The two are different quantities and are never mixed on the same scale here.',
    absent:
      'An element USGS tracks but reports no Indonesian output for is marked "not produced" — a fact, and visibly not the bottom of the ramp. An element USGS does not track at all has no production data, and is hatched as not known.',
    bounds:
      'This page shows production share and stops there. It carries no assessment of mining policy or its effects.',
    share: 'Share of world production',
    commodity: 'Commodity as reported',
  },
  id: {
    intro:
      'Indonesia adalah produsen besar untuk beberapa unsur. Halaman ini menyatakan pangsa produksi dunia, per unsur, dengan edisi dan tahap pelaporan melekat pada setiap angka.',
    reads:
      'Bacalah dengan cermat. Produksi bukan cadangan dan bukan konsumsi; sebuah negara dapat memproduksi unsur yang tidak dipakainya, dan memiliki cadangan yang tidak ditambangnya.',
    stage:
      'Tahap pelaporan penting. Angka tambang menghitung bijih di lokasi tambang; angka olahan menghitung logam setelah pemrosesan. Keduanya besaran berbeda dan tidak pernah dicampur pada satu skala di sini.',
    absent:
      'Unsur yang dilacak USGS tetapi tanpa laporan produksi Indonesia ditandai "tidak diproduksi" — sebuah fakta, dan jelas bukan ujung bawah skala. Unsur yang sama sekali tidak dilacak USGS tidak memiliki data produksi, dan diarsir sebagai tidak diketahui.',
    bounds:
      'Halaman ini menampilkan pangsa produksi dan berhenti di situ. Tidak ada penilaian atas kebijakan pertambangan maupun dampaknya.',
    share: 'Pangsa produksi dunia',
    commodity: 'Komoditas sebagaimana dilaporkan',
  },
} as const

export default function IndonesiaPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const copy = COPY[locale]

  const produced = ELEMENTS.filter((element) => element.production.type === 'produced').sort(
    (a, b) =>
      (b.production.type === 'produced' ? b.production.production.share : 0) -
      (a.production.type === 'produced' ? a.production.production.share : 0),
  )
  const notProduced = ELEMENTS.filter((element) => element.production.type === 'not-produced')

  return (
    <div className="mx-auto max-w-[1440px] px-16 py-24 flex flex-col gap-24">
      <header className="max-w-[70ch] flex flex-col gap-12">
        <h1 className="font-display text-page font-semibold">{t(locale, 'lens.production-id')}</h1>
        <p className="text-lead">{copy.intro}</p>
      </header>

      <section className="max-w-[900px]">
        {/* The table scrolls, not the page — the same wrapper every other
            table in the product has. Six columns overflow a phone. */}
        <div className="overflow-x-auto">
          <table className="w-full text-body border-collapse">
            <caption className="text-left text-micro text-muted pb-8">
              USGS Mineral Commodity Summaries {USGS_EDITION}
            </caption>
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="py-8 pr-16">
                  Z
                </th>
                <th scope="col" className="py-8 pr-16">
                  {locale === 'id' ? 'Unsur' : 'Element'}
                </th>
                <th scope="col" className="py-8 pr-16">
                  {copy.commodity}
                </th>
                <th scope="col" className="py-8 pr-16">
                  {copy.share}
                </th>
                <th scope="col" className="py-8 pr-16">
                  {locale === 'id' ? 'Tahap' : 'Stage'}
                </th>
                <th scope="col" className="py-8">
                  {locale === 'id' ? 'Tahun data' : 'Data year'}
                </th>
              </tr>
            </thead>
            <tbody>
              {produced.map((element) => {
                if (element.production.type !== 'produced') return null
                const p = element.production.production
                return (
                  <tr key={element.z} className="border-b border-rule">
                    <td className="py-8 pr-16 font-mono tabular">{element.z}</td>
                    <td className="py-8 pr-16">
                      <span className="font-display">{element.symbol}</span>{' '}
                      <span className="text-muted">
                        {locale === 'id' ? element.nameId : element.name}
                      </span>
                    </td>
                    <td className="py-8 pr-16">{p.commodity}</td>
                    <td className="py-8 pr-16 font-mono tabular">
                      {(p.share * 100).toFixed(1)}%
                    </td>
                    <td className="py-8 pr-16">{term(locale, p.stage)}</td>
                    <td className="py-8 font-mono tabular">{p.dataYear}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-[70ch] flex flex-col gap-12 text-body">
        <p>{copy.reads}</p>
        <p>{copy.stage}</p>
        <p>{copy.absent}</p>
        <p className="font-mono text-micro text-muted">
          {locale === 'id' ? 'Dilacak tanpa produksi Indonesia' : 'Tracked, no Indonesian output'}:{' '}
          {notProduced.length} {locale === 'id' ? 'unsur' : 'elements'}
        </p>
        <p className="text-muted">{copy.bounds}</p>
        <p className="font-mono text-micro text-muted">
          U.S. Geological Survey, Mineral Commodity Summaries {USGS_EDITION}. Public domain.
        </p>
      </section>
    </div>
  )
}
