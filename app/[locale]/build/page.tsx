import { notFound } from 'next/navigation'
import { OrbitalBuild } from '@/components/build/orbital-build'
import { AUFBAU_EXCEPTIONS } from '@/lib/elements/aufbau'
import { elementAt } from '@/lib/elements/data'
import { isLocale, t } from '@/lib/i18n'

export { generateStaticParams } from '../layout'

export default function BuildPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  return (
    <div className="mx-auto max-w-[1440px] px-16 py-24 flex flex-col gap-24">
      <header className="max-w-[70ch] flex flex-col gap-12">
        <h1 className="font-display text-36 font-semibold">{t(locale, 'build.title')}</h1>
        <p className="text-18">
          {locale === 'id'
            ? 'Bentuk tabel adalah konfigurasi elektron. Elektron mengisi subkulit menurut urutan energi — s dua lebar, p enam, d sepuluh, f empat belas — dan garis luar tabel mengikuti urutan itu.'
            : 'The shape of the table is the electron configuration. Electrons fill subshells in energy order — s two wide, p six, d ten, f fourteen — and the outline of the table follows from that order and nothing else.'}
        </p>
        <p className="text-18">
          {locale === 'id'
            ? 'Aturan ini kemudian gagal. Untuk dua puluh unsur, konfigurasi terbitan tidak sesuai prediksi aturan. Nyalakan sakelar untuk melihat persisnya di mana.'
            : 'Then the rule fails. For twenty elements the published configuration is not the one the rule predicts. The toggle recolours the table by that question instead — the same cells, a different lens.'}
        </p>
      </header>

      <OrbitalBuild locale={locale} />

      <section className="max-w-[70ch]">
        <h2 className="font-display text-22 font-semibold mb-12">
          {locale === 'id' ? 'Dua puluh pengecualian' : 'The twenty exceptions'}
        </h2>
        <ul className="grid gap-x-24 gap-y-4 sm:grid-cols-2 font-mono text-16 tabular">
          {AUFBAU_EXCEPTIONS.map((z) => {
            const element = elementAt(z)
            return (
              <li key={z} className="flex justify-between gap-12 border-b border-rule py-4">
                <span>
                  {z} {element.symbol}
                </span>
                <span className="text-muted">{element.configuration.notation}</span>
              </li>
            )
          })}
        </ul>
        <p className="font-mono text-14 text-muted mt-12">
          {elementAt(24).configuration.source.cite}
        </p>
      </section>
    </div>
  )
}
