import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OrbitalBuild } from '@/components/build/orbital-build'
import { WorkedExample } from '@/components/build/worked-example'
import { AUFBAU_EXCEPTIONS, predictedNotation } from '@/lib/elements/aufbau'
import { elementAt } from '@/lib/elements/data'
import { DEFAULT_LOCALE, isLocale, pageTitle, t } from '@/lib/i18n'

export { generateStaticParams } from '../layout'

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  return { title: pageTitle(locale, 'nav.build') }
}

export default function BuildPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  return (
    <div className="mx-auto max-w-[1440px] px-16 py-24 flex flex-col gap-24">
      <header className="max-w-[70ch] flex flex-col gap-12">
        <h1 className="font-display text-page font-semibold">{t(locale, 'build.title')}</h1>
        <p className="text-lead">
          {locale === 'id'
            ? 'Bentuk tabel adalah konfigurasi elektron. Elektron mengisi subkulit menurut urutan energi — s dua lebar, p enam, d sepuluh, f empat belas — dan garis luar tabel mengikuti urutan itu.'
            : 'The shape of the table is the electron configuration. Electrons fill subshells in energy order — s two wide, p six, d ten, f fourteen — and the outline of the table follows from that order and nothing else.'}
        </p>
        <p className="text-lead">
          {locale === 'id'
            ? 'Aturan ini kemudian gagal. Untuk dua puluh unsur, konfigurasi terbitan tidak sesuai prediksi aturan. Nyalakan sakelar untuk melihat persisnya di mana.'
            : 'Then the rule fails. For twenty elements the published configuration is not the one the rule predicts. The toggle recolours the table by that question instead — the same cells, a different lens.'}
        </p>
      </header>

      {/* Before any control: the rule producing a real position from a real
          electron count, with the intermediate values showing. */}
      <section className="max-w-[70ch]">
        <WorkedExample locale={locale} />
      </section>

      <OrbitalBuild locale={locale} />

      <section className="max-w-[70ch]">
        <h2 className="font-display text-title font-semibold mb-12">
          {locale === 'id' ? 'Dua puluh pengecualian' : 'The twenty exceptions'}
        </h2>
        {/*
         * The disagreement, shown rather than asserted. Both strings are on
         * screen because the claim IS the pair — the rule's answer struck
         * through, the published value beside it. Invariant 3 holds: the
         * prediction appears only here and on the panel, only for these
         * twenty, and never as the element's configuration.
         *
         * Read down the column and the pattern shows up on its own: almost
         * every exception is a subshell taking one electron early to reach a
         * half-filled or filled d or f shell.
         */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body">
            <thead>
              <tr className="border-b border-rule text-left">
                <th scope="col" className="py-8 pr-16 font-semibold">
                  Z
                </th>
                <th scope="col" className="py-8 pr-16 font-semibold">
                  {t(locale, 'build.predicted')}
                </th>
                <th scope="col" className="py-8 font-semibold">
                  {t(locale, 'build.published')}
                </th>
              </tr>
            </thead>
            <tbody>
              {AUFBAU_EXCEPTIONS.map((z) => {
                const element = elementAt(z)
                return (
                  <tr key={z} className="border-b border-rule">
                    <td className="py-4 pr-16 font-mono tabular whitespace-nowrap">
                      {z} {element.symbol}
                    </td>
                    <td className="py-4 pr-16 font-mono tabular text-muted line-through">
                      {predictedNotation(z)}
                    </td>
                    <td className="py-4 font-mono tabular">{element.configuration.notation}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-micro text-muted mt-12">
          {elementAt(24).configuration.source.cite}
        </p>
      </section>
    </div>
  )
}
