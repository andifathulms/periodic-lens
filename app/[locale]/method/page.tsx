import { notFound } from 'next/navigation'
import { AUFBAU_EXCEPTIONS } from '@/lib/elements/aufbau'
import { ELEMENTS, GENERATED_FROM, LICENCE_LINES, USGS_EDITION } from '@/lib/elements/data'
import { LENS_IDS } from '@/lib/elements/lens'
import { VIEW_IDS } from '@/lib/elements/view'
import { SOURCES } from '@/lib/elements/sources'
import { isLocale, t } from '@/lib/i18n'

export { generateStaticParams } from '../layout'

/**
 * PRD.md §10.7 — every dataset, version and licence; the USGS edition; the
 * aufbau exception list with its source; the unknown-value policy.
 *
 * The framing note (CLAUDE.md): ptable is the more comprehensive general
 * reference and is linked as such. This project exists for the two things it
 * does that ptable does not.
 */
const COPY = {
  en: {
    unknown:
      'Unknown is not zero. Many properties are simply not known for the superheavy elements — oganesson has no measured electronegativity. Rendering it at the bottom of a colour ramp would state something false, so unknown has one appearance everywhere in this product: a diagonal hatch, never a colour, never a ramp position, never an empty cell. The detail panel says "not known" rather than leaving a blank.',
    ancient:
      'Elements in use since antiquity — carbon, sulfur, iron, copper, silver, tin, antimony, gold, mercury, lead — have no recorded year of discovery. On the discovery lens they are hatched, because a conventional date would invent a precision the record does not have.',
    configurations:
      'Electron configurations are stored published values, including the roughly twenty that disagree with the aufbau rule. The rule is implemented separately: it drives the build animation and it is the subject of a test that asserts the disagreement set in both directions. It never supplies a configuration for display.',
    blocks:
      'Group 3 contains scandium, yttrium, lutetium and lawrencium, and the f-block runs 57–70 and 89–102. This follows the IUPAC provisional recommendation and keeps the block widths exactly 2, 6, 10 and 14. Helium is s-block and sits with the noble gases; that is the one position in the table that contradicts its configuration, and it is a chemical convention rather than an error.',
    origin:
      'Nucleosynthetic origin is the dominant source, simplified to seven categories. Most elements have more than one production channel, and a single colour cannot say so — the lens names its own limit in the legend.',
    views:
      'The table has three views and one of them is showing at a time. The grid colours the cells by the active lens. Topography renders the same lens as height as well as colour, so periodicity reads as waves across the periods rather than as a claim in a caption — it is offered only for continuous lenses, because height cannot order categories without inventing a ranking. The timeline puts the same 118 elements on one axis by year of discovery, still coloured by whichever lens is active.',
    spectra:
      'Emission spectra are not in this version. The NIST Atomic Spectra Database is a US Government work and would licence cleanly, but per-element line data is a substantially larger dataset than anything here and it has not been sourced or verified yet.',
    lenses:
      'Exactly one lens is active at any time. Colour is a channel that is swapped, never decoration that accumulates: 118 cells carrying several encodings at once is unreadable, and that is the failure mode this project is built to avoid.',
    ptable:
      'For a more comprehensive general reference — isotopes, compounds, spectra, orbital viewers — ptable.com is excellent, free and mature. This project is not trying to replace it. It exists for two things ptable does not do: explaining where the shape comes from, and showing Indonesia’s share of world production per element.',
    noSafety:
      'There is no safety, handling, exposure or emergency-response information anywhere in this product. Hazard classification may appear as a cited fact; guidance is a regulated domain and this is not that tool.',
  },
  id: {
    unknown:
      'Tidak diketahui bukan nol. Banyak sifat memang belum diketahui untuk unsur superberat — oganeson tidak memiliki keelektronegatifan terukur. Menampilkannya di ujung bawah skala warna berarti menyatakan sesuatu yang keliru, sehingga "tidak diketahui" memiliki satu penampilan di seluruh produk ini: arsiran diagonal, bukan warna, bukan posisi pada skala, bukan sel kosong.',
    ancient:
      'Unsur yang dipakai sejak zaman kuno — karbon, belerang, besi, tembaga, perak, timah, antimon, emas, raksa, timbal — tidak memiliki tahun penemuan tercatat. Pada lensa penemuan, unsur-unsur itu diarsir.',
    configurations:
      'Konfigurasi elektron adalah nilai terbitan yang disimpan, termasuk sekitar dua puluh yang menyimpang dari aturan aufbau. Aturannya diimplementasikan terpisah: menggerakkan animasi pembentukan, dan menjadi subjek pengujian yang memastikan himpunan penyimpangan dari dua arah.',
    blocks:
      'Golongan 3 memuat skandium, itrium, lutesium dan lawrensium, dan blok f mencakup 57–70 serta 89–102. Ini mengikuti rekomendasi sementara IUPAC dan menjaga lebar blok tepat 2, 6, 10 dan 14. Helium berada di blok s namun ditempatkan bersama gas mulia.',
    origin:
      'Asal-usul nukleosintesis adalah sumber dominan, disederhanakan menjadi tujuh kategori. Sebagian besar unsur memiliki lebih dari satu jalur pembentukan, dan satu warna tidak dapat menyatakannya.',
    views:
      'Tabel memiliki tiga tampilan dan satu di antaranya aktif setiap saat. Kisi mewarnai sel menurut lensa aktif. Topografi menampilkan lensa yang sama sebagai tinggi sekaligus warna, sehingga keberkalaan terbaca sebagai gelombang — hanya tersedia untuk lensa kontinu, karena tinggi tidak dapat mengurutkan kategori. Lini masa menempatkan ke-118 unsur pada satu sumbu menurut tahun penemuan.',
    spectra:
      'Spektrum emisi belum ada di versi ini. NIST Atomic Spectra Database adalah karya Pemerintah AS dan lisensinya bersih, tetapi data garis spektrum per unsur jauh lebih besar daripada data mana pun di sini dan belum diperoleh maupun diverifikasi.',
    lenses:
      'Tepat satu lensa aktif setiap saat. Warna adalah kanal yang ditukar, bukan dekorasi yang menumpuk.',
    ptable:
      'Untuk rujukan umum yang lebih lengkap — isotop, senyawa, spektrum — ptable.com sangat baik, gratis dan matang. Proyek ini tidak berupaya menggantikannya.',
    noSafety:
      'Tidak ada informasi keselamatan, penanganan, paparan atau tanggap darurat di produk ini. Klasifikasi bahaya dapat muncul sebagai fakta bersitasi; panduan adalah ranah teregulasi dan ini bukan alat untuk itu.',
  },
} as const

export default function MethodPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const copy = COPY[locale]
  const unknownCounts = {
    electronegativity: ELEMENTS.filter((e) => e.electronegativity.type === 'unknown').length,
    density: ELEMENTS.filter((e) => e.density.type === 'unknown').length,
    discovery: ELEMENTS.filter((e) => e.discovery.type === 'unknown').length,
  }

  return (
    <div className="mx-auto max-w-[900px] px-16 py-24 flex flex-col gap-32">
      <header className="flex flex-col gap-12">
        <h1 className="font-display text-36 font-semibold">{t(locale, 'nav.method')}</h1>
        <p className="text-18">{t(locale, 'site.tagline')}</p>
      </header>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Data dan lisensi' : 'Datasets and licences'}
        </h2>
        <dl className="flex flex-col">
          {LICENCE_LINES.map((licence) => (
            <div key={licence.dataset} className="border-b border-rule py-8">
              <dt className="text-16 font-semibold">{licence.dataset}</dt>
              <dd className="text-16">{licence.licence}</dd>
              <dd className="font-mono text-14 text-muted break-all">{licence.url}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-14 text-muted">
          {locale === 'id' ? 'Dibangun dari' : 'Built from'}: {GENERATED_FROM.join(', ')}
        </p>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Sitasi per bidang' : 'Citations, per field'}
        </h2>
        <ul className="flex flex-col gap-8 font-mono text-14 text-muted">
          {Object.values(SOURCES).map((source) => (
            <li key={source.ref} className="border-b border-rule pb-8">
              {source.cite}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Tidak diketahui bukan nol' : 'Unknown is not zero'}
        </h2>
        <p className="text-16">{copy.unknown}</p>
        <p className="text-16">{copy.ancient}</p>
        <p className="font-mono text-14 text-muted">
          {locale === 'id' ? 'Nilai tidak diketahui' : 'Unknown values'}:{' '}
          {unknownCounts.electronegativity} electronegativity · {unknownCounts.density} density ·{' '}
          {unknownCounts.discovery} discovery
        </p>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Aturan aufbau dan pengecualiannya' : 'The aufbau rule and its exceptions'}
        </h2>
        <p className="text-16">{copy.configurations}</p>
        <p className="font-mono text-14 text-muted">
          {AUFBAU_EXCEPTIONS.length} {locale === 'id' ? 'pengecualian' : 'exceptions'}:{' '}
          {AUFBAU_EXCEPTIONS.join(', ')}
        </p>
        <p className="font-mono text-14 text-muted">{SOURCES.nistLevels.cite}</p>
        <p className="text-16">{copy.blocks}</p>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Lensa' : 'The lenses'}
        </h2>
        <p className="text-16">{copy.lenses}</p>
        <ul className="flex flex-wrap gap-x-16 gap-y-4 font-mono text-14 text-muted">
          {LENS_IDS.map((lens) => (
            <li key={lens}>{lens}</li>
          ))}
        </ul>
        <p className="text-16">{copy.origin}</p>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Tampilan' : 'The views'}
        </h2>
        <p className="text-16">{copy.views}</p>
        <ul className="flex flex-wrap gap-x-16 gap-y-4 font-mono text-14 text-muted">
          {VIEW_IDS.map((view) => (
            <li key={view}>{view}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Produksi' : 'Production'}
        </h2>
        <p className="text-16">
          {locale === 'id'
            ? `Setiap angka produksi membawa tahun edisi dan tahap pelaporannya. Edisi yang dipakai: USGS Mineral Commodity Summaries ${USGS_EDITION}.`
            : `Every production figure carries its edition year and its reporting stage. The edition in use is USGS Mineral Commodity Summaries ${USGS_EDITION}.`}
        </p>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="font-display text-22 font-semibold">
          {locale === 'id' ? 'Batasan' : 'Bounds'}
        </h2>
        <p className="text-16">{copy.noSafety}</p>
        <p className="text-16">{copy.spectra}</p>
        <p className="text-16">{copy.ptable}</p>
        <p className="font-mono text-14 text-muted">https://ptable.com</p>
      </section>
    </div>
  )
}
