/**
 * English primary, Indonesian secondary — reversed from the sibling projects
 * (PRD.md §2), because chemistry vocabulary is international and this is the
 * project most likely to be found by a non-Indonesian reader.
 *
 * Element names, symbols and chemical terms stay in their standard
 * international form in both locales.
 */
export const LOCALES = ['en', 'id'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

type Dictionary = Record<string, string>

const en: Dictionary = {
  'site.name': 'Periodic Lens',
  'site.tagline': 'Why the table has that shape — and who digs the elements out of the ground.',
  'site.lead':
    'An interactive periodic table built for two things a general reference does not do: it animates where the shape of the table comes from, and it shows Indonesia’s share of world production, element by element.',
  'site.skipToTable': 'Skip to the table',
  'site.toBuild': 'Watch the shape get built',
  'site.toIndonesia': 'See the production figures',
  'table.hint':
    'One lens is active at a time. Choosing a lens recolours all 118 cells; choosing a cell opens its detail beside the table.',
  'panel.empty': 'Select any element for its configuration, its properties and the source behind each one.',
  'nav.table': 'Table',
  'nav.build': 'The build',
  'nav.layouts': 'Layouts',
  'nav.indonesia': 'Indonesia',
  'nav.method': 'Method',
  'lens.label': 'Lens',
  'layout.label': 'Layout',
  'view.label': 'View',
  'view.grid': 'Grid',
  'view.topography': 'Topography',
  'view.timeline': 'Timeline',
  'view.timelineUnrecorded': 'No recorded year',
  'view.topographyUnavailable':
    'Topography needs a continuous lens — height cannot order categories.',
  'view.topographyNote':
    'The same lens as height as well as colour. Unknown values are drawn as a dashed void spanning the whole range, because a cell resting on the baseline would read as the smallest value.',
  'view.timelineNote':
    'The same 118 elements along one axis, coloured by the active lens. Elements with no recorded year are held off the axis in their own group.',
  'lens.category': 'Category',
  'lens.block': 'Block',
  'lens.origin': 'Origin',
  'lens.production-id': 'Indonesian production',
  'lens.electronegativity': 'Electronegativity',
  'lens.atomic-radius': 'Atomic radius',
  'lens.ionisation-energy': 'Ionisation energy',
  'lens.melting-point': 'Melting point',
  'lens.density': 'Density',
  'lens.discovery': 'Discovery',
  'lens.unmeasured': 'Unknown properties',
  'legend.nothingHatched':
    'Nothing is hatched on this lens. The count itself is always known — an element with five missing properties is a fact, not a gap.',
  'legend.unknownReasonProduction':
    'no commodity covering this element appears in the USGS edition in use',
  'legend.unknownReasonProperty': 'no published value exists for this element',
  'panel.rulePredicts': 'The aufbau rule predicts',
  'panel.ruleWrong': 'and is wrong here',
  'panel.whyHere': 'Why it sits here',
  'panel.differentiating': 'Differentiating electron',
  'panel.blockWidth': 'Block width',
  'panel.byConvention':
    'Position by convention, not by configuration: helium is s-block and sits with the noble gases.',
  'panel.positionFromRule':
    'Position follows the filling order, not the published configuration — which is why this differs from the notation above, and why the exception stays in its block.',
  'build.published': 'Published',
  'build.predicted': 'Rule predicts',
  'layout.standard': 'Standard',
  'layout.left-step': 'Left-step (Janet)',
  'layout.spiral': 'Spiral (after Benfey)',
  'legend.showing': 'Showing',
  'legend.unknown': 'not known',
  'legend.notProduced': 'not produced',
  'legend.unknownNote': 'hatched on every lens — never a colour, never a position on the scale',
  'legend.scale': 'Scale',
  'panel.close': 'Close',
  'panel.configuration': 'Electron configuration',
  'panel.anomalous': 'Published configuration departs from the aufbau rule.',
  'panel.properties': 'Properties',
  'panel.activeLens': 'On the active lens',
  'panel.production': 'Indonesian production',
  'panel.neighbours': 'Group and period',
  'prop.mass': 'Standard atomic weight',
  'prop.electronegativity': 'Electronegativity (Pauling)',
  'prop.atomicRadius': 'Atomic radius',
  'prop.ionisationEnergy': 'First ionisation energy',
  'prop.meltingPoint': 'Melting point',
  'prop.density': 'Density',
  'prop.discovery': 'First identified',
  'prop.origin': 'Dominant origin',
  'prop.category': 'Category',
  'prop.block': 'Block',
  'prop.group': 'Group',
  'prop.period': 'Period',
  'text.symbol': 'Symbol',
  'text.name': 'Name',
  'text.mass': 'Mass',
  'text.heading': 'The table as text',
  'text.note': 'Always present, never a fallback. Sortable by any column.',
  'build.title': 'How the table gets its shape',
  'build.play': 'Play',
  'build.pause': 'Pause',
  'build.replay': 'Replay',
  'build.step': 'Step',
  'build.exceptions': 'Show where the rule fails',
  'build.keyException': 'published configuration disagrees with the rule',
  'build.keyFollows': 'rule and published configuration agree',
  'build.filling': 'Filling',
  'build.placed': 'electrons placed',
  'build.reduced': 'Reduced motion: advance one subshell at a time.',
  'ancient.note':
    'Elements in use since antiquity have no recorded year of discovery, so they are hatched rather than dated.',
}

const id: Dictionary = {
  'site.name': 'Periodic Lens',
  'site.tagline': 'Mengapa tabel ini berbentuk demikian — dan siapa yang menambang unsurnya.',
  'site.lead':
    'Tabel periodik interaktif yang dibangun untuk dua hal yang tidak dilakukan rujukan umum: menganimasikan asal-usul bentuk tabel, dan menampilkan pangsa produksi dunia milik Indonesia, unsur demi unsur.',
  'site.skipToTable': 'Lewati ke tabel',
  'site.toBuild': 'Lihat bentuknya tersusun',
  'site.toIndonesia': 'Lihat angka produksinya',
  'table.hint':
    'Satu lensa aktif setiap saat. Memilih lensa mewarnai ulang ke-118 sel; memilih sel membuka rinciannya di samping tabel.',
  'panel.empty': 'Pilih unsur mana pun untuk konfigurasi, sifat, dan sumber di balik masing-masingnya.',
  'nav.table': 'Tabel',
  'nav.build': 'Pembentukan',
  'nav.layouts': 'Tata letak',
  'nav.indonesia': 'Indonesia',
  'nav.method': 'Metode',
  'lens.label': 'Lensa',
  'layout.label': 'Tata letak',
  'view.label': 'Tampilan',
  'view.grid': 'Kisi',
  'view.topography': 'Topografi',
  'view.timeline': 'Lini masa',
  'view.timelineUnrecorded': 'Tanpa tahun tercatat',
  'view.topographyUnavailable':
    'Topografi memerlukan lensa kontinu — tinggi tidak dapat mengurutkan kategori.',
  'view.topographyNote':
    'Lensa yang sama sebagai tinggi sekaligus warna. Nilai yang tidak diketahui digambar sebagai rongga putus-putus setinggi seluruh rentang, karena sel yang rata di garis dasar akan terbaca sebagai nilai terkecil.',
  'view.timelineNote':
    'Ke-118 unsur yang sama pada satu sumbu, diwarnai oleh lensa aktif. Unsur tanpa tahun tercatat ditahan di luar sumbu dalam kelompok tersendiri.',
  'lens.category': 'Kategori',
  'lens.block': 'Blok',
  'lens.origin': 'Asal-usul',
  'lens.production-id': 'Produksi Indonesia',
  'lens.electronegativity': 'Keelektronegatifan',
  'lens.atomic-radius': 'Jari-jari atom',
  'lens.ionisation-energy': 'Energi ionisasi',
  'lens.melting-point': 'Titik leleh',
  'lens.density': 'Massa jenis',
  'lens.discovery': 'Penemuan',
  'lens.unmeasured': 'Sifat tidak diketahui',
  'legend.nothingHatched':
    'Tidak ada yang diarsir pada lensa ini. Cacahnya sendiri selalu diketahui — unsur dengan lima sifat yang hilang adalah sebuah fakta, bukan sebuah rongga.',
  'legend.unknownReasonProduction':
    'tidak ada komoditas yang mencakup unsur ini dalam edisi USGS yang dipakai',
  'legend.unknownReasonProperty': 'tidak ada nilai terbitan untuk unsur ini',
  'panel.rulePredicts': 'Aturan aufbau memprediksi',
  'panel.ruleWrong': 'dan keliru di sini',
  'panel.whyHere': 'Mengapa berada di sini',
  'panel.differentiating': 'Elektron pembeda',
  'panel.blockWidth': 'Lebar blok',
  'panel.byConvention':
    'Posisi menurut konvensi, bukan menurut konfigurasi: helium berada di blok s dan ditempatkan bersama gas mulia.',
  'panel.positionFromRule':
    'Posisi mengikuti urutan pengisian, bukan konfigurasi terbitan — karena itu nilai ini berbeda dari notasi di atas, dan pengecualian tetap berada di bloknya.',
  'build.published': 'Terbitan',
  'build.predicted': 'Prediksi aturan',
  'layout.standard': 'Standar',
  'layout.left-step': 'Langkah kiri (Janet)',
  'layout.spiral': 'Spiral (mengikuti Benfey)',
  'legend.showing': 'Menampilkan',
  'legend.unknown': 'tidak diketahui',
  'legend.notProduced': 'tidak diproduksi',
  'legend.unknownNote': 'diarsir pada setiap lensa — bukan warna, bukan posisi pada skala',
  'legend.scale': 'Skala',
  'panel.close': 'Tutup',
  'panel.configuration': 'Konfigurasi elektron',
  'panel.anomalous': 'Konfigurasi terbitan menyimpang dari aturan aufbau.',
  'panel.properties': 'Sifat',
  'panel.activeLens': 'Pada lensa aktif',
  'panel.production': 'Produksi Indonesia',
  'panel.neighbours': 'Golongan dan periode',
  'prop.mass': 'Bobot atom standar',
  'prop.electronegativity': 'Keelektronegatifan (Pauling)',
  'prop.atomicRadius': 'Jari-jari atom',
  'prop.ionisationEnergy': 'Energi ionisasi pertama',
  'prop.meltingPoint': 'Titik leleh',
  'prop.density': 'Massa jenis',
  'prop.discovery': 'Pertama diidentifikasi',
  'prop.origin': 'Asal-usul dominan',
  'prop.category': 'Kategori',
  'prop.block': 'Blok',
  'prop.group': 'Golongan',
  'prop.period': 'Periode',
  'text.symbol': 'Lambang',
  'text.name': 'Nama',
  'text.mass': 'Massa',
  'text.heading': 'Tabel dalam bentuk teks',
  'text.note': 'Selalu tersedia, bukan cadangan. Dapat diurutkan menurut kolom mana pun.',
  'build.title': 'Bagaimana tabel memperoleh bentuknya',
  'build.play': 'Mainkan',
  'build.pause': 'Jeda',
  'build.replay': 'Ulangi',
  'build.step': 'Langkah',
  'build.exceptions': 'Tampilkan tempat aturan ini gagal',
  'build.keyException': 'konfigurasi terbitan tidak sesuai aturan',
  'build.keyFollows': 'aturan dan konfigurasi terbitan sesuai',
  'build.filling': 'Mengisi',
  'build.placed': 'elektron ditempatkan',
  'build.reduced': 'Gerak dikurangi: maju satu subkulit setiap langkah.',
  'ancient.note':
    'Unsur yang telah dipakai sejak zaman kuno tidak memiliki tahun penemuan tercatat, sehingga diarsir alih-alih diberi tanggal.',
}

const DICTIONARIES: Record<Locale, Dictionary> = { en, id }

/**
 * Document titles. Every page carried the same <title>, so five open tabs all
 * read "Periodic Lens". The landing keeps the bare name; every other page
 * names itself first, because that is the half a narrow tab shows.
 */
export function pageTitle(locale: Locale, key?: string): string {
  const name = t(locale, 'site.name')
  return key ? `${t(locale, key)} — ${name}` : name
}

export function t(locale: Locale, key: string): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key
}

/** Category, origin and block names, in words. Chemical terms stay international. */
const TERMS: Record<Locale, Dictionary> = {
  en: {
    'alkali-metal': 'Alkali metal',
    'alkaline-earth-metal': 'Alkaline earth metal',
    'transition-metal': 'Transition metal',
    'post-transition-metal': 'Post-transition metal',
    metalloid: 'Metalloid',
    'reactive-nonmetal': 'Reactive nonmetal',
    'noble-gas': 'Noble gas',
    'inner-transition-metal': 'Inner transition metal',
    'big-bang': 'Big Bang nucleosynthesis',
    'cosmic-ray-fission': 'Cosmic ray fission',
    'dying-low-mass-stars': 'Dying low-mass stars',
    'exploding-massive-stars': 'Exploding massive stars',
    'exploding-white-dwarfs': 'Exploding white dwarfs',
    'merging-neutron-stars': 'Merging neutron stars',
    'human-made': 'Human-made',
    s: 's-block',
    p: 'p-block',
    d: 'd-block',
    f: 'f-block',
    mined: 'mined ore',
    refined: 'refined metal',
  },
  id: {
    'alkali-metal': 'Logam alkali',
    'alkaline-earth-metal': 'Logam alkali tanah',
    'transition-metal': 'Logam transisi',
    'post-transition-metal': 'Logam pasca-transisi',
    metalloid: 'Metaloid',
    'reactive-nonmetal': 'Nonlogam reaktif',
    'noble-gas': 'Gas mulia',
    'inner-transition-metal': 'Logam transisi dalam',
    'big-bang': 'Nukleosintesis Big Bang',
    'cosmic-ray-fission': 'Fisi sinar kosmik',
    'dying-low-mass-stars': 'Bintang bermassa rendah yang sekarat',
    'exploding-massive-stars': 'Bintang masif yang meledak',
    'exploding-white-dwarfs': 'Katai putih yang meledak',
    'merging-neutron-stars': 'Bintang neutron yang bergabung',
    'human-made': 'Buatan manusia',
    s: 'blok s',
    p: 'blok p',
    d: 'blok d',
    f: 'blok f',
    mined: 'bijih tambang',
    refined: 'logam olahan',
  },
}

export function term(locale: Locale, key: string): string {
  return TERMS[locale][key] ?? TERMS.en[key] ?? key
}
